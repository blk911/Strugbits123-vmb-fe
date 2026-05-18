import React, { useEffect, useMemo, useState } from "react";
import { LuX } from "react-icons/lu";
import { intelligenceBtnPrimaryClass } from "../intelligence/IntelligenceLayoutShell";
import { CAMPAIGN_RISK_NOTE } from "../../config/salonBusinessDriversMock";

const secondaryBtn =
  "inline-flex items-center justify-center rounded-lg border border-vmb-border-light bg-white px-4 py-2.5 text-sm font-semibold text-vmb-text-dark shadow-sm transition hover:bg-vmb-bg-soft/80";

const ghostBtn =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-vmb-text-muted transition hover:bg-vmb-bg-soft/60 hover:text-vmb-text-dark";

/**
 * @param {{
 *   open: boolean;
 *   campaign: {
 *     id: string;
 *     title: string;
 *     why: string;
 *     messagePreview: string;
 *     sendSchedule: string;
 *     targets: Array<{
 *       id: string;
 *       name: string;
 *       lastVisit: string;
 *       service: string;
 *       spend: string;
 *       reason: string;
 *     }>;
 *   } | null;
 *   onClose: () => void;
 *   onApprove: (campaignId: string, includedClientIds: string[]) => void;
 *   onHold: (campaignId: string) => void;
 *   onEditMessage?: () => void;
 * }} props
 */
export default function CampaignReviewModal({
  open,
  campaign,
  onClose,
  onApprove,
  onHold,
  onEditMessage,
}) {
  const [rows, setRows] = useState(
    /** @type {Array<{ id: string; name: string; lastVisit: string; service: string; spend: string; reason: string; included: boolean }>} */ ([]),
  );

  useEffect(() => {
    if (!open || !campaign) return;
    setRows(
      campaign.targets.map((t) => ({
        ...t,
        included: true,
      })),
    );
  }, [open, campaign?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const includedIds = useMemo(
    () => rows.filter((r) => r.included).map((r) => r.id),
    [rows],
  );

  if (!open || !campaign) return null;

  const toggle = (id) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, included: !r.included } : r)),
    );
  };

  const handleEdit = () => {
    if (onEditMessage) onEditMessage();
    else window.alert("Message editing is preview-only in v1.");
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close campaign review"
        className="absolute inset-0 bg-zinc-950/45 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        className="relative flex max-h-[min(92vh,880px)] w-full max-w-4xl flex-col rounded-t-2xl border border-vmb-border-light bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-review-title"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-vmb-border-light px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-vmb-secondary">
              tAIkOS · Deep Foresights
            </p>
            <h2
              id="campaign-review-title"
              className="mt-1 font-studio-serif text-xl text-vmb-text-dark sm:text-2xl"
            >
              {campaign.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-vmb-text-muted">
              Why tAIkOS recommended it: {campaign.why}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-vmb-text-muted transition hover:bg-vmb-bg-soft hover:text-vmb-text-dark"
          >
            <LuX className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="overflow-hidden rounded-xl border border-vmb-border-light">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-vmb-bg-soft/80 text-[11px] font-bold uppercase tracking-wide text-vmb-text-muted">
                <tr>
                  <th className="px-3 py-2">Include</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Last visit</th>
                  <th className="px-3 py-2">Service</th>
                  <th className="px-3 py-2">Spend</th>
                  <th className="px-3 py-2">Reason selected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vmb-border-light text-vmb-text-dark">
                {rows.map((r) => (
                  <tr key={r.id} className={r.included ? "" : "bg-zinc-50/80 opacity-70"}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={r.included}
                        onChange={() => toggle(r.id)}
                        aria-label={`Include ${r.name}`}
                        className="h-4 w-4 rounded border-vmb-border-light text-vmb-secondary focus:ring-vmb-secondary/30"
                      />
                    </td>
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2 tabular-nums text-vmb-text-muted">
                      {r.lastVisit}
                    </td>
                    <td className="px-3 py-2">{r.service}</td>
                    <td className="px-3 py-2 tabular-nums">{r.spend}</td>
                    <td className="px-3 py-2 text-vmb-text-muted">{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-vmb-border-light bg-vmb-bg-soft/40 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-vmb-text-muted">
                Message preview
              </p>
              <p className="mt-2 text-sm leading-relaxed text-vmb-text-dark">
                {campaign.messagePreview}
              </p>
            </div>
            <div className="rounded-xl border border-vmb-border-light bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-vmb-text-muted">
                Send schedule
              </p>
              <p className="mt-2 text-sm leading-relaxed text-vmb-text-dark">
                {campaign.sendSchedule}
              </p>
            </div>
          </div>

          <p className="mt-4 rounded-lg border border-dashed border-amber-400/50 bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-950/90">
            <span className="font-semibold">Risk note: </span>
            {CAMPAIGN_RISK_NOTE}
          </p>
        </div>

        <footer className="flex shrink-0 flex-col gap-3 border-t border-vmb-border-light px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-vmb-text-muted">
            {includedIds.length} client{includedIds.length === 1 ? "" : "s"} selected
            for approval (preview).
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={ghostBtn} onClick={onClose}>
              Close
            </button>
            <button type="button" className={secondaryBtn} onClick={handleEdit}>
              Edit Message
            </button>
            <button
              type="button"
              className={secondaryBtn}
              onClick={() => onHold(campaign.id)}
            >
              Hold
            </button>
            <button
              type="button"
              className={intelligenceBtnPrimaryClass}
              onClick={() => onApprove(campaign.id, includedIds)}
            >
              Approve Campaign
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
