export const CellRenderers = {
  services: (services) => (
    <div className="flex flex-wrap gap-1">
      {services.map((service, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-white border border-[#FF92A5] text-[#FF92A5] rounded text-[10px] whitespace-nowrap"
        >
          {service}
        </span>
      ))}
    </div>
  ),

  status: (status) => {
    const styles = {
      Confirmed: "bg-[#4FCF0033] text-[#4FCF00]",
      Pending: "bg-[#FF950033] text-[#FF9500]",
      Declined: "bg-[#DC26264D] text-[#DC2626]",
    };

    return (
      <span
        className={`inline-block px-3 py-1.5 rounded-md text-xs font-medium text-center min-w-[80px] ${
          styles[status] || "bg-gray-200 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  },
};
