import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  LuArrowRight,
  LuChevronDown,
  LuCloudUpload,
  LuExternalLink,
  LuHeadset,
  LuImage,
} from "react-icons/lu";
import { intelligenceBtnPrimaryClass } from "./IntelligenceLayoutShell";
import DeepInsightsMemberIngestionCard from "../deep-insights/DeepInsightsMemberIngestionCard.jsx";

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

/** @param {boolean} active */
function pulseRing(active) {
  return [
    "scroll-mt-24 rounded-lg transition-[box-shadow] duration-300",
    active ? "ring-2 ring-vmb-secondary ring-offset-2 ring-offset-white" : "",
  ].join(" ");
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
}) {
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
        <DeepInsightsMemberIngestionCard
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
          <DeepInsightsMemberIngestionCard
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
