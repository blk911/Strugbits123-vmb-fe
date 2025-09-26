import React from "react";
import { RadioGroup, Radio } from "@headlessui/react";

export default function RadioField({
    label,
    options = ["Option 1", "Option 2", "Option 3"],
    name,
    value,          // 👈 selected option (string)
    onChange,       // 👈 callback
    divClass = "",
    classes = "",
    tickIcon
}) {
    return (
        <div className="flex flex-col gap-y-[8px]">
            {label && (
                <label className="text-[14px] lg:text-[16px] font-poppins font-medium text-[#374151]">
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
                      ${checked ? "bg-[#E6E6E6] text-[#FF92A5]" : "bg-[#E6E6E6] text-transparent"}
                      ${classes}`}
                                    >
                                        {checked &&
                                            (tickIcon ? (
                                                tickIcon
                                            ) : (
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="6.5" cy="6.5" r="6" fill="white" stroke="#581838" />
                                                    <circle cx="6.49996" cy="6.49996" r="4.29" fill="#581838" />
                                                </svg>

                                            ))}
                                    </div>
                                    <span className="text-sm text-[#4B1837] font-poppins font-normal">
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
