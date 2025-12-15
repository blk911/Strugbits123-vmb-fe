export const CellRenderers = {
  services: (services) => (
    <div className="flex flex-wrap gap-1">
      {services.map((service, index) => (
        <span
          key={index}
          className="px-1.5 py-0.5  bg-white border border-[#FF92A5] text-[#FF92A5] rounded text-[10px] whitespace-nowrap"
        >
          {service}
        </span>
      ))}
    </div>
  ),

  status: (status) => {
    const styles = {
      Accepted: "bg-[#4FCF0033] text-[#4FCF00]",
      Pending: "bg-[#FF950033] text-[#FF9500]",
      Declined: "bg-[#DC26264D] text-[#DC2626]",
    };

    return (
      <span
        className={`inline-block p-[5px] rounded-[5px] text-[10px] font-medium  text-center ${
          styles[status] || "bg-gray-200 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  },
};
