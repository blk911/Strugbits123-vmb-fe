import React from "react";

export default function InvitationEnvelope({ salon, isOpen, onOpen }) {
  const salonName = salon.slug === "preview-salon" ? `${salon.ownerFirstName}'s Studio` : salon.salonName;

  return (
    <div
      className={`mx-auto max-w-2xl transition-all duration-700 ease-out ${
        isOpen ? "pointer-events-none translate-y-2 scale-[0.96] opacity-0" : "opacity-100"
      }`}
      aria-hidden={isOpen}
    >
      <div className="relative rounded-[2rem] border border-[#ead8d5] bg-[#fffaf7] p-4 shadow-[0_30px_80px_rgba(102,69,67,0.18)] sm:p-6">
        <div className="absolute inset-3 rounded-[1.5rem] border border-[#f3e4df]" />
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f5deda] px-5 pb-7 pt-14 text-center shadow-inner sm:px-10 sm:pb-10 sm:pt-20">
          <div className="absolute inset-x-0 top-0 h-1/2 origin-top border-b border-[#d4a5a5] bg-gradient-to-br from-[#fff4ef] via-[#f2c9c7] to-[#dfaaa9] shadow-[0_18px_40px_rgba(116,72,72,0.12)] transition-transform duration-700 [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-br from-[#f7d7d2] via-[#f2c5c3] to-[#ead8cf] [clip-path:polygon(0_0,50%_45%,100%_0,100%_100%,0_100%)]" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-[#f3cbc7]/70 [clip-path:polygon(0_0,100%_50%,0_100%)]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[#e8bbb9]/70 [clip-path:polygon(100%_0,0_50%,100%_100%)]" />

          <div className="relative mx-auto flex min-h-[21rem] max-w-md flex-col items-center justify-center rounded-[1.25rem] border border-white/70 bg-white/40 px-5 py-8 backdrop-blur-[2px]">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.32em] text-[#a66f72]">
              PRIVATE INVITATION
            </p>
            <h1 className="mt-5 font-studio-serif text-[2.35rem] leading-[1.05] text-[#4f3435] sm:text-[3.2rem]">
              A little gift is waiting.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#6f5554] sm:text-[0.95rem]">
              From {salonName}, chosen with care and held just for you.
            </p>
            <button
              type="button"
              onClick={onOpen}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#8f5f62] px-8 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(143,95,98,0.28)] transition hover:-translate-y-0.5 hover:bg-[#7b4e52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a3a6]"
            >
              Open Your Invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
