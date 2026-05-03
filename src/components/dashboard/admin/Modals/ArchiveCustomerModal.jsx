import React from "react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";
import { useArchiveCustomerMutation } from "../../../../store/api/adminApi";
import { toastSuccess, toastError } from "../../../../utils/toast";

const ARCHIVE_KEY = "archived_customers";
const CANCELLED_KEY = "cancelled_customers";

function saveToStorage(key, customer) {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [...existing.filter((c) => c._id !== customer._id), { ...customer, archivedAt: new Date().toISOString() }];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export default function ArchiveCustomerModal({ isOpen, onClose, data }) {
  const [archiveCustomer, { isLoading }] = useArchiveCustomerMutation();

  if (!isOpen) return null;

  const handleArchive = async () => {
    try {
      await archiveCustomer(data?._id).unwrap();
      saveToStorage(ARCHIVE_KEY, data);
      saveToStorage(CANCELLED_KEY, data);
      toastSuccess(`${data?.name || "Customer"} has been archived.`);
      onClose();
    } catch (err) {
      toastError(err?.data?.message || "Failed to archive customer");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-vmb-overlay-bg backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-vmb-modal-bg w-full max-w-[460px] rounded-[20px] p-[32px] flex flex-col gap-[24px] font-poppins relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-vmb-primary hover:bg-vmb-primary/10 p-1 rounded-full transition-colors"
        >
          <IoClose size={24} />
        </button>

        <div className="w-full text-center mt-2 flex flex-col gap-2">
          <h2 className="text-vmb-primary font-bold font-poppins text-[22px] leading-tight px-4">
            Archive This Customer?
          </h2>
          <p className="text-[#4B5563] text-[14px]">
            <span className="font-semibold">{data?.name || "This customer"}</span> will be moved to the cancelled list. This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-[16px]">
          <AppButton
            variant="custom"
            className="flex-1 bg-[#BDCECC] text-[#0F3D3E] font-semibold py-3 rounded-[10px] border-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </AppButton>
          <AppButton
            variant="secondary"
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-[10px]"
            onClick={handleArchive}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Archiving..." : "Archive"}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
