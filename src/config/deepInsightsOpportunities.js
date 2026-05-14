/**
 * Deep Insights Opportunity Engine v1 — mock definitions from synthetic import.
 * Human Context Prompt: relationship data (not discounts) — birthdays, family, referrals, etc.
 *
 * // tAIkOS opportunity engine (architecture):
 * // Provider exports + calendar + IG + TikTok + VMB invites become normalized truth threads.
 * // Truth threads generate new opportunity overlays.
 * // Each action should create more human-context data, which improves future opportunity generation.
 */

/** @typedef {"Revenue" | "Retention" | "Referral" | "Schedule" | "VMB Invite"} OpportunityBadge */

/** @typedef {{
 *   id: string;
 *   client: string;
 *   lastVisit: string;
 *   service: string;
 *   spend: string;
 *   provider: string;
 *   opportunityScore: string;
 *   status: string;
 * }} OpportunityEvidenceRow */

/**
 * @type {Record<string, {
 *   id: string;
 *   type: OpportunityBadge;
 *   title: string;
 *   signal: string;
 *   context: string;
 *   opportunity: string;
 *   recommendedAction: string;
 *   evidenceRows: OpportunityEvidenceRow[];
 *   actions: Array<{ id: string; label: string }>;
 *   humanContextPrompt?: string;
 * }>}
 */
export const OPPORTUNITIES_BY_ID = {
  "opp-balayage-001": {
    id: "opp-balayage-001",
    type: "Revenue",
    title: "Balayage Revenue Opportunity",
    signal:
      "Balayage produced the highest service revenue in the imported period.",
    context:
      "Color clients carry higher tickets and strong rebook potential when reminded on cadence.",
    opportunity:
      "Aggregate recent balayage and color clients into a focused refresh campaign before peak season.",
    recommendedAction: "Build May Balayage Refresh campaign",
    evidenceRows: [
      {
        id: "r1",
        client: "Morgan Ellis",
        lastVisit: "Apr 12",
        service: "Balayage + toner",
        spend: "$186",
        provider: "Sasha Reed",
        opportunityScore: "92",
        status: "Due 6–8 wk color cycle",
      },
      {
        id: "r2",
        client: "Priya Shah",
        lastVisit: "Apr 3",
        service: "Balayage partial",
        spend: "$164",
        provider: "Jordan Kim",
        opportunityScore: "88",
        status: "High product attach",
      },
      {
        id: "r3",
        client: "Cameron Blake",
        lastVisit: "Mar 28",
        service: "Full balayage",
        spend: "$210",
        provider: "Sasha Reed",
        opportunityScore: "90",
        status: "Referred guest ×2",
      },
      {
        id: "r4",
        client: "Lane Porter",
        lastVisit: "Mar 19",
        service: "Color gloss refresh",
        spend: "$98",
        provider: "Mia Lopez",
        opportunityScore: "76",
        status: "Upsell to full balayage",
      },
    ],
    actions: [
      { id: "invite-color", label: "Invite color clients" },
      { id: "email-rebook", label: "Email rebook reminder" },
      { id: "hold-vip", label: "Hold VIPs" },
    ],
  },
  "opp-tuesday-slow-001": {
    id: "opp-tuesday-slow-001",
    type: "Schedule",
    title: "Tuesday Slow Window",
    signal:
      "Tuesday 1PM–4PM underperforms on fill rate vs. salon average in imported schedule data.",
    context:
      "Idle chairs mid-week drain margin; targeted prompts recover density without deep discounting.",
    opportunity:
      "Pair gift requests and light-touch service invites with this window to lift utilization.",
    recommendedAction: "Create Tuesday fill campaign",
    evidenceRows: [
      {
        id: "t1",
        client: "Avery Cole",
        lastVisit: "Jan 8",
        service: "Gel manicure",
        spend: "$52",
        provider: "Riley Park",
        opportunityScore: "81",
        status: "Inactive 90+ d",
      },
      {
        id: "t2",
        client: "Sam Rivera",
        lastVisit: "Feb 2",
        service: "Birthday gift card use",
        spend: "$75",
        provider: "Alex Torres",
        opportunityScore: "79",
        status: "Birthday month",
      },
      {
        id: "t3",
        client: "Drew Nguyen",
        lastVisit: "Dec 14",
        service: "Pedicure",
        spend: "$61",
        provider: "Mia Lopez",
        opportunityScore: "77",
        status: "Nail regular",
      },
      {
        id: "t4",
        client: "Jordan Blake",
        lastVisit: "Mar 1",
        service: "Cut + style",
        spend: "$72",
        provider: "Jordan Kim",
        opportunityScore: "74",
        status: "Gift buyer tag",
      },
    ],
    actions: [
      { id: "gift-prompt", label: "Send gift request prompt" },
      { id: "invite-inactive", label: "Invite inactive clients" },
      { id: "build-promo", label: "Build promo" },
    ],
  },
  "opp-reactivation-001": {
    id: "opp-reactivation-001",
    type: "Retention",
    title: "Reactivation Targets",
    signal:
      "187 clients show 90+ days since last visit while historical spend remains strong.",
    context:
      "Lapsed high-LTV guests often return with a single timely invite — cheaper than new acquisition.",
    opportunity:
      "Launch a structured reactivation invite with optional hold slots for top decile.",
    recommendedAction: "Create reactivation invite list",
    evidenceRows: [
      {
        id: "x1",
        client: "Taylor Kim",
        lastVisit: "Nov 4",
        service: "Partial foil",
        spend: "$612 LTV",
        provider: "Sasha Reed",
        opportunityScore: "94",
        status: "106 d lapsed",
      },
      {
        id: "x2",
        client: "Riley Morgan",
        lastVisit: "Oct 22",
        service: "Balayage",
        spend: "$798 LTV",
        provider: "Jordan Kim",
        opportunityScore: "93",
        status: "Prior VIP flag",
      },
      {
        id: "x3",
        client: "Casey Wu",
        lastVisit: "Dec 1",
        service: "Cut + blowout",
        spend: "$341 LTV",
        provider: "Alex Torres",
        opportunityScore: "85",
        status: "Gift history",
      },
      {
        id: "x4",
        client: "Jamie Ortiz",
        lastVisit: "Sep 18",
        service: "Color correction",
        spend: "$1.1k LTV",
        provider: "Mia Lopez",
        opportunityScore: "96",
        status: "High ticket",
      },
    ],
    actions: [
      { id: "email", label: "Email" },
      { id: "vmb-invite", label: "VMB invite" },
      { id: "hold", label: "Hold" },
    ],
  },
  "opp-referral-candidates-001": {
    id: "opp-referral-candidates-001",
    type: "Referral",
    title: "Referral Candidates",
    signal:
      "Clusters show clients who already bring others — wedding parties, stylist intros, IG tags.",
    context:
      "Warm introducers convert faster than cold ads and deepen average retention.",
    opportunity:
      "Invite top introducers into your private client network with clear next visit CTA.",
    recommendedAction: "Invite into private client network",
    evidenceRows: [
      {
        id: "f1",
        client: "Harper Quinn",
        lastVisit: "Apr 8",
        service: "Bridal trial",
        spend: "$240",
        provider: "Sasha Reed",
        opportunityScore: "91",
        status: "Wedding party tag",
      },
      {
        id: "f2",
        client: "Reese Dalton",
        lastVisit: "Apr 2",
        service: "Cut — referral code",
        spend: "$68",
        provider: "Jordan Kim",
        opportunityScore: "89",
        status: "3 referral bookings",
      },
      {
        id: "f3",
        client: "Quinn Patel",
        lastVisit: "Mar 21",
        service: "Color + treatment",
        spend: "$195",
        provider: "Mia Lopez",
        opportunityScore: "87",
        status: "High spend + shares IG",
      },
      {
        id: "f4",
        client: "Skyler Brooks",
        lastVisit: "Mar 15",
        service: "Group booking (4)",
        spend: "$420",
        provider: "Alex Torres",
        opportunityScore: "90",
        status: "Party lead",
      },
    ],
    actions: [
      { id: "invite", label: "Invite" },
      { id: "ask-providers", label: "Ask favorite providers" },
      { id: "add-note", label: "Add relationship note" },
    ],
  },
  "opp-human-context-001": {
    id: "opp-human-context-001",
    type: "VMB Invite",
    title: "Human Context — Family Signal",
    signal:
      "Notes and tags suggest family-linked visits: child, wedding, group, spouse language.",
    context:
      "Lightweight relationship data beats generic blasts — it powers gifting and timely nudges.",
    opportunity:
      "Collect one honest preference or date that makes outreach feel personal, not promotional.",
    recommendedAction:
      "Ask one lightweight relationship question (no discount required)",
    humanContextPrompt:
      "Would you like to add your child’s birthday so we can help with family gift reminders?",
    evidenceRows: [
      {
        id: "h1",
        client: "Elena Frost",
        lastVisit: "Apr 6",
        service: "Family cut block",
        spend: "$156",
        provider: "Riley Park",
        opportunityScore: "88",
        status: "Note: “daughter’s prom”",
      },
      {
        id: "h2",
        client: "Pat Kim",
        lastVisit: "Mar 29",
        service: "Men’s cut + kid trim",
        spend: "$86",
        provider: "Jordan Kim",
        opportunityScore: "84",
        status: "Tag: family visit",
      },
      {
        id: "h3",
        client: "Nova Singh",
        lastVisit: "Mar 11",
        service: "Birthday blowout",
        spend: "$112",
        provider: "Sasha Reed",
        opportunityScore: "86",
        status: "Comment: spouse booked",
      },
    ],
    actions: [
      { id: "ask-family", label: "Ask family detail" },
      { id: "add-birthday", label: "Add birthday" },
      { id: "hold", label: "Hold" },
    ],
  },
  "opp-provider-sasha-001": {
    id: "opp-provider-sasha-001",
    type: "Revenue",
    title: "Provider Revenue Lever",
    signal:
      "Sasha Reed is producing the highest attributed revenue in the imported period.",
    context:
      "Protect top book and redistribute overflow to lift team capacity without burnout.",
    opportunity:
      "Pre-book return windows for Sasha’s top 20% clients and route overflow to trained peers.",
    recommendedAction: "Balance book + train handoffs",
    evidenceRows: [
      {
        id: "p1",
        client: "Morgan Ellis",
        lastVisit: "Apr 12",
        service: "Balayage + toner",
        spend: "$186",
        provider: "Sasha Reed",
        opportunityScore: "90",
        status: "Prebook candidate",
      },
      {
        id: "p2",
        client: "Cameron Blake",
        lastVisit: "Mar 28",
        service: "Full balayage",
        spend: "$210",
        provider: "Sasha Reed",
        opportunityScore: "91",
        status: "Waitlist risk",
      },
    ],
    actions: [
      { id: "hold", label: "Hold return slots" },
      { id: "email", label: "Email clients" },
      { id: "invite", label: "Invite overflow list" },
    ],
  },
  "opp-busy-days-001": {
    id: "opp-busy-days-001",
    type: "Schedule",
    title: "Peak Day Capacity",
    signal: "Friday and Thursday carry the highest appointment concentration.",
    context:
      "Peaks are where small slips hurt revenue most — pre-confirmation and add-on prompts win here.",
    opportunity:
      "Add confirm SMS cadence and upsell scripts on Thu–Fri blocks with predictable density.",
    recommendedAction: "Tighten Thu–Fri operations playbook",
    evidenceRows: [
      {
        id: "b1",
        client: "Sample block Fri AM",
        lastVisit: "—",
        service: "12 appts / 4 hrs",
        spend: "$2.8k",
        provider: "Floor mix",
        opportunityScore: "—",
        status: "Peak window",
      },
    ],
    actions: [
      { id: "campaign", label: "Build campaign" },
      { id: "hold", label: "Hold" },
    ],
  },
  "opp-ops-snapshot-001": {
    id: "opp-ops-snapshot-001",
    type: "Retention",
    title: "Operations Reliability",
    signal:
      "Cancellation and no-show rates in imports point to schedule leakage worth closing.",
    context:
      "Each saved seat is marginal profit — confirm flows and deposit policy reduce noise.",
    opportunity:
      "Pilot deposit + 24h confirm on highest-cancellation provider columns first.",
    recommendedAction: "Tighten confirm + deposit on risk rows",
    evidenceRows: [
      {
        id: "o1",
        client: "Cohort: Tue PM",
        lastVisit: "—",
        service: "Cancel 8.2%",
        spend: "—",
        provider: "Mixed",
        opportunityScore: "72",
        status: "Leak window",
      },
    ],
    actions: [
      { id: "email", label: "Email policy note" },
      { id: "campaign", label: "Build campaign" },
    ],
  },
};

const segmentTitleToId = {
  vip: "opp-segment-vip-001",
  referral: "opp-segment-referral-001",
  reactivation: "opp-reactivation-001",
  color: "opp-balayage-001",
  nails: "opp-tuesday-slow-001",
  gift: "opp-referral-candidates-001",
};

/** Generate lightweight segment modal (reuses themes). */
function buildSegmentOpportunity(segmentId, name, count, spendSummary) {
  const base = OPPORTUNITIES_BY_ID["opp-reactivation-001"];
  return {
    id: segmentTitleToId[segmentId] ?? `opp-segment-${segmentId}`,
    type:
      segmentId === "referral" ? "Referral"
      : segmentId === "vip" ? "Revenue"
      : "Retention",
    title: `${name} — Opportunity`,
    signal: `Segment contains ${count} clients (${spendSummary}).`,
    context:
      "Clusters let you act in batches instead of one-off messages — higher ROI on outreach.",
    opportunity:
      "Select a batch action: invite, email, or hold for this segment’s next visit window.",
    recommendedAction: `Prioritize ${name} for next campaign`,
    evidenceRows: base.evidenceRows.slice(0, 3).map((r, i) => ({
      ...r,
      id: `seg-${segmentId}-${i}`,
      status: `Segment: ${name}`,
    })),
    actions: [
      { id: "invite", label: "Invite" },
      { id: "email", label: "Email" },
      { id: "hold", label: "Hold" },
    ],
  };
}

/** @param {string} id */
export function getOpportunityById(id) {
  const direct = OPPORTUNITIES_BY_ID[id];
  if (direct) return direct;
  if (id.startsWith("opp-segment-")) {
    const seg = id.replace("opp-segment-", "").replace("-001", "");
    const labels = {
      vip: ["VIP Clients", 86, "$412k lifetime (cohort)"],
      referral: ["Referral Sources", 142, "$198k referred-booking value"],
      reactivation: ["Reactivation Targets", 187, "Est. $63k recoverable"],
      color: ["Color Clients", 534, "$28 avg uplift"],
      nails: ["Nail Regulars", 211, "High frequency"],
      gift: ["Gift Buyers", 96, "Cross-sell index 1.4×"],
    };
    const L = labels[seg];
    if (L) return buildSegmentOpportunity(seg, L[0], L[1], L[2]);
  }
  return OPPORTUNITIES_BY_ID["opp-ops-snapshot-001"];
}

/** Card title / key → opportunity id */
export const opportunityIdByRevenueTitle = {
  "Highest Revenue Service": "opp-balayage-001",
  "Highest Revenue Provider": "opp-provider-sasha-001",
  "Most Profitable Days": "opp-busy-days-001",
  "Slowest Revenue Window": "opp-tuesday-slow-001",
};

export const opportunityIdByClientBehaviorTitle = {
  "Repeat Client Rate": "opp-ops-snapshot-001",
  "Clients inactive 90+ days": "opp-reactivation-001",
  "High-value clients ($500+ lifetime)": "opp-referral-candidates-001",
  "Birthday month opportunities": "opp-human-context-001",
  "Referral-source clusters": "opp-referral-candidates-001",
};

export const opportunityIdByVmbIndex = [
  "opp-human-context-001",
  "opp-referral-candidates-001",
  "opp-tuesday-slow-001",
  "opp-referral-candidates-001",
  "opp-reactivation-001",
];

export const opportunityIdByBookingCard = {
  busiestDays: "opp-busy-days-001",
  busiestProviders: "opp-provider-sasha-001",
  operations: "opp-ops-snapshot-001",
};

export const opportunityIdByHeroStat = {
  clients: "opp-reactivation-001",
  revenue: "opp-balayage-001",
  appts: "opp-busy-days-001",
  ticket: "opp-balayage-001",
  rebook: "opp-tuesday-slow-001",
  referral: "opp-referral-candidates-001",
};

/** @param {string} segmentId */
export function getSegmentOpportunityId(segmentId) {
  return segmentTitleToId[segmentId] ?? "opp-ops-snapshot-001";
}
