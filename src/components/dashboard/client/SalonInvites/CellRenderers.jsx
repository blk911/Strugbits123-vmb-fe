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

  discount: (value) => (
    <span className="inline-block px-2 py-0.5 bg-[#FF92A533] text-[#FF92A5] rounded text-xs font-medium">
      {value}
    </span>
  ),

  status: (value) => {
    const styles = {
      Pending: "bg-[#FF950033] text-[#FF9500]",
      Claimed: "bg-[#4FCF0033] text-[#4FCF00]",
      Unclaimed: "bg-[#64748B33] text-[#64748B]",
    };

    return (
      <span
        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${
          styles[value] || "bg-red-100 text-red-800"
        }`}
      >
        {value}
      </span>
    );
  },
};
