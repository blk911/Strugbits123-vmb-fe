import React, { useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";

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
    <section className="bg-[#faf6f2] px-5 pb-10 pt-9 sm:px-8 sm:pb-11 sm:pt-10 lg:px-12 lg:pb-12 lg:pt-10">
      <div className="mx-auto max-w-[1100px] md:grid md:grid-cols-[1fr_300px] md:items-center md:gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">

        {/* ── Left: copy ── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b88f45]">
            Salon Growth Engine
          </p>

          <h1 className="font-studio-serif mt-3 text-[2rem] font-medium leading-[1.1] tracking-tight text-[#1a1412] sm:text-[2.4rem] lg:text-[2.75rem]">
            Your Most Valuable Assets Are:<br />
            <em className="not-italic text-[#c4506e]">Client Trust. Client Loyalty.</em>
          </h1>

          <p className="mt-4 text-[15px] leading-relaxed text-[#5c4d45] sm:text-[16px] lg:text-[17px]">
            Behind every appointment is a relationship, a recommendation, a birthday, a wedding, a friendship, a life event. VMB helps you grow from the people already connected to your business.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={goRegister}
              className="rounded-full bg-[#c4506e] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(196,80,110,0.28)] transition hover:bg-[#b0425e] active:scale-[0.99] sm:px-7 sm:py-3.5 sm:text-[15px]"
            >
              Analyze My Salon
            </button>
            <button
              type="button"
              onClick={scrollToScan}
              className="rounded-full border border-[#1a1412]/22 bg-white px-6 py-3 text-[14px] font-semibold text-[#1a1412] transition hover:border-[#1a1412]/40 hover:bg-[#f8f4f0] sm:px-7 sm:py-3.5 sm:text-[15px]"
            >
              See Sample Opportunities
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#d4a078", "#c48a60", "#e8c4a4", "#ba7d55", "#d8b090"].map((c, i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded-full border-2 border-[#faf6f2]"
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

        {/* ── Right: image ── */}
        <div className="mt-7 md:mt-0">
          <div
            className="relative overflow-hidden rounded-2xl shadow-[0_6px_32px_rgba(26,20,18,0.12)]"
            style={{ height: "clamp(220px, 28vw, 360px)" }}
          >
            <video
              controls
              loop
              playsInline
              className="h-full w-full object-cover object-top"
            >
              <source src="/VMB_ Trust 2.mp4" type="video/mp4" />
            </video>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1412]/15 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </div>

      </div>
    </section>
  );
}
