import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDeepInsightsHydration } from "../../../../hooks/useDeepInsightsHydration";
import RecommendedCampaignsSection from "../../../campaigns/RecommendedCampaignsSection";
import { getImportedDashboardActions } from "../../../../config/deepInsightsDashboardActions";

const pillMuted =
  "inline-flex items-center rounded border border-[#e2d6cf] bg-white px-1 py-px text-[7px] font-bold uppercase tracking-wide text-[#5c5654]";

const btnCompact =
  "inline-flex min-h-7 flex-1 items-center justify-center rounded border border-[#2f2a28]/12 bg-white px-2 text-[8px] font-bold uppercase tracking-[0.08em] text-[#2f2a28] transition hover:border-[#b88f45]/35 hover:bg-[#fffdfb] disabled:cursor-not-allowed disabled:opacity-45";

/**
 * @type {Array<{
 *   id: string;
 *   typeLabel: string;
 *   title: string;
 *   reason: string;
 *   valueBadge: string;
 *   status: string;
 *   summary: string;
 *   matched: number;
 *   approved: number;
 *   projected: string;
 *   suggested: string;
 *   nextSteps: string[];
 *   workflowCampaignId: string;
 * }>}
 */
const NEXT_BEST_ACTIONS = [
  {
    id: "nba-fill",
    typeLabel: "FILL",
    title: "Tuesday Fill Window",
    reason: "14 clients matched",
    valueBadge: "14",
    status: "READY",
    summary: "Tuesday afternoon openings detected against quiet nail regulars.",
    matched: 14,
    approved: 4,
    projected: "$640",
    suggested:
      "Approve and launch a targeted fill campaign for Tuesday PM openings.",
    nextSteps: ["Review target list", "Approve message", "Launch campaign"],
    workflowCampaignId: "camp-tuesday-glow",
  },
  {
    id: "nba-client",
    typeLabel: "CLIENT",
    title: "Balayage Reactivation",
    reason: "7 overdue rebooks",
    valueBadge: "7",
    status: "REVIEW",
    summary: "Color clients past typical rebook window with open Tuesday bandwidth.",
    matched: 7,
    approved: 2,
    projected: "$420",
    suggested: "Review the reactivation shortlist and approve outreach timing.",
    nextSteps: ["Confirm send list", "Preview message", "Schedule wave"],
    workflowCampaignId: "camp-may-color-refresh",
  },
  {
    id: "nba-vip",
    typeLabel: "VIP",
    title: "VIP Referral Invite",
    reason: "12 high-trust clients",
    valueBadge: "12",
    status: "DRAFT",
    summary: "Referral-ready VIP cluster with strong LTV and sharing history.",
    matched: 12,
    approved: 0,
    projected: "$1.1k",
    suggested: "Finalize copy and approve a low-friction VIP referral prompt.",
    nextSteps: ["Audit VIP list", "Approve message", "Queue send"],
    workflowCampaignId: "camp-vip-referral",
  },
  {
    id: "nba-human",
    typeLabel: "HUMAN",
    title: "Birthday Context Missing",
    reason: "9 profiles incomplete",
    valueBadge: "9",
    status: "CAPTURE",
    summary: "Relationship notes missing for high-touch booking conversations.",
    matched: 9,
    approved: 0,
    projected: "—",
    suggested: "Capture birthdays and family notes before the next campaign wave.",
    nextSteps: ["Open data capture", "Assign staff prompts", "Re-run match"],
    workflowCampaignId: "camp-human-context",
  },
];

function statusBadgeClass(status) {
  const s = status.toUpperCase();
  if (s === "READY") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (s === "REVIEW") return "border-amber-200 bg-amber-50 text-amber-950";
  if (s === "DRAFT") return "border-[#e2d6cf] bg-[#f8f6f4] text-[#433e3c]";
  if (s === "CAPTURE") return "border-sky-200 bg-sky-50 text-sky-950";
  return "border-[#e2d6cf] bg-white text-[#333232]";
}

export default function BusinessDriversPanel() {
  useDeepInsightsHydration();
  const recommendedRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [jumpCampaignId, setJumpCampaignId] = useState(/** @type {string | null} */ (null));
  const [heldIds, setHeldIds] = useState(/** @type {Record<string, boolean>} */ ({}));
  const [completedIds, setCompletedIds] = useState(/** @type {Record<string, boolean>} */ ({}));

  const imported = getImportedDashboardActions();
  const nextBestPool =
    imported && imported.length > 0 ? imported : NEXT_BEST_ACTIONS;

  const visibleActions = useMemo(
    () => nextBestPool.filter((a) => !completedIds[a.id]),
    [nextBestPool, completedIds],
  );

  const [selectedId, setSelectedId] = useState(NEXT_BEST_ACTIONS[0]?.id ?? "");

  const selected = useMemo(() => {
    const byId = visibleActions.find((a) => a.id === selectedId);
    return byId ?? visibleActions[0] ?? null;
  }, [visibleActions, selectedId]);

  useEffect(() => {
    if (visibleActions.length === 0) return;
    if (!visibleActions.some((a) => a.id === selectedId)) {
      setSelectedId(visibleActions[0].id);
    }
  }, [visibleActions, selectedId]);

  const scrollToRecommended = useCallback(() => {
    const el = document.getElementById("recommended-campaigns") ?? recommendedRef.current;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openWorkflow = useCallback(() => {
    if (!selected) return;
    setJumpCampaignId(selected.workflowCampaignId);
    scrollToRecommended();
  }, [selected, scrollToRecommended]);

  const rowBase =
    "w-full rounded-md border px-2 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b88f45]/35";
  const rowIdle = "border-[#e8dfd4] bg-white hover:border-[#d4bc8c]/45 hover:bg-[#fffdfb]";
  const rowSelected = "border-[#b88f45] bg-[#fffaf3] ring-1 ring-[#b88f45]/25";
  const rowHeld = "border-[#ddd] bg-[#f5f5f4] opacity-75";

  return (
    <>
      <section className="rounded-lg border border-[#e2d6cf] bg-white p-3 shadow-[0_8px_28px_-22px_rgba(39,46,45,0.55)] sm:p-3.5">
        <div className="rounded-md border border-[#e8dfd4] bg-[#faf8f5] px-2.5 py-2 sm:px-3">
          <h2 className="font-studio-serif text-lg font-semibold tracking-tight text-[#2f2a28] sm:text-xl">
            Start here to Fill Your Book!
          </h2>
          <p className="mt-0.5 text-xs leading-snug text-[#6b6262] sm:text-sm">
            Priority actions ready for review and approval.
          </p>

          {visibleActions.length === 0 ?
            <p className="mt-2 text-[11px] text-[#6b6262]">
              No queued actions. Check Recommended Campaigns below.
            </p>
          : (
            <div className="mt-2.5 flex flex-col gap-2.5 lg:flex-row lg:items-stretch lg:gap-3">
              <div className="flex min-w-0 flex-col gap-1 lg:w-[38%] lg:max-w-[38%] lg:shrink-0">
                {visibleActions.map((a) => {
                  const sel = selected?.id === a.id;
                  const held = heldIds[a.id];
                  return (
                    <button
                      key={a.id}
                      type="button"
                      className={`${rowBase} ${held ? rowHeld : sel ? rowSelected : rowIdle}`}
                      onClick={() => setSelectedId(a.id)}
                    >
                      <p className="font-mono text-[7px] font-bold uppercase tracking-[0.1em] text-[#7a726f]">
                        [{a.typeLabel}]
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold leading-tight text-[#2f2a28]">
                        {a.title}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-snug text-[#6b6262]">{a.reason}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        <span className={pillMuted}>{a.valueBadge}</span>
                        <span
                          className={`inline-flex rounded border px-1 py-px text-[7px] font-bold uppercase tracking-wide ${statusBadgeClass(a.status)}`}
                        >
                          {a.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="min-h-0 min-w-0 flex-1 rounded-md border border-[#e8dfd4] bg-white px-2.5 py-2 sm:px-3 sm:py-2.5">
                {selected ?
                  <>
                    <h3 className="font-studio-serif text-[0.8125rem] font-semibold text-[#2f2a28] sm:text-sm">
                      {selected.title}
                    </h3>
                    <p className="mt-1 text-[10px] leading-snug text-[#6b6262]">{selected.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#333232]">
                      <span>
                        <span className="font-bold uppercase tracking-wide text-[#a09a98]">
                          Matched{" "}
                        </span>
                        <span className="tabular-nums font-semibold">{selected.matched}</span>
                      </span>
                      <span>
                        <span className="font-bold uppercase tracking-wide text-[#a09a98]">
                          Approved{" "}
                        </span>
                        <span className="tabular-nums font-semibold">{selected.approved}</span>
                      </span>
                      <span>
                        <span className="font-bold uppercase tracking-wide text-[#a09a98]">
                          Projected{" "}
                        </span>
                        <span className="tabular-nums font-semibold">{selected.projected}</span>
                      </span>
                    </div>
                    <div className="my-2 border-t border-[#ece6df]" />
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a45f76]">
                      Suggested action
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#333232]">
                      {selected.suggested}
                    </p>
                    <div className="my-2 border-t border-[#ece6df]" />
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a45f76]">
                      Next steps
                    </p>
                    <ul className="mt-1 space-y-0.5 text-[11px] leading-snug text-[#333232]">
                      {selected.nextSteps.map((step) => (
                        <li key={step}>• {step}</li>
                      ))}
                    </ul>
                    <div className="mt-2.5 flex gap-1.5">
                      <button type="button" className={btnCompact} onClick={openWorkflow}>
                        OPEN WORKFLOW
                      </button>
                      <button
                        type="button"
                        className={btnCompact}
                        onClick={() =>
                          selected && setHeldIds((h) => ({ ...h, [selected.id]: !h[selected.id] }))
                        }
                      >
                        HOLD
                      </button>
                      <button
                        type="button"
                        className={btnCompact}
                        onClick={() => {
                          if (!selected) return;
                          setCompletedIds((c) => ({ ...c, [selected.id]: true }));
                        }}
                      >
                        MARK COMPLETE
                      </button>
                    </div>
                  </>
                : null}
              </div>
            </div>
          )}
        </div>

        <RecommendedCampaignsSection
          anchorRef={recommendedRef}
          forceOpenCampaignId={jumpCampaignId}
          onConsumedForceOpen={() => setJumpCampaignId(null)}
        />
      </section>
    </>
  );
}
