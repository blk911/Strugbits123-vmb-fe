import React from "react";
import OverviewSection from "./OverviewSection";
import ServicesSection from "../../../components/dashboard/serviceSection/ServicesSection";
import SalonProfileSection from "../../../components/dashboard/salonProfile/SalonProfileSection";

function DashboardHome() {
  return (
    <div className="w-full h-full bg-[#EFEFEF] p-6 flex flex-col gap-y-[27px]">
      <OverviewSection />
      <div className="w-full grid lg:grid-cols-[1fr_500px] gap-x-[50px]">
        <ServicesSection />
        <SalonProfileSection />
      </div>
    </div>
  );
}

export default DashboardHome;
