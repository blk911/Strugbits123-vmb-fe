import React from "react";
import { trustedClientsMock } from "../../../config/salonNetworkMock";

export default function SalonNetworkTrustedClients() {
  return (
    <section className="rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-vmb-text-dark">Trusted clients</h2>
      <p className="mt-1 text-sm text-vmb-text-muted">
        Clients with repeat rhythm and warm referral behavior (preview data).
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead className="text-[10px] font-bold uppercase tracking-wide text-vmb-text-muted">
            <tr>
              <th className="pb-2">Client</th>
              <th className="pb-2">Visits</th>
              <th className="pb-2">Last visit</th>
              <th className="pb-2">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vmb-border-light text-vmb-text-dark">
            {trustedClientsMock.map((r) => (
              <tr key={r.id}>
                <td className="py-2 font-medium">{r.name}</td>
                <td className="py-2 tabular-nums">{r.visits}</td>
                <td className="py-2 text-vmb-text-muted">{r.lastVisit}</td>
                <td className="py-2 text-vmb-text-muted">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
