import React from "react";

export default function ConciergeModule({
  activeConversations,
  waitingHandoffs,
  warmLeadsToday,
  onOpenInbox,
  onReviewHandoffs,
  onContinueSms,
}) {
  return (
    <div className="rounded-2xl border border-violet-500/15 bg-[#121826]/90 p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300/40">
            Intelligence
          </p>
          <h3 className="font-studio-serif mt-2 text-xl font-medium text-[#F7E7CE]">
            AI Concierge
          </h3>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-200/90 ring-1 ring-violet-400/25">
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            aria-hidden
          />
          Active
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Surface for AI-assisted client routing. Counts are illustrative until
        concierge API is wired.
      </p>
      <ul className="mt-4 space-y-2 border-y border-white/[0.06] py-4 text-sm">
        <li className="flex justify-between tabular-nums">
          <span className="text-slate-500">Active conversations</span>
          <span className="font-semibold text-slate-200">
            {activeConversations}
          </span>
        </li>
        <li className="flex justify-between tabular-nums">
          <span className="text-slate-500">Waiting handoff</span>
          <span className="font-semibold text-slate-200">
            {waitingHandoffs}
          </span>
        </li>
        <li className="flex justify-between tabular-nums">
          <span className="text-slate-500">Warm leads today</span>
          <span className="font-semibold text-[#F7E7CE]">{warmLeadsToday}</span>
        </li>
      </ul>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={onOpenInbox}
          className="w-full rounded-lg bg-[#F7E7CE] py-2.5 text-sm font-semibold text-slate-900 transition hover:brightness-105"
        >
          Open Inbox
        </button>
        <button
          type="button"
          onClick={onReviewHandoffs}
          className="w-full rounded-lg border border-white/12 bg-white/[0.04] py-2.5 text-sm font-semibold text-[#F7E7CE] transition hover:border-white/20"
        >
          Review Handoffs
        </button>
        <button
          type="button"
          onClick={onContinueSms}
          className="w-full rounded-lg border border-white/10 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/15 hover:text-white"
        >
          Continue SMS
        </button>
      </div>
    </div>
  );
}
