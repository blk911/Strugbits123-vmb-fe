import React from "react";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
export default function DashboardCard({ title, value, icon, isLoading }) {
  return (
    <div className="bg-white shadow-md rounded-[10px] p-5 flex items-center justify-end gap-1 ">
      <div className="w-full flex flex-col">
        <p className="text-[14px] text-vmb-text-muted">{title}</p>
        {isLoading ? (
          <div className="mt-3">
            <LoadingIndicator size="sm" />
          </div>
        ) : (
          <p className="text-[30px] font-bold text-vmb-primary">{value}</p>
        )}
      </div>

      <div className="flex items-center bg-vmb-secondary/30  rounded-[8px] w-[45px] h-[45px] justify-center">
        {icon}
      </div>
    </div>
  );
}
