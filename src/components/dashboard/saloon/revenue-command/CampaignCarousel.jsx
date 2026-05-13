import React from "react";
import DashboardSection from "./DashboardSection";
import { CAMPAIGNS } from "./constants";

export default function CampaignCarousel({ onExclusiveInvite }) {
  return (
    <DashboardSection
      label="Launch"
      title="Campaign roster"
      description="Premium horizontal plays — each row is a deployable revenue motion."
    >
      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-1 md:gap-4">
        {CAMPAIGNS.map((c) => (
          <article
            key={c.id}
            className="w-[min(300px,calc(100vw-2.5rem))] shrink-0 snap-start rounded-xl border border-white/[0.1] bg-[#121826]/95 shadow-none"
          >
            <div
              className={`relative h-24 bg-gradient-to-r px-4 py-3 ${c.gradient}`}
            >
              <div className={`h-8 w-8 rounded-lg ${c.accent}`} aria-hidden />
              <p className="absolute bottom-2 left-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F7E7CE]/60">
                {c.subtitle}
              </p>
            </div>
            <div className="border-t border-white/[0.06] p-4">
              <h3 className="font-studio-serif text-lg font-medium text-[#F7E7CE]">
                {c.title}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tabular-nums text-slate-500">
                <span>
                  <span className="font-semibold text-slate-300">
                    {c.shares.toLocaleString()}
                  </span>{" "}
                  reach
                </span>
                <span className="text-slate-600">·</span>
                <span>
                  <span className="font-semibold text-[#F7E7CE]/90">
                    {c.claimed}
                  </span>{" "}
                  conversions
                </span>
              </div>
              <button
                type="button"
                onClick={onExclusiveInvite}
                className="mt-4 w-full rounded-lg border border-white/10 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-[#F7E7CE]/25 hover:text-[#F7E7CE]"
              >
                Configure launch
              </button>
            </div>
          </article>
        ))}
      </div>
    </DashboardSection>
  );
}
