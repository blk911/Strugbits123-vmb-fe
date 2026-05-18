import { matchCommissionEarningsDetailHeaders } from "./glossGeniusCommissionAdapter.js";

/**
 * @param {string} fileName
 * @returns {"appointments"|"payments"|"checkout_line_items"|"summary"|"customers"|"commission_earnings_detail"|"unknown"}
 */
export function detectReportTypeFromFilename(fileName) {
  const n = fileName.toLowerCase();
  if (n.includes("appointment")) return "appointments";
  if (n.includes("commission") && (n.includes("earning") || n.includes("commission-earnings"))) {
    return "commission_earnings_detail";
  }
  if (n.includes("payment")) return "payments";
  if (n.includes("checkout") || n.includes("line item")) return "checkout_line_items";
  if (n.includes("summary")) return "summary";
  if (n.includes("customer") || n.includes("client") || n.includes("valuable")) return "customers";
  return "unknown";
}

/**
 * @param {string} fileName
 * @param {string[]} headers
 * @returns {{ provider: string; reportType: string; confidence: number }}
 */
export function detectFileMeta(fileName, headers) {
  const commissionMatch = matchCommissionEarningsDetailHeaders(headers);
  if (commissionMatch.ok) {
    return {
      provider: "glossgenius",
      reportType: "commission_earnings_detail",
      confidence: commissionMatch.fullFingerprint ? 0.97 : 0.93,
    };
  }

  const hn = headers.map((h) => String(h ?? "").toLowerCase()).join("|");
  const fn = fileName.toLowerCase();
  let provider = "unknown";
  let confidence = 0.35;

  if (
    fn.includes("gloss") ||
    fn.includes("ggen") ||
    hn.includes("gross payment") ||
    hn.includes("summary level") ||
    hn.includes("service provider")
  ) {
    provider = "glossgenius";
    confidence = 0.82;
  }

  let reportType = detectReportTypeFromFilename(fileName);
  if (reportType === "unknown") {
    if (hn.includes("appointment") || hn.includes("booked")) reportType = "appointments";
    else if (hn.includes("payment") || hn.includes("charge")) reportType = "payments";
    else if (hn.includes("line") || hn.includes("checkout")) reportType = "checkout_line_items";
    else if (hn.includes("summary") || hn.includes("total service")) reportType = "summary";
    else if (hn.includes("email") && hn.includes("client")) reportType = "customers";
  }

  if (reportType !== "unknown") confidence = Math.min(0.95, confidence + 0.08);

  return { provider, reportType, confidence };
}
