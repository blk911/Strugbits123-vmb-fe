import React from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";
import { useUnsuspendUserMutation } from "../../../../store/api/adminApi";
import { toastSuccess, toastError } from "../../../../utils/toast";

export default function UnsuspendModal({ isOpen, onClose, data }) {
  const [unsuspendUser, { isLoading }] = useUnsuspendUserMutation();

  if (!isOpen) return null;

  const handleUnsuspend = async () => {
    try {
      await unsuspendUser(data?._id).unwrap();
      toastSuccess(`Account for ${data?.name} has been unsuspended.`);
      onClose();
    } catch (err) {
      toastError(err?.data?.message || "Failed to unsuspend account");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-vmb-bg-soft w-full max-w-[450px] rounded-[20px] p-[32px] flex flex-col gap-[32px] font-poppins relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-vmb-primary hover:bg-vmb-primary/10 p-1 rounded-full transition-colors"
        >
          <IoClose size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-[#00282C] font-bold text-[24px] leading-tight px-4">
            Are You Sure To Unsuspend This Account
          </h2>
        </div>

        <div className="flex gap-[16px]">
          <AppButton
            variant="custom"
            className="flex-1 bg-[#BDCECC] text-[#0F3D3E] font-semibold py-3 rounded-[10px] border-none"
            onClick={onClose}
          >
            No
          </AppButton>
          <AppButton
            variant="secondary"
            className="flex-1 bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-white font-semibold py-3 rounded-[10px]"
            onClick={handleUnsuspend}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Wait..." : "Yes"}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
