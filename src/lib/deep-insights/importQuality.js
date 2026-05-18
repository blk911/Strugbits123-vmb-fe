import {
  applyRepairOverridesToNormalized,
  effectiveServiceCategory,
  isAppointmentProviderIgnored,
  readProviderOverrides,
  readServiceCategoryOverrides,
} from "./importRepairStorage.js";
import { readJson, LS_NORMALIZED, LS_PARSED, LS_RAW_META, LS_SIGNALS, hasImportedDataset } from "./storageKeys.js";

function trimStr(v) {
  return String(v ?? "").trim();
}

/**
 * Pure quality report from in-memory shapes (server or tests).
 * @param {{
 *   rawNormalized: any;
 *   parsed: any;
 *   rawMeta: any;
 *   signalsPack: any;
 *   categoryOverrides: Record<string, string>;
 *   providerOverrides: Record<string, string>;
 * }} p
 */
export function computeImportQualityReportFromData(p) {
  const raw = p.rawNormalized;
  if (!raw) return null;

  const normalized = applyRepairOverridesToNormalized(raw, {
    categoryMap: p.categoryOverrides,
    providerMap: p.providerOverrides,
  });
  const provOv = p.providerOverrides;
  const catOv = p.categoryOverrides;

  const clients = normalized.clients ?? [];
  const appointments = normalized.appointments ?? [];
  const transactions = normalized.transactions ?? [];
  const servicesList = normalized.services ?? [];

  const parsedArr = Array.isArray(p.parsed) ? p.parsed : [];
  const filesParsed = parsedArr.length;

  const rawFiles = Array.isArray(p.rawMeta?.files) ? p.rawMeta.files : [];
  const csvishFromRaw = rawFiles.filter((f) => {
    const name = String(f?.name ?? "").toLowerCase();
    const kind = String(f?.kind ?? "").toLowerCase();
    return kind === "csv" || name.endsWith(".csv");
  }).length;
  const filesTotal = Math.max(filesParsed, csvishFromRaw, rawFiles.length || filesParsed, 1);

  const serviceNames = new Set();
  for (const t of transactions) {
    if (trimStr(t.service_name)) serviceNames.add(trimStr(t.service_name));
    if (trimStr(t.product_name)) serviceNames.add(trimStr(t.product_name));
    if (trimStr(t.custom_item_name)) serviceNames.add(trimStr(t.custom_item_name));
  }
  for (const a of appointments) {
    if (trimStr(a.service_name)) serviceNames.add(trimStr(a.service_name));
  }
  for (const s of servicesList) {
    if (trimStr(s.service_name)) serviceNames.add(trimStr(s.service_name));
  }
  for (const pr of normalized.products ?? []) {
    if (trimStr(pr.product_name)) serviceNames.add(trimStr(pr.product_name));
  }

  let unclassifiedServiceCount = 0;
  for (const name of serviceNames) {
    if (effectiveServiceCategory(name, catOv) === "other") unclassifiedServiceCount += 1;
  }

  const totalNamedServices = serviceNames.size || 0;
  const classifiedCount = totalNamedServices - unclassifiedServiceCount;
  const classificationPct =
    totalNamedServices > 0 ? Math.round((classifiedCount / totalNamedServices) * 100) : 100;

  const missingContactCount = clients.filter((c) => !trimStr(c.email) && !trimStr(c.phone)).length;

  const thinNames = clients.filter(
    (c) => !trimStr(c.client_name) || trimStr(c.client_name) === "Unknown",
  ).length;

  const appointmentsMissingProvider = appointments.filter((a) => {
    const aid = trimStr(a.appointment_id);
    if (isAppointmentProviderIgnored(aid, provOv)) return false;
    return !trimStr(a.provider_name);
  }).length;

  const apptIds = new Set(
    (appointments ?? []).map((a) => trimStr(a.appointment_id)).filter(Boolean),
  );
  let transactionsUnlinkedToAppointments = 0;
  for (const t of transactions) {
    const aid = trimStr(t.appointment_id);
    if (aid && !apptIds.has(aid)) transactionsUnlinkedToAppointments += 1;
  }

  const signals = p.signalsPack;
  const opps = signals?.opportunities ?? [];
  const avgOpportunityModelConfidence =
    opps.length > 0 ?
      opps.reduce((s, o) => s + (typeof o.confidence === "number" ? o.confidence : 0.5), 0) / opps.length
    : 0.5;

  let score = 0;
  if (clients.length >= 10) score += 18;
  else if (clients.length >= 3) score += 12;
  else if (clients.length > 0) score += 6;

  if (appointments.length >= 20) score += 18;
  else if (appointments.length >= 5) score += 12;
  else if (appointments.length > 0) score += 6;

  if (transactions.length >= 20) score += 18;
  else if (transactions.length >= 5) score += 12;
  else if (transactions.length > 0) score += 6;

  if (classificationPct >= 85) score += 16;
  else if (classificationPct >= 60) score += 10;
  else if (classificationPct >= 40) score += 5;

  const fracContact = clients.length ? missingContactCount / clients.length : 0;
  if (fracContact < 0.2) score += 10;
  else if (fracContact < 0.45) score += 6;
  else score += 2;

  const fracNoProv = appointments.length ? appointmentsMissingProvider / appointments.length : 0;
  if (fracNoProv < 0.15) score += 10;
  else if (fracNoProv < 0.35) score += 6;
  else score += 2;

  const fracUnlinked = transactions.length ?
    transactionsUnlinkedToAppointments / transactions.length
  : 0;
  if (transactionsUnlinkedToAppointments === 0) score += 10;
  else if (fracUnlinked < 0.12) score += 7;
  else if (fracUnlinked < 0.3) score += 4;

  score += Math.round(avgOpportunityModelConfidence * 12);

  const normWarnings = normalized.normalizationSummary?.warnings ?? [];
  score -= Math.min(25, normWarnings.length * 6);

  score = Math.max(0, Math.min(100, score));

  let opportunityConfidence = /** @type {'high' | 'medium' | 'low'} */ ("high");
  if (score < 48) opportunityConfidence = "low";
  else if (score < 72) opportunityConfidence = "medium";

  const qualityWarnings = [];
  if (unclassifiedServiceCount > 0) {
    qualityWarnings.push(
      `${unclassifiedServiceCount} service${unclassifiedServiceCount === 1 ? "" : "s"} could not be classified`,
    );
  }
  if (missingContactCount > 0) {
    qualityWarnings.push(
      `${missingContactCount} client${missingContactCount === 1 ? "" : "s"} missing email or phone`,
    );
  }
  if (appointmentsMissingProvider > 0) {
    qualityWarnings.push(
      `${appointmentsMissingProvider} appointment${appointmentsMissingProvider === 1 ? "" : "s"} missing provider`,
    );
  }
  if (transactionsUnlinkedToAppointments > 0) {
    qualityWarnings.push(
      `${transactionsUnlinkedToAppointments} transaction${transactionsUnlinkedToAppointments === 1 ? "" : "s"} could not be linked to appointments`,
    );
  }
  for (const w of normWarnings.slice(0, 4)) {
    if (typeof w === "string" && w && !qualityWarnings.some((q) => q.includes(w.slice(0, 20)))) {
      qualityWarnings.push(w);
    }
  }

  if (thinNames > 0) {
    qualityWarnings.push(`${thinNames} client record${thinNames === 1 ? "" : "s"} need usable names`);
  }

  const actionableWarnings = [];
  if (unclassifiedServiceCount > 0) {
    actionableWarnings.push({
      message: `${unclassifiedServiceCount} service${unclassifiedServiceCount === 1 ? "" : "s"} could not be classified`,
      count: unclassifiedServiceCount,
      action: "Review Services",
    });
  }
  if (missingContactCount > 0) {
    actionableWarnings.push({
      message: `${missingContactCount} client${missingContactCount === 1 ? "" : "s"} missing email or phone`,
      count: missingContactCount,
      action: "Review Contacts",
    });
  }
  if (appointmentsMissingProvider > 0) {
    actionableWarnings.push({
      message: `${appointmentsMissingProvider} appointment${appointmentsMissingProvider === 1 ? "" : "s"} missing provider`,
      count: appointmentsMissingProvider,
      action: "Review Providers",
    });
  }
  if (transactionsUnlinkedToAppointments > 0) {
    actionableWarnings.push({
      message: `${transactionsUnlinkedToAppointments} transaction${transactionsUnlinkedToAppointments === 1 ? "" : "s"} could not be linked to appointments`,
      count: transactionsUnlinkedToAppointments,
      action: "Review Transactions",
    });
  }
  if (thinNames > 0) {
    actionableWarnings.push({
      message: `${thinNames} client record${thinNames === 1 ? "" : "s"} need usable names`,
      count: thinNames,
      action: "Review Contacts",
    });
  }
  for (const w of normWarnings.slice(0, 4)) {
    if (typeof w === "string" && w && !actionableWarnings.some((a) => a.message.includes(w.slice(0, 24)))) {
      actionableWarnings.push({
        message: w,
        action: "Review Transactions",
      });
    }
  }

  return {
    filesParsed,
    filesTotal,
    clientsMapped: clients.length,
    appointmentsMapped: appointments.length,
    transactionsMapped: transactions.length,
    classificationPct,
    unclassifiedServiceCount,
    opportunityConfidence,
    score,
    qualityWarnings,
    actionableWarnings,
    missingContactCount,
    appointmentsMissingProvider,
    transactionsUnlinkedToAppointments,
    avgOpportunityModelConfidence,
  };
}

/**
 * @returns {null | {
 *   filesParsed: number;
 *   filesTotal: number;
 *   clientsMapped: number;
 *   appointmentsMapped: number;
 *   transactionsMapped: number;
 *   classificationPct: number;
 *   unclassifiedServiceCount: number;
 *   opportunityConfidence: 'high' | 'medium' | 'low';
 *   score: number;
 *   qualityWarnings: string[];
 *   actionableWarnings: Array<{ message: string; count?: number; action: string }>;
 *   missingContactCount: number;
 *   appointmentsMissingProvider: number;
 *   transactionsUnlinkedToAppointments: number;
 *   avgOpportunityModelConfidence: number;
 * }}
 */
export function getImportQualityReport() {
  if (!hasImportedDataset()) return null;

  const raw = readJson(LS_NORMALIZED, null);
  const parsed = readJson(LS_PARSED, null);
  const rawMeta = readJson(LS_RAW_META, null);
  const signals = readJson(LS_SIGNALS, null);

  if (!raw) return null;

  return computeImportQualityReportFromData({
    rawNormalized: raw,
    parsed,
    rawMeta,
    signalsPack: signals,
    categoryOverrides: readServiceCategoryOverrides(),
    providerOverrides: readProviderOverrides(),
  });
}

/**
 * When true, Recommended Campaigns must not use imported opportunities (owner should fix mapping first).
 * @returns {boolean}
 */
export function shouldSuppressImportedCampaigns() {
  const q = getImportQualityReport();
  return Boolean(q && q.opportunityConfidence === "low");
}

export function importQualityTierHint(confidence) {
  if (confidence === "high") {
    return "Safe to generate campaigns from this import.";
  }
  if (confidence === "medium") {
    return "Safe to review; owner approval required before sends.";
  }
  return "Analytics only — campaign automation suppressed until mapping improves.";
}
