import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

export default function InviteCard({
  img,
  salon,
  service,
  statusText,
  statusColor,
  timeAgo,
  isLoading,
}) {
  return (
    <div
      className="border border-[#0000001A] rounded-[10px] p-3 
      flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4"
    >
      {isLoading ? (
        <div>
          <LoadingIndicator size="md" />
        </div>
      ) : (
        <>
          <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mx-auto sm:mx-0">
            <img src={img} alt="User" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col flex-grow text-center sm:text-left">
            <p className="text-[14px] font-semibold text-[#4B5563]">{salon}</p>
            <p className="text-[12px] text-[#4B5563]">{service}</p>
          </div>

          <div className="flex flex-col items-center sm:items-end sm:ml-auto mt-1 sm:mt-0">
            <div
              className="rounded-[5px] p-[5px] text-[10px] font-semibold"
              style={{
                backgroundColor: `${statusColor}33`,
                color: statusColor,
              }}
            >
              {statusText}
            </div>

            <p className="text-[10px] text-[#00000080]">{timeAgo}</p>
          </div>
        </>
      )}
    </div>
  );
}
