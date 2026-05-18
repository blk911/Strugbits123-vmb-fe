import React from "react";
import { Link } from "react-router-dom";
import TaikosBrandBlock from "../../../components/taikos/TaikosBrandBlock";

export default function SalonOwnerSettingsPage() {
  return (
    <div className="min-h-full bg-vmb-dashboard-bg font-poppins">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-vmb-border-light bg-white p-5 shadow-sm sm:p-6">
          <TaikosBrandBlock description="Salon settings — operational profile and presets stay under your control." />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            <li>
              <Link
                to="/salon-detail"
                className="block rounded-xl border border-vmb-border-light bg-vmb-bg-soft/40 p-4 font-semibold text-vmb-text-dark transition hover:border-vmb-secondary/35"
              >
                Your salon page
              </Link>
            </li>
            <li>
              <Link
                to="/service-presets"
                className="block rounded-xl border border-vmb-border-light bg-vmb-bg-soft/40 p-4 font-semibold text-vmb-text-dark transition hover:border-vmb-secondary/35"
              >
                Service presets
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
