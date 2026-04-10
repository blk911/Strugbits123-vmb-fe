import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

export default function InviteCard({
  img,
  salon,
  service,
  statusText,
  statusClass,
  timeAgo,
  isLoading,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`border border-vmb-primary/10 rounded-[10px] p-3 
      flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 hover:border-2 hover:border-vmb-secondary  transition-all 
      ${onClick ? "cursor-pointer hover:bg-vmb-bg-soft" : ""}`}
    >
      {isLoading ?
        <div>
          <LoadingIndicator size="md" />
        </div>
      : <>
          <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-vmb-bg-soft flex items-center justify-center mx-auto sm:mx-0">
            <img src={img} alt="User" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col flex-grow text-center sm:text-left">
            <p className="text-[14px] font-semibold text-vmb-text-muted">
              {salon}
            </p>
            <p className="text-[12px] text-vmb-text-muted">{service}</p>
          </div>

          <div className="flex flex-col items-center sm:items-end sm:ml-auto mt-1 sm:mt-0">
            <div
              className={`rounded-[5px] p-[5px] text-[10px] font-semibold ${statusClass}`}
            >
              {statusText}
            </div>

            <p className="text-[10px] text-vmb-text-muted/50">{timeAgo}</p>
          </div>
        </>
      }
    </div>
  );
}
