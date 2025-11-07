import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const Table = ({ data, cellRenderers }) => {
  if (!data || data.length === 0)
    return <p className="p-4 text-gray-500">No data available</p>;

  const keys = Object.keys(data[0]).filter((key) => key !== "id");

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm rounded-[10px] border-separate border-spacing-y-5 bg-white p-[10px] min-w-max">
        <TableHeader keys={keys} />
        <tbody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              keys={keys}
              cellRenderers={cellRenderers || {}}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
