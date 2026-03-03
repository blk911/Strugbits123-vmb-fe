import React from "react";

const TableHeader = ({ keys }) => (
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

        return (
          <th
            key={key}
            className={` bg-vmb-bg-soft
              text-vmb-secondary font-semibold px-2 py-2 text-left text-[13px]  sm:text-[16px]
              ${widthClass}
              ${
                noTruncate ? "whitespace-nowrap" : (
                  "whitespace-normal break-words"
                )
              }
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
