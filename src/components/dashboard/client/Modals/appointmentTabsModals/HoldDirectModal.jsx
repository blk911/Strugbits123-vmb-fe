import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../../common/site/AppButton";
import AppointmentDetailsSection from "./AppointmentDetailsSection";

import RescheduleDirectModal from "./RescheduleDirectModal";
import holdImg from "../../../../../assets/holdImg.png";
import { useDashboardModal } from "../../../../../pages/ModalProvider";
import {
  useConfirmAppointmentMutation,
  useDeclineAppointmentMutation,
} from "../../../../../store/api";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../../utils/toast";

export default function HoldDirectModal({
  isOpen,
  onClose,
  data,
  onAccept,
  onDecline,
  onReschedule,
}) {
  const { openModal } = useDashboardModal();
  const [showReschedule, setShowReschedule] = useState(false);

  const appointmentId = data?.appointment?.id;

  const [confirmAppointment, { isLoading: confirming }] =
    useConfirmAppointmentMutation();
  const [declineAppointment, { isLoading: declining }] =
    useDeclineAppointmentMutation();
  const handleReschedule = () => {
    onClose();
    openModal("rescheduleAppointmentClient", data);
  };
  const handleAccept = async () => {
    if (!appointmentId) {
      toastError("Appointment not found");
      return;
    }

    const loadingToast = toastLoading("Confirming appointment...");
    try {
      await confirmAppointment(appointmentId).unwrap();
      toastDismiss(loadingToast);
      toastSuccess("Appointment confirmed successfully!");
      onClose();
      onAccept?.();
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to confirm appointment");
    }
  };
  const handleDecline = async () => {
    if (!appointmentId) {
      toastError("Appointment not found");
      return;
    }

    const loadingToast = toastLoading("Declining appointment...");
    try {
      await declineAppointment(appointmentId).unwrap();
      toastDismiss(loadingToast);
      toastSuccess("Appointment declined");
      onClose();
      onDecline?.();
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to decline appointment");
    }
  };
  if (!isOpen) return null;
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-[Poppins]"
          onClose={onClose}
        >
          <div className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="relative w-full max-w-[460px] rounded-[20px] border border-[#5818381A] bg-[#FFF2F4] p-[30px] shadow-xl flex flex-col gap-[23px]">
                <IoClose
                  onClick={onClose}
                  className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
                />

                <div className="flex flex-col items-center text-center gap-4">
                  <img src={holdImg} alt="Hold" className="w-[97px] h-[97px]" />
                  <h2 className="text-[#581838] font-bold text-[22px]">
                    You’ve Held Your Booking
                  </h2>
                  <p className="text-[#00000080] text-[14px]">
                    Your booking request has been put on hold. You can resume or
                    confirm it anytime before it expires.
                  </p>
                </div>

                <AppointmentDetailsSection data={data} />

                <div className="grid grid-cols-2 gap-3">
                  <div />
                  <AppButton
                    variant="outline-dark"
                    size="custom"
                    onClick={handleReschedule}
                    className="py-[15px] px-[20px] text-[14px] col-span-2"
                  >
                    Reschedule
                  </AppButton>
                  <AppButton
                    variant="outline-dark"
                    size="custom"
                    onClick={handleDecline}
                    className="py-[15px] px-[20px] text-[14px]"
                    disabled={declining}
                  >
                    {declining ? "Declining..." : "Decline"}
                  </AppButton>
                  <AppButton
                    variant="primary"
                    size="custom"
                    onClick={handleAccept}
                    className="py-[15px] px-[20px] text-[14px]"
                    disabled={confirming}
                  >
                    {confirming ? "Confirming..." : "Accept"}
                  </AppButton>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      <RescheduleDirectModal
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        data={data}
      />
    </>
  );
}
