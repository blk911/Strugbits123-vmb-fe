import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuChevronDown,
  LuCloudUpload,
  LuExternalLink,
  LuHeadset,
  LuImage,
  LuLoaderCircle,
  LuX,
} from "react-icons/lu";
import { intelligenceBtnPrimaryClass } from "./IntelligenceLayoutShell";

/**
 * @typedef {import("../../config/providerOnboardingData.js").ProviderConfig} ProviderConfig
 */

const sectionTitle =
  "text-xs font-bold uppercase tracking-wide text-vmb-text-muted";

const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-vmb-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-vmb-primary hover:opacity-95";
const btnSecondary =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-vmb-border-light bg-white px-4 py-2.5 text-sm font-semibold text-vmb-text-dark shadow-sm transition hover:border-vmb-secondary/40 hover:shadow-md";
const linkPill =
  "inline-flex items-center gap-1 rounded-lg border border-vmb-border-light bg-white px-2.5 py-1.5 text-xs font-semibold text-vmb-secondary shadow-sm transition hover:border-vmb-secondary/40 hover:bg-vmb-bg-soft/50";

/** @param {boolean} active */
function providerCardClasses(active) {
  return [
    "flex h-[72px] max-h-[72px] w-full items-start justify-between gap-2 overflow-hidden rounded-lg border px-2.5 py-2 text-left shadow-sm transition",
    active ?
      "border-vmb-gold bg-vmb-secondary/10 ring-1 ring-vmb-gold/30 shadow-md"
    : "border-vmb-border-light bg-white hover:shadow-md",
  ].join(" ");
}

/** Narrow rail — member / Deep Insights @param {boolean} active */
function providerCardClassesCompact(active) {
  return [
    "flex h-[56px] max-h-[56px] w-full items-start justify-between gap-1.5 overflow-hidden rounded-lg border px-2 py-1.5 text-left shadow-sm transition",
    active ?
      "border-vmb-gold bg-vmb-secondary/10 ring-1 ring-vmb-gold/30 shadow-md"
    : "border-vmb-border-light bg-white hover:shadow-md",
  ].join(" ");
}

function CheckLi({ children, compact }) {
  return (
    <li
      className={`flex gap-2 leading-snug text-vmb-text-dark ${compact ? "text-xs" : "text-sm"}`}
    >
      <span className="mt-0.5 shrink-0 text-vmb-success" aria-hidden>
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

const MEMBER_UPLOAD_CHECKLIST = [
  "Client list",
  "Sales / transaction report",
  "Appointments optional",
];

const memberQuickBtnPrimaryClass =
  `${intelligenceBtnPrimaryClass} justify-center py-2 text-xs sm:text-sm`;

const memberQuickBtnSecondaryClass =
  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-vmb-secondary/50 bg-vmb-secondary/12 px-4 py-2 text-xs font-semibold text-vmb-text-dark shadow-sm transition hover:border-vmb-secondary/70 hover:bg-vmb-secondary/20 sm:flex-none sm:text-sm";

const memberColumnCard =
  "flex min-h-0 min-w-0 flex-col rounded-xl border border-vmb-border-light bg-white p-3 shadow-sm";
const memberColumnHeaderRow =
  "flex min-h-[2.75rem] shrink-0 flex-wrap items-center justify-start gap-2 border-b border-vmb-border-light pb-3";

const instructionSectionIds = new Set(["needs", "links", "steps"]);

// TODO: wire parser + storage endpoint — set VITE_DEEP_INSIGHTS_UPLOAD_ENABLED=true when
// POST /api/salon/deep-insights/upload is live (multipart field name: "files").
const DEEP_INSIGHTS_UPLOAD_URL = "/api/salon/deep-insights/upload";
const deepInsightsUploadApiEnabled =
  import.meta.env.VITE_DEEP_INSIGHTS_UPLOAD_ENABLED === "true";

const DEEP_INSIGHTS_ANALYSIS_STEPS = [
  "Upload files",
  "Parse files",
  "Normalize records",
  "Generate metrics",
  "Prepare analytics workspace",
];

const DEEP_INSIGHTS_ANALYSIS_STEP_MS = 620;

/** @param {File} file */
function csvFileKey(file) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

/** @param {File} file */
function isCsvFile(file) {
  if (!file.name.toLowerCase().endsWith(".csv")) return false;
  const t = (file.type || "").toLowerCase();
  if (!t) return true;
  return (
    t === "text/csv" ||
    t === "application/csv" ||
    t === "application/vnd.ms-excel" ||
    t === "text/comma-separated-values"
  );
}

/** @param {File[]} files */
function partitionCsvFiles(files) {
  const ok = [];
  const bad = [];
  for (const f of files) {
    if (isCsvFile(f)) ok.push(f);
    else bad.push(f);
  }
  return { ok, bad };
}

/** @param {File[]} existing @param {File[]} incoming */
function mergeCsvFiles(existing, incoming) {
  const keys = new Set(existing.map(csvFileKey));
  const out = [...existing];
  for (const f of incoming) {
    const k = csvFileKey(f);
    if (!keys.has(k)) {
      keys.add(k);
      out.push(f);
    }
  }
  return out;
}

/** @param {number} bytes */
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** @param {string} providerKey @param {React.MutableRefObject<(() => void) | null | undefined>} [pipelineCompleteRef] */
function useDeepInsightsCsvUpload(providerKey, pipelineCompleteRef) {
  const [uploadedFiles, setUploadedFiles] = useState(/** @type {File[]} */ ([]));
  const [fileRejectError, setFileRejectError] = useState(
    /** @type {string | null} */ (null),
  );
  const [serverError, setServerError] = useState(/** @type {string | null} */ (null));
  const [analysisStatus, setAnalysisStatus] = useState(
    /** @type {"idle" | "processing" | "complete"} */ ("idle"),
  );
  const [analysisStepDone, setAnalysisStepDone] = useState(0);
  const pipelineRunIdRef = useRef(0);
  const analysisRunLockRef = useRef(false);

  useEffect(() => {
    pipelineRunIdRef.current += 1;
    analysisRunLockRef.current = false;
    setUploadedFiles([]);
    setFileRejectError(null);
    setServerError(null);
    setAnalysisStatus("idle");
    setAnalysisStepDone(0);
  }, [providerKey]);

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      setAnalysisStatus("idle");
      setAnalysisStepDone(0);
      setServerError(null);
    }
  }, [uploadedFiles.length]);

  const addFilesFromList = useCallback(
    (list) => {
      if (analysisStatus === "processing") return;
      if (!list?.length) return;
      const { ok, bad } = partitionCsvFiles(Array.from(list));
      if (bad.length) {
        setFileRejectError(
          bad.length === 1 ?
            `"${bad[0].name}" is not a CSV file. Only .csv exports are accepted.`
          : `${bad.length} file(s) skipped — only .csv files are accepted.`,
        );
      } else {
        setFileRejectError(null);
      }
      if (!ok.length) return;
      setUploadedFiles((prev) => mergeCsvFiles(prev, ok));
      setServerError(null);
      if (analysisStatus === "complete") {
        setAnalysisStatus("idle");
        setAnalysisStepDone(0);
      }
    },
    [analysisStatus],
  );

  const removeFile = useCallback(
    (index) => {
      if (analysisStatus === "processing") return;
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
      if (analysisStatus === "complete") {
        setAnalysisStatus("idle");
        setAnalysisStepDone(0);
      }
    },
    [analysisStatus],
  );

  const runUploadAndAnalyze = useCallback(async () => {
    if (uploadedFiles.length === 0 || analysisRunLockRef.current) return;
    analysisRunLockRef.current = true;
    const runId = ++pipelineRunIdRef.current;
    setServerError(null);
    setAnalysisStatus("processing");
    setAnalysisStepDone(0);

    try {
      if (deepInsightsUploadApiEnabled) {
        const fd = new FormData();
        uploadedFiles.forEach((f) => {
          fd.append("files", f, f.name);
        });
        const res = await fetch(DEEP_INSIGHTS_UPLOAD_URL, {
          method: "POST",
          body: fd,
          credentials: "include",
        });
        if (!res.ok) {
          let detail = res.statusText;
          try {
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
              const j = await res.json();
              detail =
                (typeof j.message === "string" && j.message) ||
                (typeof j.error === "string" && j.error) ||
                JSON.stringify(j);
            } else {
              const t = await res.text();
              if (t) detail = t.slice(0, 300);
            }
          } catch {
            /* keep statusText */
          }
          throw new Error(detail || `HTTP ${res.status}`);
        }
      }

      for (let i = 0; i < DEEP_INSIGHTS_ANALYSIS_STEPS.length; i++) {
        await new Promise((r) => {
          window.setTimeout(r, DEEP_INSIGHTS_ANALYSIS_STEP_MS);
        });
        if (pipelineRunIdRef.current !== runId) return;
        setAnalysisStepDone(i + 1);
      }

      if (pipelineRunIdRef.current !== runId) return;
      setAnalysisStatus("complete");
      window.setTimeout(() => {
        pipelineCompleteRef?.current?.();
      }, 1100);
    } catch (e) {
      if (pipelineRunIdRef.current !== runId) return;
      setAnalysisStatus("idle");
      setAnalysisStepDone(0);
      setServerError(
        e instanceof Error ? e.message : "Something went wrong. Please try again.",
      );
    } finally {
      if (pipelineRunIdRef.current === runId) {
        analysisRunLockRef.current = false;
      }
    }
  }, [uploadedFiles]);

  const statusLabel = useMemo(() => {
    if (analysisStatus === "complete") return "Analysis Complete";
    if (analysisStatus === "processing") return "Processing Salon Data";
    if (uploadedFiles.length === 0) return "No files selected";
    return "Files ready for analysis";
  }, [analysisStatus, uploadedFiles.length]);

  return {
    uploadedFiles,
    fileRejectError,
    serverError,
    analysisStatus,
    analysisStepDone,
    addFilesFromList,
    removeFile,
    runUploadAndAnalyze,
    statusLabel,
    analysisSteps: DEEP_INSIGHTS_ANALYSIS_STEPS,
  };
}

/** @param {boolean} active */
function pulseRing(active) {
  return [
    "scroll-mt-24 rounded-lg transition-[box-shadow] duration-300",
    active ? "ring-2 ring-vmb-secondary ring-offset-2 ring-offset-white" : "",
  ].join(" ");
}

/** @param {{ analysisStatus: string; analysisStepDone: number; steps: string[] }} props */
function DeepInsightsAnalysisPipeline({ analysisStatus, analysisStepDone, steps }) {
  const visible = analysisStatus === "processing" || analysisStatus === "complete";
  if (!visible) return null;
  return (
    <div
      className="mt-3 space-y-2"
      aria-busy={analysisStatus === "processing"}
    >
      <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-muted">
        Extracting intelligence
      </p>
      <ul className="space-y-2">
        {steps.map((label, i) => {
          const done = i < analysisStepDone;
          const active =
            analysisStatus === "processing" && i === analysisStepDone;
          return (
            <li
              key={label}
              className={[
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition",
                done ?
                  "border-vmb-success/35 bg-vmb-success/5 text-vmb-text-dark"
                : active ?
                  "border-vmb-secondary/50 bg-vmb-secondary/8 text-vmb-text-dark shadow-sm"
                : "border-vmb-border-light bg-white/80 text-vmb-text-muted",
              ].join(" ")}
            >
              {done ?
                <span className="text-vmb-success" aria-hidden>
                  ✓
                </span>
              : active ?
                <LuLoaderCircle
                  className="h-3.5 w-3.5 shrink-0 animate-spin text-vmb-secondary"
                  aria-hidden
                />
              : <span className="w-3.5 text-center text-vmb-text-muted" aria-hidden>
                  ○
                </span>
              }
              <span className="font-medium leading-snug">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DeepInsightsResultsStub() {
  return (
    <div className="mt-3 rounded-lg border border-vmb-border-light bg-white p-3 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-secondary">
        Analysis ready
      </p>
      <p className="mt-2 text-xs leading-relaxed text-vmb-text-dark">
        Your import finished. Opening the analytics workspace with discovery-grade
        signals tailored to your salon.
      </p>
      <Link
        to="/salon-owner/deep-insights/analytics"
        className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 ${intelligenceBtnPrimaryClass} py-2.5 text-sm font-semibold`}
      >
        Open Analytics
      </Link>
    </div>
  );
}

/**
 * CSV staging UI for Deep Insights (member right column): input, dropzone, file list, status.
 * @param {{
 *   csvUpload: {
 *     uploadedFiles: File[];
 *     fileRejectError: string | null;
 *     serverError: string | null;
 *     analysisStatus: string;
 *     analysisStepDone: number;
 *     analysisSteps: string[];
 *     statusLabel: string;
 *     addFilesFromList: (list: FileList | null | undefined) => void;
 *     removeFile: (index: number) => void;
 *     runUploadAndAnalyze: () => Promise<void>;
 *   };
 *   uploadInputRef: React.RefObject<HTMLInputElement | null>;
 *   uploadDropzoneRef?: React.RefObject<HTMLDivElement | null>;
 *   highlightUpload?: boolean;
 *   browseButtonClass: string;
 *   compactDropzone?: boolean;
 * }} props
 */
function MemberCsvStagingUi({
  csvUpload,
  uploadInputRef,
  uploadDropzoneRef,
  highlightUpload = false,
  browseButtonClass,
  compactDropzone = false,
}) {
  const {
    uploadedFiles,
    fileRejectError,
    serverError,
    analysisStatus,
    analysisStepDone,
    analysisSteps,
    statusLabel,
    addFilesFromList,
    removeFile,
    runUploadAndAnalyze,
  } = csvUpload;

  const isProcessing = analysisStatus === "processing";
  const isComplete = analysisStatus === "complete";
  const hasFiles = uploadedFiles.length > 0;
  const inputsLocked = isProcessing || isComplete;

  const onDrop = useCallback(
    (e) => {
      if (inputsLocked) return;
      e.preventDefault();
      e.stopPropagation();
      addFilesFromList(e.dataTransfer?.files);
    },
    [addFilesFromList, inputsLocked],
  );

  const onDragOver = useCallback(
    (e) => {
      if (inputsLocked) return;
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "copy";
    },
    [inputsLocked],
  );

  const onDragEnter = useCallback(
    (e) => {
      if (inputsLocked) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [inputsLocked],
  );

  const dzMin = compactDropzone ? "min-h-[100px]" : "min-h-[168px]";
  const iconSz = compactDropzone ? "h-8 w-8" : "h-11 w-11";
  const textSz = compactDropzone ? "text-xs" : "text-sm";

  return (
    <>
      <input
        ref={uploadInputRef}
        type="file"
        accept=".csv,text/csv"
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
      {!isComplete ?
        <div
          ref={uploadDropzoneRef}
          className={`mt-3 flex ${dzMin} flex-col items-center justify-center rounded-xl border-2 border-dashed border-vmb-border-light bg-white px-3 py-6 transition hover:border-vmb-secondary/45 hover:bg-vmb-bg-soft/30 ${inputsLocked ? "pointer-events-none opacity-50" : ""} ${pulseRing(!!highlightUpload && !inputsLocked)}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
        >
          <LuCloudUpload className={`${iconSz} text-vmb-secondary`} aria-hidden />
          <span
            className={`mt-2 text-center font-semibold text-vmb-text-dark ${textSz}`}
          >
            Drop CSV files here
          </span>
          <span className="mt-1 text-center text-[11px] text-vmb-text-muted">
            .csv only · multiple files OK
          </span>
        </div>
      : null}

      {hasFiles ?
        <ul
          className={`mt-2 max-h-40 space-y-1.5 overflow-y-auto rounded-lg border border-vmb-border-light bg-vmb-bg-soft/20 p-2 ${isComplete ? "mt-3" : ""}`}
        >
          {uploadedFiles.map((f, index) => (
            <li
              key={csvFileKey(f)}
              className="flex items-start gap-2 rounded-md bg-white px-2 py-1.5 text-xs shadow-sm"
            >
              <span className="min-w-0 flex-1 truncate font-medium text-vmb-text-dark">
                {f.name}
              </span>
              <span className="shrink-0 text-vmb-text-muted">
                {formatFileSize(f.size)}
              </span>
              {!isComplete ?
                <button
                  type="button"
                  className="shrink-0 rounded p-0.5 text-vmb-text-muted transition hover:bg-vmb-bg-soft hover:text-vmb-text-dark disabled:opacity-40"
                  aria-label={`Remove ${f.name}`}
                  disabled={isProcessing}
                  onClick={() => removeFile(index)}
                >
                  <LuX className="h-4 w-4" aria-hidden />
                </button>
              : null}
            </li>
          ))}
        </ul>
      : null}

      <p
        className={`mt-2 text-xs font-semibold ${isComplete ? "text-vmb-secondary" : "text-vmb-text-muted"}`}
        role="status"
        aria-live="polite"
      >
        {statusLabel}
      </p>

      {fileRejectError ?
        <p
          className="mt-1.5 text-xs font-medium text-red-600"
          role="alert"
        >
          {fileRejectError}
        </p>
      : null}

      {!isComplete ?
        <button
          type="button"
          className={`mt-3 w-full ${browseButtonClass} disabled:pointer-events-none disabled:opacity-65`}
          disabled={isProcessing}
          onClick={() => {
            if (isProcessing) return;
            if (!hasFiles) {
              uploadInputRef.current?.click();
              return;
            }
            void runUploadAndAnalyze();
          }}
        >
          {isProcessing ?
            "Processing Salon Data..."
          : hasFiles ?
            "Upload + Analyze"
          : "Select CSV Files"}
        </button>
      : null}

      {serverError ?
        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
          {serverError}
        </p>
      : null}

      <DeepInsightsAnalysisPipeline
        analysisStatus={analysisStatus}
        analysisStepDone={analysisStepDone}
        steps={analysisSteps}
      />

      {isComplete ? <DeepInsightsResultsStub /> : null}
    </>
  );
}

/**
 * @param {{
 *   variant: "lab" | "member";
 *   providers: Record<string, ProviderConfig>;
 *   primaryOrder: string[];
 *   secondaryOrder: string[];
 *   memberRailTitle?: string;
 *   labRailTitle?: string;
 *   railRef?: React.RefObject<HTMLElement | null>;
 *   emptyStateMessage?: string;
 *   onChoosePlatform?: () => void;
 *   onDeepInsightsPipelineComplete?: () => void;
 * }} props
 */
export default function ProviderOnboardingExperience({
  variant,
  providers,
  primaryOrder,
  secondaryOrder,
  memberRailTitle = "Your platform",
  labRailTitle = "Your platform",
  railRef,
  emptyStateMessage,
  onChoosePlatform,
  onDeepInsightsPipelineComplete,
}) {
  const pipelineCompleteRef = useRef(
    /** @type {(() => void) | null | undefined} */ (null),
  );
  if (variant === "member") {
    pipelineCompleteRef.current = onDeepInsightsPipelineComplete;
  } else {
    pipelineCompleteRef.current = null;
  }

  const uploadInputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const memberInstructionsRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const memberUploadDropzoneRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const memberConnectCtaRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const memberApiCsvRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [focusPulse, setFocusPulse] = useState(
    /** @type {"instructions" | "upload" | "connect" | "apiUpload" | null} */ (
      null
    ),
  );

  const flashPulse = useCallback(
    /** @param {"instructions" | "upload" | "connect" | "apiUpload"} key */
    (key) => {
      setFocusPulse(key);
      window.setTimeout(() => {
        setFocusPulse((cur) => (cur === key ? null : cur));
      }, 2200);
    },
    [],
  );
  const [providerKey, setProviderKey] = useState(
    /** @type {string | null} */ (null),
  );
  const [moreOpen, setMoreOpen] = useState(false);
  const [uploadName, setUploadName] = useState(
    /** @type {string | null} */ (null),
  );
  const [assistedNotice, setAssistedNotice] = useState(false);
  const [assistedUpload, setAssistedUpload] = useState(false);
  const [apiAcknowledged, setApiAcknowledged] = useState(false);

  const deepInsightsCsv = useDeepInsightsCsvUpload(
    providerKey ?? "",
    pipelineCompleteRef,
  );

  const p = useMemo(
    () => (providerKey ? providers[providerKey] ?? null : null),
    [providerKey, providers],
  );

  const railTitle = variant === "member" ? memberRailTitle : labRailTitle;
  const memberThreeCol = variant === "member";

  const selectProvider = (key) => {
    setProviderKey(key);
    setUploadName(null);
    setAssistedNotice(false);
    setAssistedUpload(false);
    setApiAcknowledged(false);
  };

  const onFile = useCallback((fileList) => {
    const f = fileList?.[0];
    if (f) setUploadName(f.name);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      onFile(e.dataTransfer?.files);
    },
    [onFile],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const showUploadZone =
    p && (p.mode === "upload" || (p.mode === "assisted" && assistedUpload));

  const showScreenshots =
    p &&
    p.showScreenshots !== false &&
    Array.isArray(p.screenshots) &&
    p.screenshots.length > 0;

  const showOfficialLinks = p && p.showOfficialLinks !== false;

  const defaultEmpty =
    "Select a platform on the left. You’ll see exactly what VMB needs, where to go in your vendor account, and the steps to upload or connect.";

  const linksEmptyHint =
    p?.emptyLinksHint ??
    (variant === "member" ?
      "If you don’t see a link here, use your software’s usual login page — or reach out and we’ll point you there."
    : "Add vendor login or docs from your account manager if not listed here.");

  const assistedMsg =
    p?.assistedNoticeMessage ??
    (variant === "member" ?
      "We’ll reach out to help connect your account."
    : "We’ll contact you to coordinate API or enterprise access and field mapping.");

  const apiAckDefault =
    variant === "member" ?
      "You’re almost there — you’ll finish sign-in with Square when live connections are available."
    : "Next: complete OAuth in production — this button is a placeholder in the lab.";

  /** @type {Array<{ id: string; title: string; node: React.ReactNode }>} */
  const guideSections = [];

  if (p) {
    let n = 0;
    const nextTitle = (base) => `${++n}. ${base}`;
    const compact = memberThreeCol;

    const needsTitle =
      p.needsSectionTitle ??
      (variant === "member" && p.mode === "api" ? "What VMB syncs" : "What VMB needs");

    guideSections.push({
      id: "needs",
      title: nextTitle(needsTitle),
      node: (
        <ul className={compact ? "mt-1.5 space-y-0.5" : "mt-2 space-y-1"}>
          {p.needs.map((item) => (
            <CheckLi key={item} compact={compact}>
              {item}
            </CheckLi>
          ))}
        </ul>
      ),
    });

    if (showOfficialLinks) {
      guideSections.push({
        id: "links",
        title: nextTitle(p.linksSectionTitle ?? "Official links"),
        node:
          p.links.length ?
            <div
              className={
                compact ?
                  "mt-1.5 flex flex-wrap gap-1.5"
                : "mt-2 flex flex-wrap gap-2"
              }
            >
              {p.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkPill}
                >
                  {link.label}
                  <LuExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
                </a>
              ))}
            </div>
          : <p className="mt-2 text-xs text-vmb-text-muted">{linksEmptyHint}</p>,
      });
    }

    const stepsTitle =
      p.stepsSectionTitle ??
      (variant === "member" && p.mode === "api" ?
        "Connection Path"
      : "Step-by-step path");

    const showPostInGuide =
      !memberThreeCol ||
      p.mode !== "api" ||
      !("postStepsNote" in p && p.postStepsNote);

    guideSections.push({
      id: "steps",
      title: nextTitle(stepsTitle),
      node: (
        <>
          <ol className={compact ? "mt-2 space-y-1.5" : "mt-3 space-y-2"}>
            {p.steps.map((step, i) => (
              <li key={`${step}-${i}`} className="flex gap-2">
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full bg-vmb-secondary/15 font-bold text-vmb-text-dark ${compact ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-xs"}`}
                >
                  {i + 1}
                </span>
                <span
                  className={`leading-snug text-vmb-text-dark ${compact ? "pt-0.5 text-xs" : "pt-0.5 text-sm"}`}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
          {showPostInGuide && "postStepsNote" in p && p.postStepsNote ?
            <p
              className={`rounded-lg border border-dashed border-vmb-border-light bg-vmb-bg-soft/40 italic text-vmb-text-muted ${compact ? "mt-2 px-2.5 py-1.5 text-sm" : "mt-3 px-3 py-2 text-base"}`}
            >
              {p.postStepsNote}
            </p>
          : null}
        </>
      ),
    });

    if (showScreenshots) {
      guideSections.push({
        id: "shots",
        title: nextTitle(
          p.screenshotsSectionTitle ??
            (variant === "member" ? "Screenshots" : "Screenshots / placeholder"),
        ),
        node: (
          <div
            className={
              compact ?
                "mt-1.5 flex flex-wrap gap-1.5"
              : "mt-2 flex flex-wrap gap-2"
            }
          >
            {p.screenshots.map((cap) => (
              <div
                key={cap}
                className={
                  compact ?
                    "flex h-14 min-w-[5rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed border-vmb-border-light bg-vmb-bg-soft/30 px-1.5 text-center text-vmb-text-muted"
                  : "flex h-20 min-w-[6.5rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-vmb-border-light bg-vmb-bg-soft/30 px-2 text-center text-vmb-text-muted"
                }
              >
                <LuImage
                  className={compact ? "h-4 w-4 opacity-45" : "h-5 w-5 opacity-45"}
                  aria-hidden
                />
                <span
                  className={`font-medium leading-tight ${compact ? "text-[8px]" : "text-[9px]"}`}
                >
                  {cap}
                </span>
              </div>
            ))}
          </div>
        ),
      });
    }

    if (!memberThreeCol) {
      const actionTitleBase =
        p.actionSectionTitle ??
        (p.mode === "api" ? "Connect" : (
          p.mode === "assisted" && !assistedUpload
        ) ?
          "Next steps"
        : "Upload");

      guideSections.push({
        id: "action",
        title: nextTitle(actionTitleBase),
        node: (
          <LabActionBlock
            p={p}
            showUploadZone={!!showUploadZone}
            assistedUpload={assistedUpload}
            assistedNotice={assistedNotice}
            apiAcknowledged={apiAcknowledged}
            setApiAcknowledged={setApiAcknowledged}
            setAssistedUpload={setAssistedUpload}
            setAssistedNotice={setAssistedNotice}
            setUploadName={setUploadName}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onFile={onFile}
            uploadName={uploadName}
            assistedMsg={assistedMsg}
            apiAckDefault={apiAckDefault}
            btnPrimary={btnPrimary}
            btnSecondary={btnSecondary}
          />
        ),
      });
    }
  }

  const instructionBlocks =
    p && memberThreeCol ?
      guideSections.filter((b) => instructionSectionIds.has(b.id))
    : [];
  const tailBlocks =
    p && memberThreeCol ?
      guideSections.filter((b) => !instructionSectionIds.has(b.id))
    : [];

  const onMemberFindFiles = useCallback(() => {
    memberInstructionsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    flashPulse("instructions");
  }, [flashPulse]);

  const onMemberConnectAccount = useCallback(() => {
    memberConnectCtaRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    flashPulse("connect");
  }, [flashPulse]);

  const onMemberUploadFiles = useCallback(() => {
    if (p?.mode === "assisted" && !assistedUpload && !assistedNotice) {
      setAssistedUpload(true);
      setAssistedNotice(false);
      setUploadName(null);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          memberUploadDropzoneRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          flashPulse("upload");
        });
      });
      return;
    }
    if (p?.mode === "api") {
      memberApiCsvRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      flashPulse("apiUpload");
      return;
    }
    memberUploadDropzoneRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    flashPulse("upload");
  }, [p, assistedUpload, assistedNotice, flashPulse]);

  const railClass = memberThreeCol ?
    "min-w-0 scroll-mt-4 xl:w-[240px] xl:shrink-0"
  : "min-w-0 scroll-mt-4 xl:w-[340px] xl:shrink-0";

  const guidePanelClass = memberThreeCol ?
    "min-w-0 rounded-xl border border-vmb-border-light bg-white p-3 shadow-sm"
  : "min-w-0 rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm";

  const sectionGap = memberThreeCol ? "mt-4" : "mt-5";

  const renderRailButton = (key, row, active) =>
    memberThreeCol ?
      <button
        key={key}
        type="button"
        onClick={() => selectProvider(key)}
        className={providerCardClassesCompact(active)}
      >
        <div className="min-w-0 flex-1 pr-0.5">
          <p className="text-[11px] font-semibold leading-tight text-vmb-text-dark">
            {row.name}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[9px] leading-tight text-vmb-text-muted">
            {row.descriptor}
          </p>
        </div>
        <span className="shrink-0 self-start rounded border border-vmb-secondary/35 bg-vmb-secondary/10 px-0.5 py-0.5 text-[6px] font-bold leading-tight text-vmb-secondary">
          {row.badge.replace(/ /g, "\u00A0")}
        </span>
      </button>
    : <button
        key={key}
        type="button"
        onClick={() => selectProvider(key)}
        className={providerCardClasses(active)}
      >
        <div className="min-w-0 flex-1 pr-1">
          <p className="text-[12px] font-semibold leading-tight text-vmb-text-dark">
            {row.name}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-vmb-text-muted">
            {row.descriptor}
          </p>
        </div>
        <span className="shrink-0 self-start rounded border border-vmb-secondary/35 bg-vmb-secondary/10 px-1 py-0.5 text-[7px] font-bold leading-tight text-vmb-secondary">
          {row.badge.replace(/ /g, "\u00A0")}
        </span>
      </button>;

  const actionCardInner =
    "flex min-h-0 flex-col rounded-lg border border-vmb-border-light bg-vmb-bg-soft/30 p-3 shadow-sm";

  if (!memberThreeCol) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[340px_1fr]">
        <div
          ref={railRef}
          className={railClass}
        >
          <p className={`${sectionTitle} mb-1.5`}>{railTitle}</p>
          <div className="flex flex-col gap-1">
            {primaryOrder.map((key) => {
              const row = providers[key];
              if (!row) return null;
              return renderRailButton(key, row, providerKey === key);
            })}
          </div>
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className="mt-2 text-[11px] font-semibold text-vmb-secondary underline-offset-2 hover:underline"
          >
            {moreOpen ? "Hide more providers" : "More providers"}
          </button>
          {moreOpen ?
            <div className="mt-1 flex max-h-[14rem] flex-col gap-1 overflow-y-auto border-t border-dashed border-vmb-border-light pt-1.5">
              {secondaryOrder.map((key) => {
                const row = providers[key];
                if (!row) return null;
                return renderRailButton(key, row, providerKey === key);
              })}
            </div>
          : null}
        </div>

        <div className={guidePanelClass}>
          {!p ?
            <p className="text-sm text-vmb-text-muted">
              {emptyStateMessage ?? defaultEmpty}
            </p>
          : <>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-vmb-text-dark">
                  Connect {p.name}
                </h2>
                <span className="rounded border border-vmb-secondary/40 bg-vmb-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vmb-secondary">
                  {p.badge}
                </span>
              </div>
              <p className="mt-2 text-sm text-vmb-text-muted">{p.summary}</p>

              {guideSections.map((block) => (
                <div key={block.id} className={sectionGap}>
                  <h3 className={sectionTitle}>{block.title}</h3>
                  {block.node}
                </div>
              ))}
            </>
          }
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[240px_1fr_360px] xl:items-stretch">
      <div
        ref={railRef}
        id="deep-insights-provider-rail"
        className={`${memberColumnCard} scroll-mt-4 xl:w-[240px] xl:shrink-0`}
      >
        <div className={memberColumnHeaderRow}>
          {onChoosePlatform ?
            <button
              type="button"
              onClick={onChoosePlatform}
              className={`${memberQuickBtnPrimaryClass} inline-flex shrink-0`}
            >
              Choose platform
              <LuChevronDown className="h-3.5 w-3.5 opacity-90" aria-hidden />
            </button>
          : null}
        </div>
        <div className="mt-3 flex min-h-0 flex-1 flex-col">
          <div className="flex flex-col gap-1">
            {primaryOrder.map((key) => {
              const row = providers[key];
              if (!row) return null;
              return renderRailButton(key, row, providerKey === key);
            })}
          </div>
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className="mt-2 text-left text-[11px] font-semibold text-vmb-secondary underline-offset-2 hover:underline"
          >
            {moreOpen ? "Hide more providers" : "More providers"}
          </button>
          {moreOpen ?
            <div className="mt-1 flex max-h-[14rem] flex-col gap-1 overflow-y-auto border-t border-dashed border-vmb-border-light pt-1.5">
              {secondaryOrder.map((key) => {
                const row = providers[key];
                if (!row) return null;
                return renderRailButton(key, row, providerKey === key);
              })}
            </div>
          : null}
        </div>
      </div>

      <div className={`${memberColumnCard} min-w-0`}>
        <div className={memberColumnHeaderRow}>
          {!p ?
            <button
              type="button"
              onClick={onMemberFindFiles}
              className={`${memberQuickBtnPrimaryClass} inline-flex`}
            >
              Find Your Files
            </button>
          : p.mode === "api" ?
            <button
              type="button"
              onClick={onMemberConnectAccount}
              className={`${memberQuickBtnPrimaryClass} inline-flex`}
            >
              Connect Account
            </button>
          : <button
              type="button"
              onClick={onMemberFindFiles}
              className={`${memberQuickBtnPrimaryClass} inline-flex`}
            >
              Find Your Files
            </button>
          }
        </div>
        <div className="mt-3 flex min-h-0 flex-1 flex-col">
          {!p ?
            <div
              ref={memberInstructionsRef}
              id="deep-insights-instructions"
              className={pulseRing(focusPulse === "instructions")}
            >
              <p className="text-sm text-vmb-text-muted">
                {emptyStateMessage ?? defaultEmpty}
              </p>
            </div>
          : <>
              <div className="rounded-lg border border-vmb-border-light bg-vmb-bg-soft/20 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-base font-semibold text-vmb-text-dark">
                    Connect {p.name}
                  </h2>
                  <span className="rounded border border-vmb-secondary/40 bg-vmb-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vmb-secondary">
                    {p.badge}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-snug text-vmb-text-muted">
                  {p.summary}
                </p>
              </div>
              <div
                ref={memberInstructionsRef}
                id="deep-insights-instructions"
                className={`mt-3 ${pulseRing(focusPulse === "instructions")}`}
              >
                {instructionBlocks.map((block) => (
                  <div key={block.id} className={sectionGap}>
                    <h3 className={sectionTitle}>{block.title}</h3>
                    {block.node}
                  </div>
                ))}
              </div>
              {tailBlocks.map((block) => (
                <div key={block.id} className={sectionGap}>
                  <h3 className={sectionTitle}>{block.title}</h3>
                  {block.node}
                </div>
              ))}
            </>
          }
        </div>
      </div>

      <div className={`${memberColumnCard} xl:w-[360px] xl:shrink-0`}>
        <div className={memberColumnHeaderRow}>
          <button
            type="button"
            onClick={onMemberUploadFiles}
            className={`${memberQuickBtnSecondaryClass} inline-flex`}
          >
            Upload Files
          </button>
        </div>
        <div className="mt-3 flex min-h-0 flex-1 flex-col">
          {!p ?
            <div className={actionCardInner}>
              <p className="text-sm text-vmb-text-muted">
                Choose a platform to upload files, connect an account, or request
                assisted setup.
              </p>
            </div>
          : <MemberActionColumn
              p={p}
              actionCardShell={actionCardInner}
              csvUpload={deepInsightsCsv}
              assistedUpload={assistedUpload}
              assistedNotice={assistedNotice}
              apiAcknowledged={apiAcknowledged}
              setApiAcknowledged={setApiAcknowledged}
              setAssistedUpload={setAssistedUpload}
              setAssistedNotice={setAssistedNotice}
              setUploadName={setUploadName}
              uploadInputRef={uploadInputRef}
              uploadDropzoneRef={memberUploadDropzoneRef}
              connectCtaRef={memberConnectCtaRef}
              apiCsvSectionRef={memberApiCsvRef}
              highlightUpload={focusPulse === "upload"}
              highlightConnect={focusPulse === "connect"}
              highlightApiCsv={focusPulse === "apiUpload"}
              assistedMsg={assistedMsg}
              apiAckDefault={apiAckDefault}
              btnPrimary={btnPrimary}
              btnSecondary={btnSecondary}
            />
          }
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   p: ProviderConfig;
 *   showUploadZone: boolean;
 *   assistedUpload: boolean;
 *   assistedNotice: boolean;
 *   apiAcknowledged: boolean;
 *   setApiAcknowledged: (v: boolean) => void;
 *   setAssistedUpload: (v: boolean) => void;
 *   setAssistedNotice: (v: boolean) => void;
 *   setUploadName: (v: string | null) => void;
 *   onDrop: (e: React.DragEvent) => void;
 *   onDragOver: (e: React.DragEvent) => void;
 *   onFile: (list: FileList | null | undefined) => void;
 *   uploadName: string | null;
 *   assistedMsg: string;
 *   apiAckDefault: string;
 *   btnPrimary: string;
 *   btnSecondary: string;
 * }} props
 */
function LabActionBlock({
  p,
  showUploadZone,
  assistedUpload,
  assistedNotice,
  apiAcknowledged,
  setApiAcknowledged,
  setAssistedUpload,
  setAssistedNotice,
  setUploadName,
  onDrop,
  onDragOver,
  onFile,
  uploadName,
  assistedMsg,
  apiAckDefault,
  btnPrimary,
  btnSecondary,
}) {
  return (
    <>
      {p.mode === "api" ?
        <div className="mt-3 space-y-2">
          <button
            type="button"
            className={`w-full sm:w-auto ${btnPrimary}`}
            onClick={() => setApiAcknowledged(true)}
          >
            {p.connectLabel ?? `Connect ${p.name}`}
            <LuArrowRight className="h-4 w-4" aria-hidden />
          </button>
          {apiAcknowledged ?
            <p
              className="rounded-lg border border-vmb-border-light bg-vmb-bg-soft/60 px-3 py-2 text-xs text-vmb-text-dark"
              role="status"
            >
              {p.apiAckMessage ?? apiAckDefault}
            </p>
          : null}
        </div>
      : p.mode === "assisted" && !assistedUpload ?
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setAssistedUpload(true);
              setAssistedNotice(false);
              setUploadName(null);
            }}
          >
            <LuCloudUpload className="h-4 w-4" aria-hidden />
            Upload reports
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              setAssistedNotice(true);
              setAssistedUpload(false);
            }}
          >
            <LuHeadset className="h-4 w-4" aria-hidden />
            Request assisted setup
          </button>
        </div>
      : null}

      {showUploadZone ?
        <label
          className="mt-3 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-vmb-border-light bg-vmb-bg-soft/20 px-4 py-8 transition hover:border-vmb-secondary/45 hover:bg-vmb-bg-soft/35"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <LuCloudUpload className="h-9 w-9 text-vmb-secondary" aria-hidden />
          <span className="mt-2 text-sm font-semibold text-vmb-text-dark">
            Drop CSV here or browse
          </span>
          <span className="mt-1 text-xs text-vmb-text-muted">
            {uploadName ?? "Multiple files OK if your export is split."}
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            multiple
            onChange={(e) => onFile(e.target.files)}
          />
        </label>
      : null}

      {p.mode === "assisted" && assistedNotice ?
        <p
          className="mt-3 rounded-lg border border-vmb-pending/30 bg-vmb-bg-soft/80 px-3 py-2 text-center text-xs text-vmb-text-dark"
          role="status"
        >
          {assistedMsg}
        </p>
      : null}
    </>
  );
}

/**
 * @param {{
 *   p: ProviderConfig;
 *   actionCardShell: string;
 *   csvUpload: {
 *     uploadedFiles: File[];
 *     fileRejectError: string | null;
 *     serverError: string | null;
 *     analysisStatus: string;
 *     analysisStepDone: number;
 *     analysisSteps: string[];
 *     statusLabel: string;
 *     addFilesFromList: (list: FileList | null | undefined) => void;
 *     removeFile: (index: number) => void;
 *     runUploadAndAnalyze: () => Promise<void>;
 *   };
 *   assistedUpload: boolean;
 *   assistedNotice: boolean;
 *   apiAcknowledged: boolean;
 *   setApiAcknowledged: (v: boolean) => void;
 *   setAssistedUpload: (v: boolean) => void;
 *   setAssistedNotice: (v: boolean) => void;
 *   setUploadName: (v: string | null) => void;
 *   uploadInputRef: React.RefObject<HTMLInputElement | null>;
 *   uploadDropzoneRef: React.RefObject<HTMLDivElement | null>;
 *   connectCtaRef: React.RefObject<HTMLDivElement | null>;
 *   apiCsvSectionRef: React.RefObject<HTMLDivElement | null>;
 *   highlightUpload: boolean;
 *   highlightConnect: boolean;
 *   highlightApiCsv: boolean;
 *   assistedMsg: string;
 *   apiAckDefault: string;
 *   btnPrimary: string;
 *   btnSecondary: string;
 * }} props
 */
function MemberActionColumn({
  p,
  actionCardShell,
  csvUpload,
  assistedUpload,
  assistedNotice,
  apiAcknowledged,
  setApiAcknowledged,
  setAssistedUpload,
  setAssistedNotice,
  setUploadName,
  uploadInputRef,
  uploadDropzoneRef,
  connectCtaRef,
  apiCsvSectionRef,
  highlightUpload,
  highlightConnect,
  highlightApiCsv,
  assistedMsg,
  apiAckDefault,
  btnPrimary,
  btnSecondary,
}) {
  if (p.mode === "upload" || (p.mode === "assisted" && assistedUpload)) {
    return (
      <div className={actionCardShell}>
        <h3 className="text-sm font-semibold text-vmb-text-dark">
          Upload Your Files
        </h3>
        <p className="mt-1 text-xs leading-snug text-vmb-text-muted">
          Drop exported CSV reports here after following the steps.
        </p>
        <ul className="mt-3 space-y-1">
          {MEMBER_UPLOAD_CHECKLIST.map((line) => (
            <li
              key={line}
              className="flex gap-2 text-xs leading-snug text-vmb-text-dark"
            >
              <span className="text-vmb-success" aria-hidden>
                ✓
              </span>
              {line}
            </li>
          ))}
        </ul>
        <MemberCsvStagingUi
          csvUpload={csvUpload}
          uploadInputRef={uploadInputRef}
          uploadDropzoneRef={uploadDropzoneRef}
          highlightUpload={highlightUpload}
          browseButtonClass={btnPrimary}
        />
      </div>
    );
  }

  if (p.mode === "api") {
    return (
      <div className={actionCardShell}>
        <div ref={connectCtaRef} className={pulseRing(highlightConnect)}>
          <h3 className="text-sm font-semibold text-vmb-text-dark">
            Connect Account
          </h3>
          <p className="mt-1 text-xs leading-snug text-vmb-text-muted">
            Authorize VMB directly with this provider.
          </p>
          <button
            type="button"
            className={`mt-4 w-full ${btnPrimary}`}
            onClick={() => setApiAcknowledged(true)}
          >
            {p.connectLabel ?? `Connect ${p.name}`}
            <LuArrowRight className="h-4 w-4" aria-hidden />
          </button>
          {apiAcknowledged ?
            <p
              className="mt-2 rounded-lg border border-vmb-border-light bg-white px-3 py-2 text-xs text-vmb-text-dark"
              role="status"
            >
              {p.apiAckMessage ?? apiAckDefault}
            </p>
          : null}
          <p className="mt-3 text-[11px] italic text-vmb-text-muted">
            VMB never stores your provider password.
          </p>
        </div>

        <div
          ref={apiCsvSectionRef}
          className={`mt-4 border-t border-vmb-border-light pt-4 ${pulseRing(highlightApiCsv)}`}
        >
          <p className="text-xs font-semibold text-vmb-text-dark">
            Have CSV exports instead?
          </p>
          <p className="mt-1 text-[11px] leading-snug text-vmb-text-muted">
            Upload reports here if you’re not using the live connection yet.
          </p>
          <MemberCsvStagingUi
            csvUpload={csvUpload}
            uploadInputRef={uploadInputRef}
            highlightUpload={highlightApiCsv}
            browseButtonClass={btnPrimary}
            compactDropzone
          />
        </div>
      </div>
    );
  }

  if (p.mode === "assisted") {
    return (
      <div className={actionCardShell}>
        <h3 className="text-sm font-semibold text-vmb-text-dark">
          Assisted Setup
        </h3>
        {!assistedNotice && !assistedUpload ?
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              className={btnPrimary}
              onClick={() => {
                setAssistedUpload(true);
                setAssistedNotice(false);
                setUploadName(null);
              }}
            >
              <LuCloudUpload className="h-4 w-4" aria-hidden />
              Upload Reports
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setAssistedNotice(true);
                setAssistedUpload(false);
              }}
            >
              <LuHeadset className="h-4 w-4" aria-hidden />
              Request Assisted Setup
            </button>
          </div>
        : null}
        {assistedNotice ?
          <p
            className="mt-3 rounded-lg border border-vmb-pending/30 bg-white px-3 py-2 text-center text-xs text-vmb-text-dark"
            role="status"
          >
            {assistedMsg}
          </p>
        : null}
      </div>
    );
  }

  return null;
}
