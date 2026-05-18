import React, { useCallback, useEffect, useRef, useState } from "react";
import { LuChevronDown, LuSparkles } from "react-icons/lu";
import ImportReviewPanel from "../../../components/deep-insights/ImportReviewPanel";
import ImportRunSummaryPanel from "../../../components/deep-insights/ImportRunSummaryPanel";
import IntelligenceLayoutShell from "../../../components/intelligence/IntelligenceLayoutShell";
import ProviderOnboardingExperience from "../../../components/intelligence/ProviderOnboardingExperience";
import TruthThreadArchitectureNote from "../../../components/taikos/TruthThreadArchitectureNote";
import {
  MEMBER_PROVIDERS,
  PRIMARY_ORDER,
  SECONDARY_ORDER,
} from "../../../config/providerOnboardingData";
import { useDeepInsightsHydration } from "../../../hooks/useDeepInsightsHydration";
import {
  DEEP_INSIGHTS_DATASET_EVENT,
  hasImportedDataset,
} from "../../../lib/deep-insights/storageKeys";

// ─── Accordion section shell ───────────────────────────────────────────────
function AccordionSection({ id, label, sublabel, isOpen, onToggle, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-vmb-border-light bg-white shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-vmb-bg-soft/40"
      >
        <div className="min-w-0">
          <span className="block text-[13px] font-semibold text-vmb-text-dark">
            {label}
          </span>
          {sublabel && (
            <span className="block text-[11px] text-vmb-text-muted">
              {sublabel}
            </span>
          )}
        </div>
        <LuChevronDown
          aria-hidden
          className={`h-4 w-4 shrink-0 text-vmb-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Body — only mounted when open */}
      {isOpen && (
        <div className="border-t border-vmb-border-light/60">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Insight bullets ───────────────────────────────────────────────────────
const insightBullets = [
  "Booking patterns",
  "Retention gaps",
  "Referral opportunities",
  "Slow schedule windows",
  "Client growth signals",
];

// ─── Page component ────────────────────────────────────────────────────────
export default function DeepInsightsDataCapture() {
  useDeepInsightsHydration();
  const railRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  // Accordion open state — provider open by default, others closed
  const [open, setOpen] = useState({
    provider: true,
    review: false,
    summary: false,
  });

  const toggle = useCallback((key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Auto-expand Review Map once files are selected this session
  useEffect(() => {
    const onDataset = () => {
      if (hasImportedDataset()) {
        setOpen((prev) => ({ ...prev, review: true }));
      }
    };

    window.addEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDataset);
    return () => window.removeEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDataset);
  }, []);

  const focusRail = useCallback(() => {
    railRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const hero = (
    <>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-vmb-secondary">
        VMB
      </p>
      <h1 className="mt-0.5 font-semibold text-lg text-vmb-text-dark sm:text-xl">
        Deep Insights — Data Capture
      </h1>
      <p className="mt-1 text-sm font-medium text-vmb-text-dark">
        Connect your salon platform and unlock insights.
      </p>
      <p className="mt-1 text-xs text-vmb-text-muted sm:text-sm">
        Import or connect your operational data. VMB normalizes records into a
        canonical view before analytics.
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-vmb-text-dark">
        {insightBullets.map((line) => (
          <li key={line} className="flex gap-1.5 leading-snug">
            <LuSparkles
              className="mt-0.5 h-3 w-3 shrink-0 text-vmb-secondary"
              aria-hidden
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <IntelligenceLayoutShell variant="member" hero={hero}>
      <div className="space-y-3">

        {/* Step 1 — Connect & Select Files */}
        <AccordionSection
          id="provider"
          label="Connect & Select Files"
          sublabel="Choose your platform or upload a CSV export"
          isOpen={open.provider}
          onToggle={toggle}
        >
          <ProviderOnboardingExperience
            variant="member"
            providers={MEMBER_PROVIDERS}
            primaryOrder={PRIMARY_ORDER}
            secondaryOrder={SECONDARY_ORDER}
            railRef={railRef}
            onChoosePlatform={focusRail}
          />
        </AccordionSection>

        {/* Step 2 — Review Map (auto-opens after file selection) */}
        <AccordionSection
          id="review"
          label="Review Map"
          sublabel={
            hasImportedDataset()
              ? "Review and repair your imported data"
              : "Available after files are selected"
          }
          isOpen={open.review}
          onToggle={toggle}
        >
          <ImportReviewPanel />
        </AccordionSection>

        {/* Step 3 — Import */}
        <AccordionSection
          id="summary"
          label="Import"
          sublabel="Run summary and audit log"
          isOpen={open.summary}
          onToggle={toggle}
        >
          <ImportRunSummaryPanel />
        </AccordionSection>

      </div>

      <TruthThreadArchitectureNote />
    </IntelligenceLayoutShell>
  );
}
