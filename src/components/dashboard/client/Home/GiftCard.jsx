import { useNavigate } from "react-router-dom";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import defaultUser from "../../../../assets/user_icon.png";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import { capitalizeFirst } from "../../../../utils/HelperFunctions";

function EmptyState({ message }) {
  return (
    <div className="text-center py-5 text-[#9CA3AF]">
      <p className="text-[14px] font-medium">{message}</p>
    </div>
  );
}
export default function GiftCard({
  icon: Icon,
  title,
  items = [],
  emptyMessage,
  isLoading = false,
  formatTimeAgo,
}) {
  const navigate = useNavigate();
  const { openModal } = useDashboardModal();

  const handleCardClick = (item) => {
    if (title === "My Requests" && item) {
      openModal("treat", {
        isSubmitted: true,
        gift: item,
        selectedSalon: item.salonId?.salonName || "Unknown Salon",
        selectedServices: item.services.map((s) => s.serviceName || s.name),
        email: item.receiverEmail,
        message: item.message || "No message",
      });
    }

    if (title === "Received Requests" && item) {
      openModal("treatRequest", {
        gift: item,
        salon: {
          name: item.salonId?.salonName,
          description: item.salonId?.description,
          image: item.salonId?.profilePic,
        },
        services: item.services.map((s) => ({
          name: s.serviceName || s.name,
          duration: `${s.serviceDuration} min`,
          price: s.servicePrice,
        })),
        sender: {
          name: item.requesterId?.name || "Someone",
          email: item.requesterId?.email,
          message: item.message,
        },
      });
    }

    if (title === "Appointments" && item) {
      openModal("appointmentScheduled", {
        salon: {
          name: item?.salon?.salonName,
          description: item?.salon?.salonDescription || "",
          image: item?.salon?.salonImage || "/default-salon.jpg",
        },
        services: (item?.services || []).map((s) => ({
          name: s.serviceName || s.name,
          duration: `${s.duration || 60} min`,
          price: s.price || 0,
        })),
        appointment: {
          date: item?.appointmentDate,
          time: item?.startTime,
          id: item?._id,
        },
      });
    }
  };

  const handleViewAll = () => {
    if (title === "My Requests") {
      navigate("/gifts", { state: { activeTab: "myRequests" } });
    } else if (title === "Received Requests") {
      navigate("/gifts", { state: { activeTab: "receivedRequests" } });
    } else if (title === "Appointments") {
      navigate("/appointments");
    }
  };

  return (
    <div className="w-full  rounded-[12px] border border-[#F3F4F6] bg-white shadow-[0_4px_6px_#0000000D] p-5 flex flex-col ">
      <div className="flex flex-col md:flex-row items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-[#FF92A5] shrink-0" />
          <span className="text-[15px] md:text-[18px] font-semibold text-[#581838]">
            {title}
          </span>
        </div>
        <span
          onClick={handleViewAll}
          className="text-[14px] font-medium text-[#9CA3AF] underline cursor-pointer hover:text-[#FF92A5] transition-all"
        >
          View All
        </span>
      </div>

      <div className="h-[1px] bg-[#D9D9D9] mb-4"></div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingIndicator size="md" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="space-y-3 flex-1">
          {items.map((item, index) => {
            const userName =
              title === "My Requests"
                ? item.receiverEmail || "Unknown"
                : title === "Received Requests"
                ? `From: ${item.requesterId?.name || "Someone"}`
                : item.requestedBy?.name || "Client";

            const packageName =
              item.services?.length > 0
                ? `${item.services.length} service${
                    item.services.length > 1 ? "s" : ""
                  } • $${item.services.reduce(
                    (a, b) => a + (b.servicePrice || b.price || 0),
                    0
                  )}`
                : "No services";

            const status = capitalizeFirst(
              item.status || (title === "Appointments" ? "pending" : "")
            );
            const statusColor =
              status === "Pending"
                ? "#FF9500"
                : status === "Accepted" ||
                  status === "Confirmed" ||
                  status === "Scheduled"
                ? "#4FCF00"
                : status === "Hold"
                ? "#64748B"
                : status === "Reschedule-requested" || status === "Reschedule"
                ? "#FF92A5"
                : "#EF4444";
            const statusBg = `${statusColor}33`;

            const timeAgo = formatTimeAgo(
              item.createdAt || item.appointmentDate
            );

            return (
              <div
                key={item._id || index}
                className="p-3 border border-[#0000001A] rounded-[10px] flex  flex-col md:flex-row  items-center justify-between cursor-pointer hover:border-2 hover:border-[#FF92A5] transition-all"
                onClick={() => handleCardClick(item)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    <img
                      src={
                        item.salonId?.profilePic ||
                        item.requestedBy?.image ||
                        item.salonImage ||
                        defaultUser
                      }
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[#4B5563] font-semibold text-[14px] leading-[18px] break-all">
                      {userName}
                    </p>
                    <p className="text-[12px] text-[#4B5563]/70">
                      {packageName}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p
                    className="font-semibold text-[10px] rounded-[4px] px-2 py-[2px]"
                    style={{ color: statusColor, backgroundColor: statusBg }}
                  >
                    {status}
                  </p>
                  <p className="text-[10px] text-[#00000080] mt-1">{timeAgo}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
