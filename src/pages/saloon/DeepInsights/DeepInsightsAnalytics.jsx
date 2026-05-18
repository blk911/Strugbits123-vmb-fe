import React, { useCallback, useMemo, useState } from "react";
import AnalyticsHero from "../../../components/deep-insights/analytics/AnalyticsHero";
import RevenueSignals from "../../../components/deep-insights/analytics/RevenueSignals";
import ClientBehavior from "../../../components/deep-insights/analytics/ClientBehavior";
import VmbOpportunities from "../../../components/deep-insights/analytics/VmbOpportunities";
import BookingPatterns from "../../../components/deep-insights/analytics/BookingPatterns";
import SegmentBreakdown from "../../../components/deep-insights/analytics/SegmentBreakdown";
import FutureInsightsPlaceholders from "../../../components/deep-insights/analytics/FutureInsightsPlaceholders";
import OpportunityModal from "../../../components/deep-insights/OpportunityModal";
import { futureInsightPlaceholders } from "../../../config/deepInsightsMockDataset";
import { getOpportunityById } from "../../../config/deepInsightsOpportunities";
import { getAnalyticsPresentationBundle } from "../../../config/deepInsightsImportedPresentation";
import { useDeepInsightsHydration } from "../../../hooks/useDeepInsightsHydration";
import ImportQualityPanel from "../../../components/deep-insights/analytics/ImportQualityPanel";

function formatImportedAt(iso) {
  if (!iso || typeof iso !== "string") return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 19);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function DeepInsightsAnalytics() {
  useDeepInsightsHydration();
  const [selectedOppId, setSelectedOppId] = useState(/** @type {string | null} */ (null));

  const { banner, presentation, useImported, metaVersion } =
    getAnalyticsPresentationBundle();

  /** @type {typeof import("../../../config/deepInsightsMockDataset.js").mockPresentation} */
  const view = presentation;

  const selectedOpp = useMemo(
    () => (selectedOppId ? getOpportunityById(selectedOppId) : null),
    [selectedOppId],
  );

  const openOpp = useCallback((id) => {
    setSelectedOppId(id);
  }, []);

  return (
    <div className="space-y-5 pb-8">
      <AnalyticsHero stats={view.heroStats} onOpenOpportunity={openOpp} />

      {banner ?
        <div
          className="rounded-lg border border-vmb-secondary/35 bg-vmb-secondary/8 px-3 py-2 text-center text-xs text-vmb-text-dark"
          role="status"
        >
          <p className="font-semibold text-vmb-text-dark">{banner.label}</p>
          <p className="mt-1 text-[11px] text-vmb-text-muted">
            Imported: {formatImportedAt(banner.importedAt)} · Clients:{" "}
            {banner.clients} · Appointments: {banner.appointments} · Transactions:{" "}
            {banner.transactions}
          </p>
        </div>
      : !useImported && metaVersion ?
        <p className="text-center text-[10px] font-medium uppercase tracking-wider text-vmb-text-muted">
          Demo dataset · {metaVersion}
        </p>
      : null}

      {useImported ?
        <ImportQualityPanel />
      : null}

      <div className="space-y-6 rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm sm:p-5">
        <RevenueSignals
          items={view.revenueSignals}
          onOpenOpportunity={openOpp}
        />
        <hr className="border-vmb-border-light" />
        <ClientBehavior
          items={view.clientBehavior}
          onOpenOpportunity={openOpp}
        />
        <hr className="border-vmb-border-light" />
        <VmbOpportunities
          items={view.vmbOpportunities}
          onOpenOpportunity={openOpp}
        />
        <hr className="border-vmb-border-light" />
        <BookingPatterns
          {...view.bookingPatterns}
          onOpenOpportunity={openOpp}
        />
        <hr className="border-vmb-border-light" />
        <SegmentBreakdown
          segments={view.segments}
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
