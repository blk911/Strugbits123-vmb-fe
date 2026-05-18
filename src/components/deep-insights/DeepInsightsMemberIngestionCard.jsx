import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuCloudUpload, LuLoaderCircle, LuX } from "react-icons/lu";
import {
  DEEP_DIG_SAMPLE_CSV_URLS,
  DEEP_DIG_SAMPLE_PDF_MANIFEST,
} from "../../config/deepDigSampleManifest.js";
import { parseCsvDocument } from "../../lib/deep-insights/csvParser.js";
import { detectFileMeta } from "../../lib/deep-insights/detectFileMeta.js";
import { buildColumnSchema } from "../../lib/deep-insights/schemaInspector.js";
import { ALL_CANONICAL_OPTIONS, suggestCanonicalField } from "../../lib/deep-insights/mappingEngine.js";
import { appendImportAuditEvent } from "../../lib/deep-insights/importAudit.js";
import {
  createImportRun,
  getPersistedImportRunId,
  normalizeImportRun,
  parseImportRun,
  prepareDeepInsightsImportReplace,
  saveFieldMappings,
  uploadImportFiles,
} from "../../lib/deep-insights/deepInsightsApi.js";
import DeepInsightsImportSummaryCard from "./DeepInsightsImportSummaryCard.jsx";
import { normalizeSalonData } from "../../lib/deep-insights/normalizeSalonData.js";
import { generateSalonSignals } from "../../lib/deep-insights/generateSalonSignals.js";
import {
  LS_RAW_META,
  LS_PARSED,
  LS_MAPPING,
  LS_NORMALIZED,
  LS_SIGNALS,
  getDefaultDeepInsightsSalonId,
  notifyDeepInsightsDatasetChanged,
  writeJson,
} from "../../lib/deep-insights/storageKeys.js";

function pulseRing(active) {
  return [
    "scroll-mt-24 rounded-lg transition-[box-shadow] duration-300",
    active ? "ring-2 ring-vmb-secondary ring-offset-2 ring-offset-white" : "",
  ].join(" ");
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileKindFromName(name) {
  const n = name.toLowerCase();
  if (n.endsWith(".pdf")) return "pdf";
  if (n.endsWith(".csv")) return "csv";
  return "other";
}

function mappingWarnings(mapping, rt) {
  const vals = Object.values(mapping);
  const w = [];
  if (!vals.some((v) => v === "client_name" || v === "email" || v === "first_name"))
    w.push("no client field found");
  if (!vals.some((v) => String(v).includes("date") || v === "created_at"))
    w.push("no date field found");
  if (
    !vals.some(
      (v) => String(v).includes("total") || String(v).includes("amount") || v === "total_collected",
    )
  )
    w.push("no amount field found");
  if (
    !vals.some(
      (v) =>
        v === "service_name" ||
        v === "item_descriptor" ||
        v === "product_name",
    )
  )
    w.push("no service field found");
  if (rt === "unknown") w.push("unknown report type");
  return w;
}

/**
 * @param {{
 *   browseButtonClass: string;
 *   uploadInputRef: React.RefObject<HTMLInputElement | null>;
 *   uploadDropzoneRef?: React.RefObject<HTMLDivElement | null>;
 *   highlightUpload?: boolean;
 *   compactDropzone?: boolean;
 * }} props
 */
export default function DeepInsightsMemberIngestionCard({
  browseButtonClass,
  uploadInputRef,
  uploadDropzoneRef,
  highlightUpload = false,
  compactDropzone = false,
}) {
  const [items, setItems] = useState(/** @type {any[]} */ ([]));
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [mappingsByFile, setMappingsByFile] = useState(
    /** @type {Record<string, Record<string, string>>} */ ({}),
  );
  const [mappingLocked, setMappingLocked] = useState(false);
  const [done, setDone] = useState(false);

  const csvItems = useMemo(() => items.filter((x) => x.kind === "csv"), [items]);
  const hasSelectedCsv = csvItems.some((x) => x.status === "selected");
  const parsedList = useMemo(
    () => items.filter((x) => x.kind === "csv" && x.status === "parsed" && x.parsed),
    [items],
  );

  const addFilesFromList = useCallback(
    (list) => {
      if (!list?.length || busy || done) return;
      const next = [];
      for (const f of Array.from(list)) {
        const kind = fileKindFromName(f.name);
        if (kind === "other") continue;
        next.push({
          id: crypto.randomUUID(),
          file: f,
          name: f.name,
          size: f.size,
          kind,
          status: kind === "pdf" ? "reference_only" : "selected",
        });
      }
      if (!next.length) return;
      setItems((prev) => {
        const seen = new Set(prev.map((p) => `${p.name}:${p.size}`));
        const merged = [...prev];
        for (const it of next) {
          const k = `${it.name}:${it.size}`;
          if (!seen.has(k)) {
            seen.add(k);
            merged.push(it);
          }
        }
        return merged;
      });
      setStep(1);
      setMappingLocked(false);
      setDone(false);
    },
    [busy, done],
  );

  const removeAt = useCallback(
    (idx) => {
      if (busy || done) return;
      const it = items[idx];
      setItems((prev) => prev.filter((_, i) => i !== idx));
      if (it) {
        setMappingsByFile((m) => {
          const { [it.id]: _, ...rest } = m;
          return rest;
        });
      }
      setStep(1);
      setMappingLocked(false);
    },
    [busy, done, items],
  );

  const loadSamples = useCallback(async () => {
    if (busy || done) return;
    setBusy(true);
    try {
      await prepareDeepInsightsImportReplace();
      const loaded = [];
      for (const url of DEEP_DIG_SAMPLE_CSV_URLS) {
        const res = await fetch(url);
        const blob = await res.blob();
        const name = decodeURIComponent(url.split("/").pop() || "sample.csv");
        const file = new File([blob], name, { type: "text/csv" });
        loaded.push({
          id: crypto.randomUUID(),
          file,
          name,
          size: file.size,
          kind: "csv",
          status: "selected",
        });
      }
      for (const p of DEEP_DIG_SAMPLE_PDF_MANIFEST) {
        loaded.push({
          id: crypto.randomUUID(),
          file: null,
          name: p.name,
          size: 0,
          kind: "pdf",
          status: "reference_only",
        });
      }
      setItems(loaded);
      setMappingsByFile({});
      setStep(1);
      setMappingLocked(false);
      setDone(false);
    } finally {
      setBusy(false);
    }
  }, [busy, done]);

  const runInspect = useCallback(async () => {
    if (busy || done) return;
    setBusy(true);
    try {
      await prepareDeepInsightsImportReplace();
      setMappingsByFile({});
      const csvSelected = items.filter(
        (it) => it.kind === "csv" && it.status === "selected" && it.file,
      );
      if (csvSelected.length > 0) {
        try {
          const salonId = getDefaultDeepInsightsSalonId();
          const cr = await createImportRun({ salonId });
          const runId = cr.importRun?.id;
          if (runId) {
            await uploadImportFiles(
              runId,
              csvSelected.map((it) => it.file),
            );
            const pr = await parseImportRun(runId);
            if (Array.isArray(pr.items) && pr.items.length > 0) {
              const pdfs = items.filter((it) => it.kind === "pdf");
              setItems([...pdfs, ...pr.items]);
              setMappingsByFile(
                pr.mappingsByFile && typeof pr.mappingsByFile === "object" ? { ...pr.mappingsByFile } : {},
              );
              setStep(2);
              setMappingLocked(false);
              return;
            }
          }
        } catch {
          /* fall through to local inspect */
        }
      }

      const nextItems = [];
      const mapInit = /** @type {Record<string, Record<string, string>>} */ ({});

      for (const it of items) {
        if (it.kind === "pdf") {
          nextItems.push(it);
          continue;
        }
        if (it.kind !== "csv" || !it.file) {
          nextItems.push(it);
          continue;
        }
        if (it.status !== "selected") {
          nextItems.push(it);
          continue;
        }
        const text = await it.file.text();
        const parsed = parseCsvDocument(text, { maxRows: 25000 });
        const detection = detectFileMeta(it.name, parsed.headers);
        const schemas = parsed.headers.map((h) => ({
          ...buildColumnSchema(h, parsed.rows, 3),
          suggestedCanonical: suggestCanonicalField(h, detection.reportType).field,
        }));
        const row = {
          ...it,
          status: "parsed",
          parsed,
          detection,
          schemas,
        };
        nextItems.push(row);
        const m = {};
        for (const s of schemas) {
          m[s.column] = s.suggestedCanonical || "ignore";
        }
        mapInit[it.id] = m;
      }

      setItems(nextItems);
      setMappingsByFile(mapInit);
      setStep(2);
      setMappingLocked(false);
      const parsedCount = nextItems.filter((x) => x.status === "parsed").length;
      appendImportAuditEvent({
        bucket: "import_complete",
        kind: "file_uploaded",
        detail: `${parsedCount} file(s) inspected`,
      });
    } finally {
      setBusy(false);
    }
  }, [items, busy, done]);

  const runNormalize = useCallback(async () => {
    const parsedFiles = parsedList.map((it) => ({
      fileId: it.id,
      fileName: it.name,
      provider: it.detection?.provider ?? "unknown",
      reportType: it.detection?.reportType ?? "unknown",
      headers: it.parsed.headers,
      rows: it.parsed.rows,
    }));

    const runId = getPersistedImportRunId();
    if (runId) {
      try {
        await saveFieldMappings(runId, mappingsByFile);
        await normalizeImportRun(runId);
        setDone(true);
        setStep(5);
        return;
      } catch {
        /* local fallback */
      }
    }

    const normalized = normalizeSalonData({
      parsedFiles,
      mappingsByFile,
      salonId: "local-preview-salon",
    });
    const signalsPack = generateSalonSignals(normalized);

    writeJson(LS_RAW_META, {
      files: items.map((i) => ({
        id: i.id,
        name: i.name,
        kind: i.kind,
        status: i.status,
        size: i.size,
      })),
      at: new Date().toISOString(),
    });
    writeJson(
      LS_PARSED,
      parsedFiles.map((p) => ({
        fileId: p.fileId,
        fileName: p.fileName,
        rowCount: parsedList.find((x) => x.id === p.fileId)?.parsed?.rowCount,
        columnCount: p.headers.length,
        provider: p.provider,
        reportType: p.reportType,
      })),
    );
    writeJson(LS_MAPPING, mappingsByFile);
    writeJson(LS_NORMALIZED, normalized);
    writeJson(LS_SIGNALS, signalsPack);
    notifyDeepInsightsDatasetChanged();

    const cN = normalized.clients?.length ?? 0;
    const aN = normalized.appointments?.length ?? 0;
    const tN = normalized.transactions?.length ?? 0;
    appendImportAuditEvent({
      bucket: "import_complete",
      kind: "import_complete",
      detail: `${cN} clients · ${aN} appts · ${tN} txns`,
    });
    appendImportAuditEvent({
      bucket: "import_complete",
      kind: "signals_regenerated",
      detail: `${signalsPack.opportunities?.length ?? 0} campaign-ready opportunities`,
    });

    setDone(true);
    setStep(5);
  }, [items, parsedList, mappingsByFile]);

  const startNewImport = useCallback(async () => {
    const ok = window.confirm(
      "Starting a new import will replace the current imported dataset and imported campaign recommendations.",
    );
    if (!ok) return;
    setBusy(true);
    try {
      await prepareDeepInsightsImportReplace();
      setItems([]);
      setMappingsByFile({});
      setStep(1);
      setMappingLocked(false);
      setDone(false);
      notifyDeepInsightsDatasetChanged();
    } finally {
      setBusy(false);
    }
  }, []);

  const inputsLocked = busy || done;
  const dzMin = compactDropzone ? "min-h-[100px]" : "min-h-[168px]";
  const iconSz = compactDropzone ? "h-8 w-8" : "h-11 w-11";
  const textSz = compactDropzone ? "text-xs" : "text-sm";

  const primaryLabel = useMemo(() => {
    if (done) return "View Analytics";
    if (step >= 5) return "View Analytics";
    if (step === 4 && mappingLocked) return "Normalize Data";
    if (step === 4) return "Confirm Mapping";
    if (step === 3) return "Continue to Review";
    if (step === 2) return "Continue to Mapping";
    if (hasSelectedCsv) return "Inspect Files";
    return "Select Files";
  }, [step, hasSelectedCsv, mappingLocked, done]);

  const onPrimary = () => {
    if (done || step >= 5) return;
    if (step === 1) {
      if (!hasSelectedCsv) uploadInputRef.current?.click();
      else void runInspect();
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      setStep(4);
      return;
    }
    if (step === 4) {
      if (!mappingLocked) {
        setMappingLocked(true);
        appendImportAuditEvent({
          bucket: "import_complete",
          kind: "mapping_confirmed",
          detail: "Field mapping locked",
        });
        return;
      }
      void runNormalize();
    }
  };

  const stepPill = (n, label) => (
    <div
      className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
        step >= n ?
          "border-vmb-secondary/40 bg-vmb-secondary/10 text-vmb-text-dark"
        : "border-vmb-border-light bg-white text-vmb-text-muted"
      }`}
    >
      <span className="tabular-nums">{n}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );

  return (
    <>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {stepPill(1, "Files")}
        {stepPill(2, "Detect")}
        {stepPill(3, "Map")}
        {stepPill(4, "Review")}
        {stepPill(5, "Signals")}
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        accept=".csv,.pdf,text/csv,application/pdf"
        className="sr-only"
        multiple
        tabIndex={-1}
        disabled={inputsLocked}
        onChange={(e) => {
          if (inputsLocked) return;
          addFilesFromList(e.target.files);
          e.target.value = "";
        }}
      />

      {step === 1 && !done ?
        <div
          ref={uploadDropzoneRef}
          className={`mt-3 flex ${dzMin} flex-col items-center justify-center rounded-xl border-2 border-dashed border-vmb-border-light bg-white px-3 py-6 transition hover:border-vmb-secondary/45 hover:bg-vmb-bg-soft/30 ${inputsLocked ? "pointer-events-none opacity-50" : ""} ${pulseRing(!!highlightUpload && !inputsLocked)}`}
          onDrop={(e) => {
            if (inputsLocked) return;
            e.preventDefault();
            e.stopPropagation();
            addFilesFromList(e.dataTransfer?.files);
          }}
          onDragOver={(e) => {
            if (inputsLocked) return;
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = "copy";
          }}
          onDragEnter={(e) => {
            if (inputsLocked) return;
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <LuCloudUpload className={`${iconSz} text-vmb-secondary`} aria-hidden />
          <span className={`mt-2 text-center font-semibold text-vmb-text-dark ${textSz}`}>
            Drop CSV / PDF here
          </span>
          <span className="mt-1 text-center text-[11px] text-vmb-text-muted">
            CSV parsed · PDF reference only
          </span>
        </div>
      : null}

      {items.length ?
        <ul className="mt-2 max-h-36 space-y-1.5 overflow-y-auto rounded-lg border border-vmb-border-light bg-vmb-bg-soft/20 p-2">
          {items.map((it, index) => (
            <li
              key={it.id}
              className="flex items-start gap-2 rounded-md bg-white px-2 py-1.5 text-xs shadow-sm"
            >
              <span className="min-w-0 flex-1 truncate font-medium text-vmb-text-dark">{it.name}</span>
              <span className="shrink-0 text-vmb-text-muted">{formatFileSize(it.size)}</span>
              <span className="shrink-0 rounded px-1 text-[9px] font-bold uppercase text-vmb-secondary">
                {it.status === "parsed" ? "parsed"
                : it.status === "reference_only" ? "pdf ref"
                : it.kind === "pdf" ? "pdf"
                : "selected"}
              </span>
              {!done ?
                <button
                  type="button"
                  className="shrink-0 rounded p-0.5 text-vmb-text-muted transition hover:bg-vmb-bg-soft hover:text-vmb-text-dark disabled:opacity-40"
                  aria-label={`Remove ${it.name}`}
                  disabled={busy}
                  onClick={() => removeAt(index)}
                >
                  <LuX className="h-4 w-4" aria-hidden />
                </button>
              : null}
            </li>
          ))}
        </ul>
      : null}

      <button
        type="button"
        disabled={busy}
        onClick={loadSamples}
        className="mt-2 w-full rounded-lg border border-dashed border-vmb-secondary/35 bg-vmb-secondary/5 px-3 py-2 text-[11px] font-semibold text-vmb-secondary transition hover:bg-vmb-secondary/12 disabled:opacity-50"
      >
        Load Deep Dig Sample Files
      </button>

      {step >= 2 && parsedList.length ?
        <div className="mt-4 rounded-lg border border-vmb-border-light bg-white p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-muted">
            Detected files
          </p>
          <ul className="mt-2 space-y-2 text-[11px]">
            {items.map((it) => (
              <li key={it.id} className="border-b border-vmb-border-light/80 pb-2 last:border-0">
                <div className="font-medium text-vmb-text-dark">{it.name}</div>
                <div className="mt-0.5 grid gap-0.5 text-vmb-text-muted sm:grid-cols-2">
                  <span>Type: {it.kind.toUpperCase()}</span>
                  {it.parsed ?
                    <>
                      <span>Rows: {it.parsed.rowCount}</span>
                      <span>Columns: {it.parsed.columnCount}</span>
                    </>
                  : null}
                  {it.detection ?
                    <>
                      <span>Provider: {it.detection.provider}</span>
                      <span>Report: {it.detection.reportType}</span>
                      <span>Confidence: {(it.detection.confidence * 100).toFixed(0)}%</span>
                    </>
                  : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      : null}

      {step >= 3 && parsedList.length ?
        <div className="mt-4 max-h-[320px] space-y-3 overflow-y-auto">
          {parsedList.map((it) => (
            <div key={it.id} className="rounded-lg border border-vmb-border-light bg-white p-2.5">
              <p className="text-[10px] font-bold uppercase text-vmb-text-muted">Schema · {it.name}</p>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-vmb-border-light text-vmb-text-muted">
                      <th className="py-1 pr-2">Column</th>
                      <th className="py-1 pr-2">Samples</th>
                      <th className="py-1 pr-2">Type</th>
                      <th className="py-1">Map</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(it.schemas ?? []).map((s) => (
                      <tr key={s.column} className="border-b border-vmb-border-light/60">
                        <td className="py-1 pr-2 font-medium text-vmb-text-dark">{s.column}</td>
                        <td className="max-w-[140px] truncate py-1 pr-2 text-vmb-text-muted">
                          {(s.sampleValues ?? []).join(" · ")}
                        </td>
                        <td className="py-1 pr-2">{s.detectedType}</td>
                        <td className="py-1">
                          <select
                            className="max-w-[160px] rounded border border-vmb-border-light bg-white px-1 py-0.5 text-[10px] text-vmb-text-dark"
                            disabled={mappingLocked || done}
                            value={mappingsByFile[it.id]?.[s.column] ?? "ignore"}
                            onChange={(e) => {
                              const v = e.target.value;
                              setMappingsByFile((prev) => ({
                                ...prev,
                                [it.id]: { ...(prev[it.id] ?? {}), [s.column]: v },
                              }));
                            }}
                          >
                            {ALL_CANONICAL_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.entity} · {o.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      : null}

      {step >= 4 && parsedList.length ?
        <div className="mt-4 rounded-lg border border-amber-200/60 bg-amber-50/40 p-3">
          <p className="text-[10px] font-bold uppercase text-amber-900">Mapping review</p>
          <ul className="mt-2 space-y-2 text-[11px]">
            {parsedList.map((it) => {
              const m = mappingsByFile[it.id] ?? {};
              const mappedN = Object.values(m).filter((x) => x !== "ignore").length;
              const unmappedN = Object.keys(m).filter((k) => m[k] === "ignore").length;
              const warns = mappingWarnings(m, it.detection?.reportType ?? "unknown");
              return (
                <li key={it.id} className="rounded border border-amber-100/80 bg-white/80 px-2 py-1.5">
                  <div className="font-semibold text-vmb-text-dark">{it.name}</div>
                  <div className="text-vmb-text-muted">
                    Report: {it.detection?.reportType} · mapped {mappedN} · unmapped {unmappedN}
                  </div>
                  {warns.length ?
                    <ul className="mt-1 list-inside list-disc text-amber-900">
                      {warns.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  : (
                    <p className="mt-1 text-vmb-success">No blocking warnings</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      : null}

      {import.meta.env.DEV ?
        <div className="mt-4 rounded border border-vmb-border-light bg-neutral-50 px-2 py-2 font-mono text-[9px] text-neutral-700">
          <p className="font-bold uppercase text-neutral-500">Import debug</p>
          <p>files: {items.length} · parsed CSV: {parsedList.length}</p>
          <p>step: {step} · mapping locked: {String(mappingLocked)} · done: {String(done)}</p>
        </div>
      : null}

      {done ? <DeepInsightsImportSummaryCard /> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {done ?
          <>
            <Link
              to="/salon-owner/deep-insights/analytics"
              className={`flex-1 min-w-[120px] text-center ${browseButtonClass} ${busy ? "pointer-events-none opacity-65" : ""}`}
              aria-busy={busy}
            >
              Open Analytics
            </Link>
            <button
              type="button"
              className="flex-1 min-w-[120px] rounded-lg border border-vmb-secondary/45 bg-white px-3 py-2 text-center text-sm font-semibold text-vmb-secondary shadow-sm transition hover:bg-vmb-secondary/8 disabled:pointer-events-none disabled:opacity-65"
              disabled={busy}
              onClick={() => void startNewImport()}
            >
              {busy ?
                <span className="inline-flex items-center justify-center gap-2">
                  <LuLoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
                  Resetting…
                </span>
              : "Start New Import"}
            </button>
          </>
        : (
          <button
            type="button"
            className={`flex-1 min-w-[140px] ${browseButtonClass} disabled:pointer-events-none disabled:opacity-65`}
            disabled={busy}
            onClick={onPrimary}
          >
            {busy ?
              <span className="inline-flex items-center justify-center gap-2">
                <LuLoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
                Working…
              </span>
            : primaryLabel}
          </button>
        )}
      </div>
    </>
  );
}
