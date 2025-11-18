import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../../common/site/AppButton";
import AppointmentDetailsSection from "./AppointmentDetailsSection";

export default function RescheduleDirectModal({
  isOpen,
  onClose,
  data,
  onRescheduleSent,
}) {
  const [reasonText, setReasonText] = useState(
    "I’d like to reschedule my booking. Please update the appointment time as per the new availability."
  );

  if (!isOpen || !data) return null;

  const handleSubmit = () => {
    onClose();
    setTimeout(() => onRescheduleSent?.(), 200);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-[Poppins]"
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
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
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
                <Dialog.Panel className="relative w-full max-w-[470px] transform overflow-hidden rounded-[20px] border border-[#5818381A] bg-[#FFF2F4] p-[30px] shadow-xl transition-all flex flex-col gap-[23px]">
                  <IoClose
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
                  />

                  <div className="text-center">
                    <h3 className="text-[#581838] font-bold text-[22px]">
                      Reschedule Appointment
                    </h3>
                  </div>

                  <AppointmentDetailsSection data={data} />

                  <div>
                    <p className="text-[#581838] font-medium text-[14px] mb-2">
                      Write a reason for reschedule:
                    </p>
                    <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-3">
                      <textarea
                        value={reasonText}
                        onChange={(e) => setReasonText(e.target.value)}
                        rows={4}
                        className="w-full text-[12px] italic text-[#00000080] resize-none bg-transparent outline-none"
                        placeholder="Explain why you'd like to reschedule..."
                      />
                    </div>
                  </div>

                  <AppButton
                    variant="primary"
                    size="custom"
                    onClick={handleSubmit}
                    className="w-full py-[15px] text-[14px] font-semibold"
                  >
                    Request Reschedule Now
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
