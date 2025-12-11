import React from "react";

const TableRow = ({ row, keys, cellRenderers, onRowClick }) => (
  <tr onClick={() => onRowClick?.(row)}>
    {keys.map((key, index) => {
      let cellValue = cellRenderers[key]
        ? cellRenderers[key](row[key])
        : row[key];
      const headerText =
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

      const noTruncate = key === "appointmentDate" || key === "appointmentTime";

      return (
        <td key={key} data-label={headerText}>
          <div className="flex flex-col gap-1">
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
