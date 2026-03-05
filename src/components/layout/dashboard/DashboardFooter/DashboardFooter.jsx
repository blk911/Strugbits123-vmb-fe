import React from "react";

function DashboardFooter() {
  return (
    <div className="w-full flex justify-center items-center py-[20px]">
      <span
        className="max-xl:text-[14px] xl:text-[16px] max-xl:leading-[20px]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          color: "var(--vmb-primary)",
        }}
      >
        All Copyrights Reserved 2025.{" "}
        <span className="text-vmb-secondary">VMB Ven Me Baby</span>
      </span>
    </div>
  );
}

export default DashboardFooter;
