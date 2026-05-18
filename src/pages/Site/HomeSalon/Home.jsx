import React, { useCallback } from "react";
import SalonHero from "../../../components/site/SalonHero/SalonHero";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";
import {
  CloudUpload,
  BarChart2,
  Target,
  Megaphone,
  Check,
  Lock,
} from "lucide-react";

// ─── static data ──────────────────────────────────────────────────────────────

const PLATFORMS = [
  "Vagaro", "GlossGenius", "Square", "Fresha",
  "Booksy", "Boulevard", "Mangomint", "CSV Export",
];

const BOOKING_FEATURES = ["Booking", "Payments", "Calendar", "Services"];
const VMB_FEATURES     = ["Analytics", "Referrals", "Gifting", "Retention", "VIP Access"];

const METRICS = [
  { stat: "23–35%",    body: "of revenue comes from inactive clients you can win back." },
  { stat: "2–5×",      body: "more likely to rebook when personalized outreach is used." },
  { stat: "3×",        body: "higher revenue from clients in referral circles." },
  { stat: "20–40%",   body: "increase in prepaid revenue with gifting campaigns." },
  { stat: "Up to 60%", body: "prefer private, invite-only offers over public promotions." },
];

const HOW_STEPS = [
  {
    Icon: CloudUpload,
    n: "01",
    title: "Connect",
    body: "Import your existing salon data from your booking platform or upload a CSV export.",
  },
  {
    Icon: BarChart2,
    n: "02",
    title: "Analyze",
    body: "VMB finds hidden revenue, retention, referral, and gifting opportunities in your client history.",
  },
  {
    Icon: Target,
    n: "03",
    title: "Preview",
    body: "Your free Salon Intelligence Scan reveals your top 3 opportunities — no subscription needed.",
  },
  {
    Icon: Megaphone,
    n: "04",
    title: "Activate",
    body: "Subscribe to launch recovery, referral, gifting, VIP, and client-network campaigns through TaikOS.",
  },
];

const OPPORTUNITIES = [
  {
    id: "dormant",
    n: 1,
    title: "Dormant High-Value Clients",
    body: "38 premium clients spent over $2,400 in the last year but have not booked in 60+ days.",
    revenue: "$11,200+",
    cta: "Unlock Recovery Campaign",
  },
  {
    id: "referral",
    n: 2,
    title: "Referral & Friend Circles",
    body: "Your best clients already cluster around friends, bridal parties, and trusted recommendations.",
    revenue: "$8,600+",
    cta: "Activate Client Circles",
  },
  {
    id: "gifts",
    n: 3,
    title: "Giftable Service Moments",
    body: "Mother's Day, birthdays, bridal events, and best-friend gifts can become prepaid salon commerce.",
    revenue: "$6,300+",
    cta: "Launch Gift Campaign",
  },
];

const TRUST_BULLETS = [
  "100% Secure & Private",
  "No credit card required",
  "Results in minutes",
];

const TAIKOS_FEATURES = [
  "Build targeted client lists",
  "Personalize every message",
  "Automate invites & offers",
  "Track responses in real time",
  "Grow private client circles",
];

const CAMPAIGNS = [
  { label: "VIP Re-Engagement",      status: "Active",  color: "bg-emerald-50 text-emerald-700" },
  { label: "Bridal Circle Invite",   status: "Active",  color: "bg-emerald-50 text-emerald-700" },
  { label: "Birthday Gift Campaign", status: "Queued",  color: "bg-amber-50 text-amber-700"     },
  { label: "Win-Back Series",        status: "Preview", color: "bg-[#fceef2] text-[#c4506e]"    },
];

// ─── shared tokens ────────────────────────────────────────────────────────────

const eyebrow     = "text-[10px] font-bold uppercase tracking-[0.26em] text-[#b88f45]";
const eyebrowRose = "text-[10px] font-bold uppercase tracking-[0.26em] text-[#c4506e]";
const h2          = "font-studio-serif mt-2 text-[1.85rem] font-medium leading-[1.1] tracking-tight text-[#1a1412] sm:text-[2.2rem]";
const body        = "text-[16px] leading-relaxed text-[#5c4d45] sm:text-[17px]";
const secPad      = "px-5 py-10 sm:px-8 sm:py-12";

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

      {/* 2 · NOT ANOTHER BOOKING APP */}
      <section className="bg-[#faf6f2] px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-[#ede4df] bg-white shadow-[0_2px_20px_rgba(26,20,18,0.07)]">

            {/* Comparison row */}
            <div className="flex flex-col sm:flex-row">

              {/* Left — Traditional platforms */}
              <div className="flex-1 p-6 sm:p-7">
                <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#8a7f77]">
                  Not another booking app
                </p>
                <h3 className="font-studio-serif mt-2 text-[1.25rem] font-medium text-[#4a3e38] sm:text-[1.4rem]">
                  Traditional Platforms
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#7a6b62]">
                  Manage appointments and payments.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {BOOKING_FEATURES.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-[#ede4df] bg-[#faf6f2] px-3 py-1.5 text-[12px] font-medium text-[#7a6b62]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Center VS */}
              <div className="flex items-center justify-center border-y border-[#ede4df] py-4 sm:border-x sm:border-y-0 sm:px-5 sm:py-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#ede4df] bg-[#faf6f2] text-[12px] font-bold tracking-tight text-[#9a8f86]">
                  VS
                </div>
              </div>

              {/* Right — VMB */}
              <div className="flex-1 bg-[#fffcfa] p-6 sm:p-7">
                <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#c4506e]">
                  VMB
                </p>
                <h3 className="font-studio-serif mt-2 text-[1.25rem] font-medium text-[#1a1412] sm:text-[1.4rem]">
                  Grows Your Business
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#5c4d45]">
                  Through relationships, data, and activation.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {VMB_FEATURES.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-[#f0c8d0] bg-[#fceef2] px-3 py-1.5 text-[12px] font-medium text-[#c4506e]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom strip — platforms + import copy */}
            <div className="border-t border-[#ede4df] bg-[#faf6f2] px-6 py-4 sm:px-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <div className="shrink-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a7f77]">
                    Connects to
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PLATFORMS.map((p) => (
                      <span
                        key={p}
                        className="rounded-md border border-[#ede4df] bg-white px-2.5 py-1 text-[11px] font-medium text-[#4a3e38]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden h-10 w-px shrink-0 bg-[#ede4df] sm:block" aria-hidden />
                <p className="text-[13px] leading-relaxed text-[#6b5e4e]">
                  Import clients, emails, phone numbers, appointments, services, sales, visit cadence, and spend history.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 · WHAT YOUR DATA CAN REVEAL */}
      <section className="bg-white px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 flex items-center gap-4">
            <p className={eyebrow}>What your data can reveal</p>
            <div className="h-px flex-1 bg-[#ede4df]" aria-hidden />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {METRICS.map((m) => (
              <div
                key={m.stat}
                className="rounded-xl border border-[#f0c8d0] bg-[#fceef2] px-4 py-4"
              >
                <p className="font-studio-serif text-[1.55rem] font-medium leading-none text-[#c4506e]">
                  {m.stat}
                </p>
                <p className="mt-1.5 text-[12px] leading-snug text-[#6b5e4e]">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · HOW IT WORKS */}
      <section className={`bg-[#faf6f2] ${secPad}`}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className={eyebrow}>How it works</p>
            <h2 className={h2}>From data to revenue in four simple steps.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map(({ Icon, n, title, body: stepBody }) => (
              <div
                key={n}
                className="rounded-2xl border border-[#ede4df] bg-white p-5 shadow-[0_1px_4px_rgba(26,20,18,0.05)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fceef2]">
                  <Icon className="h-4 w-4 text-[#c4506e]" strokeWidth={1.8} />
                </div>
                <p className="mt-3 text-[10px] font-bold tabular-nums text-[#b88f45]">{n}</p>
                <p className="mt-1 text-[15px] font-semibold text-[#1a1412]">{title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#6b5e4e]">{stepBody}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · FREE SCAN / PAID ACTIVATION */}
      <section id="free-scan" className={`scroll-mt-16 bg-white ${secPad}`}>
        <div className="mx-auto max-w-5xl">
          <div className="lg:flex lg:gap-10">

            {/* Left — opportunity cards */}
            <div className="flex-1">
              <p className={eyebrowRose}>Free to see · paid to activate</p>
              <h2 className={h2}>
                Your free scan reveals<br className="hidden sm:block" /> 3 opportunities.
              </h2>
              <p className={`${body} mt-3 max-w-lg`}>
                The free scan shows you what's possible. Activate with VMB Pro to turn insights into action.
              </p>
              <div className="mt-6 space-y-3">
                {OPPORTUNITIES.map((opp) => (
                  <div
                    key={opp.id}
                    className="rounded-2xl border border-[#ede4df] bg-[#faf6f2] p-5"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a7f77]">
                      Opportunity {opp.n}
                    </p>
                    <p className="mt-1.5 text-[15px] font-semibold text-[#1a1412]">{opp.title}</p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-[#6b5e4e]">{opp.body}</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#8a7f77]">
                        Potential Revenue
                      </span>
                      <span className="text-[14px] font-bold text-[#b88f45]">{opp.revenue}</span>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="mt-3.5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#ede4df] bg-white py-2.5 text-[12px] font-semibold text-[#9a8f86] opacity-70"
                    >
                      <Lock className="h-3 w-3" strokeWidth={2} />
                      {opp.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — CTA panel */}
            <div className="mt-8 lg:mt-0 lg:w-[248px] lg:shrink-0 lg:pt-14">
              <div className="rounded-2xl border border-[#f0c8d0] bg-[#fceef2] p-5">
                <p className="font-studio-serif text-[17px] font-medium leading-snug text-[#1a1412]">
                  See what's hidden in your data today.
                </p>
                <ul className="mt-4 space-y-2.5">
                  {TRUST_BULLETS.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-[14px] text-[#4a3e38]">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#c4506e]" strokeWidth={2.5} />
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={goRegister}
                  className="mt-5 w-full rounded-full bg-[#c4506e] py-3 text-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(196,80,110,0.28)] transition hover:bg-[#b0425e]"
                >
                  Analyze My Salon Free
                </button>
                <p className="mt-2.5 text-center text-[11px] text-[#8a7f77]">
                  Takes less than 2 minutes
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6 · TAIKOS ACTIVATION */}
      <section className={`bg-[#faf6f2] ${secPad}`}>
        <div className="mx-auto max-w-5xl lg:flex lg:items-start lg:gap-14">

          {/* Left — copy */}
          <div className="flex-1">
            <p className={eyebrow}>TaikOS turns insights into action</p>
            <h2 className={h2}>Analytics is just the beginning.</h2>
            <p className={`${body} mt-3 max-w-md`}>
              TaikOS activates every opportunity with automated campaigns, personalized outreach, and private client-network experiences.
            </p>
            <ul className="mt-5 space-y-2.5">
              {TAIKOS_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px] text-[#4a3e38] sm:text-[16px]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fceef2]">
                    <Check className="h-3 w-3 text-[#c4506e]" strokeWidth={2.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={goRegister}
              className="mt-7 rounded-full bg-[#c4506e] px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(196,80,110,0.25)] transition hover:bg-[#b0425e] sm:text-[15px]"
            >
              Activate My Salon
            </button>
          </div>

          {/* Right — Campaign Builder mockup */}
          <div className="mt-8 lg:mt-0 lg:w-[310px] lg:shrink-0">
            <div className="rounded-2xl border border-[#ede4df] bg-white p-4 shadow-[0_4px_24px_rgba(26,20,18,0.07)]">
              <div className="flex items-center justify-between rounded-xl border border-[#ede4df] bg-[#faf6f2] px-4 py-3">
                <p className="text-[12px] font-semibold text-[#1a1412]">Campaign Builder</p>
                <span className="rounded-full border border-[#d4b87a]/50 bg-[#fdf5e4] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8a6a20]">
                  tAIkOS
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {CAMPAIGNS.map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center justify-between rounded-xl border border-[#ede4df] bg-white px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fceef2]">
                        <Megaphone className="h-2.5 w-2.5 text-[#c4506e]" strokeWidth={2} />
                      </span>
                      <span className="text-[12px] font-medium text-[#1a1412]">{c.label}</span>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${c.color}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-[10px] text-[#9a8f86]">
                Campaigns launch on activation
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7 · TRUST NOTE */}
      <section className="bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#ede4df] bg-[#faf6f2]">
            <Lock className="h-3.5 w-3.5 text-[#8a7f77]" strokeWidth={1.8} />
          </div>
          <p className="text-[15px] leading-relaxed text-[#6b5e4e] sm:text-[16px]">
            Your data is secure, private, and never sold. You own your relationships — VMB helps you grow them.
          </p>
        </div>
      </section>
    </>
  );
}
