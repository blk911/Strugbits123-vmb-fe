import React from "react";

function DashboardFooter() {
  return (
    <div className="w-full flex justify-center items-center py-[20px]">
      <span
        className="max-xl:text-[14px] xl:text-[16px] max-xl:leading-[20px]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          color: "#581838",
        }}
      >
        All Copyrights Reserved 2025.{" "}
        <span style={{ color: "#FF92A5" }}>VMB Ven Me Baby</span>
      </span>
    </div>
  );
}

export default DashboardFooter;
