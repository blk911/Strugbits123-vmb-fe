import React from "react";

export default function GiftDetails({ salon }) {
  return (
    <div>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.32em] text-[#b27a7d]">
        YOUR GIFT
      </p>
      <h2 className="mt-4 font-studio-serif text-[2rem] leading-tight text-[#3d2d2d] sm:text-[2.6rem]">
        {salon.featuredOffer.subline}
      </h2>
      <p className="mt-4 text-[1rem] leading-7 text-[#65514f]">
        {salon.featuredOffer.detail}
      </p>
      <div className="mt-6 rounded-2xl border border-[#f0ddd8] bg-[#fff8f5] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b27a7d]">
          Gift window
        </p>
        <p className="mt-2 text-sm leading-6 text-[#6d5754]">{salon.featuredOffer.expiresLabel}</p>
      </div>
    </div>
  );
}
