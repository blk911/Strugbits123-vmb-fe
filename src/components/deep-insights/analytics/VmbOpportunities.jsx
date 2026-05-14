import React from "react";
import { LuGem } from "react-icons/lu";
import InsightCard from "./InsightCard";
import { vmbOpportunityHints } from "../../../config/deepInsightsMetricHints";
import { opportunityIdByVmbIndex } from "../../../config/deepInsightsOpportunities";

/**
 * @param {{
 *   items: Array<{ title: string; body: string; tone?: string }>;
 *   onOpenOpportunity?: (id: string) => void;
 * }} props
 */
export default function VmbOpportunities({ items, onOpenOpportunity }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <LuGem className="h-4 w-4 text-vmb-secondary" aria-hidden />
        <h2 className="text-xs font-bold uppercase tracking-wide text-vmb-text-muted">
          VMB opportunities
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((item, i) => (
          <InsightCard
            key={item.title}
            title={item.title}
            variant="gem"
            metricHint={vmbOpportunityHints[i]}
            opportunityId={opportunityIdByVmbIndex[i]}
            onOpenOpportunity={onOpenOpportunity}
          >
            <p className="text-sm font-medium leading-relaxed text-vmb-text-dark">
              {item.body}
            </p>
          </InsightCard>
        ))}
      </div>
    </section>
  );
}
