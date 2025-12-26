import { useDashboardModal } from "../../../../pages/ModalProvider";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

export default function AppointmentCard({
  icon,
  from,
  service,
  price,
  statusText,
  statusColor,
  timeAgo,
  data,
  isLoading,
}) {
  const { openModal } = useDashboardModal();
  return (
    <div
      className="border border-[#0000001A] rounded-[10px] p-3 
      flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 cursor-pointer hover:border-2 hover:border-[#FF92A5]  transition-all"
      onClick={() => {
        openModal("scheduleAppointment", {
          salon: {
            name: data?.salonName,
            description: data?.salonDescription || "",
            image: data?.salonImage || "/default-salon.jpg",
          },
          services: (data?.services || []).map((s) => ({
            name: s.serviceName || s.name,
            duration: s.duration ? `${s.duration} min` : "N/A",
            price: s.price || 0,
          })),
          treatTo: {
            name: data?.requestedBy.name || "Client",
            email: data?.requestedBy.email || "N/A",
            phone: data?.requestedBy.phone || "N/A",
            image: data?.requestedBy.image || "/default-user.jpg",
          },
          treatBy: {
            name: data?.requestedFrom.name || "Payer",
            email: data?.requestedFrom.email || "N/A",
            phone: data?.requestedFrom.phone || "N/A",
            image: data?.requestedFrom.image || "/default-user.jpg",
          },
          appointment: {
            id: data?._id,
            date: data?.appointmentDate,
            time: data?.startTime,
            message: data?.reschduleReason || "",
            status: data?.status,
            type: data?.type,
          },
        });
      }}
    >
      {isLoading ? (
        <div>
          <LoadingIndicator size="md" />
        </div>
      ) : (
        <>
          <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mx-auto sm:mx-0">
            <img src={icon} alt="User" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col flex-grow text-center sm:text-left">
            <p className="text-[14px] font-semibold text-[#4B5563]">
              From: {from}
            </p>
            <p className="text-[12px] text-[#4B5563]">
              {service} • {price}
            </p>
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
