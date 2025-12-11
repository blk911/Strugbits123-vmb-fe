import React from "react";
import { IoClose } from "react-icons/io5";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import AppButton from "../../../common/site/AppButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetSalonByIdQuery } from "../../../../store/api";
import { setSelectedSalon } from "../../../../store/features/selectedSalonSlice";
import { toastLoading } from "../../../../utils/toast";

export default function AppointmentRequestHistoryModal({
  isOpen,
  onClose,
  data,
}) {
  if (!isOpen || !data) return null;

  const { timelineItems = [], treatSection = {}, appointment } = data;
  const { sender = {}, receiver = {}, salon = {} } = treatSection;
  const salonId = salon?.salonId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: salonResponse,
    isLoading: loadingSalon,
    isSuccess,
  } = useGetSalonByIdQuery(salonId, {
    skip: !isOpen || !salonId,
  });
  const handleViewSalon = () => {
    if (!salonId) return;

    if (isSuccess && salonResponse?.data) {
      dispatch(setSelectedSalon(salonResponse.data));
      onClose();
      navigate(`/salon/${salonId}`);
      return;
    }

    if (loadingSalon) {
      toastLoading("Loading salon details...");
      return;
    }

    onClose();
    navigate(`/salon/${salonId}`);
  };
  const status = appointment?.status?.toLowerCase() || "pending";
  const statusStyles = {
    pending: { bg: "bg-[#FF950033]", text: "text-[#FF9500]", label: "Pending" },
    scheduled: {
      bg: "bg-[#4FCF0033]",
      text: "text-[#4FCF00]",
      label: "Scheduled",
    },
    confirmed: {
      bg: "bg-[#4FCF0033]",
      text: "text-[#4FCF00]",
      label: "Confirmed",
    },
    hold: { bg: "bg-[#FFAA0033]", text: "text-[#FFAA00]", label: "On Hold" },
    declined: {
      bg: "bg-[#DC262633]",
      text: "text-[#DC2626]",
      label: "Declined",
    },
    default: {
      bg: "bg-gray-200",
      text: "text-gray-600",
      label: "Reschedule Requested",
    },
  };
  const currentStyle = statusStyles[status] || statusStyles.default;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[960px] max-h-[95vh] font-[Poppins] overflow-y-auto bg-[#e8e8e8] rounded-[20px] p-[30px] flex flex-col gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-[#581838] font-bold text-[24px]">
            Appointment Request History
          </h3>
          <button
            onClick={onClose}
            className="text-[#581838] text-[28px] p-1 rounded hover:bg-white/30 transition cursor-pointer"
          >
            <IoClose />
          </button>
        </div>

        <div className="w-full border border-[#5818381A] bg-[#F2F2F2] rounded-[10px] p-5 flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white border border-[#0000001A] rounded-[10px] p-5">
            <div className="flex justify-end mb-3">
              <span
                className={`px-3 py-1 ${currentStyle.bg} ${currentStyle.text} text-[10px] font-semibold rounded-[5px]`}
              >
                {currentStyle.label}
              </span>
            </div>

            <div
              className="max-h-[60vh] overflow-y-auto pr-2 no-scrollbar"
              style={{ scrollbarWidth: "none" }}
            >
              {timelineItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No timeline events yet
                </p>
              ) : (
                timelineItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          item.iconBg || "bg-[#FF92A54D]"
                        }`}
                        style={{
                          borderColor: item.iconBorderColor || "#FF92A5",
                        }}
                      >
                        <div className={item.iconColor || "text-[#FF92A5]"}>
                          {item.icon}
                        </div>
                      </div>
                      {idx < timelineItems.length - 1 && (
                        <div
                          className={`w-0.5 mt-2 ${
                            item.barColor || "bg-[#FF92A54D]"
                          }`}
                          style={{ height: 50 }}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <h4
                        className="font-bold text-sm sm:text-base"
                        style={{ color: item.titleColor || "#1F2937" }}
                      >
                        {item.title}
                      </h4>
                      {item.dateBy && (
                        <p className="text-[#6B7280] text-xs mt-0.5">
                          {item.dateBy}
                        </p>
                      )}
                      {item.body && (
                        <p className="text-[#4B5563] text-sm mt-1">
                          {item.body}
                        </p>
                      )}

                      {item.reschedule && (
                        <div className="mt-3 pl-4 border-l-2 border-[#9CA3AF4D] text-sm text-[#4B5563]">
                          <p className="font-semibold text-[#6B7280]">
                            {item.reschedule.requestFrom}
                          </p>
                          <p className="mt-1 whitespace-pre-line">
                            {item.reschedule.requestMessage}
                          </p>
                          {/* <p className="font-semibold text-[#6B7280] mt-4">
                            {item.reschedule.acceptedBy}
                          </p>
                          <p className="mt-1">
                            {item.reschedule.newAppointment}
                          </p>
                          <p>{item.reschedule.appointmentDateTime}</p> */}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="w-full md:w-[360px] flex flex-col gap-6">
            <div className="border border-[#0000001A] bg-[#F0F0F0] rounded-[10px] p-4 flex flex-col gap-5">
              <p className="text-[#581838] font-medium text-[14px]">
                Appointment Request:
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={sender.avatar || "/default-user.jpg"}
                  alt={sender.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <p className="text-[#4B5563] font-semibold text-[16px]">
                    {sender.name || "Client"}
                  </p>
                  <p className="text-[#4B5563] text-[12px] break-all">
                    {sender.email || "N/A"}
                  </p>
                  {sender?.phone && (
                    <p className="text-[#4B5563] text-[12px]">
                      {sender.phone || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-[#581838] font-medium text-[14px]">
                Services:
              </p>

              <div className="border border-[#9CA3AF4D] rounded-[10px] p-3 text-[12px]">
                {salon.serviceRequested ? (
                  <div className="flex flex-col gap-3">
                    <div className="hidden sm:flex justify-between text-[12px] font-medium text-[#000] px-1">
                      <div>Service</div>
                      <div>Duration</div>
                      <div>Price</div>
                    </div>

                    {salon.serviceRequested.map((s, i) => (
                      <div
                        key={i}
                        className={`border border-[#D9D9D9] rounded-lg p-3 text-sm 
            flex flex-col sm:flex-row sm:justify-between gap-2`}
                      >
                        <div className="flex flex-col sm:hidden justify-between">
                          <span className="text-[#000] font-medium">
                            Service:
                          </span>
                          <span className="text-[#4B5563]">{s.name}</span>
                        </div>

                        <div className="flex flex-col sm:hidden justify-between">
                          <span className="text-[#000] font-medium">
                            Duration:
                          </span>
                          <span className="text-[#4B5563]">{s.duration}</span>
                        </div>

                        <div className="flex flex-col sm:hidden justify-between">
                          <span className="text-[#000] font-medium">
                            Price:
                          </span>
                          <span className="text-[#4B5563]">${s.price}</span>
                        </div>

                        <div className="hidden sm:flex justify-between w-full text-[#4B5563]">
                          <div>{s.name}</div>
                          <div>{s.duration}</div>
                          <div>${s.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#4B5563]">No services selected</p>
                )}
              </div>
              <p className="text-left sm:text-right text-[#FF92A5] font-bold text-[13px]">
                Amount Paid: $
                {salon?.serviceRequested.reduce((a, b) => a + b.price, 0)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                <div className="flex flex-col">
                  <p className="font-medium text-[#404040]">Date</p>
                  <div className="border border-[#9CA3AF4D] rounded-[8px] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[#FF92A5] shrink-0" />
                      <p className="text-[#00000080] text-[14px]">
                        {appointment?.appointmentDate
                          ? new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString("en-GB")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="font-medium text-[#404040]">Time</p>
                  <div className="border border-[#9CA3AF4D] rounded-[8px] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-[#FF92A5] shrink-0" />
                      <p className="text-[#00000080] text-[14px]">
                        {appointment?.startTime || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-[#581838] font-semibold text-[18px]">
                Salon Information
              </h3>

              <div className="flex items-center gap-4">
                <img
                  src={salon.image || "/default-salon.jpg"}
                  alt={salon.name}
                  className="w-15 h-15 rounded-[10px] object-cover"
                />
                <div>
                  <p className="font-semibold text-[#4B5563] text-[20px]">
                    {salon.name || "Unknown Salon"}
                  </p>
                  <p className="text-[#4B5563] text-[12px]">
                    {salon.desc || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[14px]">
                <div>
                  {salon.email && (
                    <>
                      <p className="font-medium text-black">Email:</p>
                      <p className="text-[#00000080] break-all">
                        {salon.email || "N/A"}
                      </p>
                    </>
                  )}
                </div>
                {salon.phone && (
                  <div className={`${!salon.email && "col-span-2"}`}>
                    <p className="font-medium text-black">Phone:</p>
                    <p className="text-[#00000080]">{salon.phone || "N/A"}</p>
                  </div>
                )}
              </div>

              <AppButton
                variant="custom"
                size="custom"
                className="bg-[#FF92A54D] text-[#581838] font-medium py-3 rounded-[10px] hover:bg-[#ff92a5]/20 transition"
                onClick={handleViewSalon}
              >
                View Salon
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
