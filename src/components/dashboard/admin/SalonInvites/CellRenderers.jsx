import React from "react";

export const CellRenderers = {
  salonEmail: (value) => (
    <span className="text-sm font-medium text-vmb-text-muted">{value}</span>
  ),

  message: (value) => (
    <p
      className="italic text-xs text-black/80 max-w-[340px] line-clamp-3"
      title={value}
      style={{ fontStyle: "italic", opacity: 0.5 }}
    >
      {value}
    </p>
  ),

  serviceName: (options) => (
    <div className="flex flex-wrap gap-1 text-xs">
      <span className="px-1.5 py-0.5 bg-white border border-vmb-secondary text-vmb-secondary rounded text-[10px] whitespace-nowrap">
        {options}
      </span>
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

  status: (status) => {
    const statusStyles = {
      Pending: "bg-vmb-pending/20 text-vmb-pending",
      Claimed: "bg-vmb-success/20 text-vmb-success",
      Unclaimed: "bg-vmb-muted/20 text-vmb-muted",
    };

    return (
      <span
        className={`inline-block p-[5px] rounded-[5px] text-[10px] font-medium  text-center ${
          statusStyles[status] || "bg-gray-200 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  },
};
