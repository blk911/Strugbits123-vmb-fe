import React from "react";

export default function Button({text, classes,textclass}) {
  return (
    <button
      className={`flex items-center gap-2 pl-[15px] pr-[5px]  py-[8px] rounded-full border-2 border-[#7a2c3a]  text-[#7a2c3a] font-medium text-lg transition hover:bg-pink-200 ${classes}`}
      style={{ boxShadow: "0 0 0 0 #7a2c3a" }}
    >
      <span className={textclass}>{text}</span>
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#7a2c3a]">
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            d="M7 10h6m0 0l-3-3m3 3l-3 3"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  )
}