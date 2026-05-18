/**
 * GlossGenius — Commission Earnings Detail export (service / product / other line items).
 * Header names are matched case-insensitively with collapsed whitespace.
 */

/** All columns from the known Commission Earnings Detail CSV (normalized keys). */
export const GLOSS_GENIUS_COMMISSION_EARNINGS_DETAIL_HEADERS = [
  "date",
  "provider",
  "charge id",
  "payment source",
  "client",
  "descriptor",
  "price",
  "total payment amount",
  "payment method",
  "payment processing fee paid by business",
  "item discount",
  "net sale",
  "sales tax",
  "tip earned",
  "commission earned from total price",
  "commission earned from net sale",
  "product cost",
  "net sales minus cost",
];

/** Minimum subset for high-confidence detection (must all be present). */
const COMMISSION_HEADER_REQUIRED = [
  "date",
  "provider",
  "charge id",
  "client",
  "descriptor",
  "net sale",
  "tip earned",
];

/** @param {string[]} headers */
export function normalizeHeaderKey(headers) {
  return headers.map((x) => String(x ?? "").trim().toLowerCase().replace(/\s+/g, " "));
}

/**
 * @param {string[]} headers raw CSV headers
 * @returns {{ ok: boolean; fullFingerprint: boolean; headerSet: Set<string> }}
 */
export function matchCommissionEarningsDetailHeaders(headers) {
  const keys = normalizeHeaderKey(headers);
  const headerSet = new Set(keys);
  const ok = COMMISSION_HEADER_REQUIRED.every((k) => headerSet.has(k));
  const fullFingerprint =
    ok && GLOSS_GENIUS_COMMISSION_EARNINGS_DETAIL_HEADERS.every((k) => headerSet.has(k));
  return { ok, fullFingerprint, headerSet };
}

/** Preset column -> canonical field for commission_earnings_detail rows. */
export const COMMISSION_EARNINGS_HEADER_TO_CANONICAL = /** @type {Record<string, string>} */ ({
  date: "transaction_date",
  provider: "provider_name",
  "charge id": "transaction_id",
  "payment source": "payment_source",
  client: "client_name",
  descriptor: "item_descriptor",
  price: "service_amount",
  "total payment amount": "total_collected",
  "payment method": "payment_method",
  "payment processing fee paid by business": "processing_fee",
  "item discount": "discount",
  "net sale": "net_sale",
  "sales tax": "tax",
  "tip earned": "tip",
  "commission earned from total price": "commission_from_total_price",
  "commission earned from net sale": "commission_from_net_sale",
  "product cost": "product_cost",
  "net sales minus cost": "net_sales_minus_cost",
  "line item type": "line_item_class",
  "item type": "line_item_class",
  "line item class": "line_item_class",
});

/**
 * @param {Record<string,string>} row
 * @param {Record<string,string>} map column -> canonical
 * @returns {"service"|"product"|"other"}
 */
export function inferCommissionLineItemClass(row, map) {
  const h = Object.keys(map).find((col) => map[col] === "line_item_class");
  if (h) {
    const v = String(row[h] ?? "").toLowerCase();
    if (v.includes("product")) return "product";
    if (v.includes("service")) return "service";
    if (v.includes("other") || v.includes("fee") || v.includes("custom") || v.includes("misc")) return "other";
    if (v.trim()) return "other";
  }
  for (const key of Object.keys(row)) {
    const kl = String(key).trim().toLowerCase().replace(/\s+/g, " ");
    if (kl === "item type" || kl === "line item type" || kl === "line item class") {
      const v = String(row[key] ?? "").toLowerCase();
      if (v.includes("product")) return "product";
      if (v.includes("service")) return "service";
      if (v.includes("other") || v.includes("fee") || v.includes("custom") || v.includes("misc")) return "other";
      if (v.trim()) return "other";
    }
  }
  return "service";
}
