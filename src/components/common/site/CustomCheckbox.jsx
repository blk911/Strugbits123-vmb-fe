import React from "react";
import { FaCheck } from "react-icons/fa";

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <label
      className="flex items-center gap-2 cursor-pointer select-none"
      onClick={onChange}
    >
      <div
        className={`w-4 h-4 flex items-center justify-center rounded-sm border transition-all duration-200 
          ${
            checked ? "border-[#FF92A5] bg-white" : "border-gray-300 bg-white"
          }`}
      >
        {checked && <FaCheck className="text-[#FF92A5] text-[10px]" />}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default CustomCheckbox;
