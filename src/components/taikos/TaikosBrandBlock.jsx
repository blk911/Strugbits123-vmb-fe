import React from "react";
import { OWNER_APPROVAL_BADGE } from "../../config/salonBusinessDriversMock";

const defaultMark = (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-vmb-gold/50 bg-slate-950 text-[11px] font-bold text-vmb-gold">
    AI
  </div>
);

/**
 * @param {{
 *   showApprovalBadge?: boolean;
 *   title?: string;
 *   subtitle?: string;
 *   description?: string;
 *   mark?: React.ReactNode;
 * }} props
 */
export default function TaikosBrandBlock({
  showApprovalBadge = false,
  title = "tAIkOS",
  subtitle = "Deep Foresights",
  description,
  mark = defaultMark,
}) {
  return (
    <div className="flex min-w-0 gap-3">
      {mark}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-studio-serif text-lg font-medium leading-tight text-[#2f2a28] sm:text-xl">
            {title}
          </p>
          {showApprovalBadge ?
            <span className="rounded-full bg-[#f3e8df] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#7f5362] ring-1 ring-[#e8ddd4]">
              {OWNER_APPROVAL_BADGE}
            </span>
          : null}
        </div>
        <p className="text-[12px] font-medium text-[#a45f76]/90 sm:text-[13px]">{subtitle}</p>
        {description ?
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6b6262]">{description}</p>
        : null}
      </div>
    </div>
  );
}
