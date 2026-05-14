import React, { useEffect } from "react";
import { LuX } from "react-icons/lu";
import { intelligenceBtnPrimaryClass } from "../intelligence/IntelligenceLayoutShell";

const badgeClass = {
  Revenue: "border-amber-500/40 bg-amber-500/10 text-amber-800",
  Retention: "border-vmb-secondary/40 bg-vmb-secondary/10 text-vmb-secondary",
  Referral: "border-sky-500/40 bg-sky-500/10 text-sky-900",
  Schedule: "border-violet-500/40 bg-violet-500/10 text-violet-900",
  "VMB Invite": "border-vmb-gold/50 bg-vmb-gold/15 text-vmb-text-dark",
};

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   title: string;
 *   signal: string;
 *   context: string;
 *   opportunity: string;
 *   recommendedAction: string;
 *   evidenceRows: Array<{
 *     id: string;
 *     client: string;
 *     lastVisit: string;
 *     service: string;
 *     spend: string;
 *     provider: string;
 *     opportunityScore: string;
 *     status: string;
 *   }>;
 *   actions: Array<{ id: string; label: string }>;
 *   type: string;
 *   humanContextPrompt?: string;
 * }} props
 */
export default function OpportunityModal({
  open,
  onClose,
  title,
  signal,
  context,
  opportunity,
  recommendedAction,
  evidenceRows,
  actions,
  type,
  humanContextPrompt,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const badgeKey = type in badgeClass ? type : "Retention";
  const badgeStyle = badgeClass[/** @type {keyof typeof badgeClass} */ (badgeKey)];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close opportunity"
        className="absolute inset-0 bg-zinc-950/45 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />
      <div
        className="relative flex max-h-[min(92vh,900px)] w-full max-w-4xl flex-col rounded-t-2xl border border-vmb-border-light bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)] opacity-100 transition-opacity duration-200 sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="opportunity-modal-title"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-vmb-border-light px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${badgeStyle}`}
              >
                {type}
              </span>
            </div>
            <h2
              id="opportunity-modal-title"
              className="mt-2 font-semibold text-lg text-vmb-text-dark sm:text-xl"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-vmb-text-muted transition hover:bg-vmb-bg-soft hover:text-vmb-text-dark"
            aria-label="Close"
          >
            <LuX className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="space-y-4 rounded-xl border border-vmb-border-light bg-vmb-bg-soft/40 p-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-muted">
                Signal
              </p>
              <p className="mt-1 text-sm leading-relaxed text-vmb-text-dark">{signal}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-muted">
                Why it matters
              </p>
              <p className="mt-1 text-sm leading-relaxed text-vmb-text-dark">{context}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-muted">
                Opportunity
              </p>
              <p className="mt-1 text-sm leading-relaxed text-vmb-text-dark">{opportunity}</p>
            </div>
            <div className="rounded-lg border border-vmb-secondary/25 bg-white px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-secondary">
                Recommended next move
              </p>
              <p className="mt-1 text-sm font-semibold text-vmb-text-dark">
                {recommendedAction}
              </p>
            </div>
          </div>

          {humanContextPrompt ?
            <div className="mt-4 rounded-xl border border-dashed border-vmb-gold/55 bg-vmb-gold/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-dark">
                Human context prompt
              </p>
              <p className="mt-1 text-xs leading-relaxed text-vmb-text-dark">
                {humanContextPrompt}
              </p>
              <p className="mt-2 text-[10px] text-vmb-text-muted">
                Not a discount — new relationship data that improves future opportunity
                quality.
              </p>
            </div>
          : null}

          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-muted">
              Evidence
            </p>
            <div className="mt-2 overflow-x-auto rounded-lg border border-vmb-border-light">
              <table className="w-full min-w-[720px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-vmb-border-light bg-vmb-bg-soft/60">
                    <th className="px-2 py-2 font-bold text-vmb-text-muted">Client</th>
                    <th className="px-2 py-2 font-bold text-vmb-text-muted">Last visit</th>
                    <th className="px-2 py-2 font-bold text-vmb-text-muted">Service</th>
                    <th className="px-2 py-2 font-bold text-vmb-text-muted">Spend</th>
                    <th className="px-2 py-2 font-bold text-vmb-text-muted">Provider</th>
                    <th className="px-2 py-2 font-bold text-vmb-text-muted">
                      Opp. score
                    </th>
                    <th className="px-2 py-2 font-bold text-vmb-text-muted">Status</th>
                    <th className="px-2 py-2 font-bold text-vmb-text-muted whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {evidenceRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-vmb-border-light/80 hover:bg-vmb-bg-soft/30"
                    >
                      <td className="px-2 py-2 font-medium text-vmb-text-dark">
                        {row.client}
                      </td>
                      <td className="px-2 py-2 text-vmb-text-muted">{row.lastVisit}</td>
                      <td className="px-2 py-2 text-vmb-text-dark">{row.service}</td>
                      <td className="px-2 py-2 tabular-nums text-vmb-text-dark">
                        {row.spend}
                      </td>
                      <td className="px-2 py-2 text-vmb-text-muted">{row.provider}</td>
                      <td className="px-2 py-2 tabular-nums font-semibold text-vmb-secondary">
                        {row.opportunityScore}
                      </td>
                      <td className="max-w-[140px] px-2 py-2 text-vmb-text-muted">
                        {row.status}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            className="rounded border border-vmb-border-light bg-white px-1.5 py-0.5 text-[10px] font-semibold text-vmb-text-dark transition hover:border-vmb-secondary/50"
                          >
                            Invite
                          </button>
                          <button
                            type="button"
                            className="rounded border border-vmb-border-light bg-white px-1.5 py-0.5 text-[10px] font-semibold text-vmb-text-dark transition hover:border-vmb-secondary/50"
                          >
                            Email
                          </button>
                          <button
                            type="button"
                            className="rounded border border-vmb-border-light bg-white px-1.5 py-0.5 text-[10px] font-semibold text-vmb-text-dark transition hover:border-vmb-secondary/50"
                          >
                            Hold
                          </button>
                          <button
                            type="button"
                            className="rounded border border-vmb-border-light bg-white px-1.5 py-0.5 text-[10px] font-semibold text-vmb-text-dark transition hover:border-vmb-secondary/50"
                          >
                            Note
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {actions.length ?
            <div className="mt-4 flex flex-wrap gap-2">
              {actions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="rounded-lg border border-vmb-secondary/35 bg-vmb-secondary/10 px-3 py-1.5 text-[11px] font-semibold text-vmb-text-dark transition hover:bg-vmb-secondary/18"
                >
                  {a.label}
                </button>
              ))}
            </div>
          : null}
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-vmb-border-light bg-vmb-bg-soft/30 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-vmb-border-light bg-white px-3 py-2 text-xs font-semibold text-vmb-text-dark shadow-sm transition hover:bg-vmb-bg-soft"
          >
            Close
          </button>
          <button
            type="button"
            className="rounded-lg border border-vmb-border-light bg-white px-3 py-2 text-xs font-semibold text-vmb-text-dark shadow-sm transition hover:bg-vmb-bg-soft"
          >
            Save opportunity
          </button>
          <button
            type="button"
            className="rounded-lg border border-vmb-border-light bg-white px-3 py-2 text-xs font-semibold text-vmb-text-dark shadow-sm transition hover:bg-vmb-bg-soft"
          >
            Build campaign
          </button>
          <button
            type="button"
            className={`${intelligenceBtnPrimaryClass} px-4 py-2 text-xs`}
          >
            Take action
          </button>
        </footer>
      </div>
    </div>
  );
}
