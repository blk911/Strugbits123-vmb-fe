import React, { useCallback } from "react";
import advocateImg from "../../../assets/brand/benefits/advocate.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";

const SCAN_STATS = [
  { label: "Clients imported",          value: "847",      highlight: false },
  { label: "Appointments analyzed",     value: "3,241",    highlight: false },
  { label: "Revenue patterns detected", value: "$128,760", highlight: false },
  { label: "Opportunities found",       value: "3",        highlight: true  },
];

const OPP_PILLS = [
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
    <section className="bg-[#faf6f2] px-5 pb-24 pt-12 sm:px-8 sm:pb-28 sm:pt-14 lg:px-12 lg:pb-32">
      <div className="mx-auto max-w-6xl lg:flex lg:items-start lg:gap-14">

        {/* ── Left copy ── */}
        <div className="flex-1 lg:pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b88f45]">
            Salon Growth Engine
          </p>

          <h1 className="font-studio-serif mt-3 text-[2.35rem] font-medium leading-[1.08] tracking-tight text-[#1a1412] sm:text-[2.85rem] lg:text-[3.25rem]">
            Your Client List<br />
            Is Worth More<br />
            Than You Think.
          </h1>

          <p className="mt-5 max-w-[500px] text-[16px] leading-relaxed text-[#5c4d45] sm:text-[17px]">
            VMB connects to your existing salon software, analyzes your client and appointment history, and reveals hidden revenue opportunities already inside your business.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={goRegister}
              className="rounded-full bg-[#c4506e] px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(196,80,110,0.28)] transition hover:bg-[#b0425e] active:scale-[0.99] sm:text-[15px]"
            >
              Analyze My Salon
            </button>
            <button
              type="button"
              onClick={scrollToScan}
              className="rounded-full border border-[#1a1412]/22 bg-white px-7 py-3.5 text-[14px] font-semibold text-[#1a1412] transition hover:border-[#1a1412]/40 hover:bg-[#f8f4f0] sm:text-[15px]"
            >
              See Sample Opportunities
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#d4a078", "#c48a60", "#e8c4a4", "#ba7d55", "#d8b090"].map((c, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-[#faf6f2]"
                  style={{ background: c }}
                  aria-hidden
                />
              ))}
            </div>
            <p className="text-[12px] leading-snug text-[#7a6b62]">
              Join <span className="font-semibold text-[#1a1412]">2,000+</span> salon owners growing with VMB
            </p>
          </div>
        </div>

        {/* ── Right: image + scan card ── */}
        <div className="mt-10 lg:mt-0 lg:w-[430px] lg:shrink-0">
          {/* Hero image */}
          <div className="relative h-[280px] overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(26,20,18,0.10)] sm:h-[320px] lg:h-[350px]">
            <img
              src={advocateImg}
              alt="Salon stylist with client"
              className="h-full w-full object-cover object-top"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1412]/20 via-transparent to-transparent"
              aria-hidden
            />
          </div>

          {/* Scan card — overlaps image bottom */}
          <div className="relative z-10 mx-3 -mt-20 rounded-2xl border border-[#ede4df] bg-white p-4 shadow-[0_8px_40px_rgba(26,20,18,0.13)] sm:mx-4 sm:p-5">
            {/* Card header */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1412]">
                Salon Intelligence Scan
              </p>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                Scan complete
              </span>
            </div>

            {/* Stats */}
            <div className="mt-3 space-y-1.5">
              {SCAN_STATS.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                    s.highlight
                      ? "border border-[#f0c8d0] bg-[#fceef2]"
                      : "bg-[#faf6f2]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] leading-none ${
                        s.highlight ? "text-[#c4506e]" : "text-emerald-500"
                      }`}
                    >
                      {s.highlight ? "★" : "✓"}
                    </span>
                    <span
                      className={`text-[12px] ${
                        s.highlight ? "font-semibold text-[#c4506e]" : "text-[#4a3e38]"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  <span
                    className={`text-[12px] font-bold tabular-nums ${
                      s.highlight ? "text-[#c4506e]" : "text-[#1a1412]"
                    }`}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Opportunities */}
            <div className="mt-3 border-t border-[#ede4df] pt-3">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8a7f77]">
                Top opportunities detected
              </p>
              <div className="space-y-1.5">
                {OPP_PILLS.map((pill, i) => (
                  <div
                    key={pill}
                    className="flex items-center justify-between rounded-lg border border-[#ede4df] bg-white px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tabular-nums text-[#b88f45]">
                        {i + 1}
                      </span>
                      <span className="text-[11px] text-[#4a3e38]">{pill}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#c4506e]">Preview</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-3 text-center text-[9px] text-[#8a7f77]">
              Free scan · Paid activation to launch campaigns
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
