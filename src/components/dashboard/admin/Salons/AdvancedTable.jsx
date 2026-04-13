import React from "react";
import { LuArrowUp, LuArrowDown, LuArrowUpDown } from "react-icons/lu";

export default function AdvancedTable({
  data,
  columns,
  onRowClick,
  onActionClick,
  sortBy,
  sortOrder,
  onSort,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-vmb-text-muted text-sm">
        No salons found in this category
      </div>
    );
  }

  return (
    <div className=" -mx-4 sm:mx-0">
      <table className="w-full advanced-table-desktop">
        <thead className="rounded-[5px]">
          <tr className="border-b border-vmb-primary/10 bg-vmb-bg-soft ">
            {columns.map((col) => {
              const isSortable = col.sortable;
              const isActive = sortBy === col.sortField;

              return (
                <th
                  key={col.key}
                  className={`text-left bg-vmb-table-header rounded-[10px] py-3 px-6 text-sm font-semibold text-vmb-secondary uppercase tracking-wider select-none ${isSortable ? "cursor-pointer group" : ""}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  onClick={
                    isSortable ?
                      () => {
                        if (isActive) {
                          onSort?.(col.sortField, sortOrder === 1 ? -1 : 1);
                        } else {
                          onSort?.(
                            col.sortField,
                            col.sortField === "createdAt" ? -1 : 1,
                          );
                        }
                      }
                    : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {isSortable && (
                      <div className="flex items-center">
                        {isActive ?
                          sortOrder === 1 ?
                            <LuArrowUp className="w-4 h-4 text-vmb-secondary" />
                          : <LuArrowDown className="w-4 h-4 text-vmb-secondary" />

                        : <LuArrowUpDown className="text-[#9CA3AF] w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                        }
                      </div>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border border-vmb-primary/10 hover:bg-vmb-bg-soft transition cursor-pointer "
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-3 px-4 text-sm font-medium text-vmb-text-muted align-center"
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
            className="bg-white border border-vmb-primary/10 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => onRowClick?.(row)}
          >
            <div className="mb-4">
              <span className="text-xs font-medium text-vmb-text-muted block mb-2">
                Salon Name
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={row.image || row.salonImage}
                  alt={row.salonName}
                  className="w-11 h-11 rounded-lg object-cover border border-vmb-primary/10 flex-shrink-0"
                />
                <span className="font-medium text-vmb-text-muted text-sm break-words">
                  {row.salonName}
                </span>
              </div>
            </div>

            {columns
              .filter((col) => col.key !== "salonName" && col.key !== "actions")
              .map((col) => (
                <div key={col.key} className="mb-3 last:mb-4">
                  <span className="text-xs font-medium text-vmb-text-muted block">
                    {col.header}
                  </span>
                  <div className="mt-1 text-sm text-vmb-text-muted break-words">
                    {col.render ? col.render(row, onActionClick) : row[col.key]}
                  </div>
                </div>
              ))}

            <div className="flex items-center justify-between pt-3 border-t border-vmb-primary/10">
              <div className="text-xs font-medium text-vmb-text-muted">
                Actions
              </div>
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
