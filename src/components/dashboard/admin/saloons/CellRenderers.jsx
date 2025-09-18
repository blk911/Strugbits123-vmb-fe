import React from "react";

export const CellRenderers = {
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
