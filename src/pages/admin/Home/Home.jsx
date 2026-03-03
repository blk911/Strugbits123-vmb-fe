import React from "react";
import AdminStatsSection from "../../../components/dashboard/admin/Home/AdminStatsSection";
import PendingRequestsSection from "../../../components/dashboard/admin/Home/PendingRequestsSection";

function Home() {
  return (
    <div className="flex flex-col  bg-vmb-bg-soft p-6 font-poppins gap-8">
      <AdminStatsSection />
      <PendingRequestsSection />
    </div>
  );
}

export default Home;
