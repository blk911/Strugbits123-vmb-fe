import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

function Button({ text, icon, classes, textClasses, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center py-[9px] px-[17px] rounded-[4px] cursor-pointer gap-x-[7px] bg-vmb-secondary transition hover:brightness-95 ${classes}`}
    >
      <span
        className={`max-xl:text-[14px] text-white xl:text-[15px] max-xl:leading-[20px] font-poppins font-semibold uppercase tracking-[0.04em] ${textClasses}`}
      >
        {text}
      </span>
      <span className="flex items-center justify-center min-w-8 h-8 rounded-[4px] bg-vmb-primary">
        <FaArrowRightLong className="text-vmb-bg group-hover:translate-x-[4px] transition-transform duration-300" />
      </span>
    </button>
  );
}

export default Button;
