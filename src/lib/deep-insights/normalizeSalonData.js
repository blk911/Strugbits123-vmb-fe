import { classifyService } from "./classifyService.js";
import { inferCommissionLineItemClass } from "./glossGeniusCommissionAdapter.js";

function trimStr(v) {
  return String(v ?? "").trim();
}

function parseMoney(v) {
  const s = trimStr(v).replace(/[$,]/g, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

/** @param {string} v */
function parseDateLoose(v) {
  const s = trimStr(v);
  if (!s) return null;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  const m = s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (m) {
    let [, a, b, y] = m;
    y = y.length === 2 ? `20${y}` : y;
    const d2 = new Date(`${y}-${a.padStart(2, "0")}-${b.padStart(2, "0")}`);
    if (!Number.isNaN(d2.getTime())) return d2.toISOString().slice(0, 10);
  }
  return null;
}

function normStatus(s) {
  const x = trimStr(s).toLowerCase();
  if (!x) return "";
  if (x.includes("cancel")) return "cancelled";
  if (x.includes("complete")) return "completed";
  if (x.includes("no-show") || x.includes("noshow")) return "no_show";
  return x;
}

function displayName(first, last, full) {
  const f = trimStr(first);
  const l = trimStr(last);
  const n = trimStr(full);
  if (n) return n;
  if (f && l) return `${f} ${l}`;
  return f || l || "Unknown";
}

/**
 * @param {{
 *   parsedFiles: Array<{
 *     fileId: string;
 *     fileName: string;
 *     provider: string;
 *     reportType: string;
 *     rows: Record<string,string>[];
 *     headers: string[];
 *   }>;
 *   mappingsByFile: Record<string, Record<string, string>>;
 *   salonId?: string;
 * }} input
 */
export function normalizeSalonData(input) {
  const salonId = input.salonId ?? "local-preview-salon";
  const sourceFiles = input.parsedFiles.map((p) => p.fileName);
  const warnings = [];

  /** @type {Map<string, any>} */
  const clientMap = new Map();
  /** @type {any[]} */
  const appointments = [];
  /** @type {any[]} */
  const transactions = [];
  /** @type {any[]} */
  const services = [];
  /** @type {any[]} */
  const products = [];
  /** @type {Map<string, any>} */
  const providerMap = new Map();

  let apptSeq = 0;
  let txSeq = 0;
  let clientSeq = 0;

  const keyClient = (email, phone, name) => {
    const e = trimStr(email).toLowerCase();
    if (e) return `e:${e}`;
    const p = trimStr(phone).replace(/\D/g, "");
    if (p.length >= 10) return `p:${p}`;
    return `n:${trimStr(name).toLowerCase()}`;
  };

  const hadCommissionFile = input.parsedFiles.some(
    (f) => f.reportType === "commission_earnings_detail",
  );

  for (const file of input.parsedFiles) {
    const map = input.mappingsByFile[file.fileId] ?? {};
    const rt = file.reportType;

    for (const row of file.rows) {
      const pick = (field) => {
        const h = Object.keys(map).find((col) => map[col] === field);
        if (!h) return "";
        return row[h] ?? "";
      };

      const clientNameRaw = pick("client_name") || pick("first_name") || pick("last_name");
      const first = pick("first_name");
      const last = pick("last_name");
      const email = pick("email");
      const phone = pick("phone");
      const cname = displayName(first, last, clientNameRaw);
      const ck = keyClient(email, phone, cname);
      const providerName = trimStr(pick("provider_name"));

      if (rt === "commission_earnings_detail") {
        if (cname && cname !== "Unknown") {
          if (!clientMap.has(ck)) {
            clientMap.set(ck, {
              client_id: `c-${++clientSeq}`,
              client_name: cname,
              first_name: trimStr(first),
              last_name: trimStr(last),
              email: trimStr(email),
              phone: trimStr(phone),
              birthday: pick("birthday") ? parseDateLoose(pick("birthday")) : null,
              created_at: pick("created_at") ? parseDateLoose(pick("created_at")) : null,
              last_visit_at: parseDateLoose(pick("transaction_date")) || null,
              lifetime_spend: 0,
              visit_count: 0,
              referral_source: trimStr(pick("referral_source")),
              notes: trimStr(pick("notes")),
            });
          } else {
            const cur = clientMap.get(ck);
            const txd = parseDateLoose(pick("transaction_date"));
            if (txd && (!cur.last_visit_at || txd > cur.last_visit_at)) {
              cur.last_visit_at = txd;
            }
          }
        }

        if (providerName) {
          const pk = providerName.toLowerCase();
          if (!providerMap.has(pk)) {
            providerMap.set(pk, {
              provider_name: providerName,
              role: trimStr(pick("role")) || "stylist",
            });
          }
        }

        const lineClass = inferCommissionLineItemClass(row, map);
        const desc =
          trimStr(pick("item_descriptor")) ||
          trimStr(pick("service_name")) ||
          trimStr(pick("product_name"));

        const priceVal = parseMoney(pick("service_amount"));
        const totalCol = parseMoney(pick("total_collected"));
        const tipVal = parseMoney(pick("tip"));
        const taxVal = parseMoney(pick("tax"));
        const netSaleVal = parseMoney(pick("net_sale"));
        const discountVal = parseMoney(pick("discount"));

        const hasTxRow =
          Boolean(trimStr(pick("transaction_id"))) ||
          totalCol > 0 ||
          priceVal > 0 ||
          netSaleVal > 0 ||
          Boolean(desc);

        if (hasTxRow) {
          const cls =
            lineClass === "service" && desc ?
              classifyService(desc)
            : lineClass === "product" && desc ? classifyService(desc) : { service_category: "other" };

          const totalFallback =
            totalCol > 0 ? totalCol
            : priceVal + tipVal + taxVal - discountVal > 0 ? priceVal + tipVal + taxVal - discountVal
            : netSaleVal > 0 ? netSaleVal
            : priceVal;

          transactions.push({
            transaction_id: trimStr(pick("transaction_id")) || `t-${++txSeq}`,
            appointment_id: "",
            client_name: cname,
            provider_name: providerName,
            service_name: lineClass === "service" ? desc : "",
            product_name: lineClass === "product" ? desc : "",
            custom_item_name: lineClass === "other" ? desc : "",
            service_category: cls.service_category,
            transaction_date: parseDateLoose(pick("transaction_date")) || "",
            service_amount: priceVal,
            discount: discountVal,
            tip: tipVal,
            tax: taxVal,
            total_collected: totalFallback,
            payment_method: trimStr(pick("payment_method")),
            payment_source: trimStr(pick("payment_source")),
            processing_fee: parseMoney(pick("processing_fee")),
            net_sale: netSaleVal,
            commission_from_total_price: parseMoney(pick("commission_from_total_price")),
            commission_from_net_sale: parseMoney(pick("commission_from_net_sale")),
            product_cost: parseMoney(pick("product_cost")),
            net_sales_minus_cost: parseMoney(pick("net_sales_minus_cost")),
          });

          if (lineClass === "service" && desc) {
            const sCls = classifyService(desc);
            services.push({
              service_name: desc,
              service_category: sCls.service_category,
              price: priceVal || netSaleVal,
              duration: 0,
              provider_name: providerName,
            });
          } else if (lineClass === "product" && desc) {
            const pCls = classifyService(desc);
            products.push({
              product_name: desc,
              product_category: pCls.service_category,
              price: priceVal || netSaleVal,
              provider_name: providerName,
            });
          }
        }

        continue;
      }

      if (
        (pick("email") || pick("phone") || pick("client_name")) &&
        rt !== "appointments" &&
        rt !== "checkout_line_items" &&
        rt !== "payments"
      ) {
        if (!clientMap.has(ck)) {
          clientMap.set(ck, {
            client_id: `c-${++clientSeq}`,
            client_name: cname,
            first_name: trimStr(first),
            last_name: trimStr(last),
            email: trimStr(email),
            phone: trimStr(phone),
            birthday: pick("birthday") ? parseDateLoose(pick("birthday")) : null,
            created_at: pick("created_at") ? parseDateLoose(pick("created_at")) : null,
            last_visit_at: pick("last_visit_at") ? parseDateLoose(pick("last_visit_at")) : null,
            lifetime_spend: parseMoney(pick("lifetime_spend")),
            visit_count: parseInt(pick("visit_count"), 10) || 0,
            referral_source: trimStr(pick("referral_source")),
            notes: trimStr(pick("notes")),
          });
        }
      }

      if (providerName) {
        const pk = providerName.toLowerCase();
        if (!providerMap.has(pk)) {
          providerMap.set(pk, {
            provider_name: providerName,
            role: trimStr(pick("role")) || "stylist",
          });
        }
      }

      if (rt === "appointments" || (pick("appointment_date") && pick("service_name"))) {
        const svcName = trimStr(pick("service_name")) || trimStr(row.Services || row["Service"] || "");
        const cls = classifyService(svcName);
        appointments.push({
          appointment_id: trimStr(pick("appointment_id")) || `a-${++apptSeq}`,
          client_name: cname || trimStr(row["Client Name"] || ""),
          client_id: clientMap.get(ck)?.client_id ?? "",
          provider_name: providerName || trimStr(row["Service Provided By"] || row["Booked By"] || ""),
          service_name: svcName,
          service_category: cls.service_category,
          appointment_date:
            parseDateLoose(pick("appointment_date")) ||
            parseDateLoose(row["Date of Appointment"] || "") ||
            "",
          start_time: trimStr(pick("start_time")),
          end_time: trimStr(pick("end_time")),
          status: normStatus(pick("status") || row.Status || ""),
          booking_source: trimStr(pick("booking_source") || row["Booking Method"] || ""),
          created_at: parseDateLoose(pick("created_at") || row["Date Booked"] || ""),
          cancelled_at: pick("cancelled_at") ? parseDateLoose(pick("cancelled_at")) : null,
        });

        if (svcName) {
          services.push({
            service_name: svcName,
            service_category: cls.service_category,
            price: parseMoney(pick("service_amount") || pick("total_collected")),
            duration: 0,
            provider_name: providerName,
          });
        }
      }

      if (
        (rt === "payments" ||
          rt === "checkout_line_items" ||
          pick("total_collected") ||
          pick("transaction_id")) &&
        rt !== "commission_earnings_detail"
      ) {
        const amt = parseMoney(pick("total_collected") || pick("service_amount"));
        if (amt > 0 || pick("transaction_id")) {
          transactions.push({
            transaction_id: trimStr(pick("transaction_id")) || `t-${++txSeq}`,
            appointment_id: trimStr(pick("appointment_id")),
            client_name: cname,
            provider_name: providerName,
            service_name: trimStr(pick("service_name")),
            service_category: classifyService(trimStr(pick("service_name"))).service_category,
            transaction_date:
              parseDateLoose(pick("transaction_date") || pick("appointment_date")) || "",
            service_amount: parseMoney(pick("service_amount")),
            discount: parseMoney(pick("discount")),
            tip: parseMoney(pick("tip")),
            tax: parseMoney(pick("tax")),
            total_collected: amt || parseMoney(pick("tip")) + parseMoney(pick("service_amount")),
            payment_method: trimStr(pick("payment_method")),
          });
        }
      }

      if (rt === "summary") {
        const serviceCell = trimStr(row["Service"] || row["Name"] || "");
        if (serviceCell && serviceCell.toLowerCase() !== "total" && !serviceCell.includes("PRODUCT")) {
          const net = parseMoney(row["Net sales"] || row["Gross payment amount (incl. tip)"] || "0");
          if (net > 0) {
            const cls = classifyService(serviceCell);
            transactions.push({
              transaction_id: `t-sum-${++txSeq}`,
              appointment_id: "",
              client_name: "",
              provider_name: trimStr(row["Service provider"] || row.Name || ""),
              service_name: serviceCell,
              service_category: cls.service_category,
              transaction_date: "",
              service_amount: net,
              discount: 0,
              tip: parseMoney(row["Tip earned"] || row["Tip"] || "0"),
              tax: parseMoney(row["Sales tax"] || "0"),
              total_collected: net,
              payment_method: "",
            });
          }
        }
      }
    }
  }

  const clients = [...clientMap.values()];
  if (!clients.length && appointments.length) {
    const byName = new Map();
    for (const a of appointments) {
      const nm = trimStr(a.client_name);
      if (!nm) continue;
      const k = nm.toLowerCase();
      if (!byName.has(k)) {
        byName.set(k, {
          client_id: `c-${++clientSeq}`,
          client_name: nm,
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          birthday: null,
          created_at: null,
          last_visit_at: a.appointment_date || null,
          lifetime_spend: 0,
          visit_count: 0,
          referral_source: "",
          notes: "",
        });
      } else {
        const c = byName.get(k);
        if (a.appointment_date && (!c.last_visit_at || a.appointment_date > c.last_visit_at)) {
          c.last_visit_at = a.appointment_date;
        }
        c.visit_count += 1;
      }
    }
    clients.push(...byName.values());
  }

  for (const t of transactions) {
    const nm = trimStr(t.client_name);
    if (!nm) continue;
    const found = clients.find((x) => x.client_name.toLowerCase() === nm.toLowerCase());
    if (found) {
      found.lifetime_spend += Number(t.total_collected) || Number(t.service_amount) || 0;
    }
  }

  if (hadCommissionFile) {
    warnings.push(
      "GlossGenius Commission Earnings Detail supports revenue, service, client, and provider signals but does not fully support appointment schedule or open-window analysis without appointments or calendar data.",
    );
  }
  if (!appointments.length && !hadCommissionFile) {
    warnings.push("No appointment rows normalized — check column mapping.");
  }
  if (!transactions.length) warnings.push("No transaction rows — revenue signals will be thin.");
  if (!clients.length) warnings.push("No client field mapped — dedupe limited.");

  return {
    salonId,
    provider: input.parsedFiles[0]?.provider ?? "unknown",
    importedAt: new Date().toISOString(),
    sourceFiles,
    clients,
    appointments,
    transactions,
    services,
    products,
    providers: [...providerMap.values()],
    normalizationSummary: {
      clientsCount: clients.length,
      appointmentsCount: appointments.length,
      transactionsCount: transactions.length,
      servicesCount: services.length,
      productsCount: products.length,
      providersCount: providerMap.size,
      warnings,
    },
  };
}
