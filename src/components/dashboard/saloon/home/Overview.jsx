import React, { useEffect } from "react";
import DashboardCard from "./DashboardCard";

import { FaRegCalendarAlt } from "react-icons/fa";
import { RiMoneyDollarCircleLine, RiFlowerLine } from "react-icons/ri";
import { useGetDailyStatsQuery } from "../../../../store/api";
import { useUser } from "../../../../hooks/useUser";

function Overview() {
  const { user } = useUser();
  const { data: response, refetch, isLoading } = useGetDailyStatsQuery();
  useEffect(() => {
    refetch();
  }, [refetch]);

  const appointmentsCount = response?.data?.appointmentsCount || 0;
  const servicesCount = response?.data?.totalServicesCount || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-poppins items-start">
      <div className="flex flex-col gap-2 ">
        <h1 className="text-[18px] font-semibold text-vmb-primary">
          Welcome back!
        </h1>

        <h2 className="text-[35px] font-semibold text-vmb-secondary leading-tight">
          {user?.salonName || "Salon"}
        </h2>

        <p className="text-[16px] text-vmb-text-muted">
          Manage your salon efficiently
        </p>
      </div>
      {!(user?.status === "hold") && (
        <>
          <DashboardCard
            title="Today's Appointments"
            value={appointmentsCount}
            icon={
              <FaRegCalendarAlt className="text-vmb-secondary w-[18px] h-[18px]" />
            }
            isLoading={isLoading}
          />
          {/* 
        <DashboardCard
          title="Today's Revenue"
          value="$0"
          icon={
            <RiMoneyDollarCircleLine className="text-vmb-secondary w-[20px] h-[20px]" />
          }
          isLoading={isLoading}
        /> */}

          <DashboardCard
            title="Total Services"
            value={servicesCount}
            icon={
              <RiFlowerLine className="text-vmb-secondary w-[20px] h-[20px]" />
            }
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}

export default Overview;
