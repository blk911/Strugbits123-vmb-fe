import { getImportCapabilities } from "./importCapabilities.js";

/**
 * @param {import("./normalizeSalonData.js").normalizeSalonData extends (...args:any)=>infer R ? R : any} dataset
 */
export function generateSalonSignals(dataset) {
  const now = new Date();
  const cutoff45 = new Date(now);
  cutoff45.setDate(cutoff45.getDate() - 45);
  const cutoff90 = new Date(now);
  cutoff90.setDate(cutoff90.getDate() - 90);

  const clients = dataset.clients ?? [];
  const appointments = dataset.appointments ?? [];
  const transactions = dataset.transactions ?? [];

  let inactive45 = 0;
  let colorOverdue = 0;
  let highValue = 0;
  let missingBirthday = 0;
  let referralCandidates = 0;

  for (const c of clients) {
    const lv = Number(c.lifetime_spend) || 0;
    if (lv >= 500) highValue++;
    const lvDate = c.last_visit_at ? new Date(c.last_visit_at) : null;
    if (lvDate && lvDate < cutoff45) inactive45++;
    if (!c.birthday) missingBirthday++;
    if (trimStr(c.referral_source)) referralCandidates++;
  }

  const completedAppts = appointments.filter((a) => a.status === "completed").length;
  const totalTx = transactions.reduce((s, t) => s + (Number(t.total_collected) || 0), 0);
  const txClientCount = new Set(
    transactions.map((t) => trimStr(t.client_name).toLowerCase()).filter(Boolean),
  ).size;
  const avgTicket =
    completedAppts > 0 ? totalTx / completedAppts
    : txClientCount > 0 ? totalTx / txClientCount
    : transactions.length > 0 ? totalTx / transactions.length
    : 0;

  const svcRevenue = new Map();
  for (const t of transactions) {
    const k =
      trimStr(t.service_name) ||
      trimStr(t.product_name) ||
      trimStr(t.custom_item_name) ||
      "Line item";
    svcRevenue.set(k, (svcRevenue.get(k) || 0) + (Number(t.total_collected) || 0));
  }
  let topService = { name: "—", amount: 0 };
  for (const [k, v] of svcRevenue) {
    if (v > topService.amount) topService = { name: k, amount: v };
  }

  const provRevenue = new Map();
  for (const t of transactions) {
    const k = trimStr(t.provider_name) || "Staff";
    provRevenue.set(k, (provRevenue.get(k) || 0) + (Number(t.total_collected) || 0));
  }
  let topProvider = { name: "—", amount: 0 };
  for (const [k, v] of provRevenue) {
    if (v > topProvider.amount) topProvider = { name: k, amount: v };
  }

  const dow = [0, 0, 0, 0, 0, 0, 0];
  for (const a of appointments) {
    if (!a.appointment_date) continue;
    const d = new Date(a.appointment_date);
    if (Number.isNaN(d.getTime())) continue;
    dow[d.getDay()]++;
  }

  const hasAppointments = appointments.length > 0;
  const hasTxDates = transactions.some((t) => trimStr(t.transaction_date));

  let minIdx = 0;
  for (let i = 1; i < 7; i++) {
    if (dow[i] < dow[minIdx]) minIdx = i;
  }
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weakDaypart = hasAppointments ? `${dayNames[minIdx]} low volume` : "Schedule data limited (no appointments in import)";

  for (const a of appointments) {
    const svc = `${a.service_name} ${a.service_category}`.toLowerCase();
    if (!a.appointment_date) continue;
    const d = new Date(a.appointment_date);
    if (d >= cutoff90) continue;
    if (svc.includes("color") || svc.includes("balayage") || svc.includes("highlight")) {
      colorOverdue++;
    }
  }

  /** Transaction-only color/balayage backlog when no appointment rows (e.g. commission exports). */
  if (colorOverdue === 0 && transactions.length > 0) {
    const seenColor = new Set();
    for (const t of transactions) {
      const svc =
        `${trimStr(t.service_name)} ${trimStr(t.product_name)} ${trimStr(t.custom_item_name)} ${trimStr(t.service_category)}`.toLowerCase();
      if (!svc.includes("color") && !svc.includes("balayage") && !svc.includes("highlight")) continue;
      const td = t.transaction_date ? new Date(t.transaction_date) : null;
      if (!td || Number.isNaN(td.getTime()) || td >= cutoff90) continue;
      const nm = trimStr(t.client_name).toLowerCase();
      if (nm) seenColor.add(nm);
    }
    colorOverdue = seenColor.size;
  }

  /** @type {Array<{ id: string; type: string; title: string; summary: string; evidence: string; clients: string[]; projectedValue: number | null; confidence: number; recommendedAction: string; scheduleDependent?: boolean; capabilityNote?: string }>} */
  const opportunities = [];

  if (inactive45 > 0) {
    opportunities.push({
      id: "opp-import-inactive",
      type: "retention",
      title: "Reactivation Pool",
      summary: `${inactive45} clients quiet 45+ days in imported data.`,
      evidence: `last_visit_at < ${cutoff45.toISOString().slice(0, 10)}`,
      clients: clients.filter((c) => c.last_visit_at && new Date(c.last_visit_at) < cutoff45).map((c) => c.client_name),
      projectedValue: inactive45 * avgTicket * 0.15,
      confidence: 0.62,
      recommendedAction: "Run a calm win-back wave with hold option.",
    });
  }

  if (colorOverdue > 0) {
    opportunities.push({
      id: "opp-import-balayage",
      type: "revenue",
      title: "Balayage Reactivation",
      summary: `${colorOverdue} color-related visits older than 90 days.`,
      evidence: "Service category + appointment_date",
      clients: [],
      projectedValue: colorOverdue * 95,
      confidence: 0.58,
      recommendedAction: "Approve color refresh messaging for overdue clients.",
    });
  }

  if (highValue > 0) {
    opportunities.push({
      id: "opp-import-vip",
      type: "referral",
      title: !hasAppointments ? "High-Value Client Recovery" : "VIP Referral Invite",
      summary: `${highValue} clients at $500+ lifetime in import.`,
      evidence: "lifetime_spend",
      clients: clients.filter((c) => (Number(c.lifetime_spend) || 0) >= 500).map((c) => c.client_name),
      projectedValue: highValue * 120,
      confidence: 0.55,
      recommendedAction: !hasAppointments ?
        "Recovery-focused VIP outreach — use revenue signals; add schedule data for true fill windows."
      : "Private circle invite — no broadcast.",
    });
  }

  if (missingBirthday > 0) {
    opportunities.push({
      id: "opp-import-birthday",
      type: "context",
      title: "Birthday Context Missing",
      summary: `${missingBirthday} clients lack birthday in import.`,
      evidence: "clients.birthday empty",
      clients: clients.filter((c) => !c.birthday).map((c) => c.client_name),
      projectedValue: null,
      confidence: 0.45,
      recommendedAction: "Lightweight birthday capture on next visit.",
    });
  }

  if (referralCandidates > 0) {
    opportunities.push({
      id: "opp-import-referral-src",
      type: "referral",
      title: "Referral-source cohort",
      summary: `${referralCandidates} clients carry referral metadata.`,
      evidence: "referral_source",
      clients: clients.filter((c) => trimStr(c.referral_source)).map((c) => c.client_name),
      projectedValue: referralCandidates * 40,
      confidence: 0.48,
      recommendedAction: "Thank + formalize referrers.",
    });
  }

  if (hasAppointments) {
    opportunities.push({
      id: "opp-import-tuesday",
      type: "schedule",
      title: "Tuesday Fill Window",
      scheduleDependent: true,
      summary: `${weakDaypart} vs other weekdays in appointments import.`,
      evidence: JSON.stringify(dow),
      clients: [],
      projectedValue: 640,
      confidence: 0.5,
      recommendedAction: "Target quiet window with approved fill campaign.",
    });
  } else if (hasTxDates && clients.length > 0) {
    opportunities.push({
      id: "opp-import-revenue-rebook",
      type: "revenue",
      title: "Revenue Recovery / Rebook Opportunity",
      summary:
        "Imported revenue and visit timing without connected appointment/calendar data — use rebook and recovery plays, not true calendar-gap or AM/PM open-window campaigns.",
      evidence: "transactions with dates · appointments.length === 0",
      clients: [],
      projectedValue: Math.round(Math.min(14, clients.length) * (avgTicket > 0 ? avgTicket * 0.12 : 45)),
      confidence: 0.48,
      recommendedAction: "Run a calm rebook wave; import appointments for schedule-accurate fills.",
      capabilityNote: "Schedule data not connected yet.",
    });
  } else {
    opportunities.push({
      id: "opp-import-timing-limited",
      type: "schedule",
      title: "Timing Opportunity — Schedule Data Limited",
      summary:
        "No reliable appointment or paid-visit dates in this import — avoid claiming specific calendar gaps until schedule data is connected.",
      evidence: "schedule dimension thin",
      clients: [],
      projectedValue: null,
      confidence: 0.22,
      recommendedAction: "Import appointments or transaction-dated exports, then re-run normalization.",
      capabilityNote: "Schedule data not connected yet.",
    });
  }

  const pack = {
    signals: {
      inactiveClients45Plus: inactive45,
      colorOverdueApprox: colorOverdue,
      highValueClients: highValue,
      weakDaypartLabel: weakDaypart,
      scheduleCoverage: hasAppointments ? "appointments" : hasTxDates ? "limited" : "missing",
      missingBirthday,
      referralTagClients: referralCandidates,
      topServiceByRevenue: topService.name,
      topServiceRevenueAmount: topService.amount,
      topProviderByRevenue: topProvider.name,
      topProviderRevenueAmount: topProvider.amount,
      averageTicket: avgTicket,
      completedAppointmentCount: completedAppts,
    },
    opportunities,
    generatedAt: new Date().toISOString(),
  };
  pack.capabilities = getImportCapabilities(dataset, [], pack);
  return pack;
}

function trimStr(v) {
  return String(v ?? "").trim();
}
