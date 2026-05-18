import React, { useCallback, useState } from "react";
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
// Note: Megaphone still used in HOW_STEPS step 04

// ─── static data ──────────────────────────────────────────────────────────────

const RELATIONSHIP_TAGS = [
  "Loyal regulars",
  "Bridal groups",
  "Birthday clients",
  "Best friends",
  "Longtime clients",
  "Women who refer others",
  "Mothers & daughters",
  "Wedding parties",
  "Self-care regulars",
  "Holiday gift clients",
];

const OPPORTUNITY_TAGS = [
  "Hidden referral circles",
  "Dormant loyal clients",
  "Prepaid gift opportunities",
  "Bridal group networks",
  "VIP retention risks",
  "High-trust repeat clients",
  "Seasonal spending patterns",
  "Best-friend booking behavior",
];

const INSIGHT_CARDS = [
  {
    id: "dormant",
    stat: "38",
    label: "loyal clients haven't booked in 60+ days",
    potential: "Potential recovery: $11,200",
  },
  {
    id: "circles",
    stat: "11",
    label: "bridal & friend circles identified",
    potential: "Potential: Private invite campaign",
  },
  {
    id: "gifts",
    stat: "26",
    label: "giftable moments detected",
    potential: "Potential: Birthday + best-friend offers",
  },
  {
    id: "vip",
    stat: "14",
    label: "VIP repeat clients identified",
    potential: "Potential: Exclusive prepaid access",
  },
];

const HIDDEN_REVENUE_BULLETS = [
  "Hidden referral circles",
  "Loyal clients who stopped booking",
  "Bridal & best-friend networks",
  "VIP repeat spending patterns",
  "Giftable service moments",
  "Prepaid opportunity detection",
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

const CLOSE_BULLETS = [
  "Hidden revenue discovery",
  "Private client circles",
  "Gifting campaigns",
  "Trusted referrals",
  "VIP experiences",
  "Client retention",
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

  const [form, setForm] = useState({ firstName: "", salonName: "", email: "", instagram: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleForm = useCallback((e) => {
    e.preventDefault();
    setSubmitted(true);
  }, []);

  return (
    <>
      {/* 1 · HERO */}
      <SalonHero />

      {/* 2 · RELATIONSHIPS + OPPORTUNITIES — 3-column container */}
      <section className="bg-[#faf6f2] px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="overflow-hidden rounded-2xl border border-[#ede4df] bg-white shadow-[0_2px_16px_rgba(26,20,18,0.06)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_36px_1fr_1.3fr]">

              {/* Col 1 — Trust / Relationships */}
              <div className="flex flex-col border-b border-[#ede4df] p-5 sm:p-6 lg:border-b-0 lg:border-r">
                <div className="flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#8a7f77]">
                    Women you already know
                  </p>
                  <h2 className="font-studio-serif mt-2.5 text-[1.15rem] font-medium leading-[1.2] tracking-tight text-[#1a1412]">
                    The Strongest Salon Growth Travels Through Trusted Relationships.
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {RELATIONSHIP_TAGS.map((tag) => (
                      <span key={tag} className="rounded-md bg-[#f8f3ef] px-2.5 py-1.5 text-[11px] font-medium text-[#4a3e38]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 border-t border-[#f0ebe6] pt-3 text-center">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#b88f45]">Trust</span>
                </div>
              </div>

              {/* Connector — desktop only */}
              <div className="hidden lg:flex lg:flex-col lg:items-center lg:border-r lg:border-[#ede4df]">
                <div className="flex flex-1 items-center justify-center">
                  <div className="h-full w-px bg-gradient-to-b from-[#f5f0ec] via-[#e8ddd8] to-[#f5f0ec]" />
                </div>
                <div className="w-full shrink-0 border-t border-[#f0ebe6] py-3 text-center">
                  <span className="text-[11px] leading-none text-[#d4b8c0]">→</span>
                </div>
              </div>

              {/* Col 2 — Opportunities / What VMB reveals */}
              <div className="flex flex-col border-b border-[#ede4df] p-5 sm:p-6 lg:border-b-0 lg:border-r">
                <div className="flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#c4506e]">
                    What VMB reveals
                  </p>
                  <h3 className="font-studio-serif mt-2.5 text-[1.05rem] font-medium leading-[1.25] tracking-tight text-[#1a1412]">
                    What Traditional Salon Software Never Shows You
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {OPPORTUNITY_TAGS.map((tag) => (
                      <span key={tag} className="rounded-md bg-[#fdf0f4] px-2.5 py-1.5 text-[11px] font-medium text-[#7a3e52]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 border-t border-[#f0ebe6] pt-3 text-center">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#c4506e]">Opportunities</span>
                </div>
              </div>

              {/* Col 3 — Revenue Found / Insight cards */}
              <div className="flex flex-col p-5 sm:p-6">
                <div className="flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-[#8a7f77]">
                    Opportunities found
                  </p>
                  <h3 className="font-studio-serif mt-2.5 text-[1.05rem] font-medium leading-[1.25] tracking-tight text-[#1a1412]">
                    VMB Finds The Revenue Opportunities Salon Booking Software Misses.
                  </h3>
                  <div className="mt-3 space-y-1.5">
                    {INSIGHT_CARDS.map((card) => (
                      <div key={card.id} className="rounded-lg bg-[#faf6f2] px-3 py-2.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-studio-serif text-[1.2rem] font-medium leading-none text-[#c4506e]">
                            {card.stat}
                          </span>
                          <span className="text-[12px] leading-snug text-[#4a3e38]">{card.label}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] font-medium text-[#b88f45]">{card.potential}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 border-t border-[#f0ebe6] pt-3 text-center">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#b88f45]">Revenue Found</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* 3 · HIDDEN REVENUE VIDEO */}
      <section className="bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">

            {/* Left: copy */}
            <div className="flex-1">
              <p className={eyebrow}>Hidden revenue inside your client base</p>
              <h2 className="font-studio-serif mt-3 text-[1.75rem] font-medium leading-[1.1] tracking-tight text-[#1a1412] sm:text-[2.1rem] lg:text-[2.3rem]">
                The Revenue You're Looking For May Already Be Sitting In Your Chair.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#5c4d45] sm:text-[16px]">
                VMB analyzes your existing salon data to uncover hidden referral networks, dormant loyal clients, gifting opportunities, bridal groups, VIP retention risks, and revenue opportunities already inside your business.
              </p>
              <ul className="mt-5 space-y-2">
                {HIDDEN_REVENUE_BULLETS.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-[14px] text-[#4a3e38] sm:text-[15px]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c4506e]" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goRegister}
                className="mt-6 rounded-full bg-[#c4506e] px-7 py-3 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(196,80,110,0.25)] transition hover:bg-[#b0425e] active:scale-[0.99] sm:text-[15px]"
              >
                Analyze My Salon
              </button>
              <p className="mt-3 text-[11px] leading-relaxed text-[#b8b0ab]">
                Works with GlossGenius, Vagaro, Square, Fresha, Booksy, Boulevard, Mangomint, and CSV exports.
              </p>
            </div>

            {/* Right: video */}
            <div className="w-full lg:w-[48%] lg:shrink-0">
              <div className="overflow-hidden rounded-2xl border border-[#ede4df] shadow-[0_6px_32px_rgba(26,20,18,0.10)]">
                <video
                  controls
                  playsInline
                  className="w-full"
                >
                  <source src="/VMB_ Trust 3.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

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
        <div className="mx-auto max-w-[1180px]">

          {/* Title area */}
          <div className="mb-7">
            <p className={eyebrowRose}>Free to see · paid to activate</p>
            <h2 className={h2}>
              Your free scan reveals 3 opportunities.
            </h2>
            <p className={`${body} mt-3 max-w-2xl`}>
              The free scan shows you what's possible. Activate with VMB Pro to turn insights into action.
            </p>
          </div>

          {/* 4-column grid — 3 opportunity cards + CTA panel */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {OPPORTUNITIES.map((opp) => (
              <div
                key={opp.id}
                className="flex flex-col rounded-2xl border border-[#ede4df] bg-[#faf6f2] p-5"
              >
                <div className="flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a7f77]">
                    Opportunity {opp.n}
                  </p>
                  <p className="mt-1.5 text-[15px] font-semibold text-[#1a1412]">{opp.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#6b5e4e]">{opp.body}</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#8a7f77]">
                    Potential Revenue
                  </span>
                  <span className="text-[14px] font-bold text-[#b88f45]">{opp.revenue}</span>
                </div>
                <button
                  type="button"
                  disabled
                  className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#ede4df] bg-white py-2.5 text-[12px] font-semibold text-[#9a8f86] opacity-70"
                >
                  <Lock className="h-3 w-3" strokeWidth={2} />
                  {opp.cta}
                </button>
              </div>
            ))}

            {/* CTA panel — 4th column */}
            <div className="flex flex-col rounded-2xl border border-[#f0c8d0] bg-[#fceef2] p-5">
              <div className="flex-1">
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
              </div>
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
      </section>

      {/* 6 · EMOTIONAL CLOSE + INVITATION */}
      <section className="bg-[#faf6f2] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="overflow-hidden rounded-2xl border border-[#ede4df] bg-white shadow-[0_4px_24px_rgba(26,20,18,0.08)] lg:grid lg:grid-cols-[1fr_420px]">

            {/* Left — emotional copy + form */}
            <div className="border-b border-[#ede4df] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b88f45]">
                The future of salon growth
              </p>
              <h2 className="font-studio-serif mt-3 text-[1.65rem] font-medium leading-[1.1] tracking-tight text-[#1a1412] sm:text-[1.9rem] lg:text-[2.1rem]">
                The Strongest Salon Growth Never Feels Like Marketing.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5c4d45] sm:text-[16px]">
                VMB helps salons grow through trust, referrals, gifting, VIP experiences, and private client relationships already inside their business.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2">
                {CLOSE_BULLETS.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-[13px] text-[#4a3e38]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c4506e]" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>

              {/* Invitation form */}
              <div className="mt-6 rounded-xl border border-[#f0c8d0] bg-[#fceef2]/50 p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c4506e]">
                  Join the first wave of VMB salons
                </p>
                <h3 className="font-studio-serif mt-1.5 text-[1.2rem] font-medium leading-[1.2] tracking-tight text-[#1a1412]">
                  Request Your Invitation
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#6b5e4e]">
                  Be first to receive launch updates, private access invitations, and early VMB Salon opportunities.
                </p>

                {submitted ? (
                  <div className="mt-4 rounded-xl border border-[#f0c8d0] bg-white px-4 py-5 text-center">
                    <p className="font-studio-serif text-[1.05rem] font-medium text-[#1a1412]">
                      You're on the list.
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#6b5e4e]">
                      We'll be in touch with your private invitation when we're ready.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleForm} className="mt-4 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#8a7f77]">First Name</label>
                        <input type="text" required placeholder="Your first name" value={form.firstName}
                          onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                          className="w-full rounded-xl border border-[#ede4df] bg-white px-3 py-2 text-[13px] text-[#1a1412] placeholder:text-[#c0b8b4] focus:border-[#c4506e] focus:outline-none focus:ring-1 focus:ring-[#c4506e]/30" />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#8a7f77]">Salon Name</label>
                        <input type="text" required placeholder="Your salon name" value={form.salonName}
                          onChange={(e) => setForm((p) => ({ ...p, salonName: e.target.value }))}
                          className="w-full rounded-xl border border-[#ede4df] bg-white px-3 py-2 text-[13px] text-[#1a1412] placeholder:text-[#c0b8b4] focus:border-[#c4506e] focus:outline-none focus:ring-1 focus:ring-[#c4506e]/30" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#8a7f77]">Email Address</label>
                        <input type="email" required placeholder="you@yoursalon.com" value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          className="w-full rounded-xl border border-[#ede4df] bg-white px-3 py-2 text-[13px] text-[#1a1412] placeholder:text-[#c0b8b4] focus:border-[#c4506e] focus:outline-none focus:ring-1 focus:ring-[#c4506e]/30" />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#8a7f77]">
                          Instagram <span className="font-normal normal-case tracking-normal text-[#b0a8a4]">(optional)</span>
                        </label>
                        <input type="text" placeholder="@yoursalon" value={form.instagram}
                          onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
                          className="w-full rounded-xl border border-[#ede4df] bg-white px-3 py-2 text-[13px] text-[#1a1412] placeholder:text-[#c0b8b4] focus:border-[#c4506e] focus:outline-none focus:ring-1 focus:ring-[#c4506e]/30" />
                      </div>
                    </div>
                    <button type="submit"
                      className="w-full rounded-full bg-[#c4506e] py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(196,80,110,0.28)] transition hover:bg-[#b0425e] active:scale-[0.99]">
                      Request Invitation
                    </button>
                    <p className="text-center text-[10px] leading-relaxed text-[#8a7f77]">
                      No spam. Just launch updates, early access, and private invitations.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Right — video, fills full column height */}
            <div className="hidden lg:block">
              <video
                controls
                playsInline
                className="h-full w-full object-cover"
              >
                <source src="/VMB_ Trust 4.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Mobile — video below content */}
            <div className="lg:hidden">
              <video
                controls
                playsInline
                className="w-full"
              >
                <source src="/VMB_ Trust 4.mp4" type="video/mp4" />
              </video>
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
