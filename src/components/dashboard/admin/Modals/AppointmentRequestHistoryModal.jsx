import React from "react";
import { IoClose } from "react-icons/io5";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import AppButton from "../../../common/site/AppButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetSalonByIdQuery } from "../../../../store/api";
import { setSelectedSalon } from "../../../../store/features/selectedSalonSlice";
import { toastLoading } from "../../../../utils/toast";
import ServicesTable from "../../../common/dashboard/ServicesTable";
import userAvatar from "../../../../assets/user.png";
export default function AppointmentRequestHistoryModal({
  isOpen,
  onClose,
  data,
}) {
  if (!isOpen || !data) return null;

  const { timelineItems = [], treatSection = {}, appointment } = data;
  const { sender = {}, receiver = {}, salon = {} } = treatSection;
  const type = appointment?.type;
  const total = salon?.serviceRequested.reduce((a, b) => a + b.price, 0);
  let finalTotal;

  if (type === "invite") {
    //  const discount=salon?.discount;
    // finalTotal = (total-((total * discount)/100));
    finalTotal = appointment?.paidAmount || 0;
  } else if (type === "booking") {
    finalTotal = total + 2.5;
  } else if (type === "gift") {
    finalTotal = total + total * 0.1;
  } else {
    finalTotal = total;
  }
  const salonId = salon?.salonId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: salonResponse,
    isLoading: loadingSalon,
    isSuccess,
  } = useGetSalonByIdQuery(
    { id: salonId },
    {
      skip: !isOpen || !salonId,
    },
  );
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
    pending: { bg: "bg-vmb-pending/20", text: "text-vmb-pending", label: "Pending" },
    scheduled: {
        bg: "bg-vmb-success/20",
        text: "text-vmb-success",
      label: "Scheduled",
    },
    confirmed: {
        bg: "bg-vmb-success/20",
        text: "text-vmb-success",
      label: "Confirmed",
    },
    hold: { bg: "bg-vmb-pending/20", text: "text-vmb-pending", label: "On Hold" },
    declined: {
        bg: "bg-vmb-error/20",
        text: "text-vmb-error",
      label: "Declined",
    },
    default: {
      bg: "bg-vmb-bg-soft",
      text: "text-vmb-text-muted",
      label: "Reschedule Requested",
    },
  };
  const currentStyle = statusStyles[status] || statusStyles.default;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[960px] max-h-[95vh] font-poppins overflow-y-auto custom-scrollbar bg-vmb-bg-soft rounded-[20px] p-[30px] flex flex-col gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-vmb-primary font-bold text-[24px]">
            Appointment Request History
          </h3>
          <button
            onClick={onClose}
            className="text-vmb-primary text-[28px] p-1 rounded hover:bg-white/30 transition cursor-pointer"
          >
            <IoClose />
          </button>
        </div>

        <div className="w-full border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-5 flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white border border-vmb-primary/10 rounded-[10px] p-5">
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
              {timelineItems.length === 0 ?
                <p className="text-center text-vmb-text-muted py-8">
                  No timeline events yet
                </p>
              : timelineItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          item.iconBg || "bg-vmb-secondary/30"
                        }`}
                        style={{
                          borderColor: item.iconBorderColor || "var(--vmb-secondary)",
                        }}
                      >
                        <div className={item.iconColor || "text-vmb-secondary"}>
                          {item.icon}
                        </div>
                      </div>
                      {idx < timelineItems.length - 1 && (
                        <div
                          className={`w-0.5 mt-2 ${
                            item.barColor || "bg-vmb-secondary/30"
                          }`}
                          style={{ height: 50 }}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <h4
                        className="font-bold text-sm sm:text-base"
                        style={{ color: item.titleColor || "var(--vmb-text-main)" }}
                      >
                        {item.title}
                      </h4>
                      {item.dateBy && (
                        <p className="text-vmb-text-muted text-xs mt-0.5">
                          {item.dateBy}
                        </p>
                      )}
                      {item.body && (
                        <p className="text-vmb-text-muted text-sm mt-1">
                          {item.body}
                        </p>
                      )}

                      {item.reschedule && (
                        <div className="mt-3 pl-4 border-l-2 border-[#9CA3AF4D] text-sm text-[#4B5563]">
                          <p className="font-semibold text-vmb-text-muted/50">
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
              }
            </div>
          </div>

          <div className="w-full md:w-[360px] flex flex-col gap-6">
            <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-4 flex flex-col gap-5">
              <p className="text-vmb-primary font-medium text-[14px]">
                Appointment Request:
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={sender.avatar || "/default-user.jpg"}
                  alt={sender.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <p className="text-vmb-text-muted font-semibold text-[16px]">
                    {sender.name || "Client"}
                  </p>
                  <p className="text-vmb-text-muted text-[12px] break-all">
                    {sender.email || "N/A"}
                  </p>
                  {sender?.phone && (
                    <p className="text-vmb-text-muted text-[12px]">
                      {sender.phone || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-vmb-primary font-medium text-[14px]">
                Services:
              </p>
              <ServicesTable
                services={salon.serviceRequested}
                containerClass="border border-vmb-primary/10 rounded-[10px] p-2 sm:p-3 text-[11px] sm:text-[12px]"
                scrollbarClass="custom-scrollbar"
                maxHeightClass="max-h-32"
                headerClass="px-1"
                rowClass="border-t border-vmb-primary/10 pt-2 text-[11px] sm:text-[12px]"
              />

              <p className="text-left sm:text-right text-vmb-secondary font-bold text-[13px]">
                Amount Paid: ${finalTotal}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                <div className="flex flex-col">
                  <p className="font-medium text-vmb-text-main">Date</p>
                  <div className="border border-vmb-primary/10 rounded-[8px] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-vmb-secondary shrink-0" />
                      <p className="text-vmb-text-muted text-[14px]">
                        {appointment?.appointmentDate ?
                          new Date(
                            appointment.appointmentDate,
                          ).toLocaleDateString("en-GB")
                        : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="font-medium text-vmb-text-main">Time</p>
                  <div className="border border-vmb-primary/10 rounded-[8px] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-vmb-secondary shrink-0" />
                      <p className="text-vmb-text-muted text-[14px]">
                        {appointment?.startTime || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-vmb-primary font-semibold text-[18px]">
                Salon Information
              </h3>

              <div className="flex items-center gap-4">
                <img
                  src={salon.image || userAvatar}
                  alt={salon.name}
                  className="w-15 h-15 rounded-[10px] object-cover"
                />
                <div>
                  <p className="font-semibold text-vmb-text-muted text-[20px]">
                    {salon.name || "Unknown Salon"}
                  </p>
                  <p className="text-vmb-text-muted text-[12px]">
                    {salon.desc || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[14px]">
                <div>
                  {salon.email && (
                    <>
                      <p className="font-medium text-vmb-text-main">Email:</p>
                      <p className="text-vmb-text-muted break-all">
                        {salon.email || "N/A"}
                      </p>
                    </>
                  )}
                </div>
                {salon.phone && (
                  <div className={`${!salon.email && "col-span-2"}`}>
                    <p className="font-medium text-vmb-text-main">Phone:</p>
                    <p className="text-vmb-text-muted">{salon.phone || "N/A"}</p>
                  </div>
                )}
              </div>

              <AppButton
                variant="custom"
                size="custom"
                className="bg-vmb-secondary/30 text-vmb-primary font-medium py-3 rounded-[10px] hover:bg-vmb-secondary/20 transition"
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
