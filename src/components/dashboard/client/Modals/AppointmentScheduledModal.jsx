import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose, IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import salonIcon from "../../../../assets/salon-1.png";

import AppButton from "../../../common/site/AppButton";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import {
  useConfirmAppointmentMutation,
  useDeclineAppointmentMutation,
  useHoldAppointmentMutation,
} from "../../../../store/api";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../utils/toast";
import ServicesTable from "../../../common/dashboard/ServicesTable";

export default function AppointmentScheduledModal({
  isOpen,
  closeModal,
  initialData,
}) {
  if (initialData) {
    if (
      !(initialData?.salon && initialData?.services && initialData?.appointment)
    ) {
      return null;
    }
  }
  const mock = initialData || {};
  const appointmentId = initialData?.appointment?.id;

  const [holdAppointment, { isLoading: holding }] =
    useHoldAppointmentMutation();
  const [declineAppointment, { isLoading: declining }] =
    useDeclineAppointmentMutation();
  const [confirmAppointment, { isLoading: confirming }] =
    useConfirmAppointmentMutation();
  const total = mock?.services?.reduce((s, it) => s + (it.price || 0), 0);
  const type = mock?.appointment?.type;
  let finalTotal;

  if (type === "invite") {
    finalTotal = total;
  } else if (type === "booking") {
    finalTotal = total + 2.5;
  } else if (type === "gift") {
    finalTotal = total + total * 0.1;
  } else {
    finalTotal = total;
  }
  const status = mock?.appointment?.status;
  const { openModal } = useDashboardModal();

  const openHold = async () => {
    if (!appointmentId) return toastError("Appointment not found");

    const loadingToast = toastLoading("Holding appointment...");
    try {
      await holdAppointment(appointmentId).unwrap();
      toastDismiss(loadingToast);
      toastSuccess("Appointment put on hold");
      openModal("holdAppointmentClient");
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to hold appointment");
    }
  };
  const openConfirm = async () => {
    if (!appointmentId) return toastError("Appointment not found");

    const loadingToast = toastLoading("Confirming appointment...");
    try {
      await confirmAppointment(appointmentId).unwrap();
      toastDismiss(loadingToast);
      toastSuccess("Appointment confirmed successfully!");
      closeModal();
      openModal("salonApprovedSuccess", {
        title: "Appointment Confirmed",
        subtitle:
          "Your appointment has been successfully confirmed. The salon has been notified and will be expecting you at the scheduled time.",
      });
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to confirm appointment");
    }
  };
  const openDecline = async () => {
    if (!appointmentId) return toastError("Appointment not found");

    const loadingToast = toastLoading("Declining appointment...");
    try {
      await declineAppointment(appointmentId).unwrap();
      toastDismiss(loadingToast);
      toastSuccess("Appointment declined");
      openModal("declineAppointmentClient");
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to decline appointment");
    }
  };
  const openReschedule = () => {
    openModal("rescheduleAppointmentClient", mock);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-poppins"
          onClose={closeModal}
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
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className="relative w-full max-w-[460px] transform overflow-hidden rounded-[20px] border border-vmb-primary/10 bg-vmb-bg-soft p-[30px] shadow-xl transition-all flex flex-col gap-[23px]">
                  <IoClose
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-vmb-primary text-2xl cursor-pointer"
                  />

                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-vmb-primary font-bold text-[22px]">
                      Great News! <br />
                      {status === "pending"
                        ? "Your Treat Request is Fulfilled."
                        : "Your Appointment is Scheduled."}
                    </h2>
                    <p className="text-vmb-text-muted text-[14px] mt-2 leading-[20px]">
                      {status === "pending"
                        ? "Your treat request has been successfully fulfilled. The salon has been notified and will schedule your appointment."
                        : "The salon has successfully scheduled your appointment. Please review the details below and confirm your appointment."}
                    </p>
                  </div>

                  <div className="bg-white/50 border border-vmb-primary/10 rounded-[10px] p-5 flex flex-col gap-4">
                    <div className="border border-vmb-primary/10 rounded-[10px] p-3 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <img
                        src={mock?.salon?.image}
                        alt="Salon"
                        className="w-[40px] h-[40px] rounded-md object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-vmb-text-main font-semibold text-[14px] break-words">
                          {mock?.salon?.name}
                        </p>
                        <p className="text-vmb-text-main text-[12px] break-words">
                          {mock?.salon?.description}
                        </p>
                      </div>
                    </div>
                    <div className="border border-vmb-primary/10 rounded-[10px] p-[10px] flex flex-col gap-[10px]">
                      <h3 className="text-vmb-primary text-[14px] font-medium">
                        Services:
                      </h3>
                      <ServicesTable
                        services={mock?.services}
                        containerClass="border border-vmb-primary/10 rounded-[10px] p-2 sm:p-3 text-[11px] sm:text-[12px]"
                        scrollbarClass="custom-scrollbar"
                        maxHeightClass="max-h-32"
                        headerClass="px-1"
                        rowClass="border-t border-vmb-primary/10 pt-2 text-vmb-text-main text-[11px] sm:text-[12px]"
                      />
                      <div className="flex justify-end">
                        <p className="text-vmb-secondary font-bold text-[13px]">
                          Amount Paid: ${finalTotal}
                        </p>
                      </div>
                    </div>

                    {status !== "pending" && (
                      <>
                        <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-[10px] flex flex-col gap-[20px]">
                          <p className="text-vmb-primary font-medium text-[14px]">
                            Appointment Details
                          </p>

                          <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
                            <div className="flex-1">
                              <p className="text-vmb-text-main text-[14px] font-medium mb-1">
                                Date
                              </p>
                              <div className="flex items-center gap-2 text-vmb-text-muted text-[14px]">
                                <IoCalendarOutline className="text-vmb-text-muted" />
                                <span>{mock?.appointment?.date}</span>
                              </div>
                            </div>

                            <div className="flex-1">
                              <p className="text-vmb-text-main text-[14px] font-medium mb-1">
                                Time
                              </p>
                              <div className="flex items-center gap-2 text-vmb-text-muted text-[14px]">
                                <IoTimeOutline className="text-vmb-text-muted" />
                                <span>{mock?.appointment?.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-2">
                          <AppButton
                            variant="outline-dark"
                            size="custom"
                            onClick={openHold}
                            className="py-[15px] px-[20px] text-[14px]"
                            disabled={holding}
                          >
                            {holding ? "Holding..." : "Hold"}
                          </AppButton>

                          <AppButton
                            variant="outline-dark"
                            size="custom"
                            onClick={openReschedule}
                            className="py-[15px] px-[20px] text-[14px]"
                          >
                            Reschedule
                          </AppButton>

                          <AppButton
                            variant="outline-dark"
                            size="custom"
                            onClick={openDecline}
                            className="py-[15px] px-[20px] text-[14px]"
                            disabled={declining}
                          >
                            {declining ? "Declining..." : "Decline"}
                          </AppButton>

                          <AppButton
                            variant="primary"
                            size="custom"
                            onClick={openConfirm}
                            className="py-[15px] px-[20px] text-[14px]"
                            disabled={confirming}
                          >
                            {confirming ? "Confirming..." : "Accept"}
                          </AppButton>
                        </div>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
