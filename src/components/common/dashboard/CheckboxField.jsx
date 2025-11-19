import { useState, useEffect } from "react";
import { Checkbox } from "@headlessui/react";

export default function CheckboxField({
  label,
  options = ["Unisex", "Men", "Women", "Kids"],
  name,
  value = [],
  onChange,
  divClass = "",
  classes = "",
  tickIcon,
}) {
  const handleSelect = (opt) => {
    let newValue;
    if (value.includes(opt)) {
      newValue = value.filter((v) => v !== opt);
    } else {
      newValue = [...value, opt];
    }
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-y-[8px]">
      {label && (
        <label className="text-[14px] lg:text-[16px] font-poppins font-medium text-[#404040]">
          {label}
        </label>
      )}

      <div className="flex gap-x-6">
        {options.map((opt) => (
          <div
            key={opt}
            className={`flex flex-col items-center gap-x-2 ${divClass}`}
          >
            <div
              onClick={() => handleSelect(opt)}
              className={`group flex h-4 w-4 items-center justify-center rounded border border-gray-300 cursor-pointer
                ${
                  value.includes(opt)
                    ? "bg-[#E6E6E6] text-[#FF92A5]"
                    : "bg-[#E6E6E6] text-transparent"
                } 
                ${classes}`}
            >
              {value.includes(opt) &&
                (tickIcon ? (
                  tickIcon
                ) : (
                  <svg
                    className="h-3 w-3 text-[#FF92A5]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7.5 13.086l7.793-7.793a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
            </div>
            <span className="text-sm text-[#4B1837] font-poppins font-normal">
              {opt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
