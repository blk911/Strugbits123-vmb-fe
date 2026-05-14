import React from "react";
import { LuSparkles, LuChevronRight } from "react-icons/lu";
import MetricInfoTip from "./MetricInfoTip";
import { heroMetricHints } from "../../../config/deepInsightsMetricHints";
import { opportunityIdByHeroStat } from "../../../config/deepInsightsOpportunities";

/**
 * @param {{
 *   stats: Array<{ id: string; label: string; value: string; hint: string }>;
 *   onOpenOpportunity?: (id: string) => void;
 * }} props
 */
export default function AnalyticsHero({ stats, onOpenOpportunity }) {
  return (
    <header className="rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start gap-2">
        <LuSparkles
          className="mt-0.5 h-5 w-5 shrink-0 text-vmb-secondary"
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-vmb-secondary">
            Deep Insights
          </p>
          <h1 className="mt-1 font-semibold text-lg text-vmb-text-dark sm:text-xl">
            Deep Insights
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-vmb-text-muted">
            VMB analyzed your salon activity and identified operational patterns,
            growth opportunities, and client behavior signals.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => {
          const oppId = opportunityIdByHeroStat[s.id];
          const interactive = !!(oppId && onOpenOpportunity);
          return (
            <div
              key={s.id}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              className={`rounded-lg border border-vmb-border-light bg-vmb-bg-soft/25 px-2.5 py-2.5 sm:px-3 ${
                interactive ?
                  "cursor-pointer transition hover:-translate-y-[1px] hover:border-vmb-secondary/45 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vmb-secondary/35"
                : ""
              }`}
              onClick={
                interactive && oppId ?
                  () => onOpenOpportunity(oppId)
                : undefined
              }
              onKeyDown={
                interactive && oppId ?
                  (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenOpportunity(oppId);
                    }
                  }
                : undefined
              }
            >
              <div className="flex items-start justify-between gap-1">
                <p className="min-w-0 flex-1 text-[10px] font-semibold uppercase tracking-wide text-vmb-text-muted">
                  {s.label}
                </p>
                {heroMetricHints[s.id] ?
                  <MetricInfoTip
                    text={heroMetricHints[s.id]}
                    label={s.label}
                  />
                : null}
              </div>
              <p className="mt-1 font-semibold tabular-nums text-vmb-text-dark sm:text-lg">
                {s.value}
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-vmb-text-muted">
                {s.hint}
              </p>
              {interactive ?
                <div className="mt-2 flex items-center justify-between border-t border-vmb-border-light/70 pt-1.5 text-[9px] font-bold uppercase tracking-wide text-vmb-secondary">
                  <span>View opportunity</span>
                  <LuChevronRight className="h-3 w-3" aria-hidden />
                </div>
              : null}
            </div>
          );
        })}
      </div>
    </header>
  );
}
