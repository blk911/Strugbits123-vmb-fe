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
    revenueLabel: "Potential Revenue",
    revenue: "$11,200+",
    cta: "Unlock Recovery Campaign",
  },
  {
    id: "referral",
    n: 2,
    title: "Referral & Friend Circles",
    body: "Your best clients already cluster around friends, bridal parties, and trusted recommendations.",
    revenueLabel: "Potential Revenue",
    revenue: "$8,600+",
    cta: "Activate Client Circles",
  },
  {
    id: "gifts",
    n: 3,
    title: "Giftable Service Moments",
    body: "Mother's Day, birthdays, bridal events, and best-friend gifts can become prepaid salon commerce.",
    revenueLabel: "Potential Revenue",
    revenue: "$6,300+",
    cta: "Launch Gift Campaign",
  },
];

const TRUST_BULLETS = [
  "100% Secure & Private",
  "No credit card required",
  "Results in minutes",
];

const METRICS = [
  {
    stat: "23–35%",
    body: "of revenue comes from inactive clients you can win back.",
  },
  {
    stat: "2–5×",
    body: "more likely to rebook when personalized outreach is used.",
  },
  {
    stat: "3×",
    body: "higher revenue from clients in referral circles.",
  },
  {
    stat: "20–40%",
    body: "increase in prepaid revenue with gifting campaigns.",
  },
  {
    stat: "Up to 60%",
    body: "of clients prefer private, invite-only offers over public promotions.",
  },
];

const TAIKOS_FEATURES = [
  "Build targeted client lists",
  "Personalize every message",
  "Automate invites & offers",
  "Track responses in real time",
  "Grow private client circles",
];

const CAMPAIGNS = [
  { label: "VIP Re-Engagement",     status: "Active",   color: "bg-emerald-50 text-emerald-700" },
  { label: "Bridal Circle Invite",  status: "Active",   color: "bg-emerald-50 text-emerald-700" },
  { label: "Birthday Gift Campaign",status: "Queued",   color: "bg-amber-50   text-amber-700"   },
  { label: "Win-Back Series",       status: "Preview",  color: "bg-[#fceef2]  text-[#c4506e]"   },
];

// ─── shared tokens ────────────────────────────────────────────────────────────

const eyebrow = "text-[10px] font-bold uppercase tracking-[0.26em] text-[#b88f45]";
const eyebrowRose = "text-[10px] font-bold uppercase tracking-[0.26em] text-[#c4506e]";
const h2 = "font-studio-serif mt-2 text-[1.8rem] font-medium leading-[1.1] tracking-tight text-[#1a1412] sm:text-[2.15rem]";
const body = "text-[15px] leading-relaxed text-[#5c4d45] sm:text-[16px]";

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
      <section className="border-y border-[#ede4df] bg-white px-5 py-7 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-10">
            <div className="shrink-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8a7f77]">
                Works with your existing salon software
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-[#ede4df] bg-[#faf6f2] px-3 py-1 text-[12px] font-medium text-[#4a3e38]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden self-stretch w-px bg-[#ede4df] sm:block" aria-hidden />
            <p className="max-w-xs text-[13px] leading-relaxed text-[#6b5e4e] sm:text-[14px]">
              Import clients, emails, phone numbers, appointments, services, sales, visit cadence, and spend history.
            </p>
          </div>
        </div>
      </section>

      {/* 3 · HOW IT WORKS */}
      <section className="bg-[#faf6f2] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className={eyebrow}>How it works</p>
            <h2 className={h2}>From data to revenue in four simple steps.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <p className="mt-2 text-[13px] leading-relaxed text-[#6b5e4e]">{stepBody}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · FREE SCAN / PAID ACTIVATION */}
      <section id="free-scan" className="scroll-mt-16 bg-white px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="lg:flex lg:gap-10">

            {/* Left — cards */}
            <div className="flex-1">
              <p className={eyebrowRose}>Free to see · paid to activate</p>
              <h2 className={h2}>
                Your free scan reveals<br className="hidden sm:block" /> 3 opportunities.
              </h2>
              <p className={`${body} mt-3 max-w-lg`}>
                The free scan shows you what's possible. Activate with VMB Pro to turn insights into action.
              </p>

              <div className="mt-7 space-y-4">
                {OPPORTUNITIES.map((opp) => (
                  <div
                    key={opp.id}
                    className="rounded-2xl border border-[#ede4df] bg-[#faf6f2] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a7f77]">
                          Opportunity {opp.n}
                        </p>
                        <p className="mt-1.5 text-[15px] font-semibold text-[#1a1412]">{opp.title}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-[#6b5e4e]">{opp.body}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#8a7f77]">
                            {opp.revenueLabel}
                          </span>
                          <span className="text-[14px] font-bold text-[#b88f45]">{opp.revenue}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#ede4df] bg-white py-2.5 text-[12px] font-semibold text-[#9a8f86] opacity-70"
                    >
                      <Lock className="h-3 w-3" strokeWidth={2} />
                      {opp.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — CTA panel */}
            <div className="mt-10 lg:mt-0 lg:w-[260px] lg:shrink-0 lg:pt-16">
              <div className="rounded-2xl border border-[#f0c8d0] bg-[#fceef2] p-5">
                <p className="font-studio-serif text-[17px] font-medium leading-snug text-[#1a1412]">
                  See what's hidden in your data today.
                </p>
                <ul className="mt-4 space-y-2.5">
                  {TRUST_BULLETS.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-[13px] text-[#4a3e38]">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#c4506e]" strokeWidth={2.5} />
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={goRegister}
                  className="mt-5 w-full rounded-full bg-[#c4506e] py-3 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(196,80,110,0.28)] transition hover:bg-[#b0425e]"
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

      {/* 5 · WHY ANALYTICS MATTER */}
      <section className="bg-[#faf6f2] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className={eyebrow}>Why analytics matter</p>
            <h2 className={h2}>
              The money isn't just in new clients —<br className="hidden sm:block" /> it's in the ones you already have.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {METRICS.map((m) => (
              <div
                key={m.stat}
                className="rounded-2xl border border-[#ede4df] bg-white p-4 text-center shadow-[0_1px_4px_rgba(26,20,18,0.05)]"
              >
                <p className="font-studio-serif text-[1.7rem] font-medium leading-none text-[#c4506e] sm:text-[2rem]">
                  {m.stat}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-[#6b5e4e]">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · TAIKOS ACTIVATION */}
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl lg:flex lg:items-start lg:gap-14">

          {/* Left — copy */}
          <div className="flex-1">
            <p className={eyebrow}>TaikOS turns insights into action</p>
            <h2 className={h2}>Analytics is just the beginning.</h2>
            <p className={`${body} mt-4 max-w-md`}>
              TaikOS activates every opportunity with automated campaigns, personalized outreach, and private client-network experiences.
            </p>
            <ul className="mt-6 space-y-3">
              {TAIKOS_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[14px] text-[#4a3e38] sm:text-[15px]">
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
              className="mt-8 rounded-full bg-[#c4506e] px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(196,80,110,0.25)] transition hover:bg-[#b0425e] sm:text-[15px]"
            >
              Activate My Salon
            </button>
          </div>

          {/* Right — Campaign Builder mockup */}
          <div className="mt-10 lg:mt-0 lg:w-[320px] lg:shrink-0">
            <div className="rounded-2xl border border-[#ede4df] bg-[#faf6f2] p-4 shadow-[0_4px_24px_rgba(26,20,18,0.07)]">
              {/* Card header */}
              <div className="flex items-center justify-between rounded-xl border border-[#ede4df] bg-white px-4 py-3">
                <p className="text-[12px] font-semibold text-[#1a1412]">Campaign Builder</p>
                <span className="rounded-full border border-[#d4b87a]/50 bg-[#fdf5e4] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8a6a20]">
                  tAIkOS
                </span>
              </div>
              {/* Campaign rows */}
              <div className="mt-2 space-y-1.5">
                {CAMPAIGNS.map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center justify-between rounded-xl border border-[#ede4df] bg-white px-3.5 py-3"
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
      <section className="bg-[#faf6f2] px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#ede4df] bg-white">
            <Lock className="h-4 w-4 text-[#8a7f77]" strokeWidth={1.8} />
          </div>
          <p className="text-[14px] leading-relaxed text-[#6b5e4e] sm:text-[15px]">
            Your data is secure, private, and never sold. You own your relationships — VMB helps you grow them.
          </p>
        </div>
      </section>
    </>
  );
}
