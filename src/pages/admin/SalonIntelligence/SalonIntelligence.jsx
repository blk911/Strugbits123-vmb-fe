import React, { useRef } from "react";
import { LuChevronDown, LuSparkles } from "react-icons/lu";
import IntelligenceLayoutShell, {
  intelligenceBtnPrimaryClass,
} from "../../../components/intelligence/IntelligenceLayoutShell";
import ProviderOnboardingExperience from "../../../components/intelligence/ProviderOnboardingExperience";
import {
  LAB_PROVIDERS,
  PRIMARY_ORDER,
  SECONDARY_ORDER,
} from "../../../config/providerOnboardingData";

export default function SalonIntelligence() {
  const railRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  const focusRail = () => {
    railRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const hero = (
    <>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-vmb-secondary">
        VMB
      </p>
      <h1 className="mt-0.5 font-semibold text-lg text-vmb-text-dark sm:text-xl">
        Salon Intelligence Lab
      </h1>
      <p className="mt-1 text-sm font-medium text-vmb-text-dark">
        How do I get my data into VMB?
      </p>
      <p className="mt-1 text-xs text-vmb-text-muted sm:text-sm">
        Pick your platform, then follow the access path: exports, API, or
        assisted setup.
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-vmb-text-dark">
        {[
          "What to export or authorize",
          "Official links & steps",
          "Upload or connect",
        ].map((line) => (
          <li key={line} className="flex gap-1.5 leading-snug">
            <LuSparkles
              className="mt-0.5 h-3 w-3 shrink-0 text-vmb-secondary"
              aria-hidden
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={focusRail}
        className={`mt-3 ${intelligenceBtnPrimaryClass} py-2 text-xs sm:text-sm`}
      >
        Choose platform
        <LuChevronDown className="h-3.5 w-3.5 opacity-90" aria-hidden />
      </button>
    </>
  );

  return (
    <IntelligenceLayoutShell variant="admin" hero={hero}>
      <ProviderOnboardingExperience
        variant="lab"
        providers={LAB_PROVIDERS}
        primaryOrder={PRIMARY_ORDER}
        secondaryOrder={SECONDARY_ORDER}
        railRef={railRef}
      />
    </IntelligenceLayoutShell>
  );
}
