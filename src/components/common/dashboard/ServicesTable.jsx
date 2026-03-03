const ServicesTable = ({
  services = [],
  containerClass = "",
  headerClass = "",
  rowClass = "",
  scrollbarClass = "",
  maxHeightClass = "max-h-32",
  showHeader = true,
  emptyText = "No services selected",
}) => {
  if (!services.length) {
    return <p className="text-vmb-text-muted">{emptyText}</p>;
  }

  return (
    <div
      className={`
        overflow-y-auto
        ${maxHeightClass}
        ${scrollbarClass}
        ${containerClass}
      `}
    >
      {showHeader && (
        <div
          className={`grid grid-cols-3 gap-2 font-medium text-vmb-text-main ${headerClass}`}
        >
          <div>Service</div>
          <div>Duration</div>
          <div>Price</div>
        </div>
      )}

      {services.map((s, i) => (
        <div
          key={s.id ?? i}
          className={`
            grid grid-cols-3 gap-2 mt-2 text-vmb-text-muted
            ${rowClass}
          `}
        >
          <div>{s.name}</div>
          <div>{s.duration}</div>
          <div>${s.price}</div>
        </div>
      ))}
    </div>
  );
};

export default ServicesTable;
