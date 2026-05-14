import React from "react";
import { LuChevronRight } from "react-icons/lu";
import MetricInfoTip from "./MetricInfoTip";

/**
 * @param {{
 *   title: string;
 *   children: React.ReactNode;
 *   variant?: "default" | "gem";
 *   className?: string;
 *   metricHint?: string;
 *   opportunityId?: string;
 *   onOpenOpportunity?: (id: string) => void;
 * }} props
 */
export default function InsightCard({
  title,
  children,
  variant = "default",
  className = "",
  metricHint,
  opportunityId,
  onOpenOpportunity,
}) {
  const base =
    variant === "gem" ?
      "border-vmb-secondary/35 bg-gradient-to-br from-vmb-secondary/8 via-white to-vmb-bg-soft/40 shadow-[0_8px_28px_-18px_rgba(164,95,118,0.45)]"
    : "border-vmb-border-light bg-white";

  const interactive =
    !!opportunityId && typeof onOpenOpportunity === "function";
  const interactiveClass = interactive ?
    "cursor-pointer transition hover:-translate-y-[1px] hover:border-vmb-secondary/45 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vmb-secondary/35"
  : "";

  return (
    <article
      className={`flex min-h-0 flex-col rounded-xl border p-3 shadow-sm sm:p-3.5 ${base} ${interactiveClass} ${className}`}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={
        interactive ?
          () => {
            onOpenOpportunity(opportunityId);
          }
        : undefined
      }
      onKeyDown={
        interactive ?
          (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenOpportunity(opportunityId);
            }
          }
        : undefined
      }
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 text-[11px] font-bold uppercase tracking-wide text-vmb-text-muted">
          {title}
        </h3>
        {metricHint ?
          <MetricInfoTip text={metricHint} label={title} />
        : null}
      </div>
      <div className="mt-2 min-h-0 flex-1">{children}</div>
      {interactive ?
        <div className="mt-3 flex items-center justify-between border-t border-vmb-border-light/80 pt-2 text-[10px] font-bold uppercase tracking-wide text-vmb-secondary">
          <span>View opportunity</span>
          <LuChevronRight className="h-3.5 w-3.5" aria-hidden />
        </div>
      : null}
    </article>
  );
}
