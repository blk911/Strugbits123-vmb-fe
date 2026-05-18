import { appendImportAuditEvent } from "./importAudit.js";
import { classifyService } from "./classifyService.js";
import { generateSalonSignals } from "./generateSalonSignals.js";
import {
  LS_CONTACT_SUPPRESSION,
  LS_IMPORT_RUN_ID,
  LS_NORMALIZED,
  LS_PROVIDER_OVERRIDES,
  LS_SERVICE_CATEGORY_OVERRIDES,
  LS_SIGNALS,
  notifyDeepInsightsDatasetChanged,
  readJson,
  writeJson,
} from "./storageKeys.js";

function trimStr(v) {
  return String(v ?? "").trim();
}

/** Category dropdown values (canonical). */
export const SERVICE_REVIEW_CATEGORIES = [
  "balayage",
  "color",
  "haircut",
  "nails",
  "lashes",
  "brows",
  "skin",
  "waxing",
  "retail",
  "other",
];

export const PROVIDER_IGNORE_SENTINEL = "__ignore__";

export function readServiceCategoryOverrides() {
  const o = readJson(LS_SERVICE_CATEGORY_OVERRIDES, null);
  return o && typeof o === "object" && !Array.isArray(o) ? { ...o } : {};
}

export function writeServiceCategoryOverrides(map) {
  writeJson(LS_SERVICE_CATEGORY_OVERRIDES, map);
}

export function setServiceCategoryOverride(serviceName, category) {
  const name = trimStr(serviceName);
  if (!name) return;
  const m = readServiceCategoryOverrides();
  if (!SERVICE_REVIEW_CATEGORIES.includes(category)) return;
  m[name] = category;
  writeServiceCategoryOverrides(m);
}

export function readContactSuppression() {
  const o = readJson(LS_CONTACT_SUPPRESSION, null);
  return o && typeof o === "object" && !Array.isArray(o) ? { ...o } : {};
}

/** @returns {Set<string>} */
export function getContactSuppressionSet() {
  const rec = readContactSuppression();
  return new Set(
    Object.entries(rec)
      .filter(([, v]) => v === true || v === 1 || v === "1")
      .map(([k]) => String(k)),
  );
}

export function setContactSuppressed(clientId, held) {
  const id = trimStr(clientId);
  if (!id) return;
  const m = readContactSuppression();
  if (held) m[id] = true;
  else delete m[id];
  writeJson(LS_CONTACT_SUPPRESSION, m);
}

export function readProviderOverrides() {
  const o = readJson(LS_PROVIDER_OVERRIDES, null);
  return o && typeof o === "object" && !Array.isArray(o) ? { ...o } : {};
}

export function collectRepairsFromLocalStorage() {
  return {
    serviceCategoryOverrides: readServiceCategoryOverrides(),
    contactSuppressions: readContactSuppression(),
    providerOverrides: readProviderOverrides(),
  };
}

export function setProviderOverride(appointmentId, value) {
  const id = trimStr(appointmentId);
  if (!id) return;
  const m = readProviderOverrides();
  if (value == null || value === "") {
    delete m[id];
    writeJson(LS_PROVIDER_OVERRIDES, m);
    return;
  }
  m[id] = String(value);
  writeJson(LS_PROVIDER_OVERRIDES, m);
}

/**
 * @param {string} serviceName
 * @param {Record<string, string>} overridesMap
 */
export function effectiveServiceCategory(serviceName, overridesMap) {
  const name = trimStr(serviceName);
  const ov = name ? overridesMap[name] : "";
  if (ov && SERVICE_REVIEW_CATEGORIES.includes(ov)) return ov;
  return classifyService(name).service_category;
}

/**
 * Deep-clone normalized dataset and apply category + provider repair fields for scoring / signals.
 * @param {any} raw
 * @param {{ categoryMap?: Record<string, string>; providerMap?: Record<string, string> }} [explicitMaps]
 */
export function applyRepairOverridesToNormalized(raw, explicitMaps) {
  const normalized = JSON.parse(JSON.stringify(raw));
  const catOv =
    explicitMaps?.categoryMap ??
    readServiceCategoryOverrides();
  const provOv =
    explicitMaps?.providerMap ??
    readProviderOverrides();

  const patchName = (svcName) => {
    const nm = trimStr(svcName);
    if (!nm) return;
    return effectiveServiceCategory(nm, catOv);
  };

  for (const a of normalized.appointments ?? []) {
    const nm = trimStr(a.service_name);
    if (nm) {
      const cat = patchName(nm);
      if (cat) a.service_category = cat;
    }
    const aid = trimStr(a.appointment_id);
    const p = provOv[aid];
    if (p && p !== PROVIDER_IGNORE_SENTINEL) {
      a.provider_name = p;
    }
  }

  for (const t of normalized.transactions ?? []) {
    const nm = trimStr(t.service_name);
    if (nm) {
      const cat = patchName(nm);
      if (cat) t.service_category = cat;
    }
  }

  for (const s of normalized.services ?? []) {
    const nm = trimStr(s.service_name);
    if (nm) {
      const cat = patchName(nm);
      if (cat) s.service_category = cat;
    }
  }

  return normalized;
}

export function refreshDeepInsightsAfterRepairsLocal() {
  const raw = readJson(LS_NORMALIZED, null);
  if (!raw) {
    notifyDeepInsightsDatasetChanged();
    return;
  }
  const patched = applyRepairOverridesToNormalized(raw);
  const pack = generateSalonSignals(patched);
  writeJson(LS_SIGNALS, pack);
  appendImportAuditEvent({
    bucket: "recalculate_complete",
    kind: "signals_regenerated",
    detail: `${pack.opportunities?.length ?? 0} campaign-ready opportunities`,
  });
  notifyDeepInsightsDatasetChanged();
}

export function refreshDeepInsightsAfterRepairs() {
  const runId = readJson(LS_IMPORT_RUN_ID, null);
  if (runId && typeof window !== "undefined") {
    import("./deepInsightsApi.js").then((m) => {
      void m.pushRepairsAndRecalculate().then((ok) => {
        if (!ok) refreshDeepInsightsAfterRepairsLocal();
      });
    });
    return;
  }
  refreshDeepInsightsAfterRepairsLocal();
}

/**
 * @param {string} appointmentId
 * @param {Record<string, string>} [provOv]
 */
export function isAppointmentProviderIgnored(appointmentId, provOv = readProviderOverrides()) {
  return provOv[trimStr(appointmentId)] === PROVIDER_IGNORE_SENTINEL;
}
