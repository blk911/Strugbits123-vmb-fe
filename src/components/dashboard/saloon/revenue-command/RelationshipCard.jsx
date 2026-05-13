import React from "react";

const tagTone = {
  VIP: "border-amber-500/25 bg-amber-500/10 text-amber-200/90",
  Referral: "border-[#F7E7CE]/25 bg-[#F7E7CE]/8 text-[#F7E7CE]/85",
  Gift: "border-rose-400/20 bg-rose-500/10 text-rose-200/90",
  "Returning Client": "border-emerald-400/20 bg-emerald-500/10 text-emerald-200/85",
  "Warm Lead": "border-sky-400/20 bg-sky-500/10 text-sky-200/85",
  "AI Assisted": "border-violet-400/25 bg-violet-500/10 text-violet-200/85",
};

export default function RelationshipCard({ item }) {
  return (
    <li className="rounded-xl border border-white/[0.08] bg-[#141c2c]/80 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#F7E7CE]">{item.name}</span>
            {item.tags.map((t) => (
              <span
                key={t}
                className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagTone[t] || "border-white/10 bg-white/5 text-slate-300"}`}
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[15px] font-medium text-slate-200">
            {item.headline}
          </p>
          <dl className="mt-3 grid gap-1 text-sm text-slate-400 sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="text-slate-600">Source</dt>
              <dd className="font-medium text-slate-300">{item.source}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-600">Value</dt>
              <dd className="font-semibold tabular-nums text-[#F7E7CE]">
                {item.value}
              </dd>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <dt className="text-slate-600">Status</dt>
              <dd className="font-medium text-slate-300">{item.status}</dd>
            </div>
          </dl>
        </div>
      </div>
    </li>
  );
}
