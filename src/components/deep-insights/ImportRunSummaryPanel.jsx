import React, { useEffect, useMemo, useReducer } from "react";
import {
  computeImportAuditSummary,
  formatAuditKindLabel,
  readImportAudit,
} from "../../lib/deep-insights/importAudit.js";
import { DEEP_INSIGHTS_DATASET_EVENT } from "../../lib/deep-insights/storageKeys.js";

function formatWhen(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const rowCls =
  "flex min-w-0 flex-col gap-0.5 rounded-md border border-vmb-border-light/80 bg-vmb-bg-soft/25 px-2.5 py-1.5";
const rowLabel = "text-[9px] font-bold uppercase tracking-wide text-vmb-text-muted";
const rowValue = "text-[12px] font-semibold tabular-nums text-vmb-text-dark";

export default function ImportRunSummaryPanel() {
  const [, bump] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const onUpd = () => bump();
    window.addEventListener(DEEP_INSIGHTS_DATASET_EVENT, onUpd);
    return () => window.removeEventListener(DEEP_INSIGHTS_DATASET_EVENT, onUpd);
  }, []);

  const summary = useMemo(() => computeImportAuditSummary(), [bump]);
  const audit = useMemo(() => readImportAudit(), [bump]);
  const logLines = useMemo(() => [...audit.events].reverse().slice(0, 14), [audit.events]);

  return (
    <section
      className="mt-5 rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm ring-1 ring-vmb-border-light/30"
      aria-labelledby="import-run-summary-heading"
    >
      <h2
        id="import-run-summary-heading"
        className="text-sm font-semibold text-vmb-text-dark"
      >
        Import Run Summary
      </h2>
      <p className="mt-0.5 text-[11px] text-vmb-text-muted">
        What was imported, repaired, and regenerated — for a quick trust check.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className={rowCls}>
          <span className={rowLabel}>Imported files</span>
          <span className={rowValue}>{summary.importedFiles}</span>
        </div>
        <div className={rowCls}>
          <span className={rowLabel}>Normalized records</span>
          <span className={rowValue} title="Clients / appointments / transactions">
            {summary.normalizedRecords.total > 0 ?
              <span>
                {summary.normalizedRecords.total}
                <span className="ml-1 text-[10px] font-normal text-vmb-text-muted">
                  ({summary.normalizedRecords.clients}·{summary.normalizedRecords.appointments}·
                  {summary.normalizedRecords.transactions})
                </span>
              </span>
            : "—"}
          </span>
        </div>
        <div className={rowCls}>
          <span className={rowLabel}>Repairs applied</span>
          <span className={rowValue}>{summary.repairsApplied}</span>
        </div>
        <div className={rowCls}>
          <span className={rowLabel}>Signals generated</span>
          <span className={rowValue}>{summary.signalsGenerated ? "Yes" : "No"}</span>
        </div>
        <div className={rowCls}>
          <span className={rowLabel}>Campaign-ready opportunities</span>
          <span className={rowValue}>{summary.opportunityCount}</span>
        </div>
        <div className={rowCls}>
          <span className={rowLabel}>Last recalculated</span>
          <span className={`${rowValue} text-[11px]`}>{formatWhen(summary.lastRecalculated)}</span>
        </div>
      </div>

      <div className="mt-4">
        <p className={rowLabel}>Event log</p>
        {logLines.length === 0 ?
          <p className="mt-1.5 text-[11px] text-vmb-text-muted">No events yet.</p>
        : <ul className="mt-1.5 max-h-40 space-y-1 overflow-auto rounded-lg border border-vmb-border-light/70 bg-vmb-bg-soft/15 p-2 text-[11px]">
            {logLines.map((e, i) => (
              <li
                key={`${e.at}-${e.kind}-${i}`}
                className="flex flex-wrap gap-x-2 gap-y-0.5 border-b border-vmb-border-light/35 pb-1 last:border-0 last:pb-0"
              >
                <span className="shrink-0 tabular-nums text-[10px] text-vmb-text-muted">
                  {formatWhen(e.at)}
                </span>
                <span className="font-medium text-vmb-text-dark">{formatAuditKindLabel(e.kind)}</span>
                {e.detail ?
                  <span className="min-w-0 truncate text-vmb-text-muted" title={e.detail}>
                    {e.detail}
                  </span>
                : null}
                <span className="ml-auto shrink-0 text-[9px] uppercase tracking-wide text-vmb-text-muted/90">
                  {e.bucket.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        }
      </div>
    </section>
  );
}
