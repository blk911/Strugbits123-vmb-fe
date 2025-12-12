import React from "react";
import { IoClose } from "react-icons/io5";
import defaultImg from "../../../../assets/salon-1.png";
import AppButton from "../../../common/site/AppButton";
import { FiCheck, FiX } from "react-icons/fi";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import {
  useApproveSalonMutation,
  useRejectSalonMutation,
} from "../../../../store/api";
import { toastSuccess, toastError } from "../../../../utils/toast";
export default function SalonRequestModal({
  isOpen,
  closeModal,
  data,
  onAccept,
}) {
  if (!isOpen) return null;
  const { openModal } = useDashboardModal();
  const [approveSalon, { isLoading: isApproving }] = useApproveSalonMutation();
  const [declineSalon, { isLoading: isDeclining }] = useRejectSalonMutation();
  function convertTo12Hour(time) {
    if (!time) return "";

    let [hour, minute] = time.split(":");
    hour = parseInt(hour);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  }

  const handleDecline = async () => {
    if (!data?._id) {
      toastError("Salon ID not found");
      return;
    }
    try {
      await declineSalon(data?._id).unwrap();
      toastSuccess(`"${data?.salonName}" has been declined successfully!`);
      closeModal();
      openModal("rejectionSent");
    } catch (err) {
      console.error("Decline failed:", err);
      toastError(
        err?.data?.message || "Failed to decline salon. Please try again."
      );
    }
  };
  const handleApprove = async () => {
    if (!data?._id) {
      toastError("Salon ID not found");
      return;
    }

    try {
      await approveSalon(data?._id).unwrap();
      toastSuccess(`"${data?.salonName}" has been approved successfully!`);
      closeModal();
      setTimeout(() => onAccept?.(), 300);
    } catch (err) {
      console.error("Approve failed:", err);
      toastError(
        err?.data?.message || "Failed to approve salon. Please try again."
      );
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={closeModal}
    >
      <div
        className="bg-[#e8e8e8] w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[10px] p-[30px] flex flex-col gap-[32px] font-[Poppins]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-[#581838] font-bold text-[24px]">
            Salon Request
          </h2>
          <IoClose
            onClick={closeModal}
            className="text-[#581838] text-[28px] cursor-pointer"
          />
        </div>

        <div className="border border-[#5818381A] bg-[#F2F2F2] rounded-[10px] p-[20px] flex flex-col gap-[24px]">
          <div className="flex gap-4 flex-col sm:flex-row">
            <img
              src={data?.profilePic || defaultImg}
              alt={data?.salonName}
              className="w-[80px] h-[80px] rounded-[8px] object-cover"
            />

            <div className="flex flex-col gap-3 w-full">
              <h3 className="text-[#581838] font-semibold text-[18px]">
                Salon Information
              </h3>

              <div>
                <p className="text-[#000] text-[14px] font-medium">
                  Salon Name
                </p>
                <p className="text-[#00000080] text-[16px]">
                  {data?.salonName}
                </p>
              </div>

              <div>
                <p className="text-[#000] text-[14px] font-medium">Address</p>
                <p className="text-[#00000080] text-[16px]">
                  {data?.address ||
                    "123 Beauty Street, Fashion District, NY 10001"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[#000] text-[14px] font-medium">Phone</p>
                  <p className="text-[#00000080] text-[16px]">
                    {data?.phone || "+1 (555) 123-4567"}
                  </p>

                  <p className="text-[#000] text-[14px] font-medium mt-3">
                    Timing
                  </p>
                  <p className="text-[#00000080] text-[16px]">
                    {/* {data?.startTime + " - " + data?.endTime ||
                      "09:00 AM - 05:00 PM"} */}
                    {data?.startTime && data?.endTime
                      ? `${convertTo12Hour(data.startTime)} - ${convertTo12Hour(
                          data.endTime
                        )}`
                      : "09:00 AM - 05:00 PM"}
                  </p>
                </div>

                <div>
                  <p className="text-[#000] text-[14px] font-medium">
                    Licensed Document
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[#00000080] text-[12px] font-medium break-all">
                      {data?.licenseDocument
                        ? data.licenseDocument.split("/").pop()
                        : "license-document.pdf"}
                    </p>

                    <button
                      onClick={() =>
                        data?.licenseDocument &&
                        window.open(data.licenseDocument, "_blank")
                      }
                      className="bg-[#FF92A54D] rounded-[5px] px-[10px] py-[5px] text-[#581838] text-[12px] font-medium cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                  <p className="text-[#000] text-[14px] font-medium mt-3">
                    Working Days
                  </p>
                  <button className="bg-[#FF92A54D] rounded-[5px] px-[10px] py-[5px] text-[#581838] text-[12px] font-medium">
                    {data?.workingDays
                      .map((day) => day.slice(0, 3))
                      .join("-") || "Mon - Thu - Fri"}
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-[#000] text-[14px] font-medium">
                  Description
                </p>
                <textarea
                  rows={4}
                  readOnly
                  className="w-full border border-[#E5E5E5] rounded-[8px] p-3 mt-2 text-[14px] bg-white resize-none"
                  value={
                    data?.description ||
                    "A premium beauty salon offering top-tier hair, nail, and spa services with a focus on luxury and relaxation."
                  }
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#D9D9D9]"></div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[#581838] font-semibold text-[18px]">
              Owner Information
            </h3>

            <div>
              <p className="text-[#000] text-[14px] font-medium">Full Name</p>
              <p className="text-[#00000080] text-[16px]">{data?.name}</p>
            </div>

            <div>
              <p className="text-[#000] text-[14px] font-medium">Email</p>
              <p className="text-[#00000080] text-[16px]">{data?.email}</p>
            </div>

            <div>
              <p className="text-[#000] text-[14px] font-medium">Phone</p>
              <p className="text-[#00000080] text-[16px]">
                {data?.phoneNumber || "+1 (555) 987-6543"}
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto py-2">
              {data?.salonPhotos.map((i) => (
                <img
                  key={i}
                  src={i || defaultImg}
                  alt={`Gallery ${i}`}
                  className="w-[94px] h-[100px] rounded-[10px] object-cover flex-shrink-0 border border-gray-300"
                />
              ))}
            </div>
          </div>
          {(data?.status === "pending" || data?.status === "deactivated") && (
            <div className="flex flex-col sm:flex-row  justify-center sm:justify-end gap-3 pt-4">
              <AppButton
                variant="custom"
                size="custom"
                className="py-[15px] px-[20px] text-[14px] bg-[#FF92A5] text-white hover:opacity-90"
                leftIcon={<FiX size={16} />}
                onClick={handleDecline}
                disabled={isDeclining}
              >
                {isDeclining ? "Rejecting..." : "Reject"}
              </AppButton>

              <AppButton
                disabled={isApproving}
                onClick={handleApprove}
                variant="custom"
                size="custom"
                className="py-[15px] px-[20px] text-[14px] border border-[#581838] text-[#581838] hover:bg-[#581838]/10"
                leftIcon={<FiCheck size={16} />}
              >
                {isApproving ? "Approving..." : "Approve"}
              </AppButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
