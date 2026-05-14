import React from "react";
import InsightCard from "./InsightCard";
import { segmentHints } from "../../../config/deepInsightsMetricHints";
import { getSegmentOpportunityId } from "../../../config/deepInsightsOpportunities";

const segmentAccent = {
  vip: "border-l-4 border-l-vmb-gold",
  referral: "border-l-4 border-l-vmb-secondary",
  reactivation: "border-l-4 border-l-amber-500/70",
  color: "border-l-4 border-l-fuchsia-400/80",
  nails: "border-l-4 border-l-rose-400/80",
  gift: "border-l-4 border-l-emerald-500/70",
};

/**
 * @param {{
 *   segments: Array<{ id: string; name: string; count: number; spendSummary: string }>;
 *   onOpenOpportunity?: (id: string) => void;
 * }} props
 */
export default function SegmentBreakdown({ segments, onOpenOpportunity }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-vmb-text-muted">
        Client segments
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((seg) => (
          <InsightCard
            key={seg.id}
            title={seg.name}
            className={segmentAccent[seg.id] ?? ""}
            metricHint={segmentHints[seg.id]}
            opportunityId={getSegmentOpportunityId(seg.id)}
            onOpenOpportunity={onOpenOpportunity}
          >
            <p className="text-2xl font-semibold tabular-nums text-vmb-text-dark">
              {seg.count}
            </p>
            <p className="mt-1 text-xs leading-snug text-vmb-text-muted">
              {seg.spendSummary}
            </p>
          </InsightCard>
        ))}
      </div>
    </section>
  );
}
