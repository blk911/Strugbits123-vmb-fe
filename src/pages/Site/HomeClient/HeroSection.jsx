import React from "react";
import pic4 from "../../../assets/client-hero2.png";
import Button from "../../../components/common/site/Button";

function HeroSection() {
  return (
    <section className="relative w-full min-h-[620px] sm:min-h-[660px] overflow-hidden">
      <div className="absolute inset-y-[50px] inset-x-[75px] rounded-2xl overflow-hidden">
        <img
          src={pic4}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 h-full vmb-container flex items-center py-8 sm:py-10">
          <div className="vmb-card max-w-xl p-8 sm:p-10">
            <h2 className="vmb-h1 vmb-title text-xl sm:text-2xl md:text-3xl">
              Why VMB? Priority Access. Exclusive Perks. Insider Benefits.
            </h2>
            <h3 className="mt-3 leading-tight">
              <span className="block text-lg sm:text-xl font-semibold tracking-tight vmb-title">
                VMB rewards loyalty with priority booking, referral rewards, and member-only benefits.
              </span>
            </h3>
            <p className="mt-4 text-base sm:text-lg leading-relaxed vmb-muted">
              VMB members secure their preferred appointments, unlock service credits and upgrades for referrals, and strengthen their connection with the salons they love. Thoughtful incentives turn loyal clients into insiders — delivering more value with every visit.
            </p>
            <Button
              text={"Join VMB & Bring a Friend"}
              navigateTo={"register"}
              classes="vmb-btn-primary mt-6 !border-0 !pl-6 !pr-6 !py-3 after:!hidden [&>span:last-child]:hidden"
              textclass="!text-white !text-sm sm:!text-base"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
