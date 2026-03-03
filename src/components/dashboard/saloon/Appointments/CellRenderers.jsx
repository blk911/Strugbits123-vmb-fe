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
  status: (value) => {
    const styles = {
      Pending: "bg-vmb-pending/20 text-vmb-pending",
      "Reschedule requested": "bg-vmb-secondary/20 text-vmb-secondary",
      Hold: "bg-vmb-muted/20 text-vmb-muted",
      Confirmed: "bg-vmb-success/20 text-vmb-success",
      Cancelled: "bg-vmb-error/20 text-vmb-error",
      Completed: "bg-vmb-primary/20 text-vmb-primary",
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
