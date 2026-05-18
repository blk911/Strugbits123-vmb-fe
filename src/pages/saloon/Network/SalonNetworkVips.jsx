import React from "react";
import { vipClientsMock } from "../../../config/salonNetworkMock";

export default function SalonNetworkVips() {
  return (
    <section className="rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-vmb-text-dark">VIP movement</h2>
      <p className="mt-1 text-sm text-vmb-text-muted">
        High-trust guests — holds, gratitude, and selective campaigns (preview).
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-muted">
            <tr>
              <th className="pb-2">Client</th>
              <th className="pb-2">LTV</th>
              <th className="pb-2">Tier</th>
              <th className="pb-2">Next nudge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vmb-border-light text-vmb-text-dark">
            {vipClientsMock.map((r) => (
              <tr key={r.id}>
                <td className="py-2 font-medium">{r.name}</td>
                <td className="py-2 tabular-nums">{r.ltv}</td>
                <td className="py-2 text-vmb-text-muted">{r.tier}</td>
                <td className="py-2 text-vmb-text-muted">{r.nextNudge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
