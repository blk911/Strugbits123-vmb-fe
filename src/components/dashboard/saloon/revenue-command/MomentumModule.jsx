import React from "react";

export default function MomentumModule() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-[#121826]/90 p-5 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F7E7CE]/35">
            Intelligence
          </p>
          <h3 className="font-studio-serif mt-2 text-xl font-medium text-[#F7E7CE]">
            Network Momentum
          </h3>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Referral heat
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        Client pull across your private graph — structured signal, not
        decoration.
      </p>
      <div
        className="relative mt-4 h-40 rounded-xl border border-white/[0.08] bg-[#0c1220]"
        aria-hidden
      >
        <svg
          className="absolute inset-0 h-full w-full text-[#F7E7CE]/20"
          viewBox="0 0 200 140"
          preserveAspectRatio="xMidYMid meet"
        >
          <line x1="100" y1="72" x2="52" y2="40" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="72" x2="150" y2="38" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="72" x2="96" y2="108" stroke="currentColor" strokeWidth="1" />
          <line x1="52" y1="40" x2="150" y2="38" stroke="currentColor" strokeWidth="0.8" />
          <line x1="96" y1="108" x2="150" y2="38" stroke="currentColor" strokeWidth="0.8" />
          {[
            [100, 72, 5, "0.9"],
            [52, 40, 4, "0.4"],
            [150, 38, 4, "0.45"],
            [96, 108, 3.5, "0.35"],
            [30, 95, 2.8, "0.3"],
            [170, 98, 3, "0.32"],
          ].map(([cx, cy, r, o], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="#141c2c"
              stroke="#F7E7CE"
              strokeWidth="1"
              opacity={o}
            />
          ))}
        </svg>
        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-500">
          <span>Pull index</span>
          <span className="font-semibold tabular-nums text-[#F7E7CE]/80">
            +12% WoW
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-600">
        Illustrative trend. Connects to analytics when referral attribution is
        available.
      </p>
    </div>
  );
}
