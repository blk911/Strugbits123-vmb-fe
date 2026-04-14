import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../../common/site/AppButton";
import AppointmentDetailsSection from "./AppointmentDetailsSection";
import { useDashboardModal } from "../../../../../pages/ModalProvider";
import { useRequestAppointmentReschedulingMutation } from "../../../../../store/api";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../../utils/toast";

export default function RescheduleDirectModal({
  isOpen,
  onClose,
  data,
  onRescheduleSent,
}) {
  const [reasonText, setReasonText] = useState(
    "I’d like to reschedule my booking. Please update the appointment time as per the new availability.",
  );
  const [requestReschedule, { isLoading }] =
    useRequestAppointmentReschedulingMutation();

  const appointmentId = data?.appointment?.id;
  const { openModal } = useDashboardModal();
  if (!isOpen || !data) return null;

  const handleSubmit = async () => {
    if (!appointmentId) {
      toastError("Appointment ID not found");
      return;
    }

    if (!reasonText.trim()) {
      toastError("Please write a reason for rescheduling");
      return;
    }

    const loadingToast = toastLoading("Sending reschedule request...");

    try {
      await requestReschedule({
        id: appointmentId,
        data: { reason: reasonText.trim() },
      }).unwrap();

      toastDismiss(loadingToast);
      toastSuccess("Reschedule request sent successfully!");
      openModal("rescheduleSent");
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to send reschedule request");
      console.error("Reschedule failed:", err);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-poppins"
          onClose={onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-vmb-overlay-bg" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-[470px] transform overflow-hidden rounded-[20px] border border-vmb-primary/10 backdrop-blur-[1px]  bg-vmb-modals-bg p-[30px] shadow-xl transition-all flex flex-col gap-[23px]">
                  <IoClose
                    onClick={onClose}
                    className="absolute top-4 right-4 text-vmb-primary text-2xl cursor-pointer"
                  />

                  <div className="text-center">
                    <h3 className="text-vmb-primary font-bold text-[22px]">
                      Reschedule Appointment
                    </h3>
                  </div>

                  <AppointmentDetailsSection data={data} />

                  <div>
                    <p className="text-vmb-primary font-medium text-[14px] mb-2">
                      Write a reason for reschedule:
                    </p>
                    <div className="border border-vmb-primary/10 bg-white rounded-[8px] p-3">
                      <textarea
                        value={reasonText}
                        onChange={(e) => setReasonText(e.target.value)}
                        rows={4}
                        className="w-full text-[12px] italic text-vmb-text-muted resize-none bg-transparent outline-none"
                        placeholder="Explain why you'd like to reschedule..."
                      />
                    </div>
                  </div>

                  <AppButton
                    variant="primary"
                    size="custom"
                    onClick={handleSubmit}
                    className="w-full py-[15px] text-[14px] font-semibold"
                    disabled={isLoading || !reasonText.trim() === ""}
                  >
                    {isLoading ? "Sending..." : "Request Reschedule Now"}
                  </AppButton>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
