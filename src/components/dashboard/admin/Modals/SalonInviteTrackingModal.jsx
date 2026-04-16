import React from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetSalonByIdQuery } from "../../../../store/api";
import { setSelectedSalon } from "../../../../store/features/selectedSalonSlice";
import { toastLoading } from "../../../../utils/toast";

export default function SalonInviteTrackingModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;
  const { timelineItems = [], salonInfo = {}, clientInfo = {} } = data;
  const salonId = salonInfo?.salonId;
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
  const status = data.status || "pending";
  const statusStyles = {
    claimed: {
      bg: "bg-vmb-success/20",
      text: "text-vmb-success",
      label: "Claimed",
    },
    accepted: {
      bg: "bg-vmb-success/20",
      text: "text-vmb-success",
      label: "Claimed",
    },
    pending: {
      bg: "bg-vmb-pending/20",
      text: "text-vmb-pending",
      label: "Pending",
    },
    unclaimed: {
      bg: "bg-vmb-error/20",
      text: "text-vmb-error",
      label: "Unused",
    },
    default: {
      bg: "bg-vmb-bg-soft",
      text: "text-vmb-text-muted",
      label: status.charAt(0).toUpperCase() + status.slice(1),
    },
  };
  const currentStyle =
    statusStyles[status.toLowerCase()] || statusStyles.default;
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 bg-vmb-overlay-bg"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[960px] max-h-[95vh] font-poppins overflow-y-auto custom-scrollbar backdrop-blur-[1px]  bg-vmb-modals-bg rounded-[20px] p-4 sm:p-[30px] flex flex-col gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-vmb-primary font-bold text-[20px] sm:text-[24px]">
            Salon Invite Tracking
          </h3>
          <button
            onClick={onClose}
            className="text-vmb-primary text-[26px] sm:text-[28px] p-1 hover:bg-white/30 rounded"
          >
            <IoClose />
          </button>
        </div>

        <div className="w-full border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-4 sm:p-5 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={salonInfo.image}
              alt="Salon"
              className="w-20 h-20 sm:w-20 sm:h-20 rounded-[10px] object-cover"
            />

            <div className="flex-1">
              <p className="text-vmb-text-main font-semibold text-[22px] sm:text-[30px] leading-tight">
                {salonInfo.name}
              </p>
              <p className="text-vmb-text-muted text-[16px] mt-1">
                {salonInfo.desc}
              </p>
            </div>

            <AppButton
              fullWidth={false}
              variant="custom"
              size="custom"
              className="bg-vmb-secondary/30 text-vmb-primary py-[12px] px-[20px] rounded-[10px] font-medium hover:bg-vmb-secondary/20 transition whitespace-nowrap"
              onClick={handleViewSalon}
            >
              View Salon
            </AppButton>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white border border-vmb-primary/10 rounded-[10px] p-4 sm:p-5">
              <div className="flex justify-end">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${currentStyle.bg} ${currentStyle.text}`}
                >
                  {currentStyle.label}
                </span>
              </div>

              <div
                className="overflow-y-auto max-h-[50vh] pr-2 no-scrollbar mt-3"
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
                            item.iconBorderColor || "var(--vmb-secondary)",
                        }}
                      >
                        <div className="text-vmb-secondary">{item.icon}</div>
                      </div>

                      {idx < timelineItems.length - 1 && (
                        <div
                          className="w-0.5 mt-2 bg-vmb-secondary"
                          style={{ height: 50 }}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-1">
                      <p className={`font-bold  text-sm sm:text-base`}>
                        {item.title}
                      </p>
                      {item.dateBy && (
                        <p className="text-vmb-text-muted text-xs mt-1">
                          {item.dateBy}
                        </p>
                      )}
                      {item.body && (
                        <p className="text-vmb-text-main text-sm mt-2">
                          {item.body}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[360px] flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <p className="text-vmb-primary font-semibold text-[18px]">
                  Salon Information
                </p>

                <div className="grid grid-cols-2 gap-4 text-[14px] text-vmb-text-main">
                  <div>
                    <p className="font-medium">Salon Name:</p>
                    <p className="text-vmb-text-muted text-[16px]">
                      {salonInfo.name}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Email:</p>
                    <p className="text-vmb-text-muted text-[16px] break-all">
                      {salonInfo.email}
                    </p>
                  </div>
                  <div>
                    {salonInfo?.phone && (
                      <>
                        <p className="font-medium">Phone:</p>
                        <p className="text-vmb-text-muted text-[16px]">
                          {salonInfo.phone}
                        </p>
                      </>
                    )}
                  </div>
                  <div className={`${salonInfo?.phone === "" && "col-span-2"}`}>
                    <p className="font-medium">Service:</p>
                    <p className="text-vmb-text-muted text-[16px]">
                      {salonInfo.service}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Discount:</p>
                    <p className="text-vmb-text-muted text-[16px]">
                      {salonInfo.discount}
                    </p>
                  </div>
                </div>

                <p className="font-medium text-sm mt-2">Message:</p>
                <div className="border border-vmb-primary/10 bg-white rounded-[8px] p-3">
                  <p className="text-[12px] italic text-vmb-text-muted whitespace-pre-line">
                    {salonInfo.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <p className="text-vmb-primary font-semibold text-[18px]">
                  Client Information
                </p>

                <div className="flex gap-4 items-start">
                  <img
                    src={clientInfo.avatar}
                    alt={clientInfo.name}
                    className="w-[101px] h-[101px] border border-vmb-primary/10 rounded-full object-cover"
                  />

                  <div className="text-sm">
                    {clientInfo.name && (
                      <>
                        <p className="font-medium text-vmb-text-main">
                          Full Name
                        </p>
                        <p className="text-vmb-text-muted mb-2 text-[16px]">
                          {clientInfo.name}
                        </p>
                      </>
                    )}

                    <p className="font-medium text-vmb-text-main">Email</p>
                    <p className="text-vmb-text-muted mb-2 text-[16px] break-all">
                      {clientInfo.email}
                    </p>
                    {clientInfo?.phone && (
                      <>
                        <p className="font-medium text-vmb-text-main">Phone</p>
                        <p className="text-vmb-text-muted text-[16px]">
                          {clientInfo.phone}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
