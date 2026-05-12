import React from "react";
import StatPill from "./StatPill";

export default function HeroCommandBar({
  salonName,
  stats,
  onDraftInvite,
  onOpenConcierge,
  onCreateGiftRequest,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-gradient-to-br from-[#161d2e]/95 via-[#121826] to-[#0f1524] p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F7E7CE]/35">
            Command
          </p>
          <h1 className="font-studio-serif mt-2 text-3xl font-medium tracking-tight text-[#F7E7CE] sm:text-4xl md:text-[2.5rem] md:leading-tight">
            The Private Studio
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-[15px]">
            Invite-only client network for trusted relationships and active
            revenue flow.
          </p>
          {salonName ?
            <p className="mt-2 text-sm font-medium text-slate-300">
              {salonName}
            </p>
          : null}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col lg:items-stretch">
          <button
            type="button"
            onClick={onDraftInvite}
            className="rounded-lg bg-[#F7E7CE] px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:brightness-105"
          >
            Draft Invite
          </button>
          <button
            type="button"
            onClick={onOpenConcierge}
            className="rounded-lg border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-[#F7E7CE] transition hover:border-white/25 hover:bg-white/[0.07]"
          >
            Open Concierge
          </button>
          <button
            type="button"
            onClick={onCreateGiftRequest}
            className="rounded-lg border border-white/10 bg-transparent px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/15 hover:text-white"
          >
            Create Gift Request
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatPill label="Warm Leads" value={stats.warmLeads} />
        <StatPill label="Pending Gifts" value={stats.pendingGifts} />
        <StatPill label="Referral Activity" value={stats.referralActivity} />
        <StatPill
          label="AI Concierge"
          value={stats.aiHandoffs}
          sub="messages · handoffs"
        />
        <StatPill label="VIP Clients" value={stats.vipClients} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
        <span className="rounded-md border border-[#F7E7CE]/20 bg-[#F7E7CE]/5 px-3 py-1.5 text-xs font-medium tabular-nums text-[#F7E7CE]">
          {stats.referralFlowDisplay} Referral Flow
        </span>
      </div>
    </div>
  );
}
