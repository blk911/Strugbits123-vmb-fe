import { COMMISSION_EARNINGS_HEADER_TO_CANONICAL } from "./glossGeniusCommissionAdapter.js";

/** @typedef {{ value: string; label: string; entity: string }} CanonicalOption */

/** @type {Record<string, string[]>} */
export const CANONICAL_BY_ENTITY = {
  clients: [
    "client_id",
    "client_name",
    "first_name",
    "last_name",
    "email",
    "phone",
    "birthday",
    "created_at",
    "last_visit_at",
    "lifetime_spend",
    "visit_count",
    "referral_source",
    "notes",
  ],
  appointments: [
    "appointment_id",
    "client_name",
    "client_id",
    "provider_name",
    "service_name",
    "service_category",
    "appointment_date",
    "start_time",
    "end_time",
    "status",
    "booking_source",
    "created_at",
    "cancelled_at",
  ],
  transactions: [
    "transaction_id",
    "appointment_id",
    "client_name",
    "provider_name",
    "service_name",
    "service_category",
    "transaction_date",
    "service_amount",
    "discount",
    "tip",
    "tax",
    "total_collected",
    "payment_method",
    "payment_source",
    "processing_fee",
    "net_sale",
    "commission_from_total_price",
    "commission_from_net_sale",
    "product_cost",
    "net_sales_minus_cost",
    "item_descriptor",
    "line_item_class",
    "product_name",
    "custom_item_name",
  ],
  services: ["service_name", "service_category", "price", "duration", "provider_name"],
  providers: ["provider_name", "role"],
  products: ["product_name", "product_category", "price", "provider_name"],
};

/** @type {CanonicalOption[]} */
export const ALL_CANONICAL_OPTIONS = /** @type {CanonicalOption[]} */ (
  Object.entries(CANONICAL_BY_ENTITY).flatMap(([entity, fields]) =>
    fields.map((f) => ({
      value: f,
      label: f.replace(/_/g, " "),
      entity,
    })),
  )
);

ALL_CANONICAL_OPTIONS.unshift({ value: "ignore", label: "Ignore column", entity: "—" });

/**
 * @param {string} header
 * @param {string} reportType
 * @returns {{ field: string; confidence: number }}
 */
export function suggestCanonicalField(header, reportType) {
  const h = header.toLowerCase().replace(/\s+/g, " ").trim();

  if (reportType === "commission_earnings_detail") {
    const preset = COMMISSION_EARNINGS_HEADER_TO_CANONICAL[h];
    if (preset) return { field: preset, confidence: 0.99 };
  }

  const rules = [
    [[/^client id|^customer id|^id$/], "client_id", 0.7],
    [[/^(first|fname|given)/], "first_name", 0.8],
    [[/^(last|lname|surname|family)/], "last_name", 0.8],
    [[/name/], "client_name", 0.55],
    [[/email|e-mail/], "email", 0.9],
    [[/phone|mobile|cell/], "phone", 0.88],
    [[/birth|dob/], "birthday", 0.75],
    [[/referral|referred|source/], "referral_source", 0.65],
    [[/note|comment/], "notes", 0.55],
    [[/appointment id|appt id/], "appointment_id", 0.85],
    [[/appointment|appt.*date|date of appointment/], "appointment_date", 0.72],
    [[/booked|created.*book/], "created_at", 0.5],
    [[/\bstart\b/], "start_time", 0.65],
    [[/\bend\b|end time/], "end_time", 0.6],
    [[/service|item|line/], "service_name", 0.6],
    [[/staff|provider|stylist|tech|employee|service provided/], "provider_name", 0.75],
    [[/status/], "status", 0.7],
    [[/book.*method|booking|source.*book/], "booking_source", 0.55],
    [[/total|amount|collected|paid|gross payment|net sales/], "total_collected", 0.65],
    [[/\btip\b/], "tip", 0.85],
    [[/discount/], "discount", 0.82],
    [[/tax/], "tax", 0.78],
    [[/transaction|charge id|payment id/], "transaction_id", 0.55],
    [[/payment method|card/], "payment_method", 0.6],
    [[/price|rate/], "service_amount", 0.5],
  ];

  for (const [patterns, field, conf] of rules) {
    for (const p of patterns) {
      if (p.test(h)) return { field, confidence: conf };
    }
  }

  if (reportType === "appointments" && h.includes("date")) {
    return { field: "appointment_date", confidence: 0.5 };
  }
  return { field: "ignore", confidence: 0.25 };
}
