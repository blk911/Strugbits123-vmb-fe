import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import holdImg from "../../../../../assets/holdImg.png";
import confirmGif from "../../../../../assets/successGif.gif";
import declineGif from "../../../../../assets/declineGif.gif";
import rescheduleSentImg from "../../../../../assets/rescheduleSent.png";

export function StatusModal({ open, onClose, imageSrc, title, subtitle }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 9000);

      return () => clearTimeout(timer);
    }
  }, [open]);
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-poppins"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-250"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-250"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-vmb-bg-soft rounded-[10px] p-[30px] flex flex-col items-center gap-3 w-full max-w-[468px] text-center">
              <img
                src={imageSrc}
                alt={title}
                className="w-[96px] h-[96px] object-contain"
              />
              <h2 className="text-vmb-secondary font-bold text-[20px]">
                {title}
              </h2>
              <p className="text-vmb-text-main text-[14px] font-medium leading-[20px]">
                {subtitle}
              </p>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export const HoldConfirmation = ({ open, onClose }) => (
  <StatusModal
    open={open}
    onClose={onClose}
    imageSrc={holdImg}
    title="Appointment On Hold"
    subtitle="You’ve paused this appointment. Resume it whenever you’re ready!"
  />
);

export const ConfirmConfirmation = ({ open, onClose, title, subtitle }) => (
  <StatusModal
    open={open}
    onClose={onClose}
    imageSrc={confirmGif}
    title={title || "Salon Verification Approved"}
    subtitle={
      subtitle ||
      "  The salon has been successfully verified and approved. The owner can now access their salon dashboard and manage services."
    }
  />
);

export const DeclineConfirmation = ({ open, onClose }) => (
  <StatusModal
    open={open}
    onClose={onClose}
    imageSrc={declineGif}
    title="You Declined the Booking"
    subtitle="Your booking request has been declined. The salon will be informed."
  />
);

export const RescheduleSentConfirmation = ({ open, onClose }) => (
  <StatusModal
    open={open}
    onClose={onClose}
    imageSrc={rescheduleSentImg}
    title="Reschedule Request Sent"
    subtitle="Your reschedule request has been sent. You’ll be notified once confirmed."
  />
);
