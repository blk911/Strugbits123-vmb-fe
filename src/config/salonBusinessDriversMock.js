/**
 * Salon dashboard Business Drivers — mock campaigns aligned with synthetic analytics
 * (deepInsightsMockDataset). No backend; local approval state only.
 */

import { resolveGenericDeepInsightsTarget } from "../lib/deep-insights/storageKeys.js";

/** @typedef {'draft' | 'approved' | 'scheduled' | 'sent' | 'complete' | 'hold'} CampaignStatus */

export const OWNER_APPROVAL_BADGE = "Owner approval required";

export const CAMPAIGN_RISK_NOTE =
  "VMB avoids over-messaging clients.";

export const businessCommandFlow = [
  "Salon Signup",
  "Profile Setup",
  "Data Capture",
  "Analytics",
  "Opportunity Engine",
  "Campaign Recommendations",
  "Owner Approval",
  "Scheduled Actions",
  "New Human Data",
  "Better Future Opportunities",
];

/** @type {Array<{ id: string; label: string; projectedValue: string; targetCount: number; urgency: string; actionLabel: string; href: string }>} */
export const weeklyOpportunityHighlights = [
  {
    id: "wo-1",
    label: "Tuesday afternoon fill",
    projectedValue: "~$2.8k",
    targetCount: 14,
    urgency: "This week",
    actionLabel: "Review campaign",
    href: "/salon-owner/campaigns",
  },
  {
    id: "wo-2",
    label: "May color refresh wave",
    projectedValue: "~$1.9k",
    targetCount: 8,
    urgency: "Before holiday rush",
    actionLabel: "View opportunity",
    href: "/salon-owner/opportunities",
  },
  {
    id: "wo-3",
    label: "VIP referral activation",
    projectedValue: "~$4.2k LTV",
    targetCount: 12,
    urgency: "High trust",
    actionLabel: "Open network",
    href: "/salon-owner/network/referral-activity",
  },
  {
    id: "wo-4",
    label: "Human context prompts",
    projectedValue: "Relationship data",
    targetCount: 9,
    urgency: "Low-friction",
    actionLabel: "See prompts",
    href: "/salon-owner/deep-insights/analytics",
  },
];

/**
 * Operational signals — dense rows for tAIkOS panel (presentation only; actions match prior drivers).
 * @type {Array<{
 *   id: string;
 *   type: string;
 *   accent: 'opportunity' | 'attention' | 'schedule' | 'vip' | 'referral' | 'human';
 *   headline: string;
 *   detail: string;
 *   value: string;
 *   primary: { label: string; kind: 'scroll' | 'review' | 'navigate'; target?: string };
 *   secondary?: { label: string; kind: 'scroll' | 'review' | 'navigate' | 'hold-driver'; target?: string };
 * }>}
 */
export const operationalSignals = [
  {
    id: "ready-campaigns",
    type: "Campaign",
    accent: "opportunity",
    headline: "Ready campaigns",
    detail: "Waves staged · owner approval gate",
    value: "3",
    primary: { label: "Review", kind: "scroll", target: "recommended-campaigns" },
    secondary: { label: "Hub", kind: "navigate", target: "/salon-owner/campaigns" },
  },
  {
    id: "schedule-gaps",
    type: "Schedule",
    accent: "schedule",
    headline: "Tue 1–4 PM gap",
    detail: "Demand exceeds book · fill window",
    value: "$640",
    primary: { label: "Build", kind: "review", target: "camp-tuesday-glow" },
    secondary: {
      label: "Analytics",
      kind: "navigate",
      target: "/salon-owner/deep-insights/analytics",
    },
  },
  {
    id: "client-reactivation",
    type: "Client",
    accent: "attention",
    headline: "Reactivation pool",
    detail: "23 inactive · balayage / color cadence",
    value: "$2,140",
    primary: {
      label: "View",
      kind: "navigate",
      target: "/salon-owner/deep-insights/analytics",
    },
    secondary: { label: "Hold", kind: "hold-driver", target: "client-reactivation" },
  },
  {
    id: "referral-opps",
    type: "Referral",
    accent: "referral",
    headline: "Referral-active clients",
    detail: "High trust · strong LTV cluster",
    value: "12",
    primary: { label: "Open", kind: "review", target: "camp-vip-referral" },
    secondary: {
      label: "Analytics",
      kind: "navigate",
      target: "/salon-owner/deep-insights/analytics",
    },
  },
  {
    id: "vip-clients",
    type: "VIP",
    accent: "vip",
    headline: "VIP movement",
    detail: "Top-decile · holds + tailored outreach",
    value: "214",
    primary: {
      label: "Review",
      kind: "navigate",
      target: "/salon-owner/deep-insights/analytics",
    },
    secondary: { label: "Hold", kind: "hold-driver", target: "vip-clients" },
  },
  {
    id: "human-context",
    type: "Human data",
    accent: "human",
    headline: "Context gaps",
    detail: "Birthdays · family · referral hooks missing",
    value: "9",
    primary: { label: "Prompt", kind: "review", target: "camp-human-context" },
    secondary: {
      label: "Capture",
      kind: "navigate",
      target: "/salon-owner/deep-insights/data-capture",
    },
  },
];

/** @deprecated Use operationalSignals — kept name for legacy imports */
export const businessDriverCards = operationalSignals;

/** @type {Array<{ id: string; name: string; lastVisit: string; service: string; spend: string; reason: string }>} */
const targetsTuesday = [
  { id: "t1", name: "Maya Chen", lastVisit: "Apr 18", service: "Gel manicure", spend: "$86", reason: "Nail regular · quiet 6wk" },
  { id: "t2", name: "Jordan Ellis", lastVisit: "Mar 02", service: "Full highlight", spend: "$312", reason: "Inactive · color history" },
  { id: "t3", name: "Samira Noor", lastVisit: "Apr 22", service: "Pedicure + nail art", spend: "$102", reason: "Tuesday preference tag" },
  { id: "t4", name: "Alex Rivera", lastVisit: "Feb 14", service: "Men's cut", spend: "$48", reason: "Gift buyer pattern" },
  { id: "t5", name: "Priya Shah", lastVisit: "Apr 01", service: "Balayage refresh", spend: "$268", reason: "Rebook window opening" },
  { id: "t6", name: "Chris Okafor", lastVisit: "Mar 28", service: "Brow + lash", spend: "$124", reason: "Afternoon slot history" },
  { id: "t7", name: "Taylor Brooks", lastVisit: "Jan 10", service: "Keratin", spend: "$340", reason: "High LTV · lapsed" },
];

const targetsColor = [
  { id: "c1", name: "Riley Morgan", lastVisit: "Feb 12", service: "Balayage", spend: "$285", reason: "Color refresh cadence" },
  { id: "c2", name: "Emma Clarke", lastVisit: "Mar 08", service: "Full color", spend: "$198", reason: "8-week rebook window" },
  { id: "c3", name: "Quinn Harper", lastVisit: "Apr 05", service: "Highlight + toner", spend: "$242", reason: "May event tagged" },
  { id: "c4", name: "Drew Fleming", lastVisit: "Mar 29", service: "Color correction", spend: "$420", reason: "High ticket color" },
  { id: "c5", name: "Casey Ng", lastVisit: "Feb 22", service: "Balayage", spend: "$276", reason: "Referral-adjacent cluster" },
  { id: "c6", name: "Jamie Park", lastVisit: "Mar 15", service: "Gloss + treatment", spend: "$156", reason: "Product attachment" },
];

const targetsReferral = [
  { id: "r1", name: "Sloane Witt", lastVisit: "Apr 10", service: "Cut + style", spend: "$720 LTV", reason: "Prior referral activity" },
  { id: "r2", name: "Morgan Ashe", lastVisit: "Apr 14", service: "Color package", spend: "$890 LTV", reason: "VMB invite candidate" },
  { id: "r3", name: "Blake Turner", lastVisit: "Mar 30", service: "Bridal trial", spend: "$512", reason: "Wedding party lead" },
  { id: "r4", name: "Avery Cole", lastVisit: "Apr 02", service: "VIP bundle", spend: "$1.1k LTV", reason: "Social referrer tag" },
  { id: "r5", name: "Reese Dalton", lastVisit: "Feb 28", service: "Extensions", spend: "$940 LTV", reason: "High spend + shares" },
  { id: "r6", name: "Skyler Fox", lastVisit: "Apr 08", service: "Spa combo", spend: "$655", reason: "Trusted circle signal" },
];

const targetsHuman = [
  { id: "h1", name: "Nina Kessler", lastVisit: "Mar 20", service: "Family cut day", spend: "$180", reason: "Note: child accompany" },
  { id: "h2", name: "Logan Pierce", lastVisit: "Apr 03", service: "Men's cut", spend: "$96", reason: "Spouse gift mention" },
  { id: "h3", name: "Violet Grant", lastVisit: "Mar 11", service: "Balayage", spend: "$310", reason: "Wedding party flag" },
  { id: "h4", name: "Owen Hale", lastVisit: "Feb 19", service: "Beard + cut", spend: "$72", reason: "Group visit tag" },
  { id: "h5", name: "Iris Lombard", lastVisit: "Apr 12", service: "Facial", spend: "$134", reason: "Birthday month" },
  { id: "h6", name: "Marcus Lee", lastVisit: "Mar 25", service: "Kids cut", spend: "$44", reason: "Family note · trusted referral" },
];

/**
 * Recommended campaigns — Review opens modal.
 * @type {Array<{
 *   id: string;
 *   title: string;
 *   why: string;
 *   targetCount: number;
 *   messagePreview: string;
 *   sendSchedule: string;
 *   targets: typeof targetsTuesday;
 * }>}
 */
export const recommendedCampaigns = [
  {
    id: "camp-tuesday-glow",
    title: "Tuesday Glow-Up Fill",
    why: "Tuesday afternoon openings plus nail regulars and clients going quiet — tAIkOS matched a fill pattern from your synthetic week.",
    targetCount: 14,
    messagePreview:
      "We have a few Tuesday openings this week — want first pick for your usual manicure or a quick refresh? Reply HOLD anytime and we’ll pause invites for you.",
    sendSchedule: "Proposed send: Tue May 13, 2026 · 10:00 AM (your timezone) · single reminder only if no booking",
    targets: targetsTuesday,
  },
  {
    id: "camp-may-color-refresh",
    title: "May Color Refresh",
    why: "Balayage and full-color clients are entering the rebook window seen in your highest revenue service line.",
    targetCount: 8,
    messagePreview:
      "Your color is probably ready for a spring refresh — we saved a May slot cluster for color guests. One tap to see times; no pressure if you’re waiting.",
    sendSchedule: "Proposed send: Mon May 12, 2026 · 9:30 AM · staggered over 2 hours",
    targets: targetsColor,
  },
  {
    id: "camp-vip-referral",
    title: "VIP Referral Invite",
    why: "High lifetime spend plus referral behavior — ideal for a private client network invite without a discount.",
    targetCount: 12,
    messagePreview:
      "You’ve sent us amazing guests — we’d love to formalize a private circle for people you trust. Here’s a calm, one-step invite (decline anytime).",
    sendSchedule: "Proposed send: Wed May 14, 2026 · 2:00 PM · VIP batch (smaller audience)",
    targets: targetsReferral,
  },
  {
    id: "camp-human-context",
    title: "Human Context Gentle Ask",
    why: "Notes suggest family, partner, or event context — one lightweight question can unlock better timing later.",
    targetCount: 6,
    messagePreview:
      "Quick ask: would you like us to remember a child’s birthday or a favorite gift occasion? Helps us nudge kindly — never spam. Skip if you prefer not to share.",
    sendSchedule: "Proposed send: Thu May 15, 2026 · 11:00 AM · low-frequency channel",
    targets: targetsHuman,
  },
];

export function getRecommendedCampaignById(id) {
  return recommendedCampaigns.find((c) => c.id === id);
}

/**
 * `weeklyOpportunityHighlights` with generic Deep Insights analytics hrefs resolved at read time.
 * @returns {typeof weeklyOpportunityHighlights}
 */
export function getWeeklyOpportunityHighlightsResolved() {
  return weeklyOpportunityHighlights.map((w) => ({
    ...w,
    href: resolveGenericDeepInsightsTarget(w.href),
  }));
}

function mapOperationalSignalRow(row) {
  const next = { ...row };
  if (next.primary?.target) {
    next.primary = {
      ...next.primary,
      target: resolveGenericDeepInsightsTarget(next.primary.target),
    };
  }
  if (next.secondary?.target) {
    next.secondary = {
      ...next.secondary,
      target: resolveGenericDeepInsightsTarget(next.secondary.target),
    };
  }
  return next;
}

/**
 * `operationalSignals` with generic `/salon-owner/deep-insights/analytics` navigate targets resolved.
 * Explicit Data Capture URLs are unchanged.
 */
export function getOperationalSignalsResolved() {
  return operationalSignals.map(mapOperationalSignalRow);
}
