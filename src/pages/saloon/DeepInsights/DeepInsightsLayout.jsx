import React from "react";
import { Outlet } from "react-router-dom";
import DeepInsightsSubNav from "../../../components/deep-insights/DeepInsightsSubNav";

export default function DeepInsightsLayout() {
  return (
    <div className="min-h-full bg-vmb-dashboard-bg font-poppins">
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
        <DeepInsightsSubNav />
        <div className="mt-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
