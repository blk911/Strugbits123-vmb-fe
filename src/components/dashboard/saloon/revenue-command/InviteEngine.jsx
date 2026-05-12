import React from "react";

const actions = [
  { key: "vip", label: "VIP Invite", modal: "exclusiveInvite" },
  { key: "bridal", label: "Bridal Party", modal: "exclusiveInvite" },
  { key: "birthday", label: "Birthday Gift", modal: "sendTreat" },
  { key: "reactivate", label: "Client Reactivation", modal: "sendTreat" },
  { key: "referral", label: "Referral Push", modal: "exclusiveInvite" },
];

export default function InviteEngine({ onAction }) {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-[#121826]/90 p-5 md:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F7E7CE]/35">
        Module
      </p>
      <h3 className="font-studio-serif mt-2 text-xl font-medium text-[#F7E7CE]">
        Invite Engine
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Launch private invitations, gifts, and referral campaigns — each control
        maps to your existing VMB flows.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => onAction(a.modal)}
            className="rounded-lg border border-white/[0.1] bg-[#141c2c]/90 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-[#F7E7CE]/30 hover:bg-[#1a2438]/90"
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
