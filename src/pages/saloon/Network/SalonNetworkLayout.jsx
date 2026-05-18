import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import TaikosBrandBlock from "../../../components/taikos/TaikosBrandBlock";

const tabClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition",
    isActive ?
      "bg-vmb-secondary text-white shadow-sm"
    : "bg-white text-vmb-text-muted ring-1 ring-vmb-border-light hover:bg-vmb-bg-soft",
  ].join(" ");

export default function SalonNetworkLayout() {
  return (
    <div className="min-h-full bg-vmb-dashboard-bg font-poppins">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-vmb-border-light bg-white p-5 shadow-sm sm:p-6">
          <TaikosBrandBlock
            description="Private client network — trusted relationships, not cold outreach lists."
          />
        </div>
        <nav
          className="mt-4 flex flex-wrap gap-2 border-b border-vmb-border-light pb-3"
          aria-label="Network sections"
        >
          <NavLink
            to="/salon-owner/network/trusted-clients"
            className={tabClass}
          >
            Trusted Clients
          </NavLink>
          <NavLink
            to="/salon-owner/network/referral-activity"
            className={tabClass}
          >
            Referral Activity
          </NavLink>
          <NavLink to="/salon-owner/network/vips" className={tabClass}>
            VIPs
          </NavLink>
        </nav>
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
