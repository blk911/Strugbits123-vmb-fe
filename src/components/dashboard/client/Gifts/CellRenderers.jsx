import React from "react";
import Button from "../../../common/dashboard/Button";

export const CellRenderers = {
  serviceName: (options) => (
    <div className="flex flex-wrap max-w-[550px] gap-2">
      {options.map((option, index) => (
        <Button
          key={index}
          text={option}
          textClasses="!text-[12px] !text-[#FF92A5]"
          classes="!p-[5px] !bg-white border border-[#FF92A5]"
        />
      ))}
    </div>
  ),

  giftedServices: (options) => (
    <div className="flex flex-wrap max-w-[550px] gap-2">
      {options.map((option, index) => (
        <Button
          key={index}
          text={option}
          textClasses="!text-[12px] !text-[#FF92A5]"
          classes="!p-[5px] !bg-white border border-[#FF92A5]"
        />
      ))}
    </div>
  ),

  status: (value) => (
    <span
      className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
        value === "Accepted"
          ? "bg-[#4FCF0033] text-[#4FCF00]"
          : value === "Pending"
          ? "bg-[#FF950033] text-[#FF9500]"
          : "bg-red-100 text-red-800"
      }`}
    >
      {value}
    </span>
  ),

  giftStatus: (value) => (
    <span
      className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
        value === "Accepted"
          ? "bg-[#4FCF0033] text-[#4FCF00]"
          : value === "Pending"
          ? "bg-[#FF950033] text-[#FF9500]"
          : "bg-red-100 text-red-800"
      }`}
    >
      {value}
    </span>
  ),
};
