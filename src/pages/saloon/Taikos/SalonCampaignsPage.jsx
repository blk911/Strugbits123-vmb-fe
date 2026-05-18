import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getCampaigns,
  holdCampaign,
  resumeCampaign,
  SALON_CAMPAIGNS_UPDATE_EVENT,
} from "../../../data/salonCampaignStore";

const pill =
  "inline-flex min-h-7 items-center justify-center rounded-md border border-[#333232]/18 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#333232] transition hover:bg-[#f5eee9]";
const pillGold =
  "inline-flex min-h-7 items-center justify-center rounded-md bg-[#b88f45] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white transition hover:bg-[#c0a05a]";
const pillGreen =
  "inline-flex min-h-7 items-center justify-center rounded-md bg-emerald-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white transition hover:bg-emerald-800";

function useSalonCampaignsFromStorage() {
  const [campaigns, setCampaigns] = useState(() =>
    typeof window !== "undefined" ? getCampaigns() : [],
  );

  const sync = useCallback(() => {
    setCampaigns(getCampaigns());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(SALON_CAMPAIGNS_UPDATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SALON_CAMPAIGNS_UPDATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return [campaigns, sync];
}

function formatHeldAt(iso) {
  if (!iso || typeof iso !== "string") return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   campaign: import("../../../data/salonCampaignStore").SalonCampaignPersisted | null;
 * }} props
 */
function CampaignDetailModal({ open, onClose, campaign }) {
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

  const tr = campaign.tracking ?? {
    sendsQueued: 0,
    offerPageVisits: 0,
    repliesOrHolds: 0,
    bookingsAttributed: 0,
  };

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
        aria-labelledby="campaign-detail-title"
        tabIndex={-1}
        className="relative max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-xl border border-[#e8ddd4] bg-[#fffdfb] shadow-[0_22px_60px_rgba(42,36,32,0.18)]"
      >
          <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-[#efe4db] bg-gradient-to-br from-[#fffdfa] to-[#faf6f0] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p
              id="campaign-detail-title"
              className="font-studio-serif text-base font-semibold tracking-tight text-[#2f2a28] sm:text-lg"
            >
              {campaign.title}
            </p>
            {campaign.imported ?
              <p className="mt-1.5">
                <span className="rounded border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-sky-950">
                  Deep Insights import
                </span>
                <span className="mt-1 block text-[9px] text-[#6b6262]">{campaign.source}</span>
              </p>
            : null}
            <p className="mt-0.5 text-[10px] text-[#6b6262]">
              {campaign.status === "held" || campaign.status === "on_hold" ?
                "On hold — tracking preview only; no live sends."
              : "Tracking preview — no live sends."}
            </p>
          </div>
          <button type="button" className={`${pill} shrink-0`} onClick={onClose}>
            Close
          </button>
        </div>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          <section>
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">Why created</p>
            <p className="mt-1 text-[11px] leading-snug text-[#333232]">{campaign.why}</p>
          </section>

          <section>
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">
              Approved recipients ({campaign.recipients?.length ?? 0})
            </p>
            <ul className="mt-1.5 max-h-36 space-y-1 overflow-y-auto rounded-lg border border-[#efe4db] bg-white p-2 text-[11px]">
              {(campaign.recipients ?? []).map((r) => (
                <li key={r.id} className="flex justify-between gap-2 text-[#333232]">
                  <span className="font-medium">{r.name}</span>
                  <span className="shrink-0 text-[#6b6262]">{r.service}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">Message preview</p>
            <p className="mt-1 whitespace-pre-wrap rounded-lg border border-[#e2d6cf] bg-white p-3 text-[11px] leading-relaxed text-[#333232]">
              {campaign.messagePreview}
            </p>
          </section>

          <section>
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">Send timing</p>
            <p className="mt-1 text-[11px] font-medium text-[#2f2a28]">Send scheduled: {campaign.sendTime}</p>
          </section>

          <section>
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a09a98]">Tracking preview</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { label: "Sends queued", value: tr.sendsQueued },
                { label: "Offer page visits", value: tr.offerPageVisits },
                { label: "Replies / holds", value: tr.repliesOrHolds },
                { label: "Bookings attributed", value: tr.bookingsAttributed },
              ].map((row) => (
                <div
                  key={row.label}
                  className="rounded-lg border border-[#efe4db] bg-white px-2.5 py-2 shadow-sm"
                >
                  <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[#a09a98]">{row.label}</p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums text-[#2f2a28]">{row.value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function SalonCampaignsPage() {
  const [campaigns, sync] = useSalonCampaignsFromStorage();
  const [detailId, setDetailId] = useState(/** @type {string | null} */ (null));

  const summary = useMemo(() => {
    let active = 0;
    let queued = 0;
    let onHold = 0;
    let completed = 0;
    for (const c of campaigns) {
      if (c.status === "active") active += 1;
      else if (c.status === "queued") queued += 1;
      else if (c.status === "held") onHold += 1;
      else if (c.status === "on_hold") onHold += 1;
      else if (c.status === "completed") completed += 1;
    }
    return { active, queued, onHold, completed };
  }, [campaigns]);

  const activeList = useMemo(
    () => campaigns.filter((c) => c.status === "active"),
    [campaigns],
  );

  const heldList = useMemo(
    () => campaigns.filter((c) => c.status === "held"),
    [campaigns],
  );

  const detailCampaign = useMemo(
    () => (detailId ? campaigns.find((c) => c.id === detailId) ?? null : null),
    [campaigns, detailId],
  );

  const handlePause = useCallback(
    (id) => {
      holdCampaign(id);
      sync();
      setDetailId((cur) => (cur === id ? null : cur));
    },
    [sync],
  );

  const handleResume = useCallback(
    (id) => {
      resumeCampaign(id);
      sync();
      setDetailId((cur) => (cur === id ? null : cur));
    },
    [sync],
  );

  return (
    <div className="min-h-full bg-vmb-dashboard-bg font-poppins">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="rounded-xl border border-vmb-border-light bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-studio-serif text-2xl font-semibold tracking-tight text-[#2f2a28] sm:text-3xl">
                Campaigns
              </h1>
              <p className="mt-1 text-xs text-[#6b6262] sm:text-sm">
                Approved campaigns, active sends, and early results.
              </p>
            </div>
            <div className="shrink-0 rounded-lg border border-[#d4bc8c]/25 bg-[#fffaf3] px-2.5 py-2 ring-1 ring-[#b88f45]/15">
              <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#b8966a]">tAIkOS</p>
              <p className="mt-0.5 text-[10px] font-medium leading-snug text-[#5f5654]">
                Owner-approved outreach only.
              </p>
            </div>
          </div>
        </header>

        {/* Summary strip */}
        <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-vmb-border-light bg-white px-3 py-2.5 shadow-sm sm:gap-3">
          {(
            [
              ["Active", summary.active],
              ["Queued", summary.queued],
              ["On Hold", summary.onHold],
              ["Completed", summary.completed],
            ]
          ).map(([label, n]) => (
            <div
              key={label}
              className="flex min-w-[4.5rem] items-baseline gap-1.5 rounded-md border border-[#efe4db] bg-[#fffcfa] px-2.5 py-1.5"
            >
              <span className="text-[9px] font-bold uppercase tracking-wide text-[#a09a98]">{label}</span>
              <span className="text-sm font-semibold tabular-nums text-[#2f2a28]">{n}</span>
            </div>
          ))}
        </div>

        {/* Active campaigns */}
        <section className="mt-4 rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm sm:p-5">
          <h2 className="font-studio-serif text-lg font-semibold text-[#2f2a28]">Active Campaigns</h2>
          {activeList.length === 0 ?
            <div className="mt-4 rounded-lg border border-dashed border-[#e2d6cf] bg-[#fffdfb] px-4 py-8 text-center">
              <p className="text-sm font-semibold text-[#333232]">No active campaigns yet.</p>
              <p className="mt-1 text-xs text-[#6b6262]">
                Approved campaigns from your dashboard will appear here.
              </p>
            </div>
          : <ul className="mt-4 space-y-3">
              {activeList.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 rounded-lg border border-[#e2d6cf] bg-[#fffcfa] p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-studio-serif text-base font-semibold text-[#2f2a28]">{c.title}</span>
                      <span className="rounded-full bg-emerald-100 px-1.5 py-px text-[8px] font-bold uppercase text-emerald-950 ring-1 ring-emerald-200">
                        Active
                      </span>
                      {c.imported ?
                        <span className="rounded-full border border-sky-200 bg-sky-50 px-1.5 py-px text-[8px] font-bold uppercase text-sky-950">
                          Import
                        </span>
                      : null}
                      <span className="rounded-full bg-[#efe4db] px-1.5 py-px text-[8px] font-bold uppercase text-[#5f5654] ring-1 ring-[#d4bc8c]/35">
                        Tracking
                      </span>
                    </div>
                    <p className="text-[11px] text-[#333232]">
                      <span className="tabular-nums font-semibold">{c.opportunityCount}</span> opportunities found ·{" "}
                      <span className="tabular-nums font-semibold">{c.approvedCount}</span> approved for outreach
                    </p>
                    {c.messageApproved ?
                      <p className="text-[10px] font-semibold text-emerald-900">Message approved</p>
                    : null}
                    <p className="text-[10px] text-[#6b6262]">
                      Send scheduled: <span className="font-medium text-[#2f2a28]">{c.sendTime}</span>
                    </p>
                    <p className="text-[10px] text-[#6b6262]">
                      Filed source:{" "}
                      <span className="font-semibold text-[#333232]">{c.source}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1.5 sm:flex-col sm:items-stretch">
                    <button type="button" className={pillGold} onClick={() => setDetailId(c.id)}>
                      View Details
                    </button>
                    <button type="button" className={pill} onClick={() => handlePause(c.id)}>
                      Pause
                    </button>
                    <button
                      type="button"
                      className={pillGreen}
                      title="Preview only — no live metrics yet"
                      onClick={() => setDetailId(c.id)}
                    >
                      Results
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          }
        </section>

        <section className="mt-4 rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm sm:p-5">
          <h2 className="font-studio-serif text-lg font-semibold text-[#2f2a28]">
            Completed / Held Campaigns
          </h2>
          {heldList.length === 0 ?
            <p className="mt-2 text-[11px] text-[#6b6262]">
              Campaigns you complete, pause, or hold will appear here.
            </p>
          : <ul className="mt-4 space-y-3">
              {heldList.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 rounded-lg border border-[#e2d6cf] bg-neutral-50/80 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-studio-serif text-base font-semibold text-[#2f2a28]">{c.title}</span>
                      <span className="rounded-full bg-neutral-200 px-1.5 py-px text-[8px] font-bold uppercase text-neutral-800 ring-1 ring-neutral-300">
                        ON HOLD
                      </span>
                    </div>
                    <p className="text-[11px] text-[#333232]">
                      <span className="tabular-nums font-semibold">{c.opportunityCount}</span> opportunities found ·{" "}
                      <span className="tabular-nums font-semibold">{c.approvedCount}</span> approved for outreach
                    </p>
                    <p className="text-[10px] text-[#6b6262]">
                      Held: <span className="font-medium text-[#2f2a28]">{formatHeldAt(c.heldAt)}</span>
                    </p>
                    <p className="text-[10px] text-[#6b6262]">
                      Source: <span className="font-semibold text-[#333232]">{c.source}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1.5 sm:flex-col sm:items-stretch">
                    <button type="button" className={pillGreen} onClick={() => handleResume(c.id)}>
                      Resume
                    </button>
                    <button type="button" className={pillGold} onClick={() => setDetailId(c.id)}>
                      View Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          }
        </section>
      </div>

      <CampaignDetailModal
        open={Boolean(detailId && detailCampaign)}
        onClose={() => setDetailId(null)}
        campaign={detailCampaign}
      />
    </div>
  );
}
