import React from "react";

const TableRow = ({ row, keys, cellRenderers, onRowClick }) => (
  <tr
    className="block mb-4 bg-white rounded-lg hover:bg-gray-50 transition-colors md:table-row md:mb-0 cursor-pointer"
    onClick={() => onRowClick?.(row)}
  >
    {keys.map((key, index) => {
      let cellValue = cellRenderers[key]
        ? cellRenderers[key](row[key])
        : row[key];
      const headerText =
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

      const noTruncate = key === "appointmentDate" || key === "appointmentTime";

      return (
        <td
          key={key}
          data-label={headerText}
          className={`
            block w-full px-3 py-2 text-[#4B5563] text-sm
            md:table-cell md:w-auto md:px-3 md:py-2.5
            before:content-[attr(data-label)] before:font-semibold before:text-gray-600 before:block before:mb-0.5
            md:before:content-none
            ${index === 0 ? "rounded-t-lg md:rounded-l-lg" : ""}
            ${index === keys.length - 1 ? "rounded-b-lg md:rounded-r-lg" : ""}
          `}
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-1">
            <span className="md:hidden font-medium text-xs text-gray-700">
              {headerText}:
            </span>
            <div
              className={`break-words max-w-full ${
                noTruncate ? "whitespace-nowrap" : ""
              }`}
            >
              {cellValue}
            </div>
          </div>
        </td>
      );
    })}
    {/* Divider after full row - Mobile only */}
    <td className="block md:hidden w-full border-b border-gray-200 mt-2"></td>
  </tr>
);

export default TableRow;
