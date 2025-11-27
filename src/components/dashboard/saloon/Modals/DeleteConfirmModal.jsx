import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import deleteImg from "../../../../assets/delete-icon.png";
import AppButton from "../../../common/site/AppButton";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DeleteConfirmModal({ isOpen, closeModal }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-[Poppins]"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
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
            >
              <Dialog.Panel className="w-full max-w-[360px] bg-white rounded-[10px] p-[30px] flex flex-col items-center gap-3 shadow-lg">
                <img
                  src={deleteImg}
                  alt="Delete"
                  className="w-[79px] h-[93px] mx-auto"
                />

                <h2 className="text-center text-[#FF92A5] font-bold text-[20px] leading-tight">
                  Are you sure you want <br /> to delete this?
                </h2>

                <p className="text-center text-[#404040] text-[14px] font-medium leading-[20px]">
                  This action can’t be undone. Once deleted, this record will be
                  permanently removed.
                </p>

                <div className="flex w-full gap-3 mt-2">
                  <AppButton
                    leftIcon={<FaTimes />}
                    variant="custom"
                    className="flex-1 bg-[#581838] text-white"
                    onClick={closeModal}
                  >
                    No
                  </AppButton>
                  <AppButton
                    leftIcon={<FaCheck />}
                    variant="custom"
                    className="flex-1 bg-[#FF92A5] text-white"
                  >
                    Yes
                  </AppButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
