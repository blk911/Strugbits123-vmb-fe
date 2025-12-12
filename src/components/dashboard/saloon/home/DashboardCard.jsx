import React from "react";

export default function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow-[0_4px_6px_#0000000D] rounded-[10px] p-5 flex items-center justify-end gap-1 ">
      <div className="w-full flex flex-col">
        <p className="text-[14px] text-[#4B5563]">{title}</p>
        <p className="text-[30px] font-bold text-[#581838]">{value}</p>
      </div>

      <div className="flex items-center bg-[#FF92A54D]  rounded-[8px] w-[45px] h-[45px] justify-center">
        {icon}
      </div>
    </div>
  );
}
