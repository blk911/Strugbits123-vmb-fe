import React from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";

export default function GiftRequestHistoryModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const { timelineItems = [], treatSection = {} } = data;
  const { sender = {}, receiver = {}, salon = {} } = treatSection;
  const getStatusStyle = () => {
    const status = data.gift?.status?.toLowerCase() || "pending";
    switch (status) {
      case "accepted":
      case "paid":
        return {
          bg: "bg-[#4FCF0033]",
          text: "text-[#4FCF00]",
          label: "Accepted",
        };
      case "pending":
        return {
          bg: "bg-[#FF950033]",
          text: "text-[#FF9500]",
          label: "Pending",
        };
      case "declined":
      case "rejected":
        return {
          bg: "bg-[#DC262633]",
          text: "text-[#DC2626]",
          label: "Declined",
        };
      default:
        return { bg: "bg-gray-200", text: "text-gray-600", label: "Unknown" };
    }
  };

  const statusStyle = getStatusStyle();
  console.log("Data==>", data);
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[960px] font-[Poppins] max-h-[95vh] overflow-y-auto bg-[#e8e8e8] rounded-[20px] p-4 sm:p-[30px] flex flex-col gap-6 sm:gap-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Gift Request History"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[#581838] font-bold text-[20px] sm:text-[24px]">
            Gift Request History
          </h3>
          <button
            onClick={onClose}
            className="text-[#581838] text-[26px] sm:text-[28px] p-1 rounded hover:bg-white/30 transition cursor-pointer"
            aria-label="Close"
          >
            <IoClose />
          </button>
        </div>

        <div className="w-full border border-[#5818381A] bg-[#F2F2F2] rounded-[10px] p-4 sm:p-5 flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white border border-[#0000001A] rounded-[10px] p-4 sm:p-5 overflow-hidden">
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
                        item.iconBg || "bg-[#FF92A54D]"
                      }`}
                      style={{
                        borderColor: item?.iconBorderColor || "#FF92A5",
                      }}
                    >
                      <div className="text-[#FF92A5]">{item?.icon}</div>
                    </div>

                    {idx < timelineItems.length - 1 && (
                      <div
                        className={`w-0.5 mt-2 ${
                          item?.barColor || "bg-[#FF92A54D]"
                        }`}
                        style={{ height: 50 }}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-2">
                    <h4
                      className={`font-bold ${
                        item?.titleColor || "text-[#1F2937]"
                      } text-sm sm:text-base`}
                    >
                      {item.title}
                    </h4>
                    {item.dateBy && (
                      <p className="text-[#6B7280] text-xs mt-0.5">
                        {item.dateBy}
                      </p>
                    )}
                    {item.body && (
                      <p className="text-[#4B5563] text-sm mt-1">{item.body}</p>
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
            <div className="bg-[#F0F0F0] border border-[#0000001A] rounded-[10px] p-4 flex flex-col gap-5">
              <div>
                <p className="text-[#581838] font-medium text-sm">
                  Treat Request By:
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full"
                    style={{ backgroundColor: sender.avatarBg || "#FF92A54D" }}
                  >
                    <img
                      src={sender.avatar}
                      alt={sender.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[#4B5563]">
                      {sender.name}
                    </p>
                    <p className="text-xs text-[#4B5563]">{sender.email}</p>
                    <p className="text-xs text-[#4B5563]">{sender.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[#581838] font-medium text-sm">
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
                    <p className="font-semibold text-[#581838]">
                      {receiver.name}
                    </p>
                    <p className="text-xs text-[#4B5563]">{receiver.email}</p>
                    <p className="text-xs text-[#4B5563]">{receiver.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-[#581838] font-semibold text-lg">
                Salon Information
              </h3>

              <div className="flex items-center gap-4">
                {salon.image ? (
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] object-cover border border-[#E5E7EB]"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] bg-gray-200 border border-[#E5E7EB] flex items-center justify-center">
                    <span className="text-gray-500 text-lg sm:text-2xl">
                      Salon
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#4B5563] text-lg sm:text-xl">
                    {salon.name}
                  </p>
                  <p className="text-[#4B5563] text-sm">{salon.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-[#00000080] break-all">{salon.email}</p>
                </div>
                <div>
                  <p className="font-medium">Phone:</p>
                  <p className="text-[#00000080]">{salon.phone}</p>
                </div>
              </div>

              <div>
                <p className="font-medium text-sm">Service Requested:</p>
                <p className="text-[#4B5563] text-base">
                  {salon.serviceRequested}
                </p>
              </div>

              <AppButton
                variant="custom"
                size="custom"
                className="bg-[#FF92A54D] text-[#581838] font-medium py-3  rounded-[10px] hover:bg-[#ff92a5]/20 transition "
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
