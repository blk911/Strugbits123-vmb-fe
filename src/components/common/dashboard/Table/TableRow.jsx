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
    }  text-vmb-text-muted font-medium border border-vmb-primary/10 hover:bg-vmb-bg-soft rounded-[5px]`}
  >
    {keys.map((key, index) => {
      let cellValue =
        cellRenderers[key] ? cellRenderers[key](row[key]) : row[key];
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
              } text-vmb-text-muted`}
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
