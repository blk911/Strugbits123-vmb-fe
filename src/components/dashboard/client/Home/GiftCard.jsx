import { useNavigate } from "react-router-dom";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import defaultUser from "../../../../assets/user_icon.png";
import { da } from "zod/locales";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

export default function GiftCard({
  icon: Icon,
  title,
  userName,
  packageName,
  status,
  statusColor,
  statusBg,
  hasData = true,
  data,
  isLoading = false,
}) {
  const navigate = useNavigate();
  const { openModal } = useDashboardModal();

  const handleCardClick = () => {
    if (!hasData) return;
    if (title === "My Requests" && data) {
      openModal("treat", {
        isSubmitted: true,
        gift: data,
        selectedSalon: data.salonId?.salonName || "Unknown Salon",
        selectedServices: data.services.map((s) => s.serviceName || s.name),
        email: data.receiverEmail,
        message: data.message || "No message",
      });
    }

    if (title === "Received Requests" && data) {
      openModal("treatRequest", {
        gift: data,
        salon: {
          name: data.salonId?.salonName,
          description: data.salonId?.description,
          image: data.salonId?.profilePic,
        },
        services: data.services.map((s) => ({
          name: s.serviceName || s.name,
          duration: `${s.serviceDuration} min`,
          price: s.servicePrice,
        })),
        sender: {
          name: data.requesterId?.name || "Someone",
          email: data.requesterId?.email,
          message: data.message,
        },
      });
    }

    if (title === "Appointments") {
      openModal("appointmentScheduled");
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
    <div className="w-full h-full rounded-[12px] border border-[#F3F4F6] bg-white shadow-[0_4px_6px_#0000000D] p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-[#FF92A5]" />
          <span className="text-[18px] font-semibold text-[#581838]">
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

      <div className="h-[1px] bg-[#D9D9D9] mb-3"></div>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <LoadingIndicator size="md" />
        </div>
      ) : hasData ? (
        <div
          className="p-3 border border-[#0000001A] rounded-[10px] flex items-center justify-between cursor-pointer hover:border-2 hover:border-[#FF92A5] transition-all"
          onClick={handleCardClick}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
              <img
                src={data?.salonId?.profilePic || defaultUser}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[#4B5563] font-semibold text-[14px] leading-[18px] break-all">
                {userName}
              </p>
              <p className="text-[12px] text-[#4B5563]/70">{packageName}</p>
            </div>
          </div>

          <div className="text-center">
            <p
              className="font-semibold text-[10px] rounded-[4px] px-2 py-[2px]"
              style={{ color: statusColor, backgroundColor: statusBg }}
            >
              {status}
            </p>
            <p className="text-[10px] text-[#00000080] mt-1">Recent</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 text-[#9CA3AF]">
          <p className="text-[14px] font-medium">No requests to show</p>
        </div>
      )}
    </div>
  );
}
