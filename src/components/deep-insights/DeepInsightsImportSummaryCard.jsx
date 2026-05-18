import React, { useCallback, useEffect, useState } from "react";
import { getImportQualityReport, importQualityTierHint } from "../../lib/deep-insights/importQuality.js";
import {
  DEEP_INSIGHTS_DATASET_EVENT,
  LS_NORMALIZED,
  LS_PARSED,
  LS_RAW_META,
  LS_SIGNALS,
  readJson,
} from "../../lib/deep-insights/storageKeys.js";

function formatImportTimestamp(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return String(iso);
  }
}

function tierLabel(confidence) {
  if (confidence === "high" || confidence === "medium" || confidence === "low") {
    return confidence.charAt(0).toUpperCase() + confidence.slice(1);
  }
  return "—";
}

/**
 * Shown after a successful import — reflects current localStorage mirror only (one active import).
 */
export default function DeepInsightsImportSummaryCard() {
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onDataset = () => refresh();
    window.addEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDataset);
    return () => window.removeEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDataset);
  }, [refresh]);

  const rawMeta = readJson(LS_RAW_META, null);
  const parsedArr = readJson(LS_PARSED, null);
  const normalized = readJson(LS_NORMALIZED, null);
  const signals = readJson(LS_SIGNALS, null);
  const quality = getImportQualityReport();

  if (!normalized && !rawMeta) return null;

  const files = Array.isArray(rawMeta?.files) ? rawMeta.files : [];
  const parsedList = Array.isArray(parsedArr) ? parsedArr : [];

  const clientsN = normalized?.clients?.length ?? 0;
  const apptsN = normalized?.appointments?.length ?? 0;
  const txnsN = normalized?.transactions?.length ?? 0;
  const oppsN = Array.isArray(signals?.opportunities) ? signals.opportunities.length : 0;
  const conf = quality?.opportunityConfidence;
  const tier = tierLabel(conf);
  const tierHint = conf ? importQualityTierHint(conf) : "";

  return (
    <div className="mt-4 rounded-lg border border-emerald-200/70 bg-emerald-50/35 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-900/90">Import summary</p>
          <p className="mt-0.5 text-[11px] font-semibold text-emerald-950">Current import only</p>
        </div>
        <p className="text-[10px] text-emerald-900/70 tabular-nums">
          {formatImportTimestamp(rawMeta?.at)}
        </p>
      </div>

      <div className="mt-3 space-y-2 text-[11px] text-vmb-text-dark">
        <div>
          <p className="font-semibold text-vmb-text-muted">Source files</p>
          {files.length ?
            <ul className="mt-1 list-inside list-disc text-vmb-text-dark">
              {files.map((f) => (
                <li key={f.id ?? f.name}>
                  <span className="font-medium">{f.name}</span>
                  {f.kind ? <span className="text-vmb-text-muted"> · {String(f.kind).toUpperCase()}</span> : null}
                </li>
              ))}
            </ul>
          :
            <p className="mt-1 text-vmb-text-muted">—</p>
          }
        </div>

        <div>
          <p className="font-semibold text-vmb-text-muted">Parsed rows by file</p>
          {parsedList.length ?
            <ul className="mt-1 space-y-0.5">
              {parsedList.map((p) => (
                <li key={p.fileId ?? p.fileName} className="flex justify-between gap-2 tabular-nums">
                  <span className="min-w-0 truncate font-medium">{p.fileName}</span>
                  <span className="shrink-0 text-vmb-text-muted">{p.rowCount ?? "—"} rows</span>
                </li>
              ))}
            </ul>
          : (
            <p className="mt-1 text-vmb-text-muted">—</p>
          )}
        </div>

        <dl className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          <div className="flex justify-between gap-2 rounded-md border border-vmb-border-light/80 bg-white/80 px-2 py-1.5 tabular-nums">
            <dt className="text-vmb-text-muted">Normalized clients</dt>
            <dd className="font-semibold">{clientsN}</dd>
          </div>
          <div className="flex justify-between gap-2 rounded-md border border-vmb-border-light/80 bg-white/80 px-2 py-1.5 tabular-nums">
            <dt className="text-vmb-text-muted">Normalized appointments</dt>
            <dd className="font-semibold">{apptsN}</dd>
          </div>
          <div className="flex justify-between gap-2 rounded-md border border-vmb-border-light/80 bg-white/80 px-2 py-1.5 tabular-nums">
            <dt className="text-vmb-text-muted">Normalized transactions</dt>
            <dd className="font-semibold">{txnsN}</dd>
          </div>
          <div className="flex justify-between gap-2 rounded-md border border-vmb-border-light/80 bg-white/80 px-2 py-1.5 tabular-nums">
            <dt className="text-vmb-text-muted">Generated opportunities</dt>
            <dd className="font-semibold">{oppsN}</dd>
          </div>
        </dl>

        <div className="rounded-md border border-vmb-border-light/80 bg-white/80 px-2 py-1.5">
          <p className="text-[10px] font-bold uppercase text-vmb-text-muted">Confidence tier</p>
          <p className="mt-0.5 font-semibold text-vmb-text-dark">{tier}</p>
          {tierHint ?
            <p className="mt-1 text-[10px] leading-snug text-vmb-text-muted">{tierHint}</p>
          : null}
        </div>
      </div>
    </div>
  );
}
