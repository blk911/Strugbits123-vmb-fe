import React from "react";

const TableRow = ({ row, keys, cellRenderers }) => (
  <tr className="hover:bg-gray-50 transition-colors border border-gray-200 max-sm:flex max-sm:flex-col max-sm:border-0 max-sm:mb-4 max-sm:rounded-lg max-sm:shadow-sm max-sm:bg-white">
    {keys.map((key, index) => {
      let cellValue = row[key];

      if (cellRenderers[key]) {
        cellValue = cellRenderers[key](row[key]);
      }

      const headerText =
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

      return (
        <td
          key={key}
          data-label={headerText}
          className={`px-4 py-3 text-[#4B5563] border-t border-b border-[#9CA3AF4D] 
            ${index === 0 ? "rounded-l-lg border-l" : ""} 
            ${index === keys.length - 1 ? "rounded-r-lg border-r" : ""}
            max-sm:border-0 max-sm:flex max-sm:justify-between max-sm:items-center 
            max-sm:py-2 max-sm:px-4 max-sm:before:content-[attr(data-label)] 
            max-sm:before:font-bold max-sm:before:text-gray-600 max-sm:before:mr-2 
            max-sm:text-right max-sm:last:rounded-b-lg max-sm:first:rounded-t-lg`}
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
        >
          {cellValue}
        </td>
      );
    })}
  </tr>
);

export default TableRow;
