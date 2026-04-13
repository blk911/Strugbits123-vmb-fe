import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";
import TextField from "../../../common/dashboard/TextField";
import TextAreaField from "../../../common/dashboard/TextAreaField";
import { useSuspendUserMutation } from "../../../../store/api/adminApi";
import {
  toastSuccess,
  toastError,
  toastDismiss,
} from "../../../../utils/toast";
import { MdEmail } from "react-icons/md";
import declineGif from "../../../../assets/declineGif.gif";
import { useEffect } from "react";
export default function SuspendModal({ isOpen, onClose, data }) {
  const [reason, setReason] = useState("");
  const [suspendUser, { isLoading }] = useSuspendUserMutation();
  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);
  if (!isOpen) return null;

  const handleSuspend = async () => {
    if (!reason.trim()) {
      toastDismiss();
      toastError("Please provide a reason for suspension");
      return;
    }

    try {
      await suspendUser({ userId: data?._id, reason }).unwrap();
      toastSuccess(`Account for ${data?.name} has been suspended.`);
      onClose();
    } catch (err) {
      toastError(err?.data?.message || "Failed to suspend account");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-vmb-modal-bg w-full max-w-[500px] rounded-[20px] p-[24px] flex flex-col gap-[20px] font-poppins relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-vmb-primary hover:bg-vmb-primary/10 p-1 rounded-full transition-colors"
        >
          <IoClose size={24} />
        </button>

        <div className="flex flex-col items-center mt-4">
          <img src={declineGif} alt="Suspend" className="w-32 h-32 mb-4" />

          <h2 className="text-[#0F3D3E] font-bold text-[24px]">
            Suspend This Account
          </h2>
          <p className="text-[#4B5563] text-[14px] mt-1">
            Write a suspend reason below
          </p>
        </div>

        <div className="bg-white p-4 rounded-[12px] border border-black/5 flex flex-col gap-4">
          <TextField
            label=""
            placeholder={data?.email || "user@email.com"}
            value={data?.email}
            disabled
            type="email"
            icon={<MdEmail size={20} className="text-vmb-secondary" />}
          />

          <TextAreaField
            label=""
            placeholder="Write a short note explaining why this account suspended."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
          <AppButton
            variant="secondary"
            onClick={handleSuspend}
            isLoading={isLoading}
            disabled={isLoading}
            className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-white font-semibold py-3 rounded-[10px]"
          >
            {isLoading ? "Suspending..." : "Suspend Now"}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
