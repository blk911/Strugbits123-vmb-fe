import React from "react";
import { LuTelescope } from "react-icons/lu";

/**
 * @param {{ labels: string[] }} props
 */
export default function FutureInsightsPlaceholders({ labels }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <LuTelescope className="h-4 w-4 text-vmb-text-muted" aria-hidden />
        <h2 className="text-xs font-bold uppercase tracking-wide text-vmb-text-muted">
          On the roadmap
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {labels.map((label) => (
          <div
            key={label}
            className="rounded-lg border border-dashed border-vmb-border-light bg-vmb-bg-soft/30 px-3 py-2.5 text-xs text-vmb-text-muted"
          >
            <span className="font-medium text-vmb-text-dark/80">{label}</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-wide text-vmb-text-muted/90">
              Preview pipeline
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
