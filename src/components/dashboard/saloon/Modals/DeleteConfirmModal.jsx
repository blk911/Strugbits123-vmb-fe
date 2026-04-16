import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import deleteImg from "../../../../assets/trash.gif";
import AppButton from "../../../common/site/AppButton";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useDeleteServiceMutation } from "../../../../store/api";
import { toastError, toastSuccess } from "../../../../utils/toast";

export default function DeleteConfirmModal({
  isOpen,
  closeModal,
  onClose,
  id,
  onConfirm,
  title,
  message,
}) {
  const handleClose = onClose || closeModal;
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const handleDeleteClick = async () => {
    if (onConfirm) {
      await onConfirm();
      return;
    }

    if (!id) return;

    try {
      await deleteService(id).unwrap();
      handleClose();
      toastSuccess(`Service deleted successfully!`);
    } catch (err) {
      console.error("Delete failed:", err);
      toastError(err?.data?.message || "Failed to delete service");
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-poppins"
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="fixed inset-0 bg-vmb-overlay-bg" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              <Dialog.Panel className="w-full max-w-[360px] backdrop-blur-[1px]  bg-vmb-modals-bg rounded-[10px] p-[30px] flex flex-col items-center gap-3 shadow-lg">
                <img
                  src={deleteImg}
                  alt="Delete"
                  className="w-[79px] h-[93px] mx-auto"
                />

                <h2 className="text-center text-vmb-secondary font-bold text-[20px] leading-tight">
                  {title || (
                    <>
                      Are you sure you want <br /> to delete this?
                    </>
                  )}
                </h2>

                <p className="text-center text-vmb-text-main text-[14px] font-medium leading-[20px]">
                  {message ||
                    "This action can’t be undone. Once deleted, this record will be permanently removed."}
                </p>

                <div className="flex w-full gap-3 mt-2">
                  <AppButton
                    leftIcon={<FaTimes />}
                    variant="custom"
                    className="flex-1 bg-vmb-primary text-white"
                    onClick={handleClose}
                  >
                    No
                  </AppButton>
                  <AppButton
                    leftIcon={<FaCheck />}
                    variant="custom"
                    className="flex-1 bg-vmb-secondary text-white"
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes"}
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
