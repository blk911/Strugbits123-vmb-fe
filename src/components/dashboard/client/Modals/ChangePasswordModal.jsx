import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";

export default function ChangePasswordModal({ isOpen, closeModal }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-[Poppins]"
        onClose={closeModal}
      >
        {/* overlay */}
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[460px] bg-[#FFFFFF] rounded-[10px] p-[20px] shadow-xl flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-semibold text-[#581838]">
                    Change Password
                  </h2>
                  <IoClose
                    onClick={closeModal}
                    className="text-[#581838] text-3xl cursor-pointer hover:opacity-80"
                  />
                </div>

                <div className="bg-white border border-[#0000001A] rounded-[20px] p-[20px] flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-[#404040] text-[14px] font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="border border-[#E5E5E5] rounded-[8px] p-[10px] text-sm"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[#404040] text-[14px] font-medium">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="border border-[#E5E5E5] rounded-[8px] p-[10px] text-sm"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[#404040] text-[14px] font-medium">
                      Re-type Password
                    </label>
                    <input
                      type="password"
                      className="border border-[#E5E5E5] rounded-[8px] p-[10px] text-sm"
                      placeholder="Re-type new password"
                    />
                  </div>
                </div>

                <AppButton
                  variant="primary"
                  size="custom"
                  className="text-[16px] font-medium  py-3 "
                >
                  Change Password
                </AppButton>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
