import React from "react";
import { FaPlay } from "react-icons/fa";

const videoGuides = [
  {
    title: "Salon Setup",
    meta: "5 min",
    text: "Profile, services, hours, and the first offer foundation.",
  },
  {
    title: "Superstar Clients",
    meta: "Guide",
    text: "Find the clients most likely to bring in trusted referrals.",
  },
  {
    title: "New Biz Promos",
    meta: "Guide",
    text: "Build shareable offers that create fresh booking reasons.",
  },
  {
    title: "Create Your Bench",
    meta: "Guide",
    text: "Grow a warm list of clients ready for the right campaign.",
  },
  {
    title: "Special Occasions",
    meta: "Guide",
    text: "Use parties, trips, weddings, and holidays as invite moments.",
  },
];

const faqItems = [
  {
    q: "How do invites and referrals work?",
    a: "You create an offer, invite clients you trust, and they can share it with their circle. VMB keeps the salon in control of incentives and timing.",
  },
  {
    q: "What is tAIkOS?",
    a: "tAIkOS surfaces operational signals — schedule gaps, campaigns ready for approval, and client opportunities — so you can review and act in one place.",
  },
  {
    q: "Do campaigns send automatically?",
    a: "No. Recommended campaigns stay draft until you review and approve. Nothing goes out without your sign-off.",
  },
  {
    q: "Where do I manage services and my public page?",
    a: "Use Settings and Service Presets from the sidebar, or open your salon page link from Settings when you need to preview what clients see.",
  },
];

export default function SalonFaqPage() {
  return (
    <div className="min-h-full bg-vmb-dashboard-bg font-poppins text-[#333232]">
      <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-vmb-border-light pb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a45f76]">
            Help
          </p>
          <h1 className="mt-2 font-studio-serif text-3xl font-semibold text-[#2f2a28] sm:text-4xl">
            FAQ
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6b6262]">
            How-to guides and quick answers for running your salon on VMB.
          </p>
        </header>

        <section className="mt-6 rounded-[8px] bg-white p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.7)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a45f76]">
                How-To Guides
              </p>
              <h2 className="mt-2 font-studio-serif text-2xl text-[#2f2a28] sm:text-3xl">
                Get the salon growth engine moving.
              </h2>
            </div>
            <span className="text-sm font-semibold text-[#6b6262]">
              Video placeholders
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {videoGuides.map((guide) => (
              <article
                key={guide.title}
                className="overflow-hidden rounded-[8px] border border-[#e2d6cf] bg-[#fffdfb]"
              >
                <div className="flex aspect-video items-center justify-center bg-[linear-gradient(135deg,#fff8f4_0%,#ead6cf_55%,#d9b7ad_100%)] text-[#333232]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[#a45f76] shadow-[0_10px_24px_-14px_rgba(164,95,118,0.8)] ring-1 ring-[#b88f45]/30">
                    <FaPlay className="ml-0.5 text-sm" aria-hidden />
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold leading-tight text-[#2f2a28]">
                      {guide.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-[#eadfd8] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7f5362]">
                      {guide.meta}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#6b6262]">
                    {guide.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <h2 className="mt-10 font-studio-serif text-xl font-semibold text-[#2f2a28]">
          Common questions
        </h2>
        <dl className="mt-4 space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-[#e2d6cf] bg-white p-4 shadow-sm sm:p-5"
            >
              <dt className="font-semibold text-[#2f2a28]">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-[#6b6262]">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
