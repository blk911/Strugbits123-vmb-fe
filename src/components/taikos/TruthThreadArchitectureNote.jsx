import React from "react";

/** Inline architecture reminder — relationship commerce, not generic AI chat. */
export default function TruthThreadArchitectureNote() {
  return (
    <aside
      className="mt-4 rounded-xl border border-dashed border-vmb-border-light bg-vmb-bg-soft/50 px-3 py-3 text-[11px] leading-relaxed text-vmb-text-muted"
      aria-label="tAIkOS architecture note"
    >
      <p className="font-semibold text-vmb-text-dark">Truth thread engine (roadmap)</p>
      <p className="mt-1">
        Provider exports, calendar, social signals, and VMB invites normalize into truth
        threads. Threads produce opportunity overlays — small intelligent loops aimed at
        measurable relationship outcomes, not bulk discount blasts.
      </p>
    </aside>
  );
}
