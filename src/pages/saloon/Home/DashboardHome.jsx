import React from "react";

import Overview from "../../../components/dashboard/saloon/home/Overview";
import MainSection from "../../../components/dashboard/saloon/home/MainSection";

function DashboardHome() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <Overview />
      <MainSection />
    </div>
  );
}

export default DashboardHome;
