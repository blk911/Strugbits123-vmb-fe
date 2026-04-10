import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";
import TextField from "../../../common/dashboard/TextField";
import TextAreaField from "../../../common/dashboard/TextAreaField";
import { useContactUserMutation } from "../../../../store/api/adminApi";
import { toastSuccess, toastError } from "../../../../utils/toast";
import { MdEmail } from "react-icons/md";
export default function ContactCustomerModal({ isOpen, onClose, data }) {
  const [message, setMessage] = useState("");
  const [contactUser, { isLoading }] = useContactUserMutation();

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!message.trim()) {
      toastError("Please provide a message");
      return;
    }

    try {
      await contactUser({ userId: data?._id, message }).unwrap();
      toastSuccess(`Message sent to ${data?.name} successfully.`);
      onClose();
    } catch (err) {
      toastError(err?.data?.message || "Failed to send message");
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

        <div className="text-center mt-4">
          <h2 className="text-[#0F3D3E] font-bold text-[24px]">
            Send Message To Customer
          </h2>
          <p className="text-[#4B5563] text-[14px] mt-1 px-8">
            Compose your message below. The customer will receive it via email.
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
            placeholder="Write a message explaining why this account suspended."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <AppButton
          variant="secondary"
          onClick={handleSend}
          isLoading={isLoading}
          disabled={isLoading}
          className="bg-[#0F3D3E] hover:bg-[#0F3D3E]/90 text-white font-semibold py-3 rounded-[10px]"
        >
          {isLoading ? "Sending..." : "Send"}
        </AppButton>
      </div>
    </div>
  );
}
