import React from "react";

export const CellRenderers = {
  salonEmail: (value) => (
    <span className="text-sm font-medium text-vmb-text-main">{value}</span>
  ),

  message: (value) => (
    <p
      className="italic text-[12px] text-vmb-text-main/50 max-w-[340px] line-clamp-3"
      title={value}
      style={{ fontStyle: "italic" }}
    >
      {value}
    </p>
  ),

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
    <span className="inline-block px-2.5 py-1 bg-vmb-secondary/20 text-vmb-secondary rounded-md text-sm font-semibold">
      {value}
    </span>
  ),

  inviteDate: (value) => (
    <span className="text-sm text-vmb-text-muted font-medium">{value}</span>
  ),

  status: (value) => {
    const styles = {
      Claimed: "bg-vmb-success/20 text-vmb-success",
      Pending: "bg-vmb-pending/20 text-vmb-pending",
    };

    return (
      <span
        className={`inline-block p-[5px] rounded-[5px] text-[10px] font-medium break-all text-wrap ${
          styles[value] || "bg-vmb-error/20 text-vmb-error"
        }`}
      >
        {value}
      </span>
    );
  },
};
