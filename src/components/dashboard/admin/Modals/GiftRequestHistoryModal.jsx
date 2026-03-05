import React from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toastLoading } from "../../../../utils/toast";
import { setSelectedSalon } from "../../../../store/features/selectedSalonSlice";
import { useGetSalonByIdQuery } from "../../../../store/api";

export default function GiftRequestHistoryModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;
  const { timelineItems = [], treatSection = {} } = data;
  const { sender = {}, receiver = {}, salon = {} } = treatSection;

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
  const getStatusStyle = () => {
    const status = data.gift?.status?.toLowerCase() || "pending";
    switch (status) {
      case "accepted":
      case "paid":
        return {
          bg: "bg-vmb-success/20",
          text: "text-vmb-success",
          label: "Accepted",
        };
      case "pending":
        return {
          bg: "bg-vmb-pending/20",
          text: "text-vmb-pending",
          label: "Pending",
        };
      case "declined":
      case "rejected":
        return {
          bg: "bg-vmb-error/20",
          text: "text-vmb-error",
          label: "Declined",
        };
      default:
        return {
          bg: "bg-vmb-bg-soft",
          text: "text-vmb-text-muted",
          label: "Unknown",
        };
    }
  };

  const statusStyle = getStatusStyle();
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 bg-black/80"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[960px] font-poppins max-h-[95vh] overflow-y-auto custom-scrollbar bg-vmb-bg-soft rounded-[20px] p-4 sm:p-[30px] flex flex-col gap-6 sm:gap-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Gift Request History"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-vmb-primary font-bold text-[20px] sm:text-[24px]">
            Gift Request History
          </h3>
          <button
            onClick={onClose}
            className="text-vmb-primary text-[26px] sm:text-[28px] p-1 rounded hover:bg-white/30 transition cursor-pointer"
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>

        <div className="w-full border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-4 sm:p-5 flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white border border-vmb-primary/10 rounded-[10px] p-4 sm:p-5 overflow-hidden">
            <div className="flex justify-end mb-3">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
              >
                {statusStyle.label}
              </span>
            </div>

            <div
              className="overflow-y-auto max-h-[50vh] sm:max-h-[56vh] pr-2 no-scrollbar"
              style={{ scrollbarWidth: "none" }}
            >
              {timelineItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 mb-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        item.iconBg || "bg-vmb-secondary/30"
                      }`}
                      style={{
                        borderColor:
                          item?.iconBorderColor || "var(--vmb-secondary)",
                      }}
                    >
                      <div className="text-vmb-secondary">{item?.icon}</div>
                    </div>

                    {idx < timelineItems.length - 1 && (
                      <div
                        className={`w-0.5 mt-2 ${
                          item?.barColor || "bg-vmb-secondary/30"
                        }`}
                        style={{ height: 50 }}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-2">
                    <h4
                      className={`font-bold ${
                        item?.titleColor || "text-vmb-text-main"
                      } text-sm sm:text-base`}
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
                      <div className="mt-3 pl-4 border-l-2 border-vmb-primary/10 text-sm text-vmb-text-muted">
                        <p className="font-semibold text-vmb-text-muted">
                          {item.reschedule.requestFrom}
                        </p>
                        <p className="mt-1 whitespace-pre-line">
                          {item.reschedule.requestMessage}
                        </p>
                        {/* <p className="font-semibold text-[#6B7280] mt-4">
                          {item.reschedule.acceptedBy}
                        </p>
                        <p className="mt-1">{item.reschedule.newAppointment}</p>
                        <p>{item.reschedule.appointmentDateTime}</p> */}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[360px] flex flex-col gap-6">
            <div className="bg-vmb-bg-soft border border-vmb-primary/10 rounded-[10px] p-4 flex flex-col gap-5">
              <div>
                <p className="text-vmb-primary font-medium text-sm">
                  Treat Request By:
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full"
                    style={{
                      backgroundColor:
                        sender.avatarBg || "var(--vmb-secondary-soft)",
                    }}
                  >
                    <img
                      src={sender.avatar}
                      alt={sender.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-vmb-text-muted">
                      {sender.name}
                    </p>
                    <p className="text-xs text-vmb-text-muted">
                      {sender.email}
                    </p>
                    <p className="text-xs text-vmb-text-muted">
                      {sender.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-vmb-primary font-medium text-sm">
                  Treat Paid By:
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white">
                    <img
                      src={receiver.avatar}
                      alt={receiver.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-vmb-primary">
                      {receiver.name}
                    </p>
                    <p className="text-xs text-vmb-text-muted">
                      {receiver.email}
                    </p>
                    <p className="text-xs text-vmb-text-muted">
                      {receiver.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-vmb-primary font-semibold text-lg">
                Salon Information
              </h3>

              <div className="flex items-center gap-4">
                {salon.image ?
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] object-cover border border-vmb-primary/10"
                  />
                : <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] bg-vmb-bg-soft border border-vmb-primary/10 flex items-center justify-center">
                    <span className="text-vmb-text-muted text-lg sm:text-2xl">
                      Salon
                    </span>
                  </div>
                }
                <div>
                  <p className="font-semibold text-vmb-text-muted text-lg sm:text-xl">
                    {salon.name}
                  </p>
                  <p className="text-vmb-text-muted text-sm">{salon.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-vmb-text-muted break-all">
                    {salon.email}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Phone:</p>
                  <p className="text-vmb-text-muted">{salon.phone}</p>
                </div>
              </div>

              <div>
                <p className="font-medium text-sm">Service Requested:</p>
                <p className="text-vmb-text-muted text-base">
                  {salon.serviceRequested}
                </p>
              </div>

              <AppButton
                variant="custom"
                size="custom"
                className="bg-vmb-secondary/30 text-vmb-primary font-medium py-3  rounded-[10px] hover:bg-vmb-secondary/20 transition "
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
