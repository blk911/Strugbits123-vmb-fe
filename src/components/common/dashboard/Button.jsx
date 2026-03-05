import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

function Button({ text, icon, classes, textClasses, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center py-[8px] px-[17px] rounded-[8px] cursor-pointer gap-x-[7px] bg-vmb-secondary ${classes}`}
    >
      <span
        className={`max-xl:text-[16px] text-white  xl:text-[18px] max-xl:leading-[20px] font-poppins font-normal ${textClasses}`}
      >
        {text}
      </span>
      <span className="flex  items-center justify-center min-w-8 h-8 rounded-xl bg-vmb-primary">
        <FaArrowRightLong className="text-vmb-bg group-hover:translate-x-[4px] transition-transform duration-300" />
      </span>
    </button>
  );
}

export default Button;
