import {
  readJson,
  LS_NORMALIZED,
  LS_SIGNALS,
  LS_PARSED,
  hasImportedDataset,
} from "./storageKeys.js";
import { applyRepairOverridesToNormalized, getContactSuppressionSet } from "./importRepairStorage.js";
import { getImportCapabilities } from "./importCapabilities.js";

export const DEEP_INSIGHTS_RECOMMENDED_SOURCE =
  "Deep Insights → Recommended Campaigns";

/** Card subline for UI */
export const DEEP_INSIGHTS_OPPORTUNITY_ENGINE_SOURCE = "Deep Insights → Opportunity Engine";

function trimStr(v) {
  return String(v ?? "").trim();
}

function normName(s) {
  return trimStr(s).toLowerCase();
}

function formatMoney(n) {
  const x = Number(n) || 0;
  if (!x) return "$0";
  return `$${Math.round(x)}`;
}

function formatVisit(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function firstToken(name) {
  const p = trimStr(name).split(/\s+/)[0];
  return p || "there";
}

/** @param {any} t */
function targetToRow(t, fallbackReason) {
  return {
    id: t.id,
    name: t.name,
    firstName: t.firstName ?? firstToken(t.name),
    lastVisit: t.lastVisit,
    service: t.service,
    spend: t.spend,
    provider: t.provider ?? "—",
    reason: t.reason ?? t.reasonSelected ?? fallbackReason,
    reasonSelected: t.reasonSelected ?? t.reason ?? fallbackReason,
  };
}

/**
 * @typedef {import("../../config/salonBusinessDriversMock.js").recommendedCampaigns} RecShape
 */

/**
 * @param {any} dataset
 * @param {string} name
 */
function findClientByName(dataset, name) {
  const n = normName(name);
  return (dataset.clients ?? []).find((c) => normName(c.client_name) === n) ?? null;
}

/**
 * @param {any} dataset
 * @param {string} name
 */
function latestTxForClient(dataset, name) {
  const n = normName(name);
  const txs = (dataset.transactions ?? []).filter((t) => normName(t.client_name) === n);
  if (!txs.length) return null;
  return txs.reduce((a, b) => {
    const da = a.transaction_date ? new Date(a.transaction_date).getTime() : 0;
    const db = b.transaction_date ? new Date(b.transaction_date).getTime() : 0;
    return db >= da ? b : a;
  });
}

/**
 * Message template kinds for personalize().
 * @param {string} oppId
 */
function templateKindForOpportunity(oppId) {
  const map = {
    "opp-import-inactive": "reactivation",
    "opp-import-balayage": "color",
    "opp-import-tuesday": "schedule",
    "opp-import-revenue-rebook": "rebook_recovery",
    "opp-import-vip": "vip",
    "opp-import-birthday": "human",
    "opp-import-referral-src": "referral",
  };
  return map[oppId] ?? "reactivation";
}

/**
 * @param {{ firstName: string; name: string; service: string }} target
 * @param {{ messageTemplate: string; dayPartLabel?: string; avoidCalendarClaims?: boolean }} campaign
 */
export function renderDeepInsightsMessage(target, campaign) {
  const fn = target.firstName || firstToken(target.name);
  const svc = trimStr(target.service) || "your usual service";
  const dayPart = trimStr(campaign.dayPartLabel) || "this week";
  const soft = Boolean(campaign.avoidCalendarClaims);
  switch (campaign.messageTemplate) {
    case "color":
      if (soft) {
        return `Hi ${fn}, it may be time to refresh color — you usually book ${svc}. Reply when you’re ready and we’ll coordinate (specific open-slot holds need your calendar connected in VMB).`;
      }
      return `Hi ${fn}, Jenny has a few color openings coming up. Since you usually book ${svc}, she wanted you to get first pick before the week fills.`;
    case "rebook_recovery":
      return `Hi ${fn}, it’s been a little while — we’d love to help you find your next visit. Reply anytime and we’ll work around your schedule (we’re not showing specific open slots until your calendar is connected in VMB).`;
    case "schedule":
      return `Hi ${fn}, Jenny has a few openings ${dayPart} and thought of you first. Want me to hold a spot?`;
    case "vip":
      return `Hi ${fn}, Jenny is inviting a few trusted clients into her private VMB circle. You’re on the short list.`;
    case "human":
      return `Hi ${fn}, Jenny is updating her private client notes so she can remember the moments that matter. Want to add a birthday or favorite service reminder?`;
    case "referral":
      return `Hi ${fn}, Jenny noticed you’ve referred guests she loves — she wanted to thank you and save a calm, private invite slot if you’re open to it.`;
    case "reactivation":
    default:
      if (soft) {
        return `Hi ${fn}, Jenny noticed it’s been a little while since your last ${svc}. Reply when you’d like to rebook — we’ll confirm timing personally (live open-slot messaging needs your calendar connected in VMB).`;
      }
      return `Hi ${fn}, Jenny noticed it’s been a little while since your last ${svc}. A few openings are coming up this week — want me to hold one for you?`;
  }
}

/**
 * @param {any} dataset
 * @param {any} opp
 * @param {string} weakDaypart
 */
function buildRawTargets(dataset, opp, weakDaypart, suppressionSet) {
  const clients = dataset.clients ?? [];
  const appointments = dataset.appointments ?? [];
  const now = new Date();
  const cutoff90 = new Date(now);
  cutoff90.setDate(cutoff90.getDate() - 90);
  const cutoff45 = new Date(now);
  cutoff45.setDate(cutoff45.getDate() - 45);

  /** @type {Array<{ client?: any; appt?: any; nameOnly?: string }>} */
  const pool = [];

  const pushClient = (c, appt, nameOnly) => {
    if (c && suppressionSet?.has?.(String(c.client_id))) return;
    if (c) pool.push({ client: c, appt });
    else if (nameOnly) pool.push({ nameOnly });
  };

  switch (opp.id) {
    case "opp-import-inactive": {
      for (const nm of opp.clients ?? []) {
        const c = findClientByName(dataset, nm);
        pushClient(c, null, c ? undefined : nm);
      }
      break;
    }
    case "opp-import-balayage": {
      const seen = new Set();
      if (appointments.length > 0) {
        for (const a of appointments) {
          const svc = `${a.service_name} ${a.service_category}`.toLowerCase();
          if (!a.appointment_date) continue;
          const d = new Date(a.appointment_date);
          if (d >= cutoff90) continue;
          if (!svc.includes("color") && !svc.includes("balayage") && !svc.includes("highlight")) continue;
          const nm = trimStr(a.client_name);
          if (!nm || seen.has(normName(nm))) continue;
          seen.add(normName(nm));
          const c = findClientByName(dataset, nm);
          pushClient(c, a, c ? undefined : nm);
        }
      } else {
        for (const t of dataset.transactions ?? []) {
          const svc =
            `${trimStr(t.service_name)} ${trimStr(t.product_name)} ${trimStr(t.custom_item_name)} ${trimStr(t.service_category)}`.toLowerCase();
          if (!svc.includes("color") && !svc.includes("balayage") && !svc.includes("highlight")) continue;
          const td = t.transaction_date ? new Date(t.transaction_date) : null;
          if (!td || Number.isNaN(td.getTime()) || td >= cutoff90) continue;
          const nm = trimStr(t.client_name);
          if (!nm || seen.has(normName(nm))) continue;
          seen.add(normName(nm));
          const c = findClientByName(dataset, nm);
          pushClient(c, null, c ? undefined : nm);
        }
      }
      break;
    }
    case "opp-import-vip":
    case "opp-import-birthday":
    case "opp-import-referral-src": {
      for (const nm of opp.clients ?? []) {
        const c = findClientByName(dataset, nm);
        pushClient(c, null, c ? undefined : nm);
      }
      break;
    }
    case "opp-import-tuesday":
    case "opp-import-revenue-rebook": {
      const sorted = [...clients]
        .filter((c) => !suppressionSet?.has?.(String(c.client_id)))
        .sort((a, b) => {
        const da = a.last_visit_at ? new Date(a.last_visit_at).getTime() : 0;
        const db = b.last_visit_at ? new Date(b.last_visit_at).getTime() : 0;
        return da - db;
      });
      for (const c of sorted.slice(0, 14)) {
        pool.push({ client: c });
      }
      break;
    }
    default:
      break;
  }

  return pool.map((row, i) => {
    const c = row.client;
    const appt = row.appt;
    const nmOnly = row.nameOnly;
    const name = c?.client_name || nmOnly || "Client";
    const id = c?.client_id || `di-t-${opp.id}-${i}`;
    const tx = c ? latestTxForClient(dataset, c.client_name) : null;
    const lastVisit =
      c?.last_visit_at ? formatVisit(c.last_visit_at)
      : appt?.appointment_date ? formatVisit(appt.appointment_date)
      : "—";
    const service =
      trimStr(appt?.service_name) ||
      trimStr(tx?.service_name) ||
      trimStr(c?.last_service) ||
      "Recent service";
    const spend = formatMoney(c?.lifetime_spend ?? tx?.total_collected ?? 0);
    const provider =
      trimStr(appt?.provider_name) ||
      trimStr(tx?.provider_name) ||
      "—";
    const reason =
      opp.id === "opp-import-inactive" ?
        (c?.last_visit_at && new Date(c.last_visit_at) < cutoff45 ?
          "Quiet 45+ days"
        : "Retention signal")
      : opp.id === "opp-import-balayage" ?
        "Color / balayage cadence"
      : opp.id === "opp-import-vip" ?
        "High lifetime value"
      : opp.id === "opp-import-birthday" ?
        "Birthday on file missing"
      : opp.id === "opp-import-referral-src" ?
        "Referral metadata"
      : opp.id === "opp-import-tuesday" ?
        `Fill · ${weakDaypart || "quiet window"}`
      : opp.id === "opp-import-revenue-rebook" ?
        "Rebook · revenue signals (schedule not connected)"
      : "Deep Insights";

    return targetToRow(
      {
        id,
        name,
        firstName: trimStr(c?.first_name) || firstToken(name),
        lastVisit,
        service,
        spend,
        provider,
        reason,
        reasonSelected: reason,
      },
      opp.summary ?? "",
    );
  });
}

const CAMPAIGN_OPP_ORDER = [
  "opp-import-inactive",
  "opp-import-balayage",
  "opp-import-vip",
  "opp-import-birthday",
  "opp-import-referral-src",
  "opp-import-revenue-rebook",
  "opp-import-tuesday",
  "opp-import-timing-limited",
];

/**
 * Opportunities safe to turn into campaign cards (excludes informational schedule-only rows).
 * @param {any} normalized
 * @param {any} pack
 */
export function prepareImportOpportunitiesForUi(normalized, pack) {
  const opps = pack?.opportunities;
  const rawParsed = readJson(LS_PARSED, null);
  const parsedFilesStub = Array.isArray(rawParsed) ? rawParsed : [];
  const capabilities = pack?.capabilities ?? getImportCapabilities(normalized ?? {}, parsedFilesStub, pack);

  if (!Array.isArray(opps) || opps.length === 0) {
    return { list: [], capabilities };
  }

  const rank = (id) => {
    const i = CAMPAIGN_OPP_ORDER.indexOf(id);
    return i === -1 ? 50 : i;
  };

  const list = [...opps]
    .filter((o) => o.id !== "opp-import-timing-limited")
    .filter((o) => capabilities.schedule === "available" || o.id !== "opp-import-tuesday")
    .sort((a, b) => rank(a.id) - rank(b.id));

  return { list, capabilities };
}

/**
 * @returns {null | Array<any>} null = use mock campaigns; [] = imported but no ready opps; array = imported campaigns
 */
export function getRecommendedCampaignsFromDeepInsights() {
  if (!hasImportedDataset()) return null;

  const rawNorm = readJson(LS_NORMALIZED, null);
  const normalized = rawNorm ? applyRepairOverridesToNormalized(rawNorm) : null;
  const pack = readJson(LS_SIGNALS, null);
  const opps = pack?.opportunities;
  if (!Array.isArray(opps) || opps.length === 0) return [];

  const { list: sortedOpps } = prepareImportOpportunitiesForUi(normalized, pack);

  const weakDaypart = pack?.signals?.weakDaypartLabel ?? "this week";
  const suppressionSet = getContactSuppressionSet();
  const proposedSend = () => {
    const d = new Date();
    const stamp = d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    return `Proposed send: ${stamp} · from Deep Insights import · owner approval required`;
  };

  /** @type {any[]} */
  const out = [];

  for (const opp of sortedOpps) {
    const targets = buildRawTargets(normalized, opp, weakDaypart, suppressionSet);
    if (!targets.length) continue;

    const id = `di-${opp.id}`;
    const template = templateKindForOpportunity(opp.id);
    const first = targets[0];
    const sampleMessage = first ?
      renderDeepInsightsMessage(first, {
        messageTemplate: template,
        dayPartLabel: weakDaypart,
        avoidCalendarClaims: pack?.signals?.scheduleCoverage !== "appointments",
      })
    : "";

    const whyParts = [opp.summary, opp.evidence ? `Evidence: ${opp.evidence}` : "", opp.capabilityNote || ""].filter(
      Boolean,
    );

    out.push({
      id,
      title: opp.title,
      type: opp.type ?? "opportunity",
      status: "READY",
      reason: opp.summary ?? "",
      opportunityCount: targets.length,
      approvedCount: targets.length,
      projectedValue: opp.projectedValue,
      why: whyParts.join(" · "),
      targetCount: targets.length,
      targets,
      messagePreview: sampleMessage,
      sampleMessage,
      messageTemplate: template,
      dayPartLabel: weakDaypart,
      sendSchedule: proposedSend(),
      source: DEEP_INSIGHTS_RECOMMENDED_SOURCE,
      cardSource: DEEP_INSIGHTS_OPPORTUNITY_ENGINE_SOURCE,
      imported: true,
      opportunityId: opp.id,
      capabilityNote: opp.capabilityNote,
      scheduleDependent: Boolean(opp.scheduleDependent),
    });
  }

  return out;
}
