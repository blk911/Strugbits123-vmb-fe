import React from "react";

/** Primary CTA — keep in sync across admin + salon intelligence headers */
export const intelligenceBtnPrimaryClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-vmb-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-vmb-primary hover:opacity-95";

/**
 * Canonical wrapper for Intelligence Lab + Deep Insights.
 * Structure and spacing match /admin/intelligence-lab exactly.
 *
 * @param {{
 *   hero: React.ReactNode;
 *   children: React.ReactNode;
 *   variant?: "admin" | "member";
 * }} props
 */
export default function IntelligenceLayoutShell({
  hero,
  children,
  variant = "admin",
}) {
  return (
    <div
      className="min-h-full bg-vmb-dashboard-bg font-poppins"
      data-intelligence-variant={variant}
    >
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
        <section className="rounded-xl border border-vmb-border-light bg-white p-3 shadow-sm sm:p-4">
          <div className="border-b border-vmb-border-light pb-3 sm:pb-4">
            {hero}
          </div>
          <div className="mt-4">{children}</div>
        </section>
      </div>
    </div>
  );
}
