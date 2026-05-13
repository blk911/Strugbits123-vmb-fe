import React, { useCallback, useMemo, useState } from "react";
import { FaCheck, FaPlug, FaUpload, FaBan } from "react-icons/fa";

const PROVIDERS = [
  { id: "vagaro", name: "Vagaro", hint: "Full-stack salon OS" },
  { id: "glossgenius", name: "GlossGenius", hint: "Independent pros" },
  { id: "boulevard", name: "Boulevard", hint: "Premium scheduling" },
  { id: "mindbody", name: "Mindbody", hint: "Enterprise wellness" },
  { id: "fresha", name: "Fresha", hint: "Marketplace + POS" },
  { id: "booksy", name: "Booksy", hint: "Mobile-first booking" },
  { id: "square", name: "Square Appointments", hint: "Retail + appointments" },
  { id: "mangomint", name: "Mangomint", hint: "Modern minimal POS" },
];

const DATA_TYPES = [
  { id: "appointments", label: "Appointments" },
  { id: "clients", label: "Clients" },
  { id: "services", label: "Services" },
  { id: "staff", label: "Staff / Providers" },
  { id: "payments", label: "Payments / Tickets" },
  { id: "products", label: "Products / Retail" },
  { id: "reviews", label: "Reviews" },
  { id: "referrals", label: "Referrals" },
  { id: "campaigns", label: "Campaigns" },
  { id: "payroll", label: "Payroll / Labor" },
  { id: "social", label: "Instagram / Meta" },
];

const OUTPUT_PREVIEW = [
  {
    title: "Dead schedule windows",
    detail: "Under-booked half-hours by weekday + provider — reclaimable revenue slots.",
  },
  {
    title: "Top client economic nodes",
    detail: "Clients ranked by LTV, visit cadence, and downstream referral value.",
  },
  {
    title: "Churn-risk clients",
    detail: "Latent visiters, gap spikes, and downgrade in spend vs. trailing average.",
  },
  {
    title: "Best service × time combinations",
    detail: "High conversion pairs of service category and time-of-day for fills.",
  },
  {
    title: "Staff utilization gaps",
    detail: "Provider hours sold vs. available — mismatch vs. demand hotspots.",
  },
  {
    title: "Social post → booking correlation",
    detail: "Lag alignment between content spikes and net-new appointments (when social connected).",
  },
  {
    title: "Referral clusters",
    detail: "Graph hints on tight-knit client micro-networks worth seeding invites.",
  },
  {
    title: "Pricing & service opportunities",
    detail: "Bundle gaps, add-on attach rates, and underpriced high-demand SKUs.",
  },
];

const initialAvailability = () =>
  Object.fromEntries(
    DATA_TYPES.map((d) => [
      d.id,
      { included: true, mode: "idle" },
    ]),
  );

export default function SalonIntelligence() {
  const [evalStarted, setEvalStarted] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [availability, setAvailability] = useState(initialAvailability);

  const setRowMode = useCallback((rowId, mode) => {
    setAvailability((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], mode },
    }));
  }, []);

  const toggleIncluded = useCallback((rowId) => {
    setAvailability((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        included: !prev[rowId].included,
        mode: !prev[rowId].included ? prev[rowId].mode : "idle",
      },
    }));
  }, []);

  const selectedProviderName = useMemo(() => {
    const p = PROVIDERS.find((x) => x.id === providerId);
    return p?.name ?? null;
  }, [providerId]);

  return (
    <div className="flex flex-col gap-8 p-4 pb-12 font-poppins sm:p-6 lg:p-7">
      <section className="overflow-hidden rounded-[12px] border border-vmb-primary/10 bg-gradient-to-br from-white via-vmb-bg-soft to-white shadow-sm">
        <div className="border-b border-vmb-primary/8 bg-white/60 px-5 py-8 sm:px-8 sm:py-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-vmb-secondary">
            VMB Intelligence
          </p>
          <h1 className="mt-3 font-semibold text-vmb-primary text-[26px] leading-tight sm:text-[32px]">
            Salon Intelligence Lab
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-vmb-text-muted">
            A separate evaluation surface for salon booking and POS data — map
            provider capabilities, stage ingest paths, and preview the kinds of
            insights VMB can surface without mixing this flow into core booking
            or social product.
          </p>
          <button
            type="button"
            onClick={() => setEvalStarted(true)}
            className={`mt-7 inline-flex min-h-11 items-center justify-center rounded-[10px] px-7 text-[15px] font-bold text-white shadow-[0_12px_32px_-16px_rgba(15,61,62,0.45)] transition ${
              evalStarted ?
                "bg-vmb-secondary/85"
              : "bg-vmb-secondary hover:bg-vmb-primary"
            }`}
          >
            {evalStarted ? "Evaluation in progress" : "Start evaluation"}
          </button>
          {evalStarted ?
            <p className="mt-3 text-xs font-medium text-vmb-secondary">
              Draft lab session — connect providers and mark data paths below
              (local only).
            </p>
          : null}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-vmb-primary sm:text-xl">
          Provider roster
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-vmb-text-muted">
          Select a platform to scope checklist and preview outputs for that
          ecosystem.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROVIDERS.map((p) => {
            const active = providerId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setProviderId(p.id)}
                className={`flex flex-col rounded-[12px] border p-5 text-left transition ${
                  active ?
                    "border-vmb-secondary bg-white shadow-md ring-2 ring-vmb-secondary/25"
                  : "border-vmb-primary/10 bg-white/80 hover:border-vmb-secondary/35 hover:bg-white"
                }`}
              >
                <span className="text-[17px] font-bold text-vmb-primary">
                  {p.name}
                </span>
                <span className="mt-1 text-xs text-vmb-text-muted">{p.hint}</span>
                {active ?
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-vmb-secondary">
                    <FaCheck className="text-[11px]" aria-hidden />
                    Selected
                  </span>
                : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[12px] border border-vmb-primary/10 bg-white/90 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-vmb-primary sm:text-xl">
              Data availability
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-vmb-text-muted">
              {selectedProviderName ?
                `Checklist for ${selectedProviderName} (mock — no API calls).`
              : "Pick a platform to stage ingest paths per data type (local only)."}
            </p>
          </div>
        </div>

        {providerId ?
          <div className="mt-6 space-y-3">
            {DATA_TYPES.map((row) => {
              const state = availability[row.id];
              const included = state?.included ?? false;
              return (
                <div
                  key={row.id}
                  className={`rounded-[10px] border px-4 py-4 transition sm:px-5 ${
                    included ?
                      "border-vmb-primary/12 bg-vmb-bg-soft/40"
                    : "border-vmb-primary/8 bg-white/50 opacity-70"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={included}
                        onChange={() => toggleIncluded(row.id)}
                        className="h-4 w-4 rounded border-vmb-secondary/40 text-vmb-secondary focus:ring-vmb-secondary/30"
                      />
                      <span className="text-[15px] font-semibold text-vmb-primary">
                        {row.label}
                      </span>
                    </label>

                    {included ?
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: "connect", label: "Connect", icon: FaPlug },
                          { id: "csv", label: "Upload CSV", icon: FaUpload },
                          {
                            id: "unavailable",
                            label: "Mark unavailable",
                            icon: FaBan,
                          },
                        ].map((act) => {
                          const Icon = act.icon;
                          const on = state?.mode === act.id;
                          return (
                            <button
                              key={act.id}
                              type="button"
                              onClick={() => setRowMode(row.id, act.id)}
                              className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-xs font-bold transition sm:text-[13px] ${
                                on ?
                                  "border-vmb-secondary bg-vmb-secondary text-white"
                                : "border-vmb-primary/15 bg-white text-vmb-text-muted hover:border-vmb-secondary/40"
                              }`}
                            >
                              <Icon className="text-[11px] opacity-90" aria-hidden />
                              {act.label}
                            </button>
                          );
                        })}
                      </div>
                    : null}
                  </div>
                </div>
              );
            })}
          </div>
        : <p className="mt-6 rounded-[10px] border border-dashed border-vmb-primary/15 bg-vmb-bg-soft/30 px-5 py-8 text-center text-sm font-medium text-vmb-text-muted">
            Select a provider in the grid above to open the data availability
            checklist.
          </p>}
      </section>

      <section className="rounded-[12px] border border-dashed border-vmb-secondary/35 bg-white/70 p-6 sm:p-7">
        <h2 className="text-lg font-bold text-vmb-primary sm:text-xl">
          Output preview
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-vmb-text-muted">
          Illustrative discoveries this lab path would aim to produce once
          ingest rules are defined — not live scoring.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {OUTPUT_PREVIEW.map((item) => (
            <li
              key={item.title}
              className="rounded-[10px] border border-vmb-primary/10 bg-vmb-bg-soft/50 p-4"
            >
              <p className="font-semibold text-vmb-primary">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-vmb-text-muted">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
