import React, { useCallback, useRef } from "react";
import { LuSparkles } from "react-icons/lu";
import IntelligenceLayoutShell from "../../../components/intelligence/IntelligenceLayoutShell";
import ProviderOnboardingExperience from "../../../components/intelligence/ProviderOnboardingExperience";
import {
  MEMBER_PROVIDERS,
  PRIMARY_ORDER,
  SECONDARY_ORDER,
} from "../../../config/providerOnboardingData";
import { MOCK_IMPORT_META } from "../../../config/deepInsightsMockDataset";
import { useNavigate } from "react-router-dom";

const insightBullets = [
  "Booking patterns",
  "Retention gaps",
  "Referral opportunities",
  "Slow schedule windows",
  "Client growth signals",
];

export default function DeepInsightsDataCapture() {
  const railRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const navigate = useNavigate();

  const focusRail = () => {
    railRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const onPipelineComplete = useCallback(() => {
    try {
      sessionStorage.setItem(
        "vmb_deep_insights_canonical_preview",
        JSON.stringify(MOCK_IMPORT_META),
      );
    } catch {
      /* ignore quota / privacy mode */
    }
    navigate("/salon-owner/deep-insights/analytics");
  }, [navigate]);

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
      <ProviderOnboardingExperience
        variant="member"
        providers={MEMBER_PROVIDERS}
        primaryOrder={PRIMARY_ORDER}
        secondaryOrder={SECONDARY_ORDER}
        railRef={railRef}
        onChoosePlatform={focusRail}
        onDeepInsightsPipelineComplete={onPipelineComplete}
      />
    </IntelligenceLayoutShell>
  );
}
