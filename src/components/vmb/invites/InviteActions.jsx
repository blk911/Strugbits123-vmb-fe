import React from "react";

const primary =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#8f5f62] px-7 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(143,95,98,0.24)] transition hover:-translate-y-0.5 hover:bg-[#7b4e52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a3a6]";
const secondary =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#e5c9c3] bg-white px-7 text-sm font-semibold text-[#6f484b] transition hover:border-[#d3aaa5] hover:bg-[#fff8f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#edd1ca]";
const tertiary =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full px-7 text-sm font-semibold text-[#8b6b67] transition hover:bg-[#f8ebe7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#edd1ca]";

export default function InviteActions() {
  return (
    <div className="mt-8 space-y-3">
      <button type="button" className={primary}>
        Claim My Gift
      </button>
      <button type="button" className={secondary}>
        Ask for an Adjustment
      </button>
      <button type="button" className={tertiary}>
        Hold Until Later
      </button>
    </div>
  );
}
