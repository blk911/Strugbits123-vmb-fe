import React from "react";
import { RadioGroup, Radio } from "@headlessui/react";

export default function RadioField({
  label,
  options = ["Option 1", "Option 2", "Option 3"],
  name,
  value,
  onChange,
  divClass = "",
  classes = "",
  tickIcon,
}) {
  return (
    <div className="flex flex-col gap-y-[8px]">
      {label && (
        <label className="text-[14px] lg:text-[16px] font-poppins font-medium text-vmb-text-main">
          {label}
        </label>
      )}

      <RadioGroup value={value} onChange={onChange}>
        <div className={`flex gap-x-6 ${divClass}`}>
          {options.map((opt) => (
            <Radio
              key={opt}
              value={opt}
              className="flex flex-row gap-x-[10px] items-center cursor-pointer"
            >
              {({ checked }) => (
                <>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border border-gray-300
                      ${
                        checked ?
                          "bg-vmb-bg-soft text-vmb-secondary"
                        : "bg-vmb-bg-soft text-transparent"
                      }
                      ${classes}`}
                  >
                    {checked &&
                      (tickIcon ? tickIcon : (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="6.5"
                            cy="6.5"
                            r="6"
                            fill="white"
                            stroke="var(--vmb-primary)"
                          />
                          <circle
                            cx="6.49996"
                            cy="6.49996"
                            r="4.29"
                            fill="var(--vmb-primary)"
                          />
                        </svg>
                      ))}
                  </div>
                  <span className="text-sm text-vmb-primary font-poppins font-normal">
                    {opt}
                  </span>
                </>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
