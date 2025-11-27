import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../../common/site/AppButton";
import AppointmentDetailsSection from "./AppointmentDetailsSection";

import RescheduleDirectModal from "./RescheduleDirectModal";
import holdImg from "../../../../../assets/holdImg.png";
import { useDashboardModal } from "../../../../../pages/ModalProvider";

export default function HoldDirectModal({
  isOpen,
  onClose,
  data,
  onAccept,
  onDecline,
  onReschedule,
}) {
  const [showReschedule, setShowReschedule] = useState(false);
  const { openModal } = useDashboardModal();
  if (!isOpen) return null;

  const handleReschedule = () => {
    onClose();
    openModal("rescheduleAppointmentClient", data);
  };
  const handleAccept = () => {
    onClose();
    setTimeout(() => onAccept?.(), 200);
  };
  const handleDecline = () => {
    onClose();
    setTimeout(() => onDecline?.(), 200);
  };

  return (
    <>
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
                  <img src={holdImg} alt="Hold" className="w-[97px] h-[97px]" />
                  <h2 className="text-[#581838] font-bold text-[22px]">
                    You’ve Held Your Booking
                  </h2>
                  <p className="text-[#00000080] text-[14px]">
                    You can resume or confirm it anytime before it expires.
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
                  >
                    Decline
                  </AppButton>
                  <AppButton
                    variant="primary"
                    size="custom"
                    onClick={handleAccept}
                    className="py-[15px] px-[20px] text-[14px]"
                  >
                    Accept
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
