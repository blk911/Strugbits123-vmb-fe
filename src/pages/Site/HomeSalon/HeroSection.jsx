import React from "react";
import pic4 from "../../../assets/pic-4.png";
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
            <h2 className="vmb-h1 vmb-title text-2xl sm:text-3xl md:text-4xl">
              Why VMB? Fewer Cancellations. Loyal Clients. Longterm stability
            </h2>
            <h3 className="mt-3 leading-tight">
              <span className="block text-lg sm:text-xl font-semibold tracking-tight vmb-title">
                Bookings are committed, clients become advocates.
              </span>
            </h3>
            <p className="mt-4 text-base sm:text-lg leading-relaxed vmb-muted">
              VMB salons experience fewer cancellations, stronger revenue per
              chair, and clients who actively promote your services. Thoughtful
              incentives turn guests into loyal ambassadors - driving steady
              growth with less risk.
            </p>
            <Button
              text={"Be Part of Something More Personal."}
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
