import React from "react";

export const CellRenderers = {
  salonEmail: (value) => (
    <span className="text-sm font-medium text-[#00000080]">{value}</span>
  ),

  message: (value) => (
    <p
      className="italic text-xs text-[#00000080] max-w-[340px] line-clamp-3"
      title={value}
      style={{ fontStyle: "italic", opacity: 0.5 }}
    >
      {value}
    </p>
  ),

  serviceName: (options) => (
    <div className="flex flex-wrap gap-1 text-xs">
      {/* {options.map((option, index) => ( */}
      <span
        // key={index}
        className="px-1.5 py-0.5 bg-white border border-[#FF92A5] text-[#FF92A5] rounded text-[10px] whitespace-nowrap"
      >
        {options}
      </span>
      {/* ))} */}
    </div>
  ),

  discount: (value) => (
    <span className="inline-block px-2.5 py-1 bg-[#FF92A533] text-[#FF92A5] rounded-md text-sm font-semibold">
      {value}%
    </span>
  ),

  inviteDate: (value) => (
    <span className="text-sm text-[#4B5563] font-medium">{value}</span>
  ),

  status: (value) => {
    const styles = {
      Accepted: "bg-[#4FCF0033] text-[#4FCF00]",
      Pending: "bg-[#FF950033] text-[#FF9500]",
    };

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
          styles[value] || "bg-[#64748B33] text-[#64748B]"
        }`}
      >
        {value}
      </span>
    );
  },
};
