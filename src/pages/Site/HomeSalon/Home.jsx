import React, { useCallback } from "react";
import SalonHero from "../../../components/site/SalonHero/SalonHero";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";

// ─── static data ──────────────────────────────────────────────────────────────

const PLATFORMS = [
  "Vagaro",
  "GlossGenius",
  "Square",
  "Fresha",
  "Booksy",
  "Boulevard",
  "Mangomint",
  "CSV export",
];

const HOW_STEPS = [
  {
    n: "01",
    title: "Connect",
    body: "Import your existing salon data from any major booking platform or upload a CSV export.",
  },
  {
    n: "02",
    title: "Analyze",
    body: "VMB finds hidden revenue, retention, referral, and gifting opportunities inside your current client history.",
  },
  {
    n: "03",
    title: "Preview",
    body: "The free Salon Intelligence Scan shows your top 3 opportunities — no subscription required.",
  },
  {
    n: "04",
    title: "Activate",
    body: "Subscribe to VMB Pro to launch recovery, referral, gifting, VIP, and client-network campaigns through TaikOS.",
  },
];

const OPPORTUNITIES = [
  {
    id: "dormant",
    eyebrow: "Dormant High-Value Clients",
    body: "38 premium clients spent over $2,400 in the last year but have not booked in 60+ days.",
    cta: "Unlock Recovery Campaign",
  },
  {
    id: "referral",
    eyebrow: "Referral & Friend Circles",
    body: "Your best clients already cluster around friends, bridal parties, and trusted recommendations.",
    cta: "Activate Client Circles",
  },
  {
    id: "gifts",
    eyebrow: "Giftable Service Moments",
    body: "Mother's Day, birthdays, bridal events, and best-friend gifts can become prepaid salon commerce.",
    cta: "Launch Gift Campaign",
  },
];

const TAIKOS_BULLETS = [
  "Build client invite lists",
  "Create personalized outreach",
  "Launch prepaid service offers",
  "Activate gifting moments",
  "Trigger referral campaigns",
  "Track client response",
  "Grow private client circles",
];

const BOOKING_COLS = {
  left: {
    label: "Your booking platform",
    note: "Vagaro · GlossGenius · Square · Booksy · Boulevard",
    items: ["Appointment booking", "Payment processing", "Calendar management", "Service menu"],
    accent: "text-[#6b6262]",
    tag: "Manages appointments",
    tagColor: "bg-[#f5eee9] text-[#6b5e4e] border-[#e2d0c4]",
  },
  right: {
    label: "VMB",
    note: "Works alongside your platform",
    items: [
      "Relationship intelligence",
      "Client network activation",
      "Referral campaigns",
      "Gifting & prepaid offers",
      "Private access programs",
      "Growth orchestration",
    ],
    accent: "text-[#b88f45]",
    tag: "Grows demand",
    tagColor: "bg-[#fdf5e4] text-[#7a5c1e] border-[#d4b87a]/50",
  },
};

const CLIENT_WHY = [
  {
    icon: "★",
    title: "VIP access",
    body: "Exclusive access from a salon they already trust.",
  },
  {
    icon: "♡",
    title: "Easy gifting",
    body: "Send services to friends and family effortlessly.",
  },
  {
    icon: "◎",
    title: "Private invites",
    body: "Personal invitations — not mass social media posts.",
  },
  {
    icon: "◈",
    title: "Better access",
    body: "Priority availability with their favorite providers.",
  },
  {
    icon: "⌾",
    title: "Trusted referrals",
    body: "Cross-category beauty and personal care recommendations.",
  },
];

// ─── shared style tokens ──────────────────────────────────────────────────────

const eyebrow =
  "text-[9px] font-bold uppercase tracking-[0.22em] text-[#b88f45]";
const eyebrowLight =
  "text-[9px] font-bold uppercase tracking-[0.22em] text-[#b88f45]/75";
const sectionH2Dark =
  "font-studio-serif text-[1.75rem] font-medium leading-[1.1] tracking-tight text-[#faf6ef] sm:text-[2.1rem]";
const sectionH2Light =
  "font-studio-serif text-[1.75rem] font-medium leading-[1.1] tracking-tight text-[#231f1d] sm:text-[2.1rem]";
const bodyLight = "text-[14px] leading-relaxed text-[#5c534d] sm:text-[15px]";
const bodyDark  = "text-[14px] leading-relaxed text-[#b0aaa3] sm:text-[15px]";

// ─── component ────────────────────────────────────────────────────────────────

export default function HomeSalon() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goRegister = useCallback(() => {
    dispatch(setAuthType("salon"));
    dispatch(setAuthMode("signup"));
    navigate("/register");
  }, [dispatch, navigate]);

  return (
    <>
      {/* 1 · HERO */}
      <SalonHero />

      {/* 2 · PLATFORM IMPORT BAR */}
      <section className="border-b border-[#ebe4dc] bg-[#fffdfb] px-5 py-7 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
            <div className="shrink-0 text-center sm:text-left">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a7f77]">
                Works with
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                {PLATFORMS.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-[#e2d6cf] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#4a423d]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden h-10 w-px shrink-0 self-center bg-[#e2d6cf] sm:block" aria-hidden />
            <p className="max-w-sm text-center text-[12px] leading-relaxed text-[#6b5e4e] sm:text-left sm:text-[13px]">
              Import clients, emails, phone numbers, appointments, services, sales, visit cadence, and spend history.
            </p>
          </div>
        </div>
      </section>

      {/* 3 · HOW IT WORKS */}
      <section className="bg-[#0a0f18] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className={eyebrowLight}>How it works</p>
            <h2 className={`${sectionH2Dark} mt-2`}>
              Four steps from data to revenue.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5"
              >
                <p className="text-[11px] font-bold tabular-nums text-[#b88f45]/70">{s.n}</p>
                <p className="mt-2 text-[15px] font-semibold text-[#faf6ef]">{s.title}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-[#9a9490]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · FREE SCAN / PAID ACTIVATION */}
      <section id="free-scan" className="scroll-mt-16 bg-[#faf6ef] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 text-center">
            <p className={eyebrow}>Free scan · paid activation</p>
            <h2 className={`${sectionH2Light} mt-2`}>
              Free to see the opportunity.<br className="hidden sm:block" /> Paid to activate the growth.
            </h2>
            <p className={`${bodyLight} mx-auto mt-3 max-w-xl text-center`}>
              The free Salon Intelligence Scan reveals three actionable opportunities from your existing data. To launch recovery, referral, gifting, VIP, or client-network campaigns, salons activate VMB Pro.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {OPPORTUNITIES.map((opp, i) => (
              <div
                key={opp.id}
                className="flex flex-col rounded-2xl border border-[#e8ddd4] bg-white p-5 shadow-sm"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a7f77]">
                  Opportunity {i + 1}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#231f1d]">{opp.eyebrow}</p>
                <p className="mt-2 flex-1 text-[12px] leading-relaxed text-[#5c534d]">{opp.body}</p>
                <div className="mt-5 rounded-lg border border-dashed border-[#d4bc8c]/60 bg-[#fdf8ef] px-3 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#b88f45]/60">
                    VMB Pro
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#7a5c1e] opacity-60">
                    {opp.cta}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    <span className="text-[9px] text-[#9a8778]">🔒 Activate to unlock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={goRegister}
              className="rounded-full bg-[#231f1d] px-8 py-3 text-[14px] font-semibold text-[#F7E7CE] shadow-sm transition hover:bg-[#3a322c] sm:text-[15px]"
            >
              Run My Free Salon Scan
            </button>
          </div>
        </div>
      </section>

      {/* 5 · TAIKOS ACTIVATION */}
      <section className="bg-[#0e1420] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl lg:flex lg:items-start lg:gap-16">
          <div className="lg:flex-1">
            <p className={eyebrowLight}>TaikOS</p>
            <h2 className={`${sectionH2Dark} mt-2`}>
              TaikOS turns insights<br className="hidden sm:block" /> into action.
            </h2>
            <p className={`${bodyDark} mt-4 max-w-lg`}>
              VMB does not stop at analytics. TaikOS turns each opportunity into a campaign, message flow, invite path, gift offer, referral prompt, or private client-network activation.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-[320px] lg:shrink-0">
            <ul className="space-y-2.5">
              {TAIKOS_BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-3"
                >
                  <span className="shrink-0 text-[#b88f45]" aria-hidden>→</span>
                  <span className="text-[13px] text-[#d8d2c8]">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6 · NOT ANOTHER BOOKING APP */}
      <section className="bg-[#fffdfb] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <p className={eyebrow}>Positioning</p>
            <h2 className={`${sectionH2Light} mt-2`}>
              VMB works with your booking platform.<br className="hidden sm:block" /> It does not replace it.
            </h2>
          </div>

          <div className="grid gap-0 overflow-hidden rounded-2xl border border-[#e8ddd4] sm:grid-cols-[1fr_auto_1fr]">
            {/* Left — booking platforms */}
            <div className="bg-[#faf6ef] p-6 sm:p-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a7f77]">
                {BOOKING_COLS.left.label}
              </p>
              <p className="mt-1 text-[10px] text-[#a09a98]">{BOOKING_COLS.left.note}</p>
              <span className={`mt-3 inline-block rounded-md border px-2.5 py-1 text-[10px] font-semibold ${BOOKING_COLS.left.tagColor}`}>
                {BOOKING_COLS.left.tag}
              </span>
              <ul className="mt-5 space-y-2">
                {BOOKING_COLS.left.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] text-[#4a423d]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ccc0b5]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider + VS */}
            <div className="hidden flex-col items-center justify-center gap-3 border-x border-[#e8ddd4] bg-white px-4 sm:flex">
              <div className="h-16 w-px bg-[#e8ddd4]" aria-hidden />
              <span className="rounded-full border border-[#e2d6cf] bg-[#fffdfb] px-2.5 py-1 text-[10px] font-bold text-[#8a7f77]">
                +
              </span>
              <div className="h-16 w-px bg-[#e8ddd4]" aria-hidden />
            </div>

            {/* Right — VMB */}
            <div className="border-t border-[#e8ddd4] bg-white p-6 sm:border-t-0 sm:p-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b88f45]">
                {BOOKING_COLS.right.label}
              </p>
              <p className="mt-1 text-[10px] text-[#a09a98]">{BOOKING_COLS.right.note}</p>
              <span className={`mt-3 inline-block rounded-md border px-2.5 py-1 text-[10px] font-semibold ${BOOKING_COLS.right.tagColor}`}>
                {BOOKING_COLS.right.tag}
              </span>
              <ul className="mt-5 space-y-2">
                {BOOKING_COLS.right.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13px] font-medium text-[#231f1d]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#b88f45]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · WHY CLIENTS PARTICIPATE */}
      <section className="bg-[#faf6ef] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className={eyebrow}>Why clients participate</p>
            <h2 className={`${sectionH2Light} mt-2`}>
              Clients join because it feels personal.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CLIENT_WHY.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-[#e8ddd4] bg-white p-4 text-center shadow-sm"
              >
                <span className="text-[22px] text-[#b88f45]" aria-hidden>{c.icon}</span>
                <p className="mt-2 text-[13px] font-semibold text-[#231f1d]">{c.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#6b5e4e]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 · FINAL CTA */}
      <section className="bg-[#0a0f18] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className={eyebrowLight}>Get started</p>
          <h2 className={`${sectionH2Dark} mt-3`}>
            Start with the clients<br className="hidden sm:block" /> you already have.
          </h2>
          <p className={`${bodyDark} mx-auto mt-4 max-w-lg`}>
            Connect your salon platform, reveal your top opportunities, and decide what you want VMB to activate first.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={goRegister}
              className="group relative overflow-hidden rounded-full bg-[#F7E7CE] px-8 py-3.5 text-[14px] font-semibold tracking-wide text-[#1a1520] shadow-[0_8px_32px_-8px_rgba(247,231,206,0.45)] transition duration-300 hover:brightness-[1.04] sm:text-[15px]"
            >
              <span className="relative z-[1]">Run My Free Salon Scan</span>
              <span
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100"
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("free-scan")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full border border-white/[0.18] bg-white/[0.05] px-8 py-3.5 text-[14px] font-semibold tracking-wide text-[#f8f4eb] backdrop-blur-md transition hover:border-[#F7E7CE]/35 hover:bg-white/[0.08] sm:text-[15px]"
            >
              See Example Report
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
