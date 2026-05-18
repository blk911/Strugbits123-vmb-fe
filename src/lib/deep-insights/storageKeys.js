import { removeDeepInsightsDerivedCampaigns } from "../../data/salonCampaignStore.js";

export const LS_SERVICE_CATEGORY_OVERRIDES = "vmb_deep_insights_service_category_overrides";
export const LS_CONTACT_SUPPRESSION = "vmb_deep_insights_contact_suppression";
export const LS_PROVIDER_OVERRIDES = "vmb_deep_insights_provider_overrides";

export const LS_RAW_META = "vmb_deep_insights_raw_files_meta";
export const LS_PARSED = "vmb_deep_insights_parsed_files";
export const LS_MAPPING = "vmb_deep_insights_mapping";
export const LS_NORMALIZED = "vmb_deep_insights_normalized_dataset";
export const LS_SIGNALS = "vmb_deep_insights_signals";
export const LS_IMPORT_AUDIT = "vmb_deep_insights_import_audit";
export const LS_IMPORT_RUN_ID = "vmb_deep_insights_import_run_id";

export function readJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

export function clearDeepInsightsImport() {
  [
    LS_RAW_META,
    LS_PARSED,
    LS_MAPPING,
    LS_NORMALIZED,
    LS_SIGNALS,
    LS_SERVICE_CATEGORY_OVERRIDES,
    LS_CONTACT_SUPPRESSION,
    LS_PROVIDER_OVERRIDES,
    LS_IMPORT_AUDIT,
    LS_IMPORT_RUN_ID,
  ].forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      /* */
    }
  });
  removeDeepInsightsDerivedCampaigns();
  notifyDeepInsightsDatasetChanged();
}

export function hasImportedDataset() {
  const n = readJson(LS_NORMALIZED, null);
  return Boolean(n?.clients?.length || n?.appointments?.length || n?.transactions?.length);
}

/** Parsed or mapping artifacts exist (pipeline in progress or partial). */
export function hasDeepInsightsPipelineArtifacts() {
  const parsed = readJson(LS_PARSED, null);
  const mapping = readJson(LS_MAPPING, null);
  const hasParsed = Array.isArray(parsed) && parsed.length > 0;
  const hasMapping =
    mapping && typeof mapping === "object" && Object.keys(mapping).length > 0;
  return Boolean(hasParsed || hasMapping);
}

/** Show Import Review when normalized import exists or earlier pipeline data exists. */
export function shouldShowImportReviewPanel() {
  return hasImportedDataset() || hasDeepInsightsPipelineArtifacts();
}

const DEEP_INSIGHTS_DATA_CAPTURE = "/salon-owner/deep-insights/data-capture";
const DEEP_INSIGHTS_ANALYTICS = "/salon-owner/deep-insights/analytics";

/** Dispatched on this window when normalized import data is written or cleared (same-tab sidebar refresh). */
export const DEEP_INSIGHTS_DATASET_EVENT = "vmb-deep-insights-dataset-updated";

export function notifyDeepInsightsDatasetChanged() {
  try {
    window.dispatchEvent(new Event(DEEP_INSIGHTS_DATASET_EVENT));
  } catch {
    /* */
  }
}

/** Salon id for Deep Insights API (no auth wired yet). */
export function getDefaultDeepInsightsSalonId() {
  try {
    const fromEnv = import.meta.env?.VITE_DEEP_INSIGHTS_SALON_ID;
    if (typeof fromEnv === "string" && fromEnv.trim()) return fromEnv.trim();
  } catch {
    /* */
  }
  return "salon-local-preview";
}

/**
 * Generic tAIkOS / Deep Insights entry: analytics when loaded, otherwise data capture.
 * Do not use for explicit “Data Capture” or “Analytics” subnav links.
 * @returns {string}
 */
export function deepInsightsPreferredPath() {
  return hasImportedDataset() ? DEEP_INSIGHTS_ANALYTICS : DEEP_INSIGHTS_DATA_CAPTURE;
}

/**
 * Resolve static mock targets that pointed at analytics-only routes into the preferred entry.
 * @param {string} path
 * @returns {string}
 */
export function resolveGenericDeepInsightsTarget(path) {
  if (path === DEEP_INSIGHTS_ANALYTICS) return deepInsightsPreferredPath();
  return path;
}
