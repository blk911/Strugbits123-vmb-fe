import React from "react";

export default function StatPill({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-white/[0.1] bg-[#141c2c]/95 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="font-studio-sans mt-1 text-lg font-semibold tabular-nums tracking-tight text-[#F7E7CE]">
        {value}
      </p>
      {sub ?
        <p className="mt-0.5 text-[11px] text-slate-600">{sub}</p>
      : null}
    </div>
  );
}
