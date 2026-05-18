import React, { useMemo, useReducer, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DEEP_INSIGHTS_DATASET_EVENT,
  hasImportedDataset,
} from "../../../lib/deep-insights/storageKeys.js";
import {
  getImportQualityReport,
  importQualityTierHint,
} from "../../../lib/deep-insights/importQuality.js";
import { readJson, LS_NORMALIZED, LS_PARSED, LS_SIGNALS } from "../../../lib/deep-insights/storageKeys.js";
import {
  getImportCapabilities,
  IMPORT_CAPABILITY_LABELS,
} from "../../../lib/deep-insights/importCapabilities.js";

function tierStyles(confidence) {
  if (confidence === "high") {
    return {
      ring: "ring-emerald-200/80",
      badge: "border-emerald-300 bg-emerald-50 text-emerald-950",
      label: "High",
    };
  }
  if (confidence === "medium") {
    return {
      ring: "ring-amber-200/90",
      badge: "border-amber-300 bg-amber-50 text-amber-950",
      label: "Medium",
    };
  }
  return {
    ring: "ring-red-200/80",
    badge: "border-red-200 bg-red-50 text-red-950",
    label: "Low",
  };
}

const chipCls =
  "rounded-lg border border-vmb-border-light bg-vmb-bg-soft/40 px-2.5 py-1.5 text-[11px] text-vmb-text-dark shadow-sm";

export default function ImportQualityPanel() {
  const [, bump] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const onUpd = () => bump();
    window.addEventListener(DEEP_INSIGHTS_DATASET_EVENT, onUpd);
    return () => window.removeEventListener(DEEP_INSIGHTS_DATASET_EVENT, onUpd);
  }, []);

  const report = useMemo(() => {
    if (!hasImportedDataset()) return null;
    return getImportQualityReport();
  }, [bump]);

  const capabilities = useMemo(() => {
    if (!hasImportedDataset()) return null;
    const normalized = readJson(LS_NORMALIZED, null);
    const parsed = readJson(LS_PARSED, null);
    const pack = readJson(LS_SIGNALS, null);
    if (!normalized) return null;
    return (
      pack?.capabilities ?? getImportCapabilities(normalized, Array.isArray(parsed) ? parsed : [], pack)
    );
  }, [bump]);

  if (!report) return null;

  const styles = tierStyles(report.opportunityConfidence);
  const oppLabel =
    report.opportunityConfidence === "high" ? "High"
    : report.opportunityConfidence === "medium" ? "Medium"
    : "Low";

  return (
    <section
      className={`rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm ring-1 ${styles.ring} sm:p-5`}
      aria-labelledby="import-quality-heading"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="import-quality-heading"
            className="text-sm font-semibold text-vmb-text-dark sm:text-base"
          >
            Import Quality
          </h2>
          <p className="mt-0.5 text-xs text-vmb-text-muted">
            How confidently tAIkOS can read this salon data.
          </p>
        </div>
        <span
          className={`inline-flex w-fit shrink-0 rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${styles.badge}`}
        >
          Opportunity {styles.label}
        </span>
      </div>

      <p className="mt-3 text-[11px] leading-snug text-vmb-text-dark">
        {importQualityTierHint(report.opportunityConfidence)}
      </p>

      {capabilities ?
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wide text-vmb-text-muted">Coverage</span>
          {(
            [
              ["revenue", "Revenue"],
              ["clients", "Clients"],
              ["services", "Services"],
              ["schedule", "Schedule"],
              ["outreach", "Outreach"],
            ]
          ).map(([key, label]) => {
            const level = capabilities[key];
            const lbl = IMPORT_CAPABILITY_LABELS[level] ?? level;
            const tone =
              level === "available" ? "border-emerald-200/90 bg-emerald-50/80 text-emerald-950"
              : level === "limited" ? "border-amber-200/90 bg-amber-50/90 text-amber-950"
              : "border-vmb-border-light bg-vmb-bg-soft/50 text-vmb-text-muted";
            return (
              <span
                key={key}
                className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${tone}`}
              >
                {label}:{" "}
                <span className="font-bold">{lbl}</span>
              </span>
            );
          })}
        </div>
      : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <div className={chipCls}>
          <span className="font-bold text-vmb-text-muted">Files parsed</span>
          <span className="mt-0.5 block tabular-nums font-semibold">
            {report.filesParsed}/{report.filesTotal}
          </span>
        </div>
        <div className={chipCls}>
          <span className="font-bold text-vmb-text-muted">Clients mapped</span>
          <span className="mt-0.5 block tabular-nums font-semibold">{report.clientsMapped}</span>
        </div>
        <div className={chipCls}>
          <span className="font-bold text-vmb-text-muted">Appointments mapped</span>
          <span className="mt-0.5 block tabular-nums font-semibold">{report.appointmentsMapped}</span>
        </div>
        <div className={chipCls}>
          <span className="font-bold text-vmb-text-muted">Transactions mapped</span>
          <span className="mt-0.5 block tabular-nums font-semibold">{report.transactionsMapped}</span>
        </div>
        <div className={chipCls}>
          <span className="font-bold text-vmb-text-muted">Service classification</span>
          <span className="mt-0.5 block tabular-nums font-semibold">{report.classificationPct}%</span>
        </div>
        <div className={chipCls}>
          <span className="font-bold text-vmb-text-muted">Opportunity confidence</span>
          <span className="mt-0.5 block font-semibold">{oppLabel}</span>
        </div>
      </div>

      {report.qualityWarnings.length > 0 ?
        <div className="mt-4 rounded-lg border border-vmb-pending/25 bg-vmb-pending/5 px-3 py-2">
          <p className="text-[9px] font-bold uppercase tracking-wide text-vmb-text-muted">Warnings</p>
          <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-[10px] leading-snug text-vmb-text-dark">
            {report.qualityWarnings.slice(0, 8).map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          {report.opportunityConfidence === "low" ?
            <p className="mt-2 text-[10px] text-vmb-text-muted">
              Improve mapping on Data Capture, then re-run normalization to unlock campaigns.
            </p>
          : null}
          {report.opportunityConfidence === "low" ?
            <Link
              to="/salon-owner/deep-insights/data-capture#import-review"
              className="mt-2 inline-flex text-[10px] font-semibold text-vmb-secondary underline-offset-2 hover:underline"
            >
              Review mapping
            </Link>
          : null}
        </div>
      : report.opportunityConfidence === "low" ?
        <div className="mt-4 rounded-lg border border-vmb-pending/25 bg-vmb-pending/5 px-3 py-2">
          <p className="text-[10px] text-vmb-text-muted">
            Overall coverage is thin — review exports and field mapping before trusting campaigns.
          </p>
          <Link
            to="/salon-owner/deep-insights/data-capture#import-review"
            className="mt-2 inline-flex text-[10px] font-semibold text-vmb-secondary underline-offset-2 hover:underline"
          >
            Review mapping
          </Link>
        </div>
      : null}
    </section>
  );
}
