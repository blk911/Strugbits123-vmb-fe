import React from "react";
import InsightCard from "./InsightCard";
import { clientBehaviorHints } from "../../../config/deepInsightsMetricHints";
import { opportunityIdByClientBehaviorTitle } from "../../../config/deepInsightsOpportunities";

/**
 * @param {{
 *   items: Array<{ title: string; value: string; detail: string }>;
 *   onOpenOpportunity?: (id: string) => void;
 * }} props
 */
export default function ClientBehavior({ items, onOpenOpportunity }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-vmb-text-muted">
        Client behavior
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item) => (
          <InsightCard
            key={item.title}
            title={item.title}
            metricHint={clientBehaviorHints[item.title]}
            opportunityId={opportunityIdByClientBehaviorTitle[item.title]}
            onOpenOpportunity={onOpenOpportunity}
          >
            <p className="text-xl font-semibold tabular-nums text-vmb-text-dark">
              {item.value}
            </p>
            <p className="mt-1 text-xs leading-snug text-vmb-text-muted">{item.detail}</p>
          </InsightCard>
        ))}
      </div>
    </section>
  );
}
