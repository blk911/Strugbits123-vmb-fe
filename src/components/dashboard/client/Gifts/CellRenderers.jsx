import React from "react";

export const CellRenderers = {
  serviceName: (options) => (
    <div className="flex flex-wrap gap-1 text-xs">
      {options.map((option, index) => (
        <span
          key={index}
          className="px-1.5 py-0.5 bg-white border border-vmb-secondary text-vmb-secondary rounded text-[10px] whitespace-nowrap"
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
          className="px-1.5 py-0.5 bg-white border border-vmb-secondary text-vmb-secondary rounded text-[10px] whitespace-nowrap"
        >
          {option}
        </span>
      ))}
    </div>
  ),

  status: (value) => (
    <span
      className={`inline-block p-[5px] rounded-[5px] text-[10px] font-medium ${
        value === "Accepted" ? "bg-vmb-success/20 text-vmb-success"
        : value === "Pending" ? "bg-vmb-pending/20 text-vmb-pending"
        : "bg-vmb-error/20 text-vmb-error"
      }`}
    >
      {value}
    </span>
  ),
  giftServiceStatus: (value) => (
    <span
      className={`inline-block p-[5px] rounded-[5px] text-[10px] font-medium ${
        value === "Accepted" ? "bg-vmb-success/20 text-vmb-success"
        : value === "Pending" ? "bg-vmb-pending/20 text-vmb-pending"
        : "bg-vmb-error/20 text-vmb-error"
      }`}
    >
      {value}
    </span>
  ),
};
