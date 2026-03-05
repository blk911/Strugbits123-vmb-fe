import React from "react";

export const CellRenderers = {
  serviceName: (options) => (
    <div className="flex flex-wrap gap-1 text-xs">
      {/* {options.map((option, index) => ( */}
      <span
        // key={index}
        className="px-1.5 py-0.5 bg-white border border-vmb-secondary text-vmb-secondary rounded text-[10px] whitespace-nowrap"
      >
        {options}
      </span>
      {/* ))} */}
    </div>
  ),

  discount: (value) => (
    <span className="inline-block px-2 py-0.5 bg-vmb-secondary/20 text-vmb-secondary rounded text-xs font-medium">
      {value}
    </span>
  ),

  status: (value) => {
    const styles = {
      Pending: "bg-vmb-pending/20 text-vmb-pending",
      Claimed: "bg-vmb-success/20 text-vmb-success",
      Unclaimed: "bg-vmb-bg-soft text-vmb-text-muted",
    };

    return (
      <span
        className={`inline-block p-[5px] rounded-[5px] text-[10px] font-medium whitespace-nowrap ${
          styles[value] || "bg-red-100 text-red-800"
        }`}
      >
        {value}
      </span>
    );
  },
};
