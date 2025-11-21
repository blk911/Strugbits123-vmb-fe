import React from "react";
import AdminStatsSection from "../../../components/dashboard/admin/Home/AdminStatsSection";
import PendingRequestsSection from "../../../components/dashboard/admin/Home/PendingRequestsSection";

function Home() {
  return (
    <div className="flex flex-col  bg-[#EFEFEF] p-2 sm:p-7 font-[Poppins] gap-8">
      <AdminStatsSection />
      <PendingRequestsSection />
    </div>
  );
}

export default Home;
