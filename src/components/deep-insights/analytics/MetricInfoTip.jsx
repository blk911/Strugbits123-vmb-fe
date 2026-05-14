import React from "react";
import { LuCircleHelp } from "react-icons/lu";

/**
 * Hover/focus tooltip — top-aligned from icon (header top-right pattern).
 * @param {{ text: string; label?: string }} props
 */
export default function MetricInfoTip({ text, label = "Metric definition" }) {
  return (
    <span className="group/metric relative inline-flex shrink-0 align-middle">
      <button
        type="button"
        className="rounded p-0.5 text-vmb-gold outline-none transition hover:text-amber-600 focus-visible:ring-2 focus-visible:ring-vmb-secondary/35"
        aria-label={`${label}. ${text}`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <LuCircleHelp className="h-3.5 w-3.5 opacity-90" strokeWidth={2} aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full right-0 z-[70] mb-1.5 w-max max-w-[min(260px,calc(100vw-2rem))] rounded-md border border-zinc-500/40 bg-zinc-900 px-2.5 py-2 text-left text-[11px] font-normal normal-case leading-snug tracking-normal text-zinc-100 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.45)] opacity-0 transition-opacity duration-150 ease-out group-hover/metric:opacity-100 group-focus-within/metric:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
