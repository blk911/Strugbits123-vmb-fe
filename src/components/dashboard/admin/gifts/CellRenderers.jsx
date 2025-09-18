import React from "react";
import Button from "../../../common/dashboard/Button";

export const CellRenderers = {
    giftedServices: (options) => (
        <div className="flex flex-wrap max-w-[250px] gap-2">
            {options.map((option, index) => (
                <Button
                    key={index}   // ✅ unique key for each button
                    text={option}
                    textClasses={"!text-[12px] !text-[#FF92A5]"}
                     classes={"!p-[5px] !bg-white border border-[#FF92A5]"}
                />
            ))}
        </div>
    ),

      status: (value) => (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
        value === "Active"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {value}
    </span>
  ),

    actions: (row, onActionClick) => (
        <button
            onClick={() => onActionClick(row.id)}
            className="text-gray-500 bg-[#D9D9D9] hover:bg-gray-100 p-1 rounded transition-colors"
        >
            <span className="h-8 w-8 flex items-center justify-center text-xl">⋮</span>
        </button>
    ),
};
