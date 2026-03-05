import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { FaGift } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetWeeklyStatsQuery } from "../../../../store/api";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

export default function AdminStatsSection() {
  const { data, isLoading } = useGetWeeklyStatsQuery();

  const navigate = useNavigate();
  const items = [
    {
      icon: <FaRegCalendarAlt className="w-5 h-5 text-vmb-secondary" />,
      label: "Weekly Appointments",
      value: data?.data?.appointmentsCount || 0,
      path: "/appointments",
    },
    {
      icon: <IoMailOutline className="w-5 h-5 text-vmb-secondary" />,
      label: "Weekly Invites",
      value: data?.data?.invitesCount || 0,
      path: "/saloninvites",
    },
    {
      icon: <FaGift className="w-5 h-5 text-vmb-secondary" />,
      label: "Weekly Gifts",
      value: data?.data?.giftsCount || 0,
      path: "/gifts",
    },
  ];
  const handleViewClick = (item) => {
    navigate(item?.path);
  };
  return (
    <div
      className="grid gap-6 font-poppins items-start
    grid-cols-1
    [@media(min-width:400px)]:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]
    lg:grid-cols-4"
    >
      <div className="flex flex-col w-full gap-2 ">
        <h1 className="text-[26px] sm:text-[30px] font-bold text-vmb-primary">
          Admin <br /> Dashboard
        </h1>
        <p className="text-[12px] sm:text-[14px] text-vmb-text-muted">
          Manage your salon efficiently
        </p>
      </div>
      {items.map((item, idx) => (
        <div
          className="min-w-0 bg-white/50 border border-vmb-primary/10 shadow-sm rounded-[10px] p-3 sm:p-5 flex flex-col gap-1 "
          key={idx}
        >
          <div className="flex items-center bg-vmb-secondary/30  rounded-[8px] w-[35px] sm:w-[45px]  h-[35px] sm:h-[45px] justify-center">
            {item.icon}
          </div>
          <p className="text-[12px] sm:text-[14px] text-vmb-text-muted my-2">
            {item.label}
          </p>
          {isLoading ?
            <LoadingIndicator size="sm" />
          : <div className="flex items-start justify-between ">
              <p className="text-[26px] sm:text-[30px] font-bold text-vmb-primary">
                {item.value}
              </p>

              <span
                className="text-vmb-muted text-[12px] sm:text-[14px] self-center font-medium cursor-pointer pb-[2px] border-b border-vmb-muted"
                onClick={() => handleViewClick(item)}
              >
                View All
              </span>
            </div>
          }
        </div>
      ))}
    </div>
  );
}
