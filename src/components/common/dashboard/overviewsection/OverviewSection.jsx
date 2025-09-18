import React from "react";
import CardsInfo from "./CardsInfo";

function OverviewSection({ title = "Dashboard", subTitle = "Manage your salon efficiently", data, cardsClass, classes }) {
  return (
    <div className={`w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[30px] gap-y-[20px] ${classes}`}>
      <div className="flex flex-col gap-y-[10px]">
        <span
          className="max-xl:text-[30px] text-[#581838] xl:text-[30px] max-xl:leading-[30px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
          }}
        >
          {title}
        </span>
        <span
          className="max-xl:text-[14px] text-[#4B5563] xl:text-[16px] max-xl:leading-[20px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          {subTitle}
        </span>
      </div>
      {data.map((dt) => (
        <CardsInfo key={dt.title} title={dt.title} value={dt.value} icon={dt.icon} cardsClass={cardsClass}/>
      ))}
    </div>
  );
}

export default OverviewSection;
