/**
 * Deep Insights API — Vite dev / preview middleware only.
 *
 * TODO: Wire to real database + object storage; multi-tenant auth.
 * TODO: Vercel serverless — replace in-memory store; use short-lived /tmp only.
 * TODO: Field-level encryption, signed storage, deletion policy — see product security review.
 *
 * PRIVACY: Do not accept provider passwords — export files only.
 */

import { randomUUID } from "node:crypto";
import { Buffer } from "node:buffer";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseCsvDocument } from "../../../lib/deep-insights/csvParser.js";
import { detectFileMeta } from "../../../lib/deep-insights/detectFileMeta.js";
import { buildColumnSchema } from "../../../lib/deep-insights/schemaInspector.js";
import { suggestCanonicalField } from "../../../lib/deep-insights/mappingEngine.js";
import { normalizeSalonData } from "../../../lib/deep-insights/normalizeSalonData.js";
import { generateSalonSignals } from "../../../lib/deep-insights/generateSalonSignals.js";
import { applyRepairOverridesToNormalized } from "../../../lib/deep-insights/importRepairStorage.js";
import { computeImportQualityReportFromData } from "../../../lib/deep-insights/importQuality.js";
import {
  appendServerAudit,
  createRunState,
  currentImportBySalon,
  deleteCurrentForSalon,
  getOrCreateRunState,
  importRuns,
  snapshotForClient,
  touchRun,
} from "./deepInsightsServerStore.js";

function sendJson(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function salonFromUrl(url) {
  try {
    const u = new URL(url || "/", "http://deep-insights.local");
    return u.searchParams.get("salonId")?.trim() || "salon-local-preview";
  } catch {
    return "salon-local-preview";
  }
}

function matchImportRunId(pathname) {
  const m = pathname.match(
    /^\/api\/deep-insights\/imports\/([^/]+)\/(files|parse|mapping|normalize|repairs|recalculate)$/,
  );
  return m ? { id: decodeURIComponent(m[1]), action: m[2] } : null;
}

function wrapSnapshot(state) {
  return { snapshot: snapshotForClient(state) };
}

export function deepInsightsApiMiddleware(req, res, next) {
  const pathname = req.url?.split("?")[0] ?? "";
  if (!pathname.startsWith("/api/deep-insights")) {
    next();
    return;
  }
  void handleDeepInsights(req, res, pathname);
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {string} pathname
 */
async function handleDeepInsights(req, res, pathname) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  try {
    const url = req.url || "/";
    const salonId = salonFromUrl(`http://x${url}`);

    if (req.method === "POST" && pathname === "/api/deep-insights/imports") {
      const body = await readBody(req);
      const sid = body.salonId || salonId;
      const state = createRunState(sid);
      state.importRun.provider = body.provider || "upload";
      touchRun(state);
      return sendJson(res, 200, { importRun: state.importRun, ...wrapSnapshot(state) });
    }

    const runMatch = matchImportRunId(pathname);
    if (req.method === "POST" && runMatch?.action === "files") {
      const state = getOrCreateRunState(runMatch.id);
      if (!state) return sendJson(res, 404, { error: "Import run not found" });
      const body = await readBody(req);
      const tmpBase = os.tmpdir();
      for (const f of body.files ?? []) {
        const fid = `rf-${randomUUID()}`;
        const rawPath = path.join(tmpBase, `di-${runMatch.id}-${fid}.bin`);
        if (f.contentBase64) {
          const buf = Buffer.from(f.contentBase64, "base64");
          fs.writeFileSync(rawPath, buf);
        }
        const rec = {
          id: fid,
          importRunId: runMatch.id,
          salonId: state.importRun.salonId,
          fileName: f.fileName,
          fileType: f.fileType || "text/csv",
          size: f.size ?? 0,
          storagePath: f.contentBase64 ? rawPath : "",
          uploadedAt: new Date().toISOString(),
          parseStatus: f.contentBase64 ? "pending" : "skipped",
        };
        state.rawFiles.push(rec);
        state.importRun.sourceFiles.push({
          id: rec.id,
          fileName: rec.fileName,
          fileType: rec.fileType,
        });
        appendServerAudit(state, {
          type: "file_uploaded",
          message: rec.fileName,
          payload: { fileId: fid },
        });
      }
      touchRun(state);
      state.importRun.status = "uploading";
      return sendJson(res, 200, { ok: true, ...wrapSnapshot(state) });
    }

    if (req.method === "POST" && runMatch?.action === "parse") {
      const state = getOrCreateRunState(runMatch.id);
      if (!state) return sendJson(res, 404, { error: "Import run not found" });
      state.parsedSchemas = [];
      state.bundles = state.bundles || {};
      const items = [];
      const mapInit = { ...state.fieldMappings };

      for (const rf of state.rawFiles) {
        if (!rf.storagePath || !fs.existsSync(rf.storagePath)) continue;
        const text = fs.readFileSync(rf.storagePath, "utf8");
        const parsed = parseCsvDocument(text, { maxRows: 25000 });
        const detection = detectFileMeta(rf.fileName, parsed.headers);
        const schemas = parsed.headers.map((h) => ({
          ...buildColumnSchema(h, parsed.rows, 3),
          suggestedCanonical: suggestCanonicalField(h, detection.reportType).field,
        }));
        const m = {};
        for (const s of schemas) {
          m[s.column] = s.suggestedCanonical || "ignore";
        }
        Object.assign(mapInit, { [rf.id]: m });

        state.bundles[rf.id] = {
          fileId: rf.id,
          fileName: rf.fileName,
          provider: detection.provider,
          reportType: detection.reportType,
          headers: parsed.headers,
          rows: parsed.rows,
        };

        const schemaRow = {
          id: `ps-${rf.id}`,
          importRunId: runMatch.id,
          fileId: rf.id,
          headers: parsed.headers,
          sampleRows: parsed.rows.slice(0, 5),
          rowCount: parsed.rowCount,
          columnCount: parsed.headers.length,
          detectedReportType: detection.reportType,
          detectedProvider: detection.provider,
          confidence: 0.75,
        };
        state.parsedSchemas.push(schemaRow);
        rf.parseStatus = "parsed";
        appendServerAudit(state, {
          type: "file_parsed",
          message: rf.fileName,
          payload: { fileId: rf.id, rows: parsed.rowCount },
        });

        items.push({
          id: rf.id,
          file: null,
          name: rf.fileName,
          size: rf.size,
          kind: "csv",
          status: "parsed",
          parsed,
          detection,
          schemas,
        });
      }

      state.fieldMappings = { ...state.fieldMappings, ...mapInit };
      touchRun(state);
      state.importRun.status = "parsed";
      return sendJson(res, 200, {
        items,
        mappingsByFile: { ...state.fieldMappings },
        ...wrapSnapshot(state),
      });
    }

    if (req.method === "POST" && runMatch?.action === "mapping") {
      const state = getOrCreateRunState(runMatch.id);
      if (!state) return sendJson(res, 404, { error: "Import run not found" });
      const body = await readBody(req);
      state.fieldMappings = body.mappingsByFile || {};
      touchRun(state);
      appendServerAudit(state, {
        type: "mapping_saved",
        message: "Field mappings saved",
        payload: { fileCount: Object.keys(state.fieldMappings).length },
      });
      state.importRun.status = "mapped";
      return sendJson(res, 200, { ok: true, ...wrapSnapshot(state) });
    }

    if (req.method === "POST" && runMatch?.action === "normalize") {
      const state = getOrCreateRunState(runMatch.id);
      if (!state) return sendJson(res, 404, { error: "Import run not found" });
      const bundles = state.bundles || {};
      const parsedFiles = Object.values(bundles).map((b) => ({
        fileId: b.fileId,
        fileName: b.fileName,
        provider: b.provider ?? "unknown",
        reportType: b.reportType ?? "unknown",
        headers: b.headers,
        rows: b.rows,
      }));
      const normalized = normalizeSalonData({
        parsedFiles,
        mappingsByFile: state.fieldMappings,
        salonId: state.importRun.salonId,
      });
      const patched = applyRepairOverridesToNormalized(normalized, {
        categoryMap: state.repairs.serviceCategoryOverrides,
        providerMap: state.repairs.providerOverrides,
      });
      const signalsPack = generateSalonSignals(patched);
      state.normalizedDataset = normalized;
      state.signalsPack = signalsPack;

      const q = computeImportQualityReportFromData({
        rawNormalized: normalized,
        parsed: state.parsedSchemas,
        rawMeta: { files: state.importRun.sourceFiles },
        signalsPack,
        categoryOverrides: state.repairs.serviceCategoryOverrides,
        providerOverrides: state.repairs.providerOverrides,
      });
      if (q) {
        state.importRun.qualityScore = q.score;
        state.importRun.confidenceTier = q.opportunityConfidence;
        state.importRun.normalizedCounts = {
          clients: normalized.clients?.length ?? 0,
          appointments: normalized.appointments?.length ?? 0,
          transactions: normalized.transactions?.length ?? 0,
        };
      }

      state.importRun.status = "normalized";
      touchRun(state);
      appendServerAudit(state, {
        type: "normalized",
        message: "Dataset normalized and signals generated",
        payload: state.importRun.normalizedCounts,
      });
      appendServerAudit(state, {
        type: "recalculated",
        message: "Initial signals",
        payload: { opportunities: signalsPack.opportunities?.length ?? 0 },
      });
      return sendJson(res, 200, { ok: true, ...wrapSnapshot(state) });
    }

    if (req.method === "POST" && runMatch?.action === "repairs") {
      const state = getOrCreateRunState(runMatch.id);
      if (!state) return sendJson(res, 404, { error: "Import run not found" });
      const body = await readBody(req);
      const o = body.overrides || {};
      state.repairs = {
        serviceCategoryOverrides: { ...(o.serviceCategoryOverrides || {}) },
        contactSuppressions: { ...(o.contactSuppressions || {}) },
        providerOverrides: { ...(o.providerOverrides || {}) },
      };
      touchRun(state);
      appendServerAudit(state, {
        type: "repair_saved",
        message: "Repair overrides saved",
        payload: {
          categories: Object.keys(state.repairs.serviceCategoryOverrides).length,
          providers: Object.keys(state.repairs.providerOverrides).length,
        },
      });
      return sendJson(res, 200, { ok: true, ...wrapSnapshot(state) });
    }

    if (req.method === "POST" && runMatch?.action === "recalculate") {
      const state = getOrCreateRunState(runMatch.id);
      if (!state) return sendJson(res, 404, { error: "Import run not found" });
      if (!state.normalizedDataset) {
        return sendJson(res, 400, { error: "No normalized dataset" });
      }
      const raw = JSON.parse(JSON.stringify(state.normalizedDataset));
      const patched = applyRepairOverridesToNormalized(raw, {
        categoryMap: state.repairs.serviceCategoryOverrides,
        providerMap: state.repairs.providerOverrides,
      });
      const signalsPack = generateSalonSignals(patched);
      state.signalsPack = signalsPack;
      const q = computeImportQualityReportFromData({
        rawNormalized: raw,
        parsed: state.parsedSchemas,
        rawMeta: { files: state.importRun.sourceFiles },
        signalsPack,
        categoryOverrides: state.repairs.serviceCategoryOverrides,
        providerOverrides: state.repairs.providerOverrides,
      });
      if (q) {
        state.importRun.qualityScore = q.score;
        state.importRun.confidenceTier = q.opportunityConfidence;
      }
      touchRun(state);
      appendServerAudit(state, {
        type: "recalculated",
        message: "Signals and quality recalculated",
        payload: { opportunities: signalsPack.opportunities?.length ?? 0 },
      });
      return sendJson(res, 200, { ok: true, ...wrapSnapshot(state) });
    }

    if (req.method === "GET" && pathname === "/api/deep-insights/imports/current") {
      const sid = salonFromUrl(`http://x${url}`);
      const rid = currentImportBySalon.get(sid);
      if (!rid) return sendJson(res, 404, { error: "No current import" });
      const state = importRuns.get(rid);
      if (!state) return sendJson(res, 404, { error: "Not found" });
      return sendJson(res, 200, wrapSnapshot(state));
    }

    if (req.method === "GET" && /^\/api\/deep-insights\/imports\/[^/]+$/.test(pathname)) {
      const id = decodeURIComponent(pathname.replace("/api/deep-insights/imports/", ""));
      if (id === "current") return sendJson(res, 400, { error: "Use /imports/current" });
      const state = importRuns.get(id);
      if (!state) return sendJson(res, 404, { error: "Not found" });
      return sendJson(res, 200, wrapSnapshot(state));
    }

    if (req.method === "GET" && pathname === "/api/deep-insights/signals/current") {
      const sid = salonFromUrl(`http://x${url}`);
      const rid = currentImportBySalon.get(sid);
      if (!rid) return sendJson(res, 404, { error: "No current import" });
      const state = importRuns.get(rid);
      if (!state) return sendJson(res, 404, { error: "Not found" });
      return sendJson(res, 200, {
        snapshot: {
          importRun: state.importRun,
          signalsPack: state.signalsPack,
          normalizedDataset: state.normalizedDataset,
          repairs: state.repairs,
          rawFiles: state.rawFiles,
          parsedSchemas: state.parsedSchemas,
          fieldMappings: state.fieldMappings,
          auditEvents: state.auditEvents,
        },
      });
    }

    if (req.method === "DELETE" && pathname === "/api/deep-insights/imports/current") {
      const sid = salonFromUrl(`http://x${url}`);
      deleteCurrentForSalon(sid);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch (e) {
    console.error("[deep-insights-api]", e);
    return sendJson(res, 500, { error: e?.message || "Server error" });
  }
}