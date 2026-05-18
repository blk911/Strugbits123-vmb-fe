/**
 * Deep Insights REST client — API-first with localStorage mirror fallback.
 *
 * TODO: Send auth headers + real salon id from session when backend auth exists.
 * TODO: Production host — set VITE_BACKEND_URL or mount these routes on your API.
 */

import { buildApiBaseUrl } from "../../store/api/baseUrl.js";
import { appendImportAuditEvent } from "./importAudit.js";
import { mirrorDeepInsightsServerSnapshot } from "./deepInsightsMirror.js";
import { collectRepairsFromLocalStorage } from "./importRepairStorage.js";
import {
  clearDeepInsightsImport,
  getDefaultDeepInsightsSalonId,
  LS_IMPORT_RUN_ID,
  readJson,
  writeJson,
} from "./storageKeys.js";

const RELATIVE_DEV_PREFIX = "/api/deep-insights";

function deepInsightsUrl(path) {
  const slug = path.startsWith("/") ? path : `/${path}`;
  if (import.meta.env.DEV) {
    return `${RELATIVE_DEV_PREFIX}${slug}`;
  }
  const base = buildApiBaseUrl("api/deep-insights").replace(/\/$/, "");
  return `${base}${slug}`;
}

async function fetchJson(method, path, body) {
  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body !== undefined && method !== "GET" && method !== "DELETE") {
    init.body = JSON.stringify(body);
  }
  const res = await fetch(deepInsightsUrl(path), init);
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!res.ok) {
    const err = new Error(data?.error || res.statusText || "API error");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function tryMirrorFromResponse(data) {
  if (data?.snapshot) {
    mirrorDeepInsightsServerSnapshot(data.snapshot);
    return { ok: true, snapshot: data.snapshot };
  }
  return { ok: false };
}

export function getPersistedImportRunId() {
  return readJson(LS_IMPORT_RUN_ID, null);
}

export async function createImportRun(payload = {}) {
  const salonId = payload.salonId ?? getDefaultDeepInsightsSalonId();
  const data = await fetchJson("POST", "/imports", { salonId, ...payload });
  await tryMirrorFromResponse(data);
  if (data?.importRun?.id) {
    writeJson(LS_IMPORT_RUN_ID, data.importRun.id);
  }
  return data;
}

/**
 * Upload raw files (JSON + base64) — avoids multipart dependency in dev middleware.
 * @param {string} importRunId
 * @param {File[]} files
 */
export async function uploadImportFiles(importRunId, files) {
  const payload = { files: [] };
  for (const f of files) {
    const buf = await f.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const b64 = btoa(binary);
    payload.files.push({
      fileName: f.name,
      fileType: f.type || "text/csv",
      size: f.size,
      contentBase64: b64,
    });
  }
  const data = await fetchJson("POST", `/imports/${encodeURIComponent(importRunId)}/files`, payload);
  await tryMirrorFromResponse(data);
  return data;
}

export async function parseImportRun(importRunId) {
  const data = await fetchJson("POST", `/imports/${encodeURIComponent(importRunId)}/parse`, {});
  await tryMirrorFromResponse(data);
  return data;
}

export async function saveFieldMappings(importRunId, mappingsByFile) {
  const data = await fetchJson("POST", `/imports/${encodeURIComponent(importRunId)}/mapping`, {
    mappingsByFile,
  });
  await tryMirrorFromResponse(data);
  return data;
}

export async function normalizeImportRun(importRunId) {
  const data = await fetchJson("POST", `/imports/${encodeURIComponent(importRunId)}/normalize`, {});
  await tryMirrorFromResponse(data);
  return data;
}

export async function saveRepairOverrides(importRunId, overrides) {
  const data = await fetchJson("POST", `/imports/${encodeURIComponent(importRunId)}/repairs`, {
    overrides,
  });
  await tryMirrorFromResponse(data);
  return data;
}

export async function recalculateImportRun(importRunId) {
  const data = await fetchJson(
    "POST",
    `/imports/${encodeURIComponent(importRunId)}/recalculate`,
    {},
  );
  await tryMirrorFromResponse(data);
  return data;
}

export async function getCurrentImportRun(salonId = getDefaultDeepInsightsSalonId()) {
  const data = await fetchJson(
    "GET",
    `/imports/current?salonId=${encodeURIComponent(salonId)}`,
    undefined,
  );
  if (data?.snapshot) {
    mirrorDeepInsightsServerSnapshot(data.snapshot);
  }
  return data;
}

export async function getImportRun(importRunId) {
  const data = await fetchJson("GET", `/imports/${encodeURIComponent(importRunId)}`, undefined);
  if (data?.snapshot) {
    mirrorDeepInsightsServerSnapshot(data.snapshot);
  }
  return data;
}

export async function getCurrentSignals(salonId = getDefaultDeepInsightsSalonId()) {
  const data = await fetchJson(
    "GET",
    `/signals/current?salonId=${encodeURIComponent(salonId)}`,
    undefined,
  );
  if (data?.snapshot?.signalsPack) {
    mirrorDeepInsightsServerSnapshot({
      importRun: data.snapshot.importRun ?? { id: getPersistedImportRunId() },
      rawFiles: data.snapshot.rawFiles ?? [],
      parsedSchemas: data.snapshot.parsedSchemas ?? [],
      fieldMappings: data.snapshot.fieldMappings ?? {},
      normalizedDataset: data.snapshot.normalizedDataset,
      repairs: data.snapshot.repairs,
      signalsPack: data.snapshot.signalsPack,
      auditEvents: data.snapshot.auditEvents ?? [],
    });
  }
  return data;
}

export async function clearCurrentImport(salonId = getDefaultDeepInsightsSalonId()) {
  try {
    await fetchJson("DELETE", `/imports/current?salonId=${encodeURIComponent(salonId)}`, undefined);
  } catch {
    /* fallback below */
  }
  clearDeepInsightsImport();
}

/**
 * Before a new import run (new file set), drop server-side current import (best-effort)
 * and wipe local mirror: raw meta, parsed, mappings, normalized, signals, repairs, audit, campaigns from prior import.
 */
export async function prepareDeepInsightsImportReplace(salonId = getDefaultDeepInsightsSalonId()) {
  return clearCurrentImport(salonId);
}

/**
 * Pull latest import + signals from API into localStorage mirror.
 * @returns {Promise<boolean>} true if API succeeded
 */
export async function hydrateDeepInsightsFromApi() {
  try {
    await getCurrentImportRun();
    try {
      await getCurrentSignals();
    } catch {
      /* signals optional */
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Sync repairs from LS then recalculate on server (API-first).
 * @returns {Promise<boolean>}
 */
export async function pushRepairsAndRecalculate() {
  const runId = getPersistedImportRunId();
  if (!runId) return false;
  try {
    const repairs = collectRepairsFromLocalStorage();
    await saveRepairOverrides(runId, repairs);
    await recalculateImportRun(runId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Record local-only audit when API repair sync fails (demo / offline).
 */
export function recordLocalRepairAudit(kind, detail) {
  appendImportAuditEvent({ bucket: "repair_saved", kind, detail });
}
