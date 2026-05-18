import React from "react";
import { referralActivityMock } from "../../../config/salonNetworkMock";

export default function SalonNetworkReferralActivity() {
  return (
    <section className="rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-vmb-text-dark">Referral activity</h2>
      <p className="mt-1 text-sm text-vmb-text-muted">
        Who brings others in — prime for calm, permission-based invites (preview).
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-muted">
            <tr>
              <th className="pb-2">Client</th>
              <th className="pb-2">Referrals</th>
              <th className="pb-2">Last</th>
              <th className="pb-2">Channel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vmb-border-light text-vmb-text-dark">
            {referralActivityMock.map((r) => (
              <tr key={r.id}>
                <td className="py-2 font-medium">{r.name}</td>
                <td className="py-2 tabular-nums">{r.referred}</td>
                <td className="py-2 text-vmb-text-muted">{r.lastReferral}</td>
                <td className="py-2 text-vmb-text-muted">{r.channel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
