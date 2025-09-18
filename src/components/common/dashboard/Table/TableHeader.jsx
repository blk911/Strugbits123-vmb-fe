const TableHeader = ({ keys }) => (
  <thead className="rounded-lg bg-[#F8F8F8] shadow-sm">
    <tr>
      {keys.map((key, index) => (
        <th
          key={key}
          className={`text-[#6B7280] font-medium px-4 py-3 text-left text-xs text-[16px] 
            ${index === 0 ? "rounded-l-lg" : ""} 
            ${index === keys.length - 1 ? "rounded-r-lg" : ""}`}
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
        >
          {/* Capitalize key and replace camelCase with spaces */}
          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
        </th>
      ))}
    </tr>
  </thead>
);

export default TableHeader