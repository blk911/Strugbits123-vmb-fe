import React from "react";

export default function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow-[0_4px_6px_#0000000D] rounded-[10px] p-5 flex flex-col gap-1 ">
      <div className="flex items-start justify-between">
        <p className="text-[14px] text-[#4B5563]">{title}</p>

        <div className="flex items-center bg-[#FF92A54D] border border-[#E5E7EB] rounded-[8px] ">
          {icon}
        </div>
      </div>

      <p className="text-[30px] font-bold text-[#581838]">{value}</p>
    </div>
  );
}
