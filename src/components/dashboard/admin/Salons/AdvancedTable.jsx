import React from "react";

export default function AdvancedTable({
  data,
  columns,
  onRowClick,
  onActionClick,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        No salons found in this category
      </div>
    );
  }

  return (
    <div className=" -mx-4 sm:mx-0">
      <table className="w-full advanced-table-desktop">
        <thead className="rounded-[5px]">
          <tr className="border-b border-gray-200 bg-[#F8F8F8] ">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-4 px-3 text-sm font-semibold text-[#FF92A5] uppercase tracking-wider"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border border-[#9CA3AF4D] hover:bg-gray-50 transition cursor-pointer "
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-4 px-3 text-sm text-gray-700 align-center"
                >
                  <div className="break-words max-w-xs">
                    {col.render ? col.render(row, onActionClick) : row[col.key]}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="advanced-table-mobile space-y-4 px-4 sm:px-0">
        {data.map((row) => (
          <div
            key={row.id}
            className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => onRowClick?.(row)}
          >
            <div className="mb-4">
              <span className="text-xs font-medium text-gray-500 block mb-2">
                Salon Name
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={row.image || row.salonImage}
                  alt={row.salonName}
                  className="w-11 h-11 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                />
                <span className="font-medium text-gray-800 text-sm break-words">
                  {row.salonName}
                </span>
              </div>
            </div>

            {columns
              .filter((col) => col.key !== "salonName" && col.key !== "actions")
              .map((col) => (
                <div key={col.key} className="mb-3 last:mb-4">
                  <span className="text-xs font-medium text-gray-500 block">
                    {col.header}
                  </span>
                  <div className="mt-1 text-sm text-gray-700 break-words">
                    {col.render ? col.render(row, onActionClick) : row[col.key]}
                  </div>
                </div>
              ))}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-500">Actions</div>
              <div className="flex items-center gap-2">
                {columns
                  .find((c) => c.key === "actions")
                  ?.render(row, onActionClick)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
