import React, { useCallback } from "react";
import heroBackdrop from "../../../assets/salon_hero_bg.png";
import HeroOverlay from "./HeroOverlay";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";

const SCAN_STATS = [
  { label: "Clients imported", value: "847", done: true },
  { label: "Appointments analyzed", value: "3,241", done: true },
  { label: "Revenue patterns detected", value: "", done: true },
  { label: "Opportunities found", value: "3", highlight: true },
];

const OPPORTUNITY_PILLS = [
  "38 dormant high-value clients",
  "Referral circles identified",
  "Giftable moments mapped",
];

export default function SalonHero() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goRegister = useCallback(() => {
    dispatch(setAuthType("salon"));
    dispatch(setAuthMode("signup"));
    navigate("/register");
  }, [dispatch, navigate]);

  const scrollToScan = useCallback(() => {
    document.getElementById("free-scan")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#0a0f18]">
      <style>{`
        @keyframes salonHeroKen {
          0%   { transform: scale(1)    translate(0,0); }
          100% { transform: scale(1.07) translate(-1.5%,0.8%); }
        }
        .salon-hero-ken { animation: salonHeroKen 24s ease-in-out infinite alternate; }
        @keyframes scanPulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1; }
        }
        .scan-pulse { animation: scanPulse 2.6s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBackdrop}
          alt=""
          className="salon-hero-ken h-full w-full object-cover object-[center_28%]"
        />
        <HeroOverlay />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0f18]/85 via-[#0a0f18]/50 to-[#0a0f18]/15"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] mx-auto flex max-w-[1440px] flex-col items-start px-5 pb-16 pt-14 sm:px-8 sm:pb-18 sm:pt-16 lg:flex-row lg:items-center lg:gap-10 lg:px-12 lg:pb-20 lg:pt-18">

        {/* Left — copy */}
        <div className="flex min-w-0 flex-1 flex-col justify-center lg:pr-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-[#F7E7CE]/55 sm:text-[11px]">
            Salon Growth Engine
          </p>
          <h1 className="font-studio-serif mt-3 text-[2.05rem] font-medium leading-[1.08] tracking-tight text-[#faf6ef] sm:mt-4 sm:text-[2.55rem] lg:text-[3.05rem] lg:leading-[1.04]">
            Your Client List<br className="hidden sm:block" /> Is Worth More<br className="hidden sm:block" /> Than You Think.
          </h1>
          <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-[#ccc7be] sm:text-[16px] lg:text-[17px]">
            VMB connects to your existing salon software, analyzes your client and appointment history, and reveals hidden revenue opportunities already inside your business.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={goRegister}
              className="group relative overflow-hidden rounded-full bg-[#F7E7CE] px-7 py-3 text-[14px] font-semibold tracking-wide text-[#1a1520] shadow-[0_8px_32px_-8px_rgba(247,231,206,0.45)] transition duration-300 hover:brightness-[1.04] active:scale-[0.99] sm:text-[15px]"
            >
              <span className="relative z-[1]">Analyze My Salon</span>
              <span
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100"
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={scrollToScan}
              className="rounded-full border border-white/[0.18] bg-[#1a2235]/55 px-7 py-3 text-[14px] font-semibold tracking-wide text-[#f8f4eb] backdrop-blur-md transition duration-300 hover:border-[#F7E7CE]/35 hover:bg-[#232f4a]/55 sm:text-[15px]"
            >
              See Sample Opportunities
            </button>
          </div>
        </div>

        {/* Right — Intelligence Scan mock card */}
        <div className="mt-10 w-full max-w-[370px] shrink-0 self-start sm:self-auto lg:mt-0 lg:w-[370px]">
          <div className="rounded-2xl border border-white/[0.10] bg-[#0d1628]/82 p-5 shadow-[0_28px_64px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-6">

            {/* Card header */}
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#F7E7CE]/55">
                Salon Intelligence Scan
              </p>
              <span className="scan-pulse flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            </div>

            {/* Stats */}
            <div className="mt-4 space-y-2">
              {SCAN_STATS.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 ${
                    s.highlight
                      ? "border border-[#b88f45]/40 bg-[#b88f45]/10"
                      : "border border-white/[0.07] bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[11px] leading-none ${
                        s.highlight ? "text-[#F7E7CE]" : "text-emerald-400"
                      }`}
                    >
                      {s.highlight ? "★" : "✓"}
                    </span>
                    <span
                      className={`text-[12px] font-medium ${
                        s.highlight ? "text-[#F7E7CE]" : "text-[#ccc7be]"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {s.value && (
                    <span
                      className={`text-[13px] font-bold tabular-nums ${
                        s.highlight ? "text-[#F7E7CE]" : "text-white"
                      }`}
                    >
                      {s.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Opportunities */}
            <div className="mt-4 border-t border-white/[0.08] pt-4">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#F7E7CE]/45">
                Top opportunities detected
              </p>
              <div className="space-y-1.5">
                {OPPORTUNITY_PILLS.map((pill, i) => (
                  <div
                    key={pill}
                    className="flex items-center gap-2.5 rounded-lg border border-[#b88f45]/20 bg-[#b88f45]/[0.07] px-3 py-2"
                  >
                    <span className="text-[10px] font-bold tabular-nums text-[#b88f45]">
                      {i + 1}
                    </span>
                    <span className="text-[11px] text-[#ccc7be]">{pill}</span>
                    <span className="ml-auto shrink-0 rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white/35">
                      Locked
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-center text-[9px] text-[#8a9bb8]/65">
              Free scan · subscribe to unlock campaigns
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
