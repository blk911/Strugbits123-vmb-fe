import React from "react";

export const CellRenderers = {
  serviceName: (options) => (
    <div className="flex flex-wrap gap-1 text-xs">
      {options.map((option, index) => (
        <span
          key={index}
          className="px-1.5 py-0.5 bg-white border border-[#FF92A5] text-[#FF92A5] rounded text-[10px] whitespace-nowrap"
        >
          {option}
        </span>
      ))}
    </div>
  ),

  giftedServices: (options) => (
    <div className="flex flex-wrap gap-1 text-xs">
      {options.map((option, index) => (
        <span
          key={index}
          className="px-1.5 py-0.5 bg-white border border-[#FF92A5] text-[#FF92A5] rounded text-[10px] whitespace-nowrap"
        >
          {option}
        </span>
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
