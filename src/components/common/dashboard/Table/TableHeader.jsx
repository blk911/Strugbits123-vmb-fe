import React from "react";
import { LuArrowUp, LuArrowDown, LuArrowUpDown } from "react-icons/lu";
const TableHeader = ({ keys, onSort, sortBy, sortOrder, sortFields = {} }) => (
  <thead>
    <tr>
      {keys.map((key, index) => {
        const widthClass =
          key === "serviceName" ? "w-32"
          : key === "payersEmail" ? "w-36"
          : key === "expiresOn" ? "w-32"
          : key === "discount" ? "w-20"
          : key === "status" ? "w-20"
          : "w-28";

        const noTruncate = key === "expiresOn";
        const isSortable = !!onSort && !!sortFields[key];
        const isActive = isSortable && sortBy === sortFields[key];
        return (
          <th
            key={key}
            onClick={
              isSortable ?
                () => {
                  if (isActive) {
                    onSort(sortFields[key], sortOrder === 1 ? -1 : 1);
                  } else {
                    onSort(sortFields[key], -1);
                  }
                }
              : undefined
            }
            className={` bg-[#f2ebe6]
              text-vmb-primary font-semibold px-2 py-2 text-left text-[12px] sm:text-[13px] uppercase tracking-[0.05em]
              ${widthClass}
              ${noTruncate ? "whitespace-nowrap" : "whitespace-normal break-words"}
              ${isSortable ? "cursor-pointer group select-none hover:bg-[#eadfd8]" : ""}
            `}
            style={{ fontFamily: "Libre Franklin, sans-serif", fontWeight: 600 }}
          >
            <div className="flex items-center gap-2">
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
              {isSortable && (
                <div className="flex items-center">
                  {isActive ?
                    sortOrder === 1 ?
                      <LuArrowUp className="w-4 h-4 text-vmb-secondary" />
                    : <LuArrowDown className="w-4 h-4 text-vmb-secondary" />
                  : <LuArrowUpDown className="text-vmb-secondary w-3 h-3  " />}
                </div>
              )}
            </div>
          </th>
        );
      })}
    </tr>
  </thead>
);
export default TableHeader;
