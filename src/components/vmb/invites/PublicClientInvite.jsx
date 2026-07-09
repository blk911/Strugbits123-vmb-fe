import React, { useState } from "react";
import InvitationEnvelope from "./InvitationEnvelope";
import InvitationCard from "./InvitationCard";

export default function PublicClientInvite({ salon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8f5] text-[#332a28]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,221,218,0.72),transparent_34%),linear-gradient(135deg,rgba(255,248,245,0.96),rgba(246,231,226,0.78)_48%,rgba(255,252,248,0.98))]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-5 py-10 sm:px-8 lg:py-14">
        <div className="w-full">
          <InvitationEnvelope salon={salon} isOpen={isOpen} onOpen={() => setIsOpen(true)} />
          {isOpen ? <InvitationCard salon={salon} isOpen={isOpen} /> : null}
        </div>
      </section>
    </main>
  );
}
