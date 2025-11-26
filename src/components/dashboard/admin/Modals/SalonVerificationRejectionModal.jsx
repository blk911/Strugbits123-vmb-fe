import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import CustomCheckbox from "../../../common/site/CustomCheckbox";
import { IoChevronDown } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";
import { useDashboardModal } from "../../../../pages/ModalProvider";
export default function SalonVerificationRejectionModal({ isOpen, onClose }) {
  const [selectedReasons, setSelectedReasons] = useState({});
  const [otherReason, setOtherReason] = useState("");
  const [openSection, setOpenSection] = useState(null);
  const dropdownRef = useRef(null);
  const { openModal } = useDashboardModal();
  const toggleReason = (key) => {
    setSelectedReasons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: "License & Document Issues",
      reasons: [
        "Invalid or expired salon license",
        "License image is unclear or unreadable",
        "License number does not match salon name",
        "Missing mandatory document(s)",
      ],
    },
    {
      title: "Information Inconsistency",
      reasons: [
        "Salon name does not match uploaded documents",
        "Owner name mismatch with registration form",
        "Incomplete or incorrect salon details provided",
      ],
    },
    {
      title: "Duplicate or Fraudulent Entries",
      reasons: [
        "Duplicate registration detected",
        "Suspicious or fraudulent activity found",
      ],
    },
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenSection(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 z-[999] p-4"
      onClick={onClose}
    >
      <div
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[450px] rounded-[12px] p-6 font-[Poppins] shadow-lg relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#581838] text-[22px] cursor-pointer"
        >
          <IoClose />
        </button>

        <h2 className="text-center text-[22px] font-bold text-[#FF92A5] mt-2">
          Salon Verification Rejection
        </h2>

        <p className="text-center text-[14px] text-[#00000080] mt-2 leading-[20px]">
          You are about to reject this salon’s verification request. Choose a
          reason from the list below.
        </p>

        <div className="flex flex-col gap-4 mt-6">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col">
              <button
                onClick={() =>
                  setOpenSection(openSection === index ? null : index)
                }
                className="flex justify-between items-center bg-[#F8F8F8] px-4 py-3 rounded-[8px] border border-[#E5E5E5] cursor-pointer"
              >
                <span className="text-[14px] text-[#404040] font-medium">
                  {section.title}
                </span>

                <IoChevronDown
                  className={`transition-transform duration-300 ${
                    openSection === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`transition-all overflow-hidden ${
                  openSection === index ? "max-h-[400px] mt-2" : "max-h-0"
                }`}
              >
                <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-3 flex flex-col gap-2">
                  {section.reasons.map((reason, i) => (
                    <CustomCheckbox
                      key={i}
                      label={reason}
                      checked={selectedReasons[reason] || false}
                      onChange={() => toggleReason(reason)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-[14px] text-[#404040] font-medium">
              Write your reason (optional)
            </label>
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="border border-[#E5E5E5] bg-white rounded-[8px] p-3 text-[12px] italic text-[#00000080] min-h-[90px] resize-none"
              placeholder="Type here..."
            />
          </div>
        </div>

        <AppButton
          variant="primary"
          size="custom"
          className="text-[16px] font-medium  py-2 mt-4"
          onClick={() => openModal("rejectionSent")}
        >
          Confirm Rejection
        </AppButton>
      </div>
    </div>
  );
}
