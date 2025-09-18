import React from "react";

const TableRow = ({ row, keys, onActionClick, cellRenderers=false }) => (
  <tr className="hover:bg-gray-50 transition-colors border border-gray-200">
    {keys.map((key, index) => {
      let cellValue = row[key];

      // If a custom renderer exists, use it
      if (cellRenderers[key]) {
        cellValue = cellRenderers[key](row[key], onActionClick ? row : null, onActionClick);
      }

      return (
        <td
          key={key}
          className={`px-4 py-3 text-[#4B5563] border-t border-b border-[#9CA3AF4D] 
          ${index === 0 ? "rounded-l-lg border-l" : ""} 
          ${index === keys.length - 1 ? "rounded-r-lg border-r" : ""}`}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          {cellValue}
        </td>
      );
    })}
  </tr>
);

export default TableRow;
