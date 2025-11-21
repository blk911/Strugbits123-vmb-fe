import React from "react";
import { FiEye, FiCheck, FiX } from "react-icons/fi";

export const CellRenderers = {
  //   salonName: (row) => (
  //     <div className="flex items-center gap-3">
  //       <img
  //         src={row.image}
  //         alt={row.salonName}
  //         className="w-[46px] h-[46px] rounded-lg object-cover border border-gray-200"
  //       />
  //       <span className="font-medium text-[#4B5563]">{row.salonName}</span>
  //     </div>
  //   ),

  status: (status) => {
    const styles = {
      Active: "bg-[#4FCF0033] text-[#4FCF00]",
      Pending: "bg-[#FF950033] text-[#FF9500]",
      Inactive: "bg-[#4B556333] text-[#4B5563]",
      Rejected: "bg-[#DC262633] text-[#DC2626]",
    };

    return (
      <span
        className={`inline-block px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  },

  actions: (row, onRowClick) => (
    <div className="flex items-center justify-end gap-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRowClick?.(row);
        }}
        className="p-2 rounded-lg border border-[#9CA3AFCC] hover:bg-gray-50 transition"
        title="View Details"
      >
        <FiEye className="w-4 h-4 text-gray-600" />
      </button>

      {row.status === "Pending" && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Approve", row.salonName);
              // Call your approve API
            }}
            className="p-2 rounded-lg border border-[#9CA3AFCC] hover:bg-green-50 transition"
            title="Approve"
          >
            <FiCheck className="w-4 h-4 text-green-600" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Reject", row.salonName);
              // Call your reject API
            }}
            className="p-2 rounded-lg border border-[#9CA3AFCC] hover:bg-red-50 transition"
            title="Reject"
          >
            <FiX className="w-4 h-4 text-red-600" />
          </button>
        </>
      )}

      {row.status === "Inactive" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Reactivate", row.salonName);
          }}
          className="p-2 rounded-lg border border-[#9CA3AFCC] hover:bg-blue-50 transition"
          title="Reactivate"
        >
          <FiCheck className="w-4 h-4 text-blue-600" />
        </button>
      )}
    </div>
  ),
};
