/** @typedef {"available" | "limited" | "missing"} CapabilityLevel */

function trimStr(v) {
  return String(v ?? "").trim();
}

/**
 * @param {any} normalizedDataset
 * @returns {boolean}
 */
function hasServiceLineSignals(normalizedDataset) {
  const n = normalizedDataset;
  if (!n) return false;
  if ((n.services?.length ?? 0) > 0 || (n.products?.length ?? 0) > 0) return true;
  for (const t of n.transactions ?? []) {
    if (
      trimStr(t.service_name) ||
      trimStr(t.product_name) ||
      trimStr(t.custom_item_name) ||
      trimStr(t.item_descriptor)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * @param {any} normalizedDataset
 */
function transactionDatesExist(normalizedDataset) {
  for (const t of normalizedDataset?.transactions ?? []) {
    if (trimStr(t.transaction_date)) return true;
  }
  return false;
}

const OUTREACH_LIMITED_THRESHOLD = 0.4;

/**
 * Deep Insights capability grid for imported data (what the product can safely claim).
 *
 * @param {any} normalizedDataset
 * @param {Array<{ reportType?: string }>=} parsedFiles
 * @param {any | null} signalsPack
 * @returns {{
 *   revenue: CapabilityLevel;
 *   clients: CapabilityLevel;
 *   services: CapabilityLevel;
 *   providers: CapabilityLevel;
 *   schedule: CapabilityLevel;
 *   outreach: CapabilityLevel;
 *   notes: string[];
 * }}
 */
export function getImportCapabilities(normalizedDataset, parsedFiles = [], signalsPack = null) {
  /** @type {string[]} */
  const notes = [];

  const clients = normalizedDataset?.clients ?? [];
  const appointments = normalizedDataset?.appointments ?? [];
  const transactions = normalizedDataset?.transactions ?? [];
  const providers = normalizedDataset?.providers ?? [];

  /** @type {CapabilityLevel} */
  let revenue = "missing";
  if (transactions.length > 0) revenue = "available";

  /** @type {CapabilityLevel} */
  let clientsLevel = "missing";
  if (clients.length > 0) clientsLevel = "available";

  /** @type {CapabilityLevel} */
  let services = "missing";
  if (hasServiceLineSignals(normalizedDataset)) {
    services = "available";
  } else if (transactions.length > 0) {
    services = "limited";
  }

  /** @type {CapabilityLevel} */
  let providersLevel = "missing";
  if (providers.length > 0) providersLevel = "available";

  /** @type {CapabilityLevel} */
  let schedule = "missing";
  if (appointments.length > 0) {
    schedule = "available";
  } else if (transactionDatesExist(normalizedDataset)) {
    schedule = "limited";
  }

  /** @type {CapabilityLevel} */
  let outreach = "missing";
  if (clients.length > 0) {
    const noContact = clients.filter((c) => !trimStr(c.email) && !trimStr(c.phone)).length;
    const frac = noContact / clients.length;
    if (frac >= OUTREACH_LIMITED_THRESHOLD) {
      outreach = "limited";
      notes.push(
        `${Math.round(frac * 100)}% of imported clients are missing both email and phone — outreach campaigns are limited until contact fields improve.`,
      );
    } else {
      outreach = "available";
    }
  }

  const cov = signalsPack?.signals?.scheduleCoverage;
  if (cov === "limited" && schedule === "limited") {
    notes.push("Schedule and open-window intelligence are limited without appointment or calendar data.");
  }

  const hadCommission =
    Array.isArray(parsedFiles) &&
    parsedFiles.some((f) => f?.reportType === "commission_earnings_detail");
  if (hadCommission && schedule !== "available") {
    notes.push(
      "GlossGenius Commission Earnings Detail supports revenue, client, provider, and line-item signals; true calendar-gap campaigns need schedule data.",
    );
  }

  const normWarnings = normalizedDataset?.normalizationSummary?.warnings ?? [];
  for (const w of normWarnings) {
    if (typeof w === "string" && w && !notes.includes(w)) {
      if (w.includes("Commission Earnings Detail") || w.includes("appointment")) {
        notes.push(w);
      }
    }
  }

  return {
    revenue,
    clients: clientsLevel,
    services,
    providers: providersLevel,
    schedule,
    outreach,
    notes,
  };
}

/** UI label for compact chips */
export const IMPORT_CAPABILITY_LABELS = /** @type {const} */ ({
  available: "Available",
  limited: "Limited",
  missing: "Missing",
});
