import React from "react";

import Overview from "../../../components/dashboard/saloon/Home/Overview";
import MainSection from "../../../components/dashboard/saloon/Home/MainSection";

function DashboardHome() {
  return (
    <div className="p-6 flex flex-col gap-8 font-[Poppins]">
      <Overview />
      <MainSection />
    </div>
  );
}

export default DashboardHome;
