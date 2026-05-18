/**
 * Lightweight RFC-style CSV parse: quotes, commas inside quotes, doubled quotes, CRLF.
 * @param {string} text
 * @returns {string[][]}
 */
export function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let i = 0;
  let inQuotes = false;

  const pushCell = () => {
    row.push(cell);
    cell = "";
  };
  const pushRow = () => {
    rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += c;
      i++;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      pushCell();
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      pushCell();
      pushRow();
      i++;
      continue;
    }
    cell += c;
    i++;
  }
  pushCell();
  if (row.length > 1 || (row.length === 1 && row[0] !== "")) pushRow();
  return rows;
}

/**
 * @param {string} text
 * @param {{ maxRows?: number }} [opts]
 */
export function parseCsvDocument(text, opts = {}) {
  const maxRows = opts.maxRows ?? 50000;
  const all = parseCsvRows(text);
  if (all.length === 0) {
    return {
      headers: [],
      rows: [],
      sampleRows: [],
      rowCount: 0,
      columnCount: 0,
    };
  }
  const headers = all[0].map((h) => String(h ?? "").trim());
  const body = all.slice(1).filter((r) => r.some((c) => String(c ?? "").trim() !== ""));
  const capped = body.slice(0, maxRows);
  const rows = capped.map((r) => {
    const o = {};
    headers.forEach((h, idx) => {
      o[h] = r[idx] != null ? String(r[idx]).trim() : "";
    });
    return o;
  });
  const sampleRows = rows.slice(0, 5);
  return {
    headers,
    rows,
    sampleRows,
    rowCount: body.length,
    columnCount: headers.length,
  };
}
