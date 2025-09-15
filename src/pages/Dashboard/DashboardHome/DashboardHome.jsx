import React from "react";
import OverviewSection from "./OverviewSection";
import ServicesSection from "../../../components/dashboard/serviceSection/ServicesSection";
import SalonProfileSection from "../../../components/dashboard/salonProfile/SalonProfileSection";
import RevenueChart from "../../../components/dashboardComponent/RevenueChart";
import QuickInvitesSection from "../../../components/dashboard/quickInvites/QuickInvitesSection";

function DashboardHome() {
  return (
    <div className="w-full h-full bg-[#EFEFEF] p-6 flex flex-col gap-y-[27px] max-sm:overflow-x-scroll">
      <OverviewSection />
      <div className="w-full grid lg:grid-cols-[1fr_500px] gap-x-[50px] gap-y-[40px]">
        <div className="w-full flex flex-col gap-y-[30px]">
          <RevenueChart />
          <ServicesSection />
        </div>
        <div className="w-full flex flex-col gap-y-[30px]">
          <SalonProfileSection />
          <QuickInvitesSection />
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
