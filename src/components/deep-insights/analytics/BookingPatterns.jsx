import React from "react";
import InsightCard from "./InsightCard";
import MetricInfoTip from "./MetricInfoTip";
import { bookingPatternCardHints } from "../../../config/deepInsightsMetricHints";
import { opportunityIdByBookingCard } from "../../../config/deepInsightsOpportunities";

/** @param {{ label: string; pct: number }} props */
function MiniBarRow({ label, pct }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-9 shrink-0 text-[10px] font-semibold text-vmb-text-muted">
        {label}
      </span>
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-vmb-bg-soft">
        <div
          className="h-full rounded-full bg-vmb-secondary/80 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * @param {{
 *   busiestDays: Array<{ label: string; pct: number }>;
 *   busiestProviders: Array<{ label: string; pct: number }>;
 *   cancellationRate: string;
 *   noShowRate: string;
 *   avgBookingLeadTimeDays: string;
 *   onOpenOpportunity?: (id: string) => void;
 * }} props
 */
export default function BookingPatterns({
  busiestDays,
  busiestProviders,
  cancellationRate,
  noShowRate,
  avgBookingLeadTimeDays,
  onOpenOpportunity,
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-vmb-text-muted">
        Booking patterns
      </h2>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <InsightCard
          title="Busiest days"
          metricHint={bookingPatternCardHints.busiestDays}
          opportunityId={opportunityIdByBookingCard.busiestDays}
          onOpenOpportunity={onOpenOpportunity}
        >
          <div className="space-y-2">
            {busiestDays.map((row) => (
              <MiniBarRow key={row.label} label={row.label} pct={row.pct} />
            ))}
          </div>
        </InsightCard>
        <InsightCard
          title="Busiest providers"
          metricHint={bookingPatternCardHints.busiestProviders}
          opportunityId={opportunityIdByBookingCard.busiestProviders}
          onOpenOpportunity={onOpenOpportunity}
        >
          <div className="space-y-2">
            {busiestProviders.map((row) => (
              <MiniBarRow key={row.label} label={row.label} pct={row.pct} />
            ))}
          </div>
        </InsightCard>
        <InsightCard
          title="Operations snapshot"
          metricHint={bookingPatternCardHints.operationsSnapshot}
          opportunityId={opportunityIdByBookingCard.operations}
          onOpenOpportunity={onOpenOpportunity}
        >
          <ul className="space-y-3 text-sm">
            <li className="flex items-start justify-between gap-2 border-b border-dashed border-vmb-border-light pb-2">
              <span className="flex min-w-0 items-start gap-1 text-vmb-text-muted">
                <span>Cancellation rate</span>
                <MetricInfoTip
                  text={bookingPatternCardHints.cancellationRate}
                  label="Cancellation rate"
                />
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-vmb-text-dark">
                {cancellationRate}
              </span>
            </li>
            <li className="flex items-start justify-between gap-2 border-b border-dashed border-vmb-border-light pb-2">
              <span className="flex min-w-0 items-start gap-1 text-vmb-text-muted">
                <span>No-show rate</span>
                <MetricInfoTip
                  text={bookingPatternCardHints.noShowRate}
                  label="No-show rate"
                />
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-vmb-text-dark">
                {noShowRate}
              </span>
            </li>
            <li className="flex items-start justify-between gap-2">
              <span className="flex min-w-0 items-start gap-1 text-vmb-text-muted">
                <span>Avg booking lead time</span>
                <MetricInfoTip
                  text={bookingPatternCardHints.bookingLeadTime}
                  label="Avg booking lead time"
                />
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-vmb-text-dark">
                {avgBookingLeadTimeDays} days
              </span>
            </li>
          </ul>
        </InsightCard>
      </div>
    </section>
  );
}
