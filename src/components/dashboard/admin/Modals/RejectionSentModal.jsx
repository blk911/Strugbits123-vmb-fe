import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import claimGif from "../../../../assets/claimed.gif";
export default function RejectionSentModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 z-[999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[420px] rounded-[10px] p-[30px] font-poppins flex flex-col items-center gap-3 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={claimGif}
          alt="Rejection Sent"
          className="w-[138px] h-[138px] object-contain"
        />

        <h2 className="text-center text-[20px] font-bold text-vmb-secondary mt-2">
          Rejection Sent
        </h2>

        <p className="text-center text-vmb-text-muted text-[14px] leading-[20px] mt-1">
          The salon verification request has been rejected successfully. The
          selected reason has been shared with the salon owner for review.
        </p>
      </div>
    </div>
  );
}
