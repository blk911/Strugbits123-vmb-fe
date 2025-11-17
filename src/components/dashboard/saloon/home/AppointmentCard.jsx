export default function AppointmentCard({
  icon,
  from,
  service,
  price,
  statusText,
  statusColor,
  timeAgo,
}) {
  return (
    <div
      className="border border-[#0000001A] rounded-[10px] p-3 
      flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4"
    >
      <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mx-auto sm:mx-0">
        <img src={icon} alt="User" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col flex-grow text-center sm:text-left">
        <p className="text-[14px] font-semibold text-[#4B5563]">From: {from}</p>
        <p className="text-[12px] text-[#4B5563]">
          {service} • {price}
        </p>
      </div>

      <div className="flex flex-col items-center sm:items-end sm:ml-auto mt-1 sm:mt-0">
        <div
          className="px-2 py-1 rounded text-[10px] font-semibold"
          style={{
            backgroundColor: `${statusColor}33`,
            color: statusColor,
          }}
        >
          {statusText}
        </div>

        <p className="text-[10px] text-[#00000080]">{timeAgo}</p>
      </div>
    </div>
  );
}
