import React from "react";
import GiftDetails from "./GiftDetails";
import InviteActions from "./InviteActions";

export default function InvitationCard({ salon, isOpen }) {
  const firstName = salon.recipientFirstName || "there";
  const salonName = salon.displaySalonName || (salon.slug === "preview-salon" ? `${salon.ownerFirstName}'s Studio` : salon.salonName);

  return (
    <div
      className={`mx-auto max-w-3xl transition-all duration-700 ease-out ${
        isOpen ? "-mt-[27rem] translate-y-0 opacity-100 sm:-mt-[30rem]" : "translate-y-10 opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <article className="relative overflow-hidden rounded-[2rem] border border-[#ead8d5] bg-[#fffdfb] shadow-[0_30px_90px_rgba(102,69,67,0.2)]">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#d5a45f] via-[#f4d9bf] to-[#c88b9a]" />
        <div className="absolute right-0 top-0 h-44 w-44 rounded-bl-full bg-[#f7ded9]/70" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-tr-full bg-[#fbefe9]" />

        <div className="relative grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="flex min-h-[20rem] flex-col justify-between bg-[#f5e3df] px-7 py-8 sm:px-9">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.32em] text-[#a66f72]">
                PRIVATE INVITATION
              </p>
              <h1 className="mt-5 font-studio-serif text-[3.1rem] leading-none text-[#3d2d2d] sm:text-[4.2rem]">
                Hi {firstName}
              </h1>
            </div>
            <div className="rounded-2xl border border-white/75 bg-white/45 p-5 backdrop-blur-sm">
              <p className="font-studio-serif text-2xl leading-tight text-[#4f3435]">
                {salon.featuredOffer.headline}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#735b58]">
                {salon.privateNote || `A private note from ${salonName}, held in a softer place than a standard booking link.`}
              </p>
            </div>
          </aside>

          <section className="px-7 py-8 sm:px-10 sm:py-10">
            <GiftDetails salon={salon} />
            <InviteActions labels={salon.actionLabels} />
          </section>
        </div>
      </article>
    </div>
  );
}
