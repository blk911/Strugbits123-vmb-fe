import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose, IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import ServicesTable from "../../../common/dashboard/ServicesTable";

export default function RescheduleRequestModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;
  const total = data.services.reduce((s, it) => s + it.price, 0);
  const type = data?.appointment?.type;

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
                <Dialog.Panel className="relative w-full max-w-[470px] transform overflow-hidden rounded-[20px] border border-[#5818381A] bg-[#FFF2F4] p-[30px] shadow-xl transition-all flex flex-col gap-[23px]">
                  <IoClose
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
                  />

                  <div className="flex flex-col items-center gap-2 text-center">
                    <h3 className="text-[#581838] font-bold text-[22px]">
                      Reschedule Request Sent
                    </h3>
                    <p className="text-[#00000080] text-[14px] mt-2 leading-[20px]">
                      Your appointment reschedule request has been sent to the
                      salon. You'll be notified once they respond with a
                      confirmation or new time slot.
                    </p>
                  </div>

                  <div className="bg-white border border-[#0000001A] rounded-[10px] p-5 flex flex-col gap-4">
                    <div className="border border-[#0000001A] rounded-[10px] p-3 flex items-center gap-3">
                      <img
                        src={data.salon.image}
                        alt={data.salon.name}
                        className="w-[40px] h-[40px] rounded-md object-cover"
                      />
                      <div>
                        <p className="text-[#4B5563] font-semibold text-[14px]">
                          {data.salon.name}
                        </p>
                        <p className="text-[#4B5563] text-[12px]">
                          {data.salon.description}
                        </p>
                      </div>
                    </div>

                    <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[10px]">
                      <h3 className="text-[#581838] text-[14px] font-medium">
                        Paying For:
                      </h3>
                      <ServicesTable
                        services={data?.services}
                        containerClass="border border-[#9CA3AF4D] rounded-[10px] p-2 sm:p-3 text-[11px] sm:text-[12px]"
                        scrollbarClass="custom-scrollbar"
                        maxHeightClass="max-h-32"
                        headerClass="px-1"
                        rowClass="border-t border-[#9CA3AF4D] pt-2 text-[#581838] text-[11px] sm:text-[12px]"
                      />

                      <div className="flex justify-end">
                        <p className="text-[#FF92A5] font-bold text-[13px]">
                          Total Price: ${finalTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[#581838] font-medium text-[14px] mb-2">
                        Reschedule Reason:
                      </p>
                      <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-3">
                        <textarea
                          radioGroup
                          defaultValue={data?.appointment?.rescheduleReason}
                          rows={4}
                          className="w-full text-[12px] italic text-[#00000080] resize-none bg-transparent outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>
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
