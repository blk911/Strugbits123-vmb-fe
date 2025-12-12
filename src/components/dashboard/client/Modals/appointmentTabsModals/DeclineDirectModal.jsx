import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../../common/site/AppButton";
import AppointmentDetailsSection from "./AppointmentDetailsSection";
import declineGif from "../../../../../assets/declineGif.gif";

export default function DeclineDirectModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-[Poppins]"
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="relative w-full max-w-[460px] rounded-[20px] border border-[#5818381A] bg-[#FFF2F4] p-[30px] shadow-xl flex flex-col gap-[23px]">
              <IoClose
                onClick={onClose}
                className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
              />

              <div className="flex flex-col items-center text-center gap-4">
                <img
                  src={declineGif}
                  alt="Declined"
                  className="w-[97px] h-[97px]"
                />
                <h2 className="text-[#581838] font-bold text-[22px]">
                  You Declined Booking Request
                </h2>
                <p className="text-[#00000080] text-[14px]">
                  You’ve declined this booking request. The salon has been
                  notified about your decision.
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
