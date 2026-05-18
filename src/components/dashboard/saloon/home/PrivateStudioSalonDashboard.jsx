import React from "react";
import BusinessDriversPanel from "./BusinessDriversPanel";
import CalendarPulseWidget from "./CalendarPulseWidget";

export default function PrivateStudioSalonDashboard() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#f5eee9] font-poppins text-[#333232]">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <CalendarPulseWidget />

        <BusinessDriversPanel />
      </div>
    </div>
  );
}
