import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CAMPAIGN_RISK_NOTE,
  getRecommendedCampaignById,
  recommendedCampaigns,
} from "../../config/salonBusinessDriversMock";
import { activateCampaign, getCampaigns, holdCampaign, resumeCampaign, SALON_CAMPAIGNS_UPDATE_EVENT } from "../../data/salonCampaignStore";
import { useDeepInsightsHydration } from "../../hooks/useDeepInsightsHydration";
import { renderDeepInsightsMessage, getRecommendedCampaignsFromDeepInsights } from "../../lib/deep-insights/getRecommendedCampaignsFromDeepInsights.js";
import { shouldSuppressImportedCampaigns } from "../../lib/deep-insights/importQuality.js";
import { DEEP_INSIGHTS_DATASET_EVENT } from "../../lib/deep-insights/storageKeys.js";

/** @typedef {'draft' | 'send_list_approved' | 'message_approved' | 'tracking_preview'} WorkflowStatus */

const pillBtn =
  "inline-flex min-h-7 items-center justify-center rounded-md border border-[#333232]/18 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#333232] transition hover:bg-[#f5eee9] disabled:cursor-not-allowed disabled:opacity-45";

const primaryGold =
  "inline-flex min-h-7 items-center justify-center rounded-md bg-[#b88f45] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white transition hover:bg-[#c0a05a] disabled:cursor-not-allowed disabled:opacity-45";

const primaryGreen =
  "inline-flex min-h-7 items-center justify-center rounded-md bg-emerald-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-45";

const editLink =
  "text-[10px] font-semibold text-[#15803d] underline decoration-[#15803d]/35 underline-offset-2 hover:text-emerald-900";

const PREVIEW_SALON_NAME = "Preview Salon";
const PREVIEW_OWNER_NAME = "Jenny";

const CAMPAIGNS_PAGE_PATH = "/salon-owner/campaigns";

function firstToken(name) {
  const p = name.trim().split(/\s+/)[0];
  return p || name;
}

/** @param {string} service */
function serviceCategory(service) {
  const s = service.toLowerCase();
  if (s.includes("manicure") || s.includes("pedicure") || s.includes("nail")) return "manicure";
  if (s.includes("color") || s.includes("balayage") || s.includes("highlight")) return "color";
  if (s.includes("cut") || s.includes("style")) return "styling";
  if (s.includes("facial") || s.includes("spa")) return "spa";
  if (s.includes("extension") || s.includes("bridal")) return "specialty";
  return "salon";
}

/** @param {{ id: string }} campaign */
function dayPartForCampaign(campaign) {
  if (campaign.dayPartLabel) return campaign.dayPartLabel;
  const map = {
    "camp-tuesday-glow": "Tuesday afternoon",
    "camp-may-color-refresh": "May booking window",
    "camp-vip-referral": "VIP invite window",
    "camp-human-context": "this week",
  };
  return map[campaign.id] ?? "this week";
}

/** @param {{ id: string; title: string; imported?: boolean; messageTemplate?: string }} campaign */
function offerPlaceholderSubtext(campaign) {
  if (campaign.imported && campaign.messageTemplate) {
    const map = {
      reactivation: "Win-back window — openings this week",
      color: "Color priority hold",
      schedule: "Schedule fill — quiet window",
      vip: "VIP circle invite",
      human: "Notes + context capture",
      referral: "Referral thank-you / invite",
    };
    return map[campaign.messageTemplate] ?? "Limited availability";
  }
  const map = {
    "camp-tuesday-glow": "Limited Tuesday openings",
    "camp-may-color-refresh": "Limited color window this month",
    "camp-vip-referral": "VIP referral window",
    "camp-human-context": "This week only",
  };
  return map[campaign.id] ?? "Limited availability";
}

/** @param {{ id: string; title: string }} campaign */
function previewOfferUrl(campaign) {
  const slug =
    campaign.id === "camp-tuesday-glow" ?
      "tuesday-glow-up"
    : campaign.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
  return `vmb.app/preview-salon/offers/${slug}`;
}

/** @param {{ name: string; service: string }} target @param {{ id: string; imported?: boolean; messageTemplate?: string; dayPartLabel?: string }} campaign */
function renderPersonalizedMessage(target, campaign) {
  if (campaign.imported && campaign.messageTemplate) {
    return renderDeepInsightsMessage(
      { ...target, firstName: target.firstName },
      campaign,
    );
  }
  const fn = firstToken(target.name);
  const cat = serviceCategory(target.service);
  const dayPart = dayPartForCampaign(campaign);
  const lastService = target.service.toLowerCase().includes("gel") ?
      "gel manicures"
    : target.service.toLowerCase();
  return `Hi ${fn}, we have a few ${cat} openings this ${dayPart}.\nSince you usually book ${lastService}, Jenny wanted you to get first pick before the schedule fills.\nWant me to hold a spot?`;
}

/** @param {typeof recommendedCampaigns[number]} camp @param {{ status: WorkflowStatus; clientChecked: Record<string, boolean> } | undefined} w */
function approvedOutreachCount(camp, w) {
  if (!w) return 0;
  return camp.targets.filter((t) => w.clientChecked[t.id]).length;
}

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   onApproveMessage: () => boolean;
 *   previewTarget: { id: string; name: string; service: string } | null;
 *   campaign: { id: string; title: string } | null;
 *   messageAlreadyApproved: boolean;
 *   approveDisabled: boolean;
 * }} props
 */
function CampaignMessagePreviewModal({
  open,
  onClose,
  onApproveMessage,
  previewTarget,
  campaign,
  messageAlreadyApproved,
  approveDisabled,
}) {
  const panelRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panelRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open || !campaign) return null;

  const body =
    previewTarget ? renderPersonalizedMessage(previewTarget, campaign) : "Select a client in the list to preview.";
  const offerUrl = previewOfferUrl(campaign);
  const subtext = offerPlaceholderSubtext(campaign);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-[#2a2420]/45 backdrop-blur-[2px]" aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-preview-title"
        tabIndex={-1}
        className="relative max-h-[min(90vh,880px)] w-full max-w-[720px] overflow-y-auto rounded-xl border border-[#e8ddd4] bg-[#fffdfb] shadow-[0_22px_60px_rgba(42,36,32,0.18)]"
      >
        <div className="border-b border-[#efe4db] bg-gradient-to-br from-[#fffdfa] to-[#faf6f0] px-5 py-4 sm:px-6 sm:py-5">
          <p
            id="campaign-preview-title"
            className="font-studio-serif text-lg font-semibold tracking-tight text-[#2f2a28] sm:text-xl"
          >
            Preview Client Message
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#6b6262]">
            This is what selected clients will see before the campaign is sent.
          </p>
        </div>

        <div className="space-y-5 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3 rounded-xl border border-[#d4bc8c]/25 bg-white p-3 shadow-sm ring-1 ring-[#b88f45]/12">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#efe4db] to-[#e2d4c4] text-[10px] font-bold uppercase tracking-wide text-[#6b6262] ring-2 ring-white"
              aria-hidden
            >
              photo
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#2f2a28]">{PREVIEW_SALON_NAME}</p>
              <p className="text-[11px] text-[#6b6262]">{PREVIEW_OWNER_NAME}</p>
            </div>
            <div className="shrink-0 rounded-md border border-[#d4bc8c]/4 bg-[#fffaf3] px-2 py-1.5 text-center ring-1 ring-[#b88f45]/15">
              <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#b8966a]">tAIkOS</p>
              <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">VMB</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2d6cf] bg-white p-4 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">
              Message
              {previewTarget ?
                <span className="ml-1 font-medium normal-case text-[#b8966a]">
                  · sample: {firstToken(previewTarget.name)}
                </span>
              : null}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-[#333232]">{body}</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#efe4db] bg-[#faf8f5]">
            <div className="flex h-28 items-center justify-center bg-[#e8ddd4]/4">
              <div className="h-20 w-32 rounded-lg bg-gradient-to-br from-[#e8ddd4] to-[#ddd2c8] ring-1 ring-[#d4bc8c]/25" />
            </div>
            <div className="space-y-1 px-4 py-3">
              <p className="text-sm font-semibold text-[#2f2a28]">{campaign.title}</p>
              <p className="text-[11px] text-[#6b6262]">{subtext}</p>
              <button
                type="button"
                className="mt-2 w-full rounded-lg border border-[#b88f45]/35 bg-[#b88f45]/08 py-2 text-[11px] font-semibold text-[#8a6a32]"
                disabled
              >
                View My Offer
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-[#d4bc8c]/35 bg-[#fffaf3]/6 p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#b8966a]">Client CTA Destination</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#5c5654]">
              Clients return to a private VMB offer page where they can accept, request a hold, or reply.
            </p>
            <p className="mt-2 break-all font-mono text-[10px] text-[#6b6262]">{offerUrl}</p>
            {/*
              Future recipient offer page (not built yet):
              /salon/:salonSlug/offer/:campaignSlug/:recipientToken
              — salon identity, campaign offer, accept/hold/reply, VMB invite path.
            */}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#efe4db] bg-[#fffdfb] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button type="button" className={pillBtn} onClick={onClose}>
            Back to Campaign
          </button>
          {!messageAlreadyApproved ?
            <button
              type="button"
              disabled={approveDisabled}
              className={primaryGold}
              onClick={() => {
                if (onApproveMessage()) onClose();
              }}
            >
              Approve Message
            </button>
          : (
            <span className="inline-flex min-h-7 items-center justify-center rounded-md border border-emerald-200/8 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-900">
              Message approved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   anchorRef?: React.RefObject<HTMLDivElement | null>;
 *   className?: string;
 *   forceOpenCampaignId?: string | null;
 *   onConsumedForceOpen?: () => void;
 * }} props
 */
export default function RecommendedCampaignsSection({
  anchorRef,
  className = "",
  forceOpenCampaignId = null,
  onConsumedForceOpen,
}) {
  useDeepInsightsHydration();
  const navigate = useNavigate();
  const [, bumpDeepInsights] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const onDs = () => bumpDeepInsights();
    window.addEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDs);
    return () => window.removeEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDs);
  }, []);

  const { campaignsForUi, showEmptyImport, campaignsFromImport, showQualitySuppressed } = useMemo(() => {
    if (shouldSuppressImportedCampaigns()) {
      return {
        campaignsForUi: [],
        showEmptyImport: false,
        campaignsFromImport: true,
        showQualitySuppressed: true,
      };
    }
    const di = getRecommendedCampaignsFromDeepInsights();
    if (di === null) {
      return {
        campaignsForUi: recommendedCampaigns,
        showEmptyImport: false,
        campaignsFromImport: false,
        showQualitySuppressed: false,
      };
    }
    if (di.length === 0) {
      return {
        campaignsForUi: [],
        showEmptyImport: true,
        campaignsFromImport: true,
        showQualitySuppressed: false,
      };
    }
    return {
      campaignsForUi: di,
      showEmptyImport: false,
      campaignsFromImport: true,
      showQualitySuppressed: false,
    };
  }, [bumpDeepInsights]);

  const defaultCampaignId = campaignsForUi[0]?.id ?? null;
  const [selectedCampaignId, setSelectedCampaignId] = useState(defaultCampaignId);
  const [messagePreviewOpen, setMessagePreviewOpen] = useState(false);

  const [workflowById, setWorkflowById] = useState(() => ({}));

  useEffect(() => {
    setWorkflowById((prev) => {
      const next = { ...prev };
      for (const c of campaignsForUi) {
        if (!next[c.id]) {
          next[c.id] = {
            status: /** @type {WorkflowStatus} */ ("draft"),
            clientChecked: Object.fromEntries(c.targets.map((t) => [t.id, true])),
          };
        }
      }
      return next;
    });
  }, [campaignsForUi]);

  useEffect(() => {
    setSelectedCampaignId((cur) => {
      if (!campaignsForUi.length) return null;
      if (cur && campaignsForUi.some((c) => c.id === cur)) return cur;
      return campaignsForUi[0].id;
    });
  }, [campaignsForUi]);

  const [storeCampaigns, setStoreCampaigns] = useState(() =>
    typeof window !== "undefined" ? getCampaigns() : [],
  );

  useEffect(() => {
    const sync = () => setStoreCampaigns(getCampaigns());
    sync();
    window.addEventListener(SALON_CAMPAIGNS_UPDATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SALON_CAMPAIGNS_UPDATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const selectedCampaign = useMemo(() => {
    if (!selectedCampaignId) return null;
    const fromList = campaignsForUi.find((c) => c.id === selectedCampaignId);
    if (fromList) return fromList;
    return getRecommendedCampaignById(selectedCampaignId);
  }, [selectedCampaignId, campaignsForUi]);

  const wf = selectedCampaignId ? workflowById[selectedCampaignId] : null;

  const setWorkflow = useCallback((campaignId, updater) => {
    setWorkflowById((prev) => {
      const cur = prev[campaignId] ?? {
        status: /** @type {WorkflowStatus} */ ("draft"),
        clientChecked: {},
      };
      const next = typeof updater === "function" ? updater(cur) : updater;
      return { ...prev, [campaignId]: next };
    });
  }, []);

  const toggleClient = useCallback(
    (campaignId, targetId, checked) => {
      setWorkflow(campaignId, (w) => ({
        ...w,
        clientChecked: { ...w.clientChecked, [targetId]: checked },
      }));
    },
    [setWorkflow],
  );

  const selectedCheckedCount = useMemo(() => {
    if (!selectedCampaign || !wf) return 0;
    return selectedCampaign.targets.filter((t) => wf.clientChecked[t.id]).length;
  }, [selectedCampaign, wf]);

  const previewTarget = useMemo(() => {
    if (!selectedCampaign || !wf) return null;
    return selectedCampaign.targets.find((t) => wf.clientChecked[t.id]) ?? selectedCampaign.targets[0] ?? null;
  }, [selectedCampaign, wf]);

  useEffect(() => {
    if (!forceOpenCampaignId) return;
    setSelectedCampaignId(forceOpenCampaignId);
    onConsumedForceOpen?.();
  }, [forceOpenCampaignId, onConsumedForceOpen]);

  useEffect(() => {
    setMessagePreviewOpen(false);
  }, [selectedCampaignId]);

  const handleApproveSendList = useCallback(() => {
    if (!selectedCampaignId || !wf || selectedCheckedCount < 1) return;
    setWorkflow(selectedCampaignId, (w) => ({
      ...w,
      status: w.status === "draft" ? "send_list_approved" : w.status,
    }));
  }, [selectedCampaignId, wf, selectedCheckedCount, setWorkflow]);

  const handleEditSendList = useCallback(() => {
    if (!selectedCampaignId) return;
    setWorkflow(selectedCampaignId, (w) => ({
      ...w,
      status: "draft",
    }));
  }, [selectedCampaignId, setWorkflow]);

  const handleApproveMessageFromModal = useCallback(() => {
    if (!selectedCampaignId || !wf || wf.status !== "send_list_approved") return false;
    setWorkflow(selectedCampaignId, (w) => ({
      ...w,
      status: "message_approved",
    }));
    return true;
  }, [selectedCampaignId, wf, setWorkflow]);

  const handleEditMessage = useCallback(() => {
    if (!selectedCampaignId || !wf) return;
    if (wf.status !== "message_approved" && wf.status !== "tracking_preview") return;
    setWorkflow(selectedCampaignId, (w) => ({
      ...w,
      status: "send_list_approved",
    }));
  }, [selectedCampaignId, wf, setWorkflow]);

  const parseSchedule = useCallback((full) => {
    const proposed =
      full.replace(/^Proposed send:\s*/i, "").trim().split("·")[0]?.trim() ?? full;
    const lower = full.toLowerCase();
    const cadence =
      lower.includes("deep insights") ?
        "Cadence tied to your imported Deep Insights snapshot."
      : lower.includes("reminder") ?
        "Single reminder only if no booking."
      : "Standard cadence per campaign rules.";
    return { proposed, cadence };
  }, []);

  const buildHoldPayload = useCallback(
    (camp) => {
      const w = workflowById[camp.id];
      if (!w) return null;
      const approvedTargets = camp.targets.filter((t) => w.clientChecked[t.id]);
      const pt = approvedTargets[0] ?? null;
      const messagePreview = pt ? renderPersonalizedMessage(pt, camp) : camp.messagePreview;
      const { proposed } = parseSchedule(camp.sendSchedule);
      return {
        title: camp.title,
        source: camp.imported ? "Deep Insights → Recommended Campaigns" : "Dashboard → Recommended Campaigns",
        imported: Boolean(camp.imported),
        opportunityCount: camp.targetCount,
        approvedCount: approvedOutreachCount(camp, w),
        messageApproved: w.status === "message_approved" || w.status === "tracking_preview",
        sendListApproved: w.status !== "draft",
        sendTime: proposed,
        why: camp.why,
        messagePreview,
        recipients: approvedTargets.map((t) => ({
          id: t.id,
          name: t.name,
          service: t.service,
          lastVisit: t.lastVisit,
          spend: t.spend,
          reason: t.reason,
        })),
        tracking: {
          sendsQueued: approvedOutreachCount(camp, w),
          offerPageVisits: 0,
          repliesOrHolds: 0,
          bookingsAttributed: 0,
        },
      };
    },
    [workflowById, parseSchedule],
  );

  const handleRunCampaignClick = useCallback(() => {
    if (!selectedCampaign || !selectedCampaignId || !wf || wf.status !== "message_approved") return;
    const approvedTargets = selectedCampaign.targets.filter((t) => wf.clientChecked[t.id]);
    const previewForMessage =
      previewTarget && approvedTargets.some((t) => t.id === previewTarget.id) ?
        previewTarget
      : approvedTargets[0] ?? null;
    const body =
      previewForMessage ? renderPersonalizedMessage(previewForMessage, selectedCampaign) : (
        selectedCampaign.messagePreview
      );
    const { proposed } = parseSchedule(selectedCampaign.sendSchedule);

    activateCampaign({
      id: selectedCampaign.id,
      title: selectedCampaign.title,
      status: "active",
      source: selectedCampaign.imported ? "Deep Insights → Recommended Campaigns" : "Dashboard → Recommended Campaigns",
      imported: Boolean(selectedCampaign.imported),
      opportunityCount: selectedCampaign.targetCount,
      approvedCount: selectedCheckedCount,
      messageApproved: true,
      sendListApproved: true,
      sendTime: proposed,
      why: selectedCampaign.why,
      messagePreview: body,
      recipients: approvedTargets.map((t) => ({
        id: t.id,
        name: t.name,
        service: t.service,
        lastVisit: t.lastVisit,
        spend: t.spend,
        reason: t.reason,
      })),
      tracking: {
        sendsQueued: selectedCheckedCount,
        offerPageVisits: 0,
        repliesOrHolds: 0,
        bookingsAttributed: 0,
      },
      filedLocation: "Campaigns → Active Campaigns",
    });

    setWorkflow(selectedCampaignId, (w) => ({
      ...w,
      status: "tracking_preview",
    }));
  }, [
    parseSchedule,
    previewTarget,
    selectedCampaign,
    selectedCampaignId,
    selectedCheckedCount,
    setWorkflow,
    wf,
  ]);

  const openMessagePreview = useCallback(() => {
    setMessagePreviewOpen(true);
  }, []);

  const messageSectionVisible =
    wf &&
    (wf.status === "send_list_approved" ||
      wf.status === "message_approved" ||
      wf.status === "tracking_preview");

  const runSectionVisible =
    wf && (wf.status === "message_approved" || wf.status === "tracking_preview");

  const sendListApprovedUi = wf && wf.status !== "draft";
  const targetSummaryGreen = sendListApprovedUi;

  const opportunitySummaryFor = useCallback((camp) => {
    const w = workflowById[camp.id];
    const pool = camp.targetCount;
    const approved = approvedOutreachCount(camp, w);
    return { pool, approved };
  }, [workflowById]);

  const selectedHeld = useMemo(
    () =>
      Boolean(
        selectedCampaignId &&
          storeCampaigns.find((c) => c.id === selectedCampaignId)?.status === "held",
      ),
    [selectedCampaignId, storeCampaigns],
  );

  return (
    <div
      id="recommended-campaigns"
      ref={anchorRef}
      className={`mt-10 border-t border-dashed border-[#e2d6cf] pt-8 ${className}`}
    >
      <CampaignMessagePreviewModal
        open={messagePreviewOpen}
        onClose={() => setMessagePreviewOpen(false)}
        onApproveMessage={handleApproveMessageFromModal}
        previewTarget={previewTarget}
        campaign={selectedCampaign}
        messageAlreadyApproved={Boolean(
          wf && (wf.status === "message_approved" || wf.status === "tracking_preview"),
        )}
        approveDisabled={Boolean(!selectedCampaign || !wf || selectedHeld)}
      />

      <div className="rounded-xl border border-[#e2d6cf] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">Ready when you are</h3>
              {campaignsFromImport && campaignsForUi.length > 0 && !showQualitySuppressed ?
                <span className="rounded border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-sky-950">
                  Imported from Deep Insights
                </span>
              : null}
            </div>
            <p className="mt-0.5 text-xs text-[#6b6262]">
              No sends run automatically — you approve every wave.
            </p>
          </div>
        </div>

        {showQualitySuppressed ?
          <div className="mt-6 rounded-lg border border-amber-200/80 bg-amber-50/40 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-[#2f2a28]">
              Imported data needs review before campaign recommendations.
            </p>
            <p className="mt-1 text-xs text-[#6b6262]">
              Import quality is low — tAIkOS will show analytics only until mapping and coverage improve.
            </p>
            <Link
              to="/salon-owner/deep-insights/data-capture#import-review"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#b88f45] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#c0a05a]"
            >
              Review Mapping
            </Link>
          </div>
        : showEmptyImport ?
          <div className="mt-6 rounded-lg border border-dashed border-[#d4bc8c]/45 bg-[#fffaf3] px-4 py-6 text-center">
            <p className="text-sm font-semibold text-[#2f2a28]">No campaign-ready opportunities yet.</p>
            <p className="mt-1 text-xs text-[#6b6262]">
              Run normalization on Data Capture or open Analytics to refresh signals.
            </p>
            <Link
              to="/salon-owner/deep-insights/analytics"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#b88f45] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#c0a05a]"
            >
              Open Analytics
            </Link>
          </div>
        : (
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[0.4fr_0.6fr]">
          <div className="flex min-w-0 flex-col gap-2">
            {campaignsForUi.map((camp) => {
              const held = storeCampaigns.some((c) => c.id === camp.id && c.status === "held");
              const selected = camp.id === selectedCampaignId;
              const w = workflowById[camp.id];
              const { pool, approved } = opportunitySummaryFor(camp);
              const ws = w?.status;

              const baseArticle =
                "flex cursor-pointer flex-col rounded-xl border p-3 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b88f45]/35";

              let stateArticle =
                "border-[#e2d6cf] bg-white hover:border-[#d4bc8c]/45";
              if (held) {
                stateArticle = "border-neutral-300 bg-neutral-100/8 opacity-75 grayscale-[0.28]";
              } else if (ws === "tracking_preview") {
                stateArticle = "border-emerald-600/55 bg-emerald-50/45";
              } else if (ws === "message_approved") {
                stateArticle = "border-emerald-500/40 bg-emerald-50/28";
              } else if (ws === "send_list_approved") {
                stateArticle = "border-emerald-500/28 bg-emerald-50/12";
              }

              const selectedArticle =
                selected && !held ? "ring-2 ring-[#b88f45]/35 border-[#b88f45] bg-[#fffaf3]" : "";

              return (
                <article
                  key={camp.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCampaignId(camp.id);
                    }
                  }}
                  className={`${baseArticle} ${stateArticle} ${selectedArticle}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-1.5">
                    <h4 className="text-sm font-bold leading-tight text-[#333232]">{camp.title}</h4>
                    {held ?
                      <span className="inline-flex rounded-full bg-neutral-200 px-1.5 py-px text-[8px] font-bold uppercase tracking-wide text-neutral-700 ring-1 ring-neutral-300">
                        ON HOLD
                      </span>
                    : ws === "tracking_preview" ?
                      <span className="inline-flex rounded-full bg-emerald-100 px-1.5 py-px text-[8px] font-bold uppercase tracking-wide text-emerald-950 ring-1 ring-emerald-200">
                        tracking
                      </span>
                    : null}
                  </div>
                  {camp.imported && camp.cardSource ?
                    <p className="mt-1 text-[9px] font-medium text-[#7a726f]">{camp.cardSource}</p>
                  : null}
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[#6b6262]">
                    <span className="font-semibold text-[#5f5654]">Why: </span>
                    {camp.why}
                  </p>
                  <p className="mt-1.5 text-[10px] leading-snug text-[#333232]">
                    <span className="tabular-nums font-semibold">{pool}</span> opportunities found ·{" "}
                    <span className="tabular-nums font-semibold">{approved}</span> approved for outreach
                  </p>
                  <div
                    className="mt-2 flex flex-wrap gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={held}
                      className={primaryGold}
                      onClick={() => setSelectedCampaignId(camp.id)}
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      disabled={held}
                      className={pillBtn}
                      onClick={() => setSelectedCampaignId(camp.id)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className={pillBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (storeCampaigns.some((c) => c.id === camp.id && c.status === "held")) {
                          resumeCampaign(camp.id);
                          return;
                        }
                        const payload = buildHoldPayload(camp);
                        if (payload) holdCampaign(camp.id, payload);
                      }}
                    >
                      {held ? "Resume" : "Hold"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="min-w-0 rounded-xl border border-[#e2d6cf] bg-[#fffdfb] p-3 shadow-sm sm:p-4">
            {selectedCampaign && wf ?
              <>
                <div className="flex flex-col gap-3 border-b border-[#e8ddd4] pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <h4 className="min-w-0 font-studio-serif text-base font-semibold leading-snug text-[#2f2a28] sm:text-lg">
                    Campaign Detail: {selectedCampaign.title}
                  </h4>
                  <div
                    className={`shrink-0 rounded-lg px-3 py-2 text-right shadow-sm ring-1 ${
                      targetSummaryGreen ?
                        "border border-emerald-200/8 bg-emerald-50/9 ring-emerald-200/15"
                      : "border border-[#d4bc8c]/6 bg-[#fffaf3] ring-[#b88f45]/15"
                    }`}
                  >
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#059669]">
                      Opportunity pool
                    </p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums text-[#14532d]">
                      {selectedCampaign.targetCount} found
                    </p>
                    <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#15803d]">
                      Send list
                    </p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums text-[#14532d]">
                      {selectedCheckedCount} approved
                    </p>
                    <p className="mt-2 text-[9px] leading-snug text-[#6b6262]">
                      <span className="tabular-nums font-semibold text-[#333232]">
                        {selectedCampaign.targetCount}
                      </span>{" "}
                      opportunities found ·{" "}
                      <span className="tabular-nums font-semibold text-[#333232]">
                        {selectedCheckedCount}
                      </span>{" "}
                      approved for outreach
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-6">
                  <section aria-labelledby="sec-targets">
                    <h5 id="sec-targets" className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a45f76]">
                      1 · Target clients
                    </h5>

                    {wf.status === "draft" ?
                      <>
                        <div className="mt-2 overflow-x-auto rounded-lg border border-[#efe4db] bg-white">
                          <table className="w-full min-w-[520px] border-collapse text-left text-[10px]">
                            <thead>
                              <tr className="border-b border-[#e8ddd4] text-[8px] font-bold uppercase tracking-wide text-[#a09a98]">
                                <th className="w-8 py-2 pl-2" scope="col">
                                  <span className="sr-only">Include</span>
                                </th>
                                <th className="py-2 pr-2 font-semibold">Client</th>
                                <th className="py-2 px-1 font-semibold">Last visit</th>
                                <th className="py-2 px-1 font-semibold">Service</th>
                                <th className="py-2 px-1 font-semibold">Spend</th>
                                <th className="py-2 pl-1 pr-2 font-semibold">Reason selected</th>
                              </tr>
                            </thead>
                            <tbody className="text-[#333232]">
                              {selectedCampaign.targets.map((t) => (
                                <tr key={t.id} className="border-b border-[#f5eee9] last:border-b-0">
                                  <td className="py-1.5 pl-2 align-middle">
                                    <input
                                      type="checkbox"
                                      className="h-3.5 w-3.5 rounded border-[#c4bbb4] text-[#b88f45] focus:ring-[#b88f45]"
                                      checked={Boolean(wf.clientChecked[t.id])}
                                      disabled={selectedHeld}
                                      onChange={(e) =>
                                        toggleClient(selectedCampaign.id, t.id, e.target.checked)
                                      }
                                    />
                                  </td>
                                  <td className="py-1.5 pr-2 font-medium">{t.name}</td>
                                  <td className="py-1.5 px-1 tabular-nums text-[#6b6262]">{t.lastVisit}</td>
                                  <td className="py-1.5 px-1">{t.service}</td>
                                  <td className="py-1.5 px-1 tabular-nums">{t.spend}</td>
                                  <td className="py-1.5 pl-1 pr-2 text-[#6b6262]">{t.reason}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-1.5 text-[11px] font-medium text-[#333232]">
                          <span className="tabular-nums">{selectedCheckedCount}</span> clients selected
                        </p>
                        <button
                          type="button"
                          disabled={
                            selectedHeld || wf.status !== "draft" || selectedCheckedCount < 1
                          }
                          className={`${primaryGold} mt-2`}
                          onClick={handleApproveSendList}
                        >
                          Approve Send List
                        </button>
                      </>
                    : (
                      <div
                        className="mt-2 rounded-lg border border-emerald-200/8 bg-emerald-50/9 px-3 py-2.5"
                        role="status"
                      >
                        <p className="text-[11px] font-semibold text-emerald-950">Send list approved</p>
                        <button type="button" className={`${editLink} mt-1`} onClick={handleEditSendList}>
                          Edit
                        </button>
                      </div>
                    )}
                  </section>

                  {messageSectionVisible ?
                    <section aria-labelledby="sec-message">
                      <h5 id="sec-message" className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a45f76]">
                        2 · Review message
                      </h5>

                      {wf.status === "send_list_approved" ?
                        <div className="mt-2 rounded-lg border border-[#e2d6cf] bg-white p-3 shadow-sm">
                          <p className="text-[10px] text-[#6b6262]">
                            Review the full client-facing experience, then approve the message.
                          </p>
                          {previewTarget ?
                            <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-[#333232]">
                              {renderPersonalizedMessage(previewTarget, selectedCampaign)}
                            </p>
                          : (
                            <p className="mt-2 text-[11px] text-[#6b6262]">
                              Select at least one client for personalization.
                            </p>
                          )}
                          <button
                            type="button"
                            disabled={selectedHeld}
                            className={`${primaryGold} mt-3 w-full sm:w-auto`}
                            onClick={openMessagePreview}
                          >
                            Review Message
                          </button>
                        </div>
                      : (
                        <div
                          className="mt-2 rounded-lg border border-emerald-200/8 bg-emerald-50/9 px-3 py-2.5"
                          role="status"
                        >
                          <p className="text-[11px] font-semibold text-emerald-950">Message approved</p>
                          <button type="button" className={`${editLink} mt-1`} onClick={handleEditMessage}>
                            Edit
                          </button>
                        </div>
                      )}
                    </section>
                  : null}

                  {runSectionVisible ?
                    <>
                      <section aria-labelledby="sec-timing">
                        <h5 id="sec-timing" className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a45f76]">
                          3 · Confirm / run campaign
                        </h5>
                        <div className="mt-2 space-y-2 rounded-lg border border-[#efe4db] bg-white p-3 text-[11px]">
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">
                              Proposed send
                            </p>
                            <p className="mt-1 font-medium text-[#2f2a28]">
                              {parseSchedule(selectedCampaign.sendSchedule).proposed}
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">
                              Cadence
                            </p>
                            <p className="mt-1 text-[#6b6262]">
                              {parseSchedule(selectedCampaign.sendSchedule).cadence}
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">
                              Risk note
                            </p>
                            <p className="mt-1 text-[#6b6262]">{CAMPAIGN_RISK_NOTE}</p>
                          </div>
                        </div>
                        {wf.status === "message_approved" ?
                          <button
                            type="button"
                            disabled={selectedHeld}
                            className={`${primaryGreen} mt-2`}
                            onClick={handleRunCampaignClick}
                          >
                            Confirm + Run Campaign
                          </button>
                        : null}
                      </section>

                      {wf.status === "tracking_preview" ?
                        <>
                          <div
                            className="rounded-lg border border-emerald-200/8 bg-emerald-50/9 px-3 py-2.5"
                            role="status"
                          >
                            <p className="text-[11px] font-semibold text-emerald-950">
                              Campaign queued for tracking
                            </p>
                            <p className="mt-1.5 text-[10px] text-[#6b6262]">
                              Filed under:{" "}
                              <span className="font-semibold text-[#14532d]">Campaigns → Active Campaigns</span>
                            </p>
                            <button
                              type="button"
                              className={`${primaryGreen} mt-2`}
                              onClick={() => navigate(CAMPAIGNS_PAGE_PATH)}
                            >
                              Open Campaigns
                            </button>
                          </div>

                          <section aria-labelledby="sec-tracking">
                            <h5
                              id="sec-tracking"
                              className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a45f76]"
                            >
                              4 · Campaign tracking (preview)
                            </h5>
                            <p className="mt-2 text-[10px] text-[#6b6262]">Preview metrics — no live data yet.</p>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              {[
                                { label: "Sends queued", value: String(selectedCheckedCount) },
                                { label: "Offer page visits", value: "—" },
                                { label: "Replies / holds", value: "—" },
                                { label: "Bookings attributed", value: "—" },
                              ].map((row) => (
                                <div
                                  key={row.label}
                                  className="rounded-lg border border-[#efe4db] bg-white px-3 py-2.5 shadow-sm"
                                >
                                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#a09a98]">
                                    {row.label}
                                  </p>
                                  <p className="mt-1 text-lg font-semibold tabular-nums text-[#2f2a28]">
                                    {row.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </section>
                        </>
                      : null}
                    </>
                  : null}
                </div>
              </>
            : (
              <>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#b8966a]">
                  Campaign detail
                </p>
                <h4 className="mt-1 font-studio-serif text-lg font-semibold text-[#2f2a28]">
                  Campaign Detail
                </h4>
                <p className="mt-2 text-[11px] leading-relaxed text-[#6b6262]">
                  Select a campaign to run the approval workflow: target list, message, timing, then run.
                </p>
              </>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
