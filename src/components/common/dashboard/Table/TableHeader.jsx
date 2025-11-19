import React from "react";

const TableHeader = ({ keys }) => (
  <thead className="hidden md:table-header-group bg-[#F8F8F8] rounded-lg">
    <tr>
      {keys.map((key, index) => {
        const widthClass =
          key === "serviceName"
            ? "w-32"
            : key === "payersEmail"
            ? "w-36"
            : key === "expiresOn"
            ? "w-32"
            : key === "discount"
            ? "w-20"
            : key === "status"
            ? "w-20"
            : "w-28";

        const noTruncate = key === "expiresOn";

        return (
          <th
            key={key}
            className={`
              text-[#FF92A5] font-medium px-2 py-2 text-left text-[13px]
              ${widthClass}
              ${noTruncate ? "whitespace-nowrap" : "truncate"}
              ${index === 0 ? "rounded-l-lg" : ""}
              ${index === keys.length - 1 ? "rounded-r-lg" : ""}
            `}
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
          >
            {key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1")}
          </th>
        );
      })}
    </tr>
  </thead>
);

export default TableHeader;
