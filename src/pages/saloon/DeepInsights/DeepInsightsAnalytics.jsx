import React, { useCallback, useMemo, useState } from "react";
import AnalyticsHero from "../../../components/deep-insights/analytics/AnalyticsHero";
import RevenueSignals from "../../../components/deep-insights/analytics/RevenueSignals";
import ClientBehavior from "../../../components/deep-insights/analytics/ClientBehavior";
import VmbOpportunities from "../../../components/deep-insights/analytics/VmbOpportunities";
import BookingPatterns from "../../../components/deep-insights/analytics/BookingPatterns";
import SegmentBreakdown from "../../../components/deep-insights/analytics/SegmentBreakdown";
import FutureInsightsPlaceholders from "../../../components/deep-insights/analytics/FutureInsightsPlaceholders";
import OpportunityModal from "../../../components/deep-insights/OpportunityModal";
import {
  futureInsightPlaceholders,
  mockPresentation,
} from "../../../config/deepInsightsMockDataset";
import { getOpportunityById } from "../../../config/deepInsightsOpportunities";

export default function DeepInsightsAnalytics() {
  const [selectedOppId, setSelectedOppId] = useState(/** @type {string | null} */ (null));

  const selectedOpp = useMemo(
    () => (selectedOppId ? getOpportunityById(selectedOppId) : null),
    [selectedOppId],
  );

  const openOpp = useCallback((id) => {
    setSelectedOppId(id);
  }, []);
  const metaHint = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("vmb_deep_insights_canonical_preview");
      if (!raw) return null;
      const m = JSON.parse(raw);
      return typeof m?.schemaVersion === "string" ? m.schemaVersion : null;
    } catch {
      return null;
    }
  }, []);

  return (
    <div className="space-y-5 pb-8">
      <AnalyticsHero stats={mockPresentation.heroStats} onOpenOpportunity={openOpp} />

      {metaHint ?
        <p className="text-center text-[10px] font-medium uppercase tracking-wider text-vmb-text-muted">
          Preview dataset · {metaHint}
        </p>
      : null}

      <div className="space-y-6 rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm sm:p-5">
        <RevenueSignals
          items={mockPresentation.revenueSignals}
          onOpenOpportunity={openOpp}
        />
        <hr className="border-vmb-border-light" />
        <ClientBehavior
          items={mockPresentation.clientBehavior}
          onOpenOpportunity={openOpp}
        />
        <hr className="border-vmb-border-light" />
        <VmbOpportunities
          items={mockPresentation.vmbOpportunities}
          onOpenOpportunity={openOpp}
        />
        <hr className="border-vmb-border-light" />
        <BookingPatterns
          {...mockPresentation.bookingPatterns}
          onOpenOpportunity={openOpp}
        />
        <hr className="border-vmb-border-light" />
        <SegmentBreakdown
          segments={mockPresentation.segments}
          onOpenOpportunity={openOpp}
        />
        <hr className="border-vmb-border-light" />
        <FutureInsightsPlaceholders labels={futureInsightPlaceholders} />
      </div>

      <p className="text-center text-[10px] text-vmb-text-muted">
        Intelligence preview · not a spreadsheet export. Production metrics will
        reflect your live canonical pipeline.
      </p>

      {selectedOpp ?
        <OpportunityModal
          open
          onClose={() => setSelectedOppId(null)}
          title={selectedOpp.title}
          type={selectedOpp.type}
          signal={selectedOpp.signal}
          context={selectedOpp.context}
          opportunity={selectedOpp.opportunity}
          recommendedAction={selectedOpp.recommendedAction}
          evidenceRows={selectedOpp.evidenceRows}
          actions={selectedOpp.actions}
          humanContextPrompt={selectedOpp.humanContextPrompt}
        />
      : null}
    </div>
  );
}
