import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import AppointmentDetailsSection from "./AppointmentDetailsSection";
import claimGif from "../../../../../assets/claimed.gif";
export default function ConfirmDirectModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-poppins"
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="relative w-full max-w-[460px] rounded-[20px] border border-vmb-primary/10 bg-vmb-bg-soft p-[30px] shadow-xl flex flex-col gap-[23px]">
              <IoClose
                onClick={onClose}
                className="absolute top-4 right-4 text-vmb-primary text-2xl cursor-pointer"
              />

              <div className="flex flex-col items-center text-center gap-4">
                <img
                  src={claimGif}
                  alt="Declined"
                  className="w-[97px] h-[97px]"
                />
                <h2 className="text-vmb-primary font-bold text-[22px]">
                  Your Booking is Confirmed
                </h2>
                <p className="text-vmb-text-muted text-[14px]">
                  You have successfully confirmed your booking request.
                </p>
              </div>

              <AppointmentDetailsSection data={data} />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
