const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const PHONE_RE = /^[\d+\-()\s.]{10,}$/;
const BOOL_RE = /^(true|false|yes|no|1|0)$/i;

/**
 * @param {string[]} samples
 * @returns {{ detectedType: string; confidence: number }}
 */
export function inferColumnType(samples) {
  const nonEmpty = samples.map((s) => String(s ?? "").trim()).filter(Boolean);
  if (nonEmpty.length === 0) return { detectedType: "unknown", confidence: 0.2 };

  let currencyHits = 0;
  let numHits = 0;
  let dateHits = 0;
  let dtHits = 0;
  let emailHits = 0;
  let phoneHits = 0;
  let boolHits = 0;

  for (const v of nonEmpty) {
    if (EMAIL_RE.test(v)) emailHits++;
    else if (PHONE_RE.test(v.replace(/[^\d+]/g, ""))) phoneHits++;
    else if (BOOL_RE.test(v)) boolHits++;
    else if (/^\$?[\d,]+\.\d{2}$/.test(v) || /^\$[\d,]+$/.test(v)) currencyHits++;
    else if (/^-?\d+(\.\d+)?$/.test(v.replace(/,/g, ""))) numHits++;
    else if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}$/.test(v)) dateHits++;
    else if (/^\d{4}-\d{2}-\d{2}/.test(v)) dateHits++;
    else if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(v) && /am|pm|:|\d{4}/i.test(v)) dtHits++;
  }

  const n = nonEmpty.length;
  const ratio = (x) => x / n;

  if (ratio(emailHits) >= 0.6) return { detectedType: "email", confidence: 0.85 };
  if (ratio(phoneHits) >= 0.5) return { detectedType: "phone", confidence: 0.75 };
  if (ratio(boolHits) >= 0.7) return { detectedType: "boolean", confidence: 0.8 };
  if (ratio(currencyHits) >= 0.5) return { detectedType: "currency", confidence: 0.82 };
  if (ratio(numHits) >= 0.6) return { detectedType: "number", confidence: 0.78 };
  if (ratio(dtHits) >= 0.4) return { detectedType: "datetime", confidence: 0.72 };
  if (ratio(dateHits) >= 0.4) return { detectedType: "date", confidence: 0.7 };
  return { detectedType: "string", confidence: 0.55 };
}

/**
 * @param {string} header
 * @param {Record<string, string>} rows - objects keyed by header
 * @param {number} sampleN
 */
export function buildColumnSchema(header, rows, sampleN = 3) {
  const key = header;
  const uniq = [];
  for (const r of rows) {
    if (uniq.length >= sampleN) break;
    const t = String(r[key] ?? "").trim();
    if (t && !uniq.includes(t)) uniq.push(t);
  }
  const { detectedType, confidence } = inferColumnType(uniq.length ? uniq : [" "]);
  return {
    column: header,
    sampleValues: uniq.slice(0, sampleN),
    detectedType,
    suggestedCanonical: null,
    mappingConfidence: confidence,
  };
}
