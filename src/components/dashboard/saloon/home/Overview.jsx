import React, { useEffect } from "react";
import DashboardCard from "./DashboardCard";

import { FaRegCalendarAlt } from "react-icons/fa";
import { RiMoneyDollarCircleLine, RiFlowerLine } from "react-icons/ri";
import { useGetDailyStatsQuery } from "../../../../store/api";

function Overview() {
  const { data: response, refetch } = useGetDailyStatsQuery();
  useEffect(() => {
    refetch();
  }, [refetch]);

  const appointmentsCount = response?.data?.appointmentsCount || 0;
  const servicesCount = response?.data?.totalServicesCount || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-[Poppins] items-start">
      <div className="flex flex-col gap-2 ">
        <h1 className="text-[18px] font-semibold text-[#581838]">
          Welcome back!
        </h1>

        <h2 className="text-[35px] font-semibold text-[#FF92A5] leading-tight">
          Bella Beauty Salon
        </h2>

        <p className="text-[16px] text-[#4B5563]">
          Manage your salon efficiently
        </p>
      </div>

      <DashboardCard
        title="Today's Appointments"
        value={appointmentsCount}
        icon={<FaRegCalendarAlt className="text-[#FF92A5] w-[18px] h-[18px]" />}
      />

      <DashboardCard
        title="Today's Revenue"
        value="$1,245"
        icon={
          <RiMoneyDollarCircleLine className="text-[#FF92A5] w-[20px] h-[20px]" />
        }
      />

      <DashboardCard
        title="Total Services"
        value={servicesCount}
        icon={<RiFlowerLine className="text-[#FF92A5] w-[20px] h-[20px]" />}
      />
    </div>
  );
}

export default Overview;
