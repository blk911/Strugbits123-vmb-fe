import React, { useRef, useEffect } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import AppButton from "../../../common/site/AppButton";
import CustomCheckbox from "../../../common/site/CustomCheckbox";
import { useHoldSalonMutation } from "../../../../store/api";
import { toastSuccess, toastError } from "../../../../utils/toast";

const holdReasonSchema = z
  .object({
    reasons: z.array(z.string()).min(1, "Please select at least one reason"),
    otherReason: z.string().optional(),
  })
  .refine(
    (data) =>
      data.reasons.length > 0 ||
      (data.otherReason && data.otherReason.trim() !== ""),
    {
      message: "Please select at least one reason or write your own.",
      path: ["otherReason"],
    }
  );

export default function SalonVerificationRejectionModal({
  isOpen,
  onClose,
  salonId,
  salonName = "Salon",
}) {
  const dropdownRef = useRef(null);
  const [openSection, setOpenSection] = React.useState(null);

  const [holdSalon, { isLoading }] = useHoldSalonMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(holdReasonSchema),
    mode: "onChange",
    defaultValues: {
      reasons: [],
      otherReason: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({ reasons: [], otherReason: "" });
      setOpenSection(null);
    }
  }, [isOpen, reset]);

  const selectedReasons = watch("reasons");
  const otherReason = watch("otherReason");

  const toggleReason = (reason) => {
    const current = selectedReasons || [];
    const updated = current.includes(reason)
      ? current.filter((r) => r !== reason)
      : [...current, reason];
    setValue("reasons", updated, { shouldValidate: true });
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

  const onSubmit = async (data) => {
    if (!salonId) {
      toastError("Salon ID is missing.");
      return;
    }

    const allReasons = [
      ...data.reasons,
      ...(data.otherReason.trim() ? [data.otherReason.trim()] : []),
    ];
    const reasonText = allReasons.join(" | ");

    try {
      await holdSalon({
        id: salonId,
        reason: reasonText,
      }).unwrap();

      toastSuccess(`"${salonName}" has been put on hold.`);
      onClose();
    } catch (err) {
      toastError(err?.data?.message || "Failed to hold salon.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 z-[999] p-4"
      onClick={onClose}
    >
      <div
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[450px] rounded-[12px] p-6 font-[Poppins] shadow-lg relative max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#581838] text-[22px] cursor-pointer hover:opacity-70"
        >
          <IoClose />
        </button>

        <h2 className="text-center text-[22px] font-bold text-[#FF92A5] mt-2">
          Salon Hold Rejection
        </h2>

        <p className="text-center text-[14px] text-[#00000080] mt-2 leading-[20px]">
          You are about to hold this salon’s verification request. Choose a
          reason from the list below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="flex flex-col gap-4">
            {sections.map((section, index) => (
              <div key={index} className="flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSection(openSection === index ? null : index)
                  }
                  className="flex justify-between items-center bg-[#F8F8F8] px-4 py-3 rounded-[8px] border border-[#E5E5E5] cursor-pointer hover:bg-[#f0f0f0] transition"
                >
                  <span className="text-[14px] text-[#404040] font-medium">
                    {section.title}
                  </span>
                  <IoChevronDown
                    className={`text-[#581838] transition-transform duration-300 ${
                      openSection === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openSection === index ? "max-h-[500px] mt-2" : "max-h-0"
                  }`}
                >
                  <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-3 flex flex-col gap-2">
                    {section.reasons.map((reason) => (
                      <CustomCheckbox
                        key={reason}
                        label={reason}
                        checked={selectedReasons.includes(reason)}
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
              <Controller
                name="otherReason"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="border border-[#E5E5E5] bg-white rounded-[8px] p-3 text-[13px] resize-none min-h-[90px] focus:outline-none focus:ring-2 focus:ring-[#FF92A5]"
                    placeholder="Add any additional details..."
                  />
                )}
              />
              {errors.otherReason && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.otherReason.message}
                </p>
              )}
            </div>
          </div>

          <AppButton
            type="submit"
            variant="primary"
            size="custom"
            className="w-full text-[16px] font-medium py-3 mt-6"
            isLoading={isLoading}
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Putting on Hold..." : "Confirm Hold"}
          </AppButton>
        </form>
      </div>
    </div>
  );
}
