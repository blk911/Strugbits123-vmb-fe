import React from "react";
import InsightCard from "./InsightCard";
import { revenueSignalHints } from "../../../config/deepInsightsMetricHints";
import { opportunityIdByRevenueTitle } from "../../../config/deepInsightsOpportunities";

/**
 * @param {{
 *   items: Array<{ title: string; value: string; detail: string }>;
 *   onOpenOpportunity?: (id: string) => void;
 * }} props
 */
export default function RevenueSignals({ items, onOpenOpportunity }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-vmb-text-muted">
        Revenue signals
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <InsightCard
            key={item.title}
            title={item.title}
            metricHint={revenueSignalHints[item.title]}
            opportunityId={opportunityIdByRevenueTitle[item.title]}
            onOpenOpportunity={onOpenOpportunity}
          >
            <p className="text-base font-semibold text-vmb-text-dark">{item.value}</p>
            <p className="mt-1 text-xs leading-snug text-vmb-text-muted">{item.detail}</p>
          </InsightCard>
        ))}
      </div>
    </section>
  );
}
