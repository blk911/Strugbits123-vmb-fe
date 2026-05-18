import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getSalonLandingBySlug } from "../../../data/mockSalonLanding";

const shell = "min-h-screen bg-[#faf7f3] text-[#2c2724]";
const sectionShell =
  "rounded-2xl border border-[#e8ddd4]/90 bg-white/85 shadow-[0_1px_0_rgba(44,39,36,0.04)] backdrop-blur-sm";
const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-[#9a7349] px-6 py-3 text-[13px] font-semibold tracking-tight text-white shadow-[0_8px_24px_rgba(154,115,73,0.25)] transition hover:bg-[#855d3b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a574]/50";
const btnSecondary =
  "inline-flex items-center justify-center rounded-full border border-[#d4c4b0] bg-white/90 px-6 py-3 text-[13px] font-semibold tracking-tight text-[#4a423d] shadow-sm transition hover:border-[#b8a08c] hover:bg-[#fffdfa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a574]/40";
const sectionEyebrow = "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7f77]";

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SalonClientLandingPage() {
  const { id: salonSlug } = useParams();
  const salon = getSalonLandingBySlug(salonSlug);

  useEffect(() => {
    document.title = salon ? `${salon.pageTitle}` : "Salon invite · VMB";
    return () => {
      document.title = "VMB";
    };
  }, [salon]);

  if (!salon) {
    return (
      <div className={`${shell} flex flex-col items-center justify-center px-6 py-20`}>
        <p className="font-studio-serif text-xl text-[#2c2724]">This invite link isn’t available.</p>
        <p className="mt-2 max-w-sm text-center text-sm text-[#6b625c]">
          Check the link you received, or ask your salon for an updated invite.
        </p>
        <Link to="/" className={`${btnPrimary} mt-8`}>
          Back to VMB
        </Link>
      </div>
    );
  }

  return (
    <div className={shell}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <header className="border-b border-[#ebe4dc]/80 bg-[#fffcf8]/95">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
          <span className="font-studio-serif text-[15px] font-semibold tracking-tight text-[#2c2724]">
            {salon.pageTitle}
          </span>
          <span className="rounded-full border border-[#e5d9ce] bg-white/80 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#8a7258]">
            Private invite
          </span>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8">
        {/* Hero */}
        <section className="text-center sm:text-left">
          <div className="mx-auto flex max-w-xl flex-col gap-8 sm:mx-0 sm:max-w-none sm:flex-row sm:items-center sm:gap-10">
            <div
              className="mx-auto flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e8ddd4] via-[#dccfbf] to-[#cdbba9] text-[10px] font-semibold uppercase tracking-widest text-white/90 shadow-inner ring-4 ring-white sm:mx-0 sm:h-44 sm:w-44"
              role="img"
              aria-label={salon.heroImageLabel}
            >
              {salon.heroImageLabel}
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <h1 className="font-studio-serif text-[1.65rem] font-semibold leading-snug tracking-tight text-[#231f1d] sm:text-4xl">
                {salon.salonName}
              </h1>
              <p className="text-[15px] leading-relaxed text-[#5c534d]">{salon.heroMessage}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button type="button" className={btnPrimary}>
                  Join Client Network
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => scrollToId("featured-offer")}
                >
                  View Current Offer
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-14 space-y-8">
          {/* 1 · Featured Offer */}
          <section id="featured-offer" className={`${sectionShell} scroll-mt-24 p-6 sm:p-8`}>
            <p className={sectionEyebrow}>Featured offer</p>
            <h2 className="mt-2 font-studio-serif text-xl font-semibold text-[#231f1d] sm:text-2xl">
              {salon.featuredOffer.headline}
            </h2>
            <p className="mt-1 text-[15px] font-medium text-[#6a5f48]">{salon.featuredOffer.subline}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-[#5c534d]">{salon.featuredOffer.detail}</p>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-[#9a8f86]">
              {salon.featuredOffer.expiresLabel}
            </p>
            <button type="button" className={`${btnPrimary} mt-6 w-full sm:w-auto`}>
              See offer details
            </button>
          </section>

          {/* 2 · Request / Hold */}
          <section className={`${sectionShell} p-6 sm:p-8`}>
            <p className={sectionEyebrow}>Request / hold appointment</p>
            <h2 className="mt-2 font-studio-serif text-lg font-semibold text-[#231f1d] sm:text-xl">
              Tell us what you need
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#5c534d]">{salon.appointmentTeaser}</p>
            <button type="button" className={`${btnSecondary} mt-5`}>
              Request or hold a time
            </button>
          </section>

          {/* 3 · Services */}
          <section className={`${sectionShell} p-6 sm:p-8`}>
            <p className={sectionEyebrow}>Services</p>
            <h2 className="mt-2 font-studio-serif text-lg font-semibold text-[#231f1d] sm:text-xl">
              What we hold space for
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {salon.services.map((s) => (
                <li
                  key={s.id}
                  className="rounded-xl border border-[#efe8e0] bg-[#fffdfb] px-4 py-3.5"
                >
                  <p className="text-[14px] font-semibold text-[#342e2a]">{s.label}</p>
                  <p className="mt-1 text-[12px] leading-snug text-[#7a716a]">{s.blurb}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 4 · Gift Request */}
          <section className={`${sectionShell} p-6 sm:p-8`}>
            <p className={sectionEyebrow}>Gift request</p>
            <h2 className="mt-2 font-studio-serif text-lg font-semibold text-[#231f1d] sm:text-xl">
              Send something thoughtful
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#5c534d]">{salon.giftTeaser}</p>
            <button type="button" className={`${btnSecondary} mt-5`}>
              Start a gift request
            </button>
          </section>

          {/* 5 · Invite a Friend */}
          <section className={`${sectionShell} p-6 sm:p-8`}>
            <p className={sectionEyebrow}>Invite a friend</p>
            <h2 className="mt-2 font-studio-serif text-lg font-semibold text-[#231f1d] sm:text-xl">
              Grow your circle quietly
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#5c534d]">{salon.inviteTeaser}</p>
            <button type="button" className={`${btnPrimary} mt-5`}>
              Send a private invite
            </button>
          </section>

          {/* 6 · Trusted Favorites */}
          <section className={`${sectionShell} border-dashed p-6 sm:p-8`}>
            <p className={sectionEyebrow}>Trusted favorites</p>
            <h2 className="mt-2 font-studio-serif text-lg font-semibold text-[#231f1d] sm:text-xl">
              A personal shortlist
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#5c534d]">
              {salon.trustedFavoritesPlaceholder}
            </p>
            {salon.favorites.length > 0 ?
              <ul className="mt-5 space-y-2">
                {salon.favorites.map((f) => (
                  <li
                    key={f.id}
                    className="rounded-lg border border-[#efe8e0]/80 bg-[#fffdfb]/80 px-3 py-2.5 text-[13px] text-[#4a423d]"
                  >
                    <span className="font-medium">{f.name}</span>
                    {f.note ?
                      <span className="mt-0.5 block text-[12px] text-[#7a716a]">{f.note}</span>
                    : null}
                  </li>
                ))}
              </ul>
            : null}
          </section>
        </div>

        <footer className="mt-16 border-t border-[#ebe4dc] pt-8 text-center">
          <p className="text-[11px] leading-relaxed text-[#9a928b]">
            Invite experience · future campaign links can land here with your name and offer pre-filled.
          </p>
          <Link to="/" className="mt-3 inline-block text-[12px] font-medium text-[#7a654e] underline-offset-4 hover:underline">
            VMB home
          </Link>
        </footer>
      </main>
    </div>
  );
}
