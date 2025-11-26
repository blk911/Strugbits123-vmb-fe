import React from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";

export default function SalonInviteTrackingModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const { timelineItems = [], salonInfo = {}, clientInfo = {} } = data;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[960px] max-h-[95vh] font-[Poppins] overflow-y-auto bg-[#e8e8e8] rounded-[20px] p-4 sm:p-[30px] flex flex-col gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[#581838] font-bold text-[20px] sm:text-[24px]">
            Salon Invite Tracking
          </h3>
          <button
            onClick={onClose}
            className="text-[#581838] text-[26px] sm:text-[28px] p-1 hover:bg-white/30 rounded"
          >
            <IoClose />
          </button>
        </div>

        <div className="w-full border border-[#5818381A] bg-[#F2F2F2] rounded-[10px] p-4 sm:p-5 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={salonInfo.image}
              alt="Salon"
              className="w-20 h-20 sm:w-20 sm:h-20 rounded-[10px] object-cover"
            />

            <div className="flex-1">
              <p className="text-[#4B5563] font-semibold text-[22px] sm:text-[30px] leading-tight">
                {salonInfo.name}
              </p>
              <p className="text-[#4B5563] text-[16px] mt-1">
                {salonInfo.desc}
              </p>
            </div>

            <AppButton
              fullWidth={false}
              variant="custom"
              size="custom"
              className="bg-[#FF92A54D] text-[#581838] py-[12px] px-[20px] rounded-[10px] font-medium hover:bg-[#ff92a5]/20 transition whitespace-nowrap"
            >
              View Salon
            </AppButton>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white border border-[#0000001A] rounded-[10px] p-4 sm:p-5">
              <div className="flex justify-end">
                <span className="px-2 py-1 bg-[#4FCF0033] text-[#4FCF00] text-[10px] font-semibold rounded">
                  Accepted
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
                          item.iconBg || "bg-[#FF92A54D]"
                        }`}
                        style={{
                          borderColor: item.iconBorderColor || "#FF92A5",
                        }}
                      >
                        <div className="text-[#FF92A5]">{item.icon}</div>
                      </div>

                      {idx < timelineItems.length - 1 && (
                        <div
                          className="w-0.5 mt-2 bg-[#FF92A5]"
                          style={{ height: 50 }}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-1">
                      <p
                        className={`font-bold ${
                          item.titleColor || "text-[#1F2937]"
                        } text-sm sm:text-base`}
                      >
                        {item.title}
                      </p>
                      {item.dateBy && (
                        <p className="text-[#6B7280] text-xs mt-1">
                          {item.dateBy}
                        </p>
                      )}
                      {item.body && (
                        <p className="text-[#4B5563] text-sm mt-2">
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
                <p className="text-[#581838] font-semibold text-[18px]">
                  Salon Information
                </p>

                <div className="grid grid-cols-2 gap-4 text-[14px] text-[#000000]">
                  <div>
                    <p className="font-medium">Salon Name:</p>
                    <p className="text-[#00000080] text-[16px]">
                      {salonInfo.name}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Email:</p>
                    <p className="text-[#00000080] text-[16px] break-all">
                      {salonInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Phone:</p>
                    <p className="text-[#00000080] text-[16px]">
                      {salonInfo.phone}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Service:</p>
                    <p className="text-[#00000080] text-[16px]">
                      {salonInfo.service}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Discount:</p>
                    <p className="text-[#00000080] text-[16px]">
                      {salonInfo.discount}
                    </p>
                  </div>
                </div>

                <p className="font-medium text-sm mt-2">Message:</p>
                <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-3">
                  <p className="text-[12px] italic text-[#00000080] whitespace-pre-line">
                    {salonInfo.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <p className="text-[#581838] font-semibold text-[18px]">
                  Client Information
                </p>

                <div className="flex gap-4 items-start">
                  <img
                    src={clientInfo.avatar}
                    alt={clientInfo.name}
                    className="w-[101px] h-[101px] rounded-full object-cover"
                  />

                  <div className="text-sm">
                    <p className="font-medium text-[#000000]">Full Name</p>
                    <p className="text-[#00000080] mb-2 text-[16px]">
                      {clientInfo.name}
                    </p>

                    <p className="font-medium text-[#000000]">Email</p>
                    <p className="text-[#00000080] mb-2 text-[16px] break-all">
                      {clientInfo.email}
                    </p>

                    <p className="font-medium text-[#000000]">Phone</p>
                    <p className="text-[#00000080] text-[16px]">
                      {clientInfo.phone}
                    </p>
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
