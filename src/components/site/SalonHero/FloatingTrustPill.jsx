import React from "react";

export default function FloatingTrustPill({ children, className = "" }) {
  return (
    <div
      className={`
        inline-flex max-w-full items-center rounded-full border border-white/[0.12]
        bg-white/[0.07] px-4 py-2.5 text-[13px] font-medium leading-snug text-[#f5f0e6]/95
        shadow-none backdrop-blur-md sm:text-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}
