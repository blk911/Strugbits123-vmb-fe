import React, { useMemo, useState } from "react";
import OpportunityModal from "../../../components/deep-insights/OpportunityModal";
import TaikosBrandBlock from "../../../components/taikos/TaikosBrandBlock";
import TruthThreadArchitectureNote from "../../../components/taikos/TruthThreadArchitectureNote";
import { listStaticOpportunityRecords } from "../../../config/deepInsightsOpportunities";

export default function SalonOpportunitiesPage() {
  const catalog = useMemo(() => listStaticOpportunityRecords(), []);
  const [selectedId, setSelectedId] = useState(/** @type {string | null} */ (null));
  const selected = useMemo(
    () => (selectedId ? catalog.find((o) => o.id === selectedId) : null),
    [catalog, selectedId],
  );

  return (
    <div className="min-h-full bg-vmb-dashboard-bg font-poppins">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-vmb-border-light bg-white p-5 shadow-sm sm:p-6">
          <TaikosBrandBlock
            description="Opportunity engine — select a signal to open evidence, row actions, and approval-ready next steps. Relationship commerce, not blast marketing."
          />
          <TruthThreadArchitectureNote />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {catalog.map((opp) => (
            <button
              key={opp.id}
              type="button"
              onClick={() => setSelectedId(opp.id)}
              className="rounded-xl border border-vmb-border-light bg-white p-4 text-left shadow-sm transition hover:border-vmb-secondary/35 hover:shadow-md"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-vmb-secondary">
                {opp.type}
              </p>
              <p className="mt-1 font-semibold text-vmb-text-dark">{opp.title}</p>
              <p className="mt-2 line-clamp-2 text-sm text-vmb-text-muted">
                {opp.signal}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selected ?
        <OpportunityModal
          open
          onClose={() => setSelectedId(null)}
          title={selected.title}
          type={selected.type}
          signal={selected.signal}
          context={selected.context}
          opportunity={selected.opportunity}
          recommendedAction={selected.recommendedAction}
          evidenceRows={selected.evidenceRows}
          actions={selected.actions}
          humanContextPrompt={selected.humanContextPrompt}
        />
      : null}
    </div>
  );
}
