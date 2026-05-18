import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/salon-owner/deep-insights/data-capture", label: "Data Capture" },
  { to: "/salon-owner/deep-insights/analytics", label: "Analytics" },
  { to: "/salon-owner/opportunities", label: "Opportunities" },
  { to: "/salon-owner/campaigns", label: "Campaigns" },
];

export default function DeepInsightsSubNav() {
  return (
    <nav
      className="flex flex-wrap gap-2 rounded-xl border border-vmb-border-light bg-white p-2 shadow-sm"
      aria-label="tAIkOS sections"
    >
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            [
              "rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs",
              isActive ?
                "bg-vmb-secondary text-white shadow-sm"
              : "text-vmb-text-muted hover:bg-vmb-bg-soft/60 hover:text-vmb-text-dark",
            ].join(" ")
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
