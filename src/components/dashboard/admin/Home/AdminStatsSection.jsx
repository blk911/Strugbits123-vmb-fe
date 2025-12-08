import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { FaGift } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetWeeklyStatsQuery } from "../../../../store/api";

export default function AdminStatsSection() {
  const { data } = useGetWeeklyStatsQuery();

  const navigate = useNavigate();
  const items = [
    {
      icon: <FaRegCalendarAlt className="w-5 h-5 text-[#FF92A5]" />,
      label: "Weekly Appointments",
      value: data?.data?.appointmentsCount || 0,
      path: "/appointments",
    },
    {
      icon: <IoMailOutline className="w-5 h-5 text-[#FF92A5]" />,
      label: "Weekly Invites",
      value: data?.data?.invitesCount || 0,
      path: "/saloninvites",
    },
    {
      icon: <FaGift className="w-5 h-5 text-[#FF92A5]" />,
      label: "Weekly Gifts",
      value: data?.data?.giftsCount || 0,
      path: "/gifts",
    },
  ];
  const handleViewClick = (item) => {
    navigate(item?.path);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-[Poppins] items-start">
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold text-[#581838]">
          Admin <br /> Dashboard
        </h1>
        <p className="text-[14px] text-[#4B5563]">
          Manage your salon efficiently
        </p>
      </div>
      {items.map((item, idx) => (
        <div
          className="bg-white shadow-[0_4px_6px_#0000000D] rounded-[10px] p-5 flex flex-col gap-1 "
          key={idx}
        >
          <div className="flex items-center bg-[#FF92A54D]  rounded-[8px] w-[45px] h-[45px] justify-center">
            {item.icon}
          </div>
          <p className="text-[14px] text-[#4B5563] my-2">{item.label}</p>
          <div className="flex items-start justify-between ">
            <p className="text-[30px] font-bold text-[#581838]">{item.value}</p>

            <span
              className="text-[#64748B] text-[14px] self-center font-medium underline cursor-pointer"
              onClick={() => handleViewClick(item)}
            >
              View All
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
