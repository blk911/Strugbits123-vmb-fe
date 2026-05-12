import React, { useCallback } from "react";
import heroBackdrop from "../../../assets/salon_hero_bg.png";
import stylistStill from "../../../assets/brand/benefits/girls-night.jpg";
import HeroOverlay from "./HeroOverlay";
import FloatingTrustPill from "./FloatingTrustPill";
import AvatarStack from "./AvatarStack";
import HeroActions from "./HeroActions";

export default function SalonHero() {
  const scrollToId = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#0a0f18]">
      <style>{`
        @keyframes salonHeroKen {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.07) translate(-1.5%, 0.8%); }
        }
        @keyframes salonHeroDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(10px, -18px) scale(1.05); opacity: 0.55; }
        }
        @keyframes salonHeroDrift2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.25; }
          50% { transform: translate(-16px, 12px); opacity: 0.45; }
        }
        @keyframes salonHeroShimmer {
          0% { opacity: 0.15; transform: translateX(-20%); }
          100% { opacity: 0.35; transform: translateX(20%); }
        }
        .salon-hero-ken {
          animation: salonHeroKen 24s ease-in-out infinite alternate;
        }
        .salon-hero-drift {
          animation: salonHeroDrift 14s ease-in-out infinite;
        }
        .salon-hero-drift-2 {
          animation: salonHeroDrift2 18s ease-in-out infinite;
        }
        .salon-hero-shimmer {
          animation: salonHeroShimmer 12s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Background layer */}
      <div className="absolute inset-0">
        <img
          src={heroBackdrop}
          alt=""
          className="salon-hero-ken h-full w-full object-cover object-[center_28%]"
        />
        <HeroOverlay />
        {/* Soft light haze — cinematic, not neon */}
        <div
          className="salon-hero-shimmer pointer-events-none absolute -left-1/4 top-0 h-1/2 w-[70%] bg-gradient-to-r from-transparent via-[#F7E7CE]/10 to-transparent blur-3xl"
          aria-hidden
        />
        <div
          className="salon-hero-drift pointer-events-none absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-[#F7E7CE]/8 blur-[100px]"
          aria-hidden
        />
        <div
          className="salon-hero-drift-2 pointer-events-none absolute bottom-1/4 left-1/3 h-48 w-48 rounded-full bg-[#6b8cae]/15 blur-[80px]"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] mx-auto flex min-h-[78vh] max-w-[1440px] flex-col px-5 pb-16 pt-20 sm:min-h-[82vh] sm:px-8 sm:pb-20 sm:pt-24 lg:min-h-[88vh] lg:flex-row lg:items-center lg:gap-4 lg:px-12 lg:pb-24 lg:pt-28">
        {/* Left — primary narrative */}
        <div className="flex min-w-0 flex-1 flex-col justify-center lg:flex-[1.05] lg:pr-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#F7E7CE]/55 sm:text-xs">
            Private Studio
          </p>
          <h1 className="font-studio-serif mt-5 text-[2.35rem] font-medium leading-[1.08] tracking-tight text-[#faf6ef] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]">
            The Private Studio
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#d8d2c8] sm:text-lg">
            Luxury nail experiences for trusted clients and curated referrals.
          </p>
          <p className="mt-3 text-sm font-medium tracking-wide text-[#F7E7CE]/50">
            Cherry Creek · Invite-only access
          </p>

          <HeroActions
            className="mt-10"
            onSendGift={() => scrollToId("salon-gifts-invite")}
            onBookExperience={() => scrollToId("salon-book-experience")}
          />
        </div>

        {/* Right — trust & human presence (asymmetrical) */}
        <div className="relative mt-14 flex min-h-[320px] flex-1 justify-end lg:mt-0 lg:min-h-[420px] lg:flex-[0.95]">
          {/* Stylist / lifestyle focal */}
          <div className="relative w-full max-w-[420px] lg:max-w-none">
            <div className="relative ml-auto aspect-[4/5] w-[88%] max-w-[380px] overflow-hidden rounded-[2rem] sm:w-[85%] sm:max-w-[400px] lg:mr-0 lg:w-full lg:max-w-[440px]">
              <img
                src={stylistStill}
                alt="Salon experience"
                className="h-full w-full object-cover transition duration-[2.2s] ease-out hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1525]/55 via-transparent to-[#0d1528]/20" />
            </div>

            {/* Floating trust — layered, not card grids */}
            <div className="absolute -left-2 top-[8%] z-[2] max-w-[240px] sm:left-0 lg:-left-6 lg:max-w-[260px]">
              <FloatingTrustPill className="salon-hero-drift shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]">
                Trusted by <span className="whitespace-nowrap font-semibold text-[#F7E7CE]">248 clients</span>
              </FloatingTrustPill>
            </div>
            <div className="absolute bottom-[18%] right-0 z-[2] max-w-[260px] sm:right-2 lg:-right-4 lg:bottom-[22%] lg:max-w-[280px]">
              <FloatingTrustPill className="salon-hero-drift-2 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]">
                <span className="text-[#F7E7CE]/90">12 invitations</span> sent
                this week
              </FloatingTrustPill>
            </div>
            <div className="absolute bottom-2 left-[6%] z-[2] sm:bottom-6 sm:left-[10%] lg:bottom-8">
              <FloatingTrustPill>
                <span className="text-[#F7E7CE]">VIP Bridal Circle</span> active
              </FloatingTrustPill>
            </div>

            <div className="absolute right-[4%] top-[40%] z-[2] hidden items-center gap-3 sm:flex lg:right-[6%]">
              <AvatarStack />
              <FloatingTrustPill className="!py-2 !text-xs">
                Invites circulating
              </FloatingTrustPill>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
