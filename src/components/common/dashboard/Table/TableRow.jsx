import React from "react";

const TableRow = ({
  row,
  keys,
  cellRenderers,
  onRowClick,
  showPointer = true,
}) => (
  <tr
    onClick={() => onRowClick?.(row)}
    className={`${
      showPointer ? "cursor-pointer" : ""
    }  text-[#4B5563] font-medium border border-[#9CA3AF4D] hover:bg-gray-50 rounded-[5px]`}
  >
    {keys.map((key, index) => {
      let cellValue = cellRenderers[key]
        ? cellRenderers[key](row[key])
        : row[key];
      const headerText =
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

      const noTruncate = key === "appointmentDate" || key === "appointmentTime";

      return (
        <td key={key} data-label={headerText}>
          <div className="flex flex-col ">
            <span className="label md:hidden">{headerText}:</span>
            <div
              className={`value ${
                noTruncate ? "whitespace-nowrap" : "break-words"
              }`}
            >
              {cellValue}
            </div>
          </div>
        </td>
      );
    })}
  </tr>
);
export default TableRow;
