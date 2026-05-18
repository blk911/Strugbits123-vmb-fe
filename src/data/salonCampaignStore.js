/** @typedef {'active' | 'held' | 'draft' | 'queued' | 'completed'} SalonCampaignStatus */

/** @typedef {'active' | 'draft'} PreviousStoreStatusBeforeHold */

/**
 * @typedef {{
 *   id: string;
 *   name: string;
 *   service?: string;
 *   lastVisit?: string;
 *   spend?: string;
 *   reason?: string;
 * }} SalonCampaignRecipient
 */

/**
 * @typedef {{
 *   id: string;
 *   title: string;
 *   status: SalonCampaignStatus;
 *   source: string;
 *   opportunityCount: number;
 *   approvedCount: number;
 *   messageApproved: boolean;
 *   sendListApproved: boolean;
 *   sendTime: string;
 *   why: string;
 *   messagePreview: string;
 *   recipients: SalonCampaignRecipient[];
 *   tracking: {
 *     sendsQueued: number;
 *     offerPageVisits: number;
 *     repliesOrHolds: number;
 *     bookingsAttributed: number;
 *   };
 *   filedLocation?: string;
 *   updatedAt?: number;
 *   heldAt?: string;
 *   previousStatusBeforeHold?: PreviousStoreStatusBeforeHold;
 *   imported?: boolean;
 * }} SalonCampaignPersisted
 */

export const SALON_CAMPAIGNS_STORAGE_KEY = "vmb_salon_campaigns";

/** Initial template list for imports/tests; runtime source of truth is localStorage. */
export const mockCampaigns = /** @type {SalonCampaignPersisted[]} */ ([]);

export const SALON_CAMPAIGNS_UPDATE_EVENT = "vmb-salon-campaigns-updated";

function dispatchUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SALON_CAMPAIGNS_UPDATE_EVENT));
}

/**
 * @param {unknown} row
 * @returns {SalonCampaignPersisted}
 */
function normalizeRow(row) {
  /** @type {any} */
  const r = row && typeof row === "object" ? row : {};
  const s = r.status;
  const status =
    s === "on_hold" || s === "held" ? "held"
    : s === "active" ? "active"
    : s === "draft" ? "draft"
    : s === "queued" ? "queued"
    : s === "completed" ? "completed"
    : "draft";
  return { ...r, status };
}

/**
 * @returns {SalonCampaignPersisted[]}
 */
function loadRaw() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SALON_CAMPAIGNS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const normalized = parsed.map(normalizeRow);
    return normalized;
  } catch {
    return [];
  }
}

/**
 * @param {SalonCampaignPersisted[]} list
 */
function saveRaw(list) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SALON_CAMPAIGNS_STORAGE_KEY, JSON.stringify(list));
  dispatchUpdated();
}

/**
 * @returns {SalonCampaignPersisted[]}
 */
export function getCampaigns() {
  return loadRaw();
}

/**
 * @param {SalonCampaignPersisted} campaign
 */
export function activateCampaign(campaign) {
  const list = loadRaw();
  const now = Date.now();
  const idx = list.findIndex((c) => c.id === campaign.id);
  const next = {
    ...campaign,
    status: /** @type {SalonCampaignStatus} */ ("active"),
    messageApproved: true,
    sendListApproved: true,
    filedLocation: campaign.filedLocation ?? "Campaigns → Active Campaigns",
    updatedAt: now,
    heldAt: undefined,
    previousStatusBeforeHold: undefined,
  };
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...next };
  } else {
    list.push(next);
  }
  saveRaw(list);
}

/**
 * @param {SalonCampaignStatus | string | undefined} s
 * @returns {PreviousStoreStatusBeforeHold}
 */
function previousHoldFromStatus(s) {
  if (s === "active") return "active";
  return "draft";
}

/**
 * Mark a campaign held and persist. If the row does not exist yet, pass `payload` with enough fields to create it (dashboard hold before run).
 * @param {string} campaignId
 * @param {Partial<SalonCampaignPersisted>=} payload - merged when creating the row or refreshing snapshot while holding
 */
export function holdCampaign(campaignId, payload) {
  const list = loadRaw();
  const idx = list.findIndex((c) => c.id === campaignId);
  const heldAt = new Date().toISOString();

  if (idx < 0) {
    if (!payload?.title) return;
    const base = /** @type {SalonCampaignPersisted} */ ({
      id: campaignId,
      title: payload.title,
      status: "held",
      source: payload.source ?? "Dashboard → Recommended Campaigns",
      imported: Boolean(payload.imported),
      opportunityCount: payload.opportunityCount ?? 0,
      approvedCount: payload.approvedCount ?? 0,
      messageApproved: Boolean(payload.messageApproved),
      sendListApproved: Boolean(payload.sendListApproved),
      sendTime: payload.sendTime ?? "",
      why: payload.why ?? "",
      messagePreview: payload.messagePreview ?? "",
      recipients: Array.isArray(payload.recipients) ? payload.recipients : [],
      tracking: payload.tracking ?? {
        sendsQueued: payload.approvedCount ?? 0,
        offerPageVisits: 0,
        repliesOrHolds: 0,
        bookingsAttributed: 0,
      },
      filedLocation: payload.filedLocation,
      heldAt,
      previousStatusBeforeHold: "draft",
      updatedAt: Date.now(),
    });
    list.push(base);
    saveRaw(list);
    return;
  }

  const cur = list[idx];
  if (cur.status === "held") return;

  const previousStatusBeforeHold = previousHoldFromStatus(cur.status);
  list[idx] = {
    ...cur,
    ...payload,
    status: "held",
    heldAt,
    previousStatusBeforeHold,
    updatedAt: Date.now(),
  };
  saveRaw(list);
}

/**
 * Clear held state and restore prior store status (active or draft).
 * @param {string} campaignId
 */
export function resumeCampaign(campaignId) {
  const list = loadRaw();
  const idx = list.findIndex((c) => c.id === campaignId);
  if (idx < 0) return;
  const cur = list[idx];
  if (cur.status !== "held") return;

  const nextStatusRaw = cur.previousStatusBeforeHold ?? "draft";
  const nextStatus = /** @type {SalonCampaignStatus} */ (nextStatusRaw === "active" ? "active" : "draft");

  list[idx] = {
    ...cur,
    status: nextStatus,
    heldAt: undefined,
    previousStatusBeforeHold: undefined,
    updatedAt: Date.now(),
  };
  saveRaw(list);
}

/**
 * Drop persisted Salon dashboard rows that came from the last Deep Insights import
 * (recommended campaigns with imported/di- IDs). Call when clearing or replacing import data.
 */
export function removeDeepInsightsDerivedCampaigns() {
  const list = loadRaw();
  const next = list.filter((c) => {
    if (c.imported === true) return false;
    if (String(c.id).startsWith("di-")) return false;
    const src = String(c.source || "");
    if (src.includes("Deep Insights")) return false;
    return true;
  });
  if (next.length !== list.length) {
    saveRaw(next);
  }
}
