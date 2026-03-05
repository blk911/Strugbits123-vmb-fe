export const CellRenderers = {
  services: (services) => (
    <div className="flex flex-wrap gap-1">
      {services.map((service, index) => (
        <span
          key={index}
          className="px-1.5 py-0.5  bg-white border border-vmb-secondary text-vmb-secondary rounded text-[10px] whitespace-nowrap"
        >
          {service}
        </span>
      ))}
    </div>
  ),

  status: (status) => {
    const styles = {
      Accepted: "bg-vmb-success/20 text-vmb-success",
      Pending: "bg-vmb-pending/20 text-vmb-pending",
      Declined: "bg-vmb-error/20 text-vmb-error",
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
