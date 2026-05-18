import {
  LS_CONTACT_SUPPRESSION,
  LS_NORMALIZED,
  LS_PROVIDER_OVERRIDES,
  LS_RAW_META,
  LS_SERVICE_CATEGORY_OVERRIDES,
  LS_SIGNALS,
  LS_IMPORT_AUDIT,
  LS_PARSED,
  readJson,
  writeJson,
} from "./storageKeys.js";

const MAX_EVENTS = 100;

/**
 * @typedef {'import_complete' | 'repair_saved' | 'recalculate_complete'} ImportAuditBucket
 */

/**
 * @typedef {{
 *   at: string;
 *   bucket: ImportAuditBucket;
 *   kind: string;
 *   detail?: string;
 * }} ImportAuditEventRow
 */

/** @returns {{ version: number; events: ImportAuditEventRow[] }} */
export function readImportAudit() {
  const raw = readJson(LS_IMPORT_AUDIT, null);
  if (!raw || typeof raw !== "object") return { version: 1, events: [] };
  const events = Array.isArray(raw.events) ? raw.events : [];
  return { version: 1, events };
}

/** @param {{ version: number; events: ImportAuditEventRow[] }} data */
export function writeImportAudit(data) {
  writeJson(LS_IMPORT_AUDIT, data);
}

/**
 * @param {{ bucket: ImportAuditBucket; kind: string; detail?: string }} row
 */
export function appendImportAuditEvent({ bucket, kind, detail }) {
  const audit = readImportAudit();
  audit.events.push({
    at: new Date().toISOString(),
    bucket,
    kind,
    detail: detail ? String(detail).slice(0, 240) : undefined,
  });
  if (audit.events.length > MAX_EVENTS) {
    audit.events = audit.events.slice(-MAX_EVENTS);
  }
  writeImportAudit(audit);
}

export function formatAuditKindLabel(kind) {
  const map = {
    import_created: "Import created",
    file_uploaded: "File uploaded",
    file_parsed: "File parsed",
    mapping_saved: "Mapping saved",
    normalized: "Normalized",
    mapping_confirmed: "Mapping confirmed",
    import_complete: "Import complete",
    service_override_saved: "Service override saved",
    contact_held: "Contact held from outreach",
    contact_released: "Contact released for outreach",
    provider_override_saved: "Provider override saved",
    signals_regenerated: "Signals regenerated",
    repair_saved: "Repair saved",
    recalculated: "Recalculated",
    cleared: "Import cleared",
  };
  return map[kind] || kind;
}

function serverTypeToLocalRow(type, message, payload, createdAt) {
  /** @type {ImportAuditBucket} */
  let bucket = "import_complete";
  if (type === "repair_saved" || type === "repair_patch") bucket = "repair_saved";
  if (type === "recalculated") bucket = "recalculate_complete";

  let kind = type;
  if (type === "repair_patch") kind = "repair_saved";

  const detail =
    message ||
    (payload && typeof payload === "object" ? JSON.stringify(payload).slice(0, 200) : undefined);

  return {
    at: createdAt,
    bucket,
    kind,
    detail,
  };
}

/**
 * Replace local audit log with server events (API source of truth).
 * @param {Array<{ type: string; message?: string; payload?: any; createdAt: string }>} serverEvents
 */
export function writeImportAuditFromServerEvents(serverEvents) {
  const rows = (serverEvents ?? []).map((e) =>
    serverTypeToLocalRow(e.type, e.message, e.payload, e.createdAt),
  );
  writeImportAudit({ version: 1, events: rows.slice(-MAX_EVENTS) });
}

export function computeImportAuditSummary() {
  const rawMeta = readJson(LS_RAW_META, null);
  const parsed = readJson(LS_PARSED, null);
  const normalized = readJson(LS_NORMALIZED, null);
  const signals = readJson(LS_SIGNALS, null);
  const cat = readJson(LS_SERVICE_CATEGORY_OVERRIDES, null);
  const sup = readJson(LS_CONTACT_SUPPRESSION, null);
  const prov = readJson(LS_PROVIDER_OVERRIDES, null);

  const importedFiles = Array.isArray(rawMeta?.files) ? rawMeta.files.length
    : Array.isArray(parsed) ? parsed.length
    : 0;

  const clients = normalized?.clients?.length ?? 0;
  const appointments = normalized?.appointments?.length ?? 0;
  const transactions = normalized?.transactions?.length ?? 0;
  const normalizedTotal = clients + appointments + transactions;

  const catN = cat && typeof cat === "object" && !Array.isArray(cat) ? Object.keys(cat).length : 0;
  const supN =
    sup && typeof sup === "object" && !Array.isArray(sup) ?
      Object.values(sup).filter((v) => v === true || v === 1 || v === "1").length
    : 0;
  const provN = prov && typeof prov === "object" && !Array.isArray(prov) ? Object.keys(prov).length : 0;
  const repairsApplied = catN + supN + provN;

  const opportunities = Array.isArray(signals?.opportunities) ? signals.opportunities.length : 0;
  const lastRecalculated = signals?.generatedAt ?? null;

  return {
    importedFiles,
    normalizedRecords: { clients, appointments, transactions, total: normalizedTotal },
    repairsApplied,
    signalsGenerated: Boolean(signals),
    opportunityCount: opportunities,
    lastRecalculated,
  };
}
