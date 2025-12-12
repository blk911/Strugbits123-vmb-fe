import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const Table = ({ data, cellRenderers, onRowClick }) => {
  if (!data || data.length === 0)
    return <p className="p-4 text-gray-500 text-center">No data available</p>;

  const keys = Object.keys(data[0]).filter((key) => key !== "id");

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed text-sm bg-white custom-table ">
        <TableHeader keys={keys} />
        <tbody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              keys={keys}
              cellRenderers={cellRenderers || {}}
              onRowClick={onRowClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
