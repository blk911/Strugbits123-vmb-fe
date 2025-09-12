import React from "react";

function CardsInfo() {
  return (
    <div className="flex bg-white p-[20px] gap-x-[10px] rounded-[10px] justify-between items-center">
      <div className="flex flex-col gap-y-[10px] ">
        <span
          className="max-xl:text-[14px] xl:text-[14px] max-xl:leading-[20px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          Today's Bookings
        </span>

        <span
          className="max-xl:text-[30px] text-[#581838] xl:text-[30px] max-xl:leading-[20px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
          }}
        >
          24
        </span>
      </div>
      <div className="px-[16px] h-[52px] bg-[#FF92A54D] flex justify-center items-center rounded-[8px]">
        <svg
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.57143 0C5.20357 0 5.71429 0.558594 5.71429 1.25V2.5H10.2857V1.25C10.2857 0.558594 10.7964 0 11.4286 0C12.0607 0 12.5714 0.558594 12.5714 1.25V2.5H14.2857C15.2321 2.5 16 3.33984 16 4.375V6.25H0V4.375C0 3.33984 0.767857 2.5 1.71429 2.5H3.42857V1.25C3.42857 0.558594 3.93929 0 4.57143 0ZM0 7.5H16V18.125C16 19.1602 15.2321 20 14.2857 20H1.71429C0.767857 20 0 19.1602 0 18.125V7.5ZM11.75 11.9141C12.0857 11.5469 12.0857 10.9531 11.75 10.5898C11.4143 10.2266 10.8714 10.2227 10.5393 10.5898L7.14643 14.3008L5.46786 12.4648C5.13214 12.0977 4.58929 12.0977 4.25714 12.4648C3.925 12.832 3.92143 13.4258 4.25714 13.7891L6.54286 16.2891C6.87857 16.6562 7.42143 16.6562 7.75357 16.2891L11.75 11.9141Z"
            fill="#FF92A5"
          />
        </svg>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-x-[30px] gap-y-[20px]">
      <div className="flex flex-col gap-y-[10px]">
        <span
          className="max-xl:text-[30px] text-[#581838] xl:text-[30px] max-xl:leading-[20px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
          }}
        >
          Dashboard
        </span>
        <span
          className="max-xl:text-[14px] text-[#4B5563] xl:text-[14px] max-xl:leading-[20px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          Manage your salon efficiently
        </span>
      </div>
      <CardsInfo />
      <CardsInfo />
      <CardsInfo />
    </div>
  );
}

export default OverviewSection;
