import React from "react";
import heroBg from "../../../assets/salon_hero_bg.png";
import PrimaryButton from "../../../components/common/site/PrimaryButton";
import { useNavigate } from "react-router-dom";

export default function WhyVMBHero() {
  const navigate = useNavigate();

  return (
    <section className="w-full ">
      <div
        className="
          w-full max-w-[1280px]
          mx-auto
          rounded-[20px]
          overflow-hidden
          relative
          min-h-[380px] sm:min-h-[420px] lg:min-h-[543px]
          flex items-center
        "
      >
        <img
          src={heroBg}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />

        <div
          className="
            backdrop-blur-sm
            bg-white/85
            border border-vmb-primary/10
            rounded-[16px] sm:rounded-[20px]
            p-4 sm:p-6 lg:p-[30px]
            flex flex-col gap-[20px]
            mx-2 sm:mx-6 lg:ml-[37px]
            w-full
            max-w-[562px]
          "
        >
          <div>
            <h1 className="font-lato font-bold text-[24px] sm:text-[34px] lg:text-[45px] text-vmb-primary">
              Why VMB?
            </h1>

            <h2 className="font-lato font-semibold text-[18px] sm:text-[24px] lg:text-[35px] text-vmb-primary leading-snug">
              Fewer Cancellations. Loyal Clients. Long-term Stability
            </h2>
          </div>

          <p className="font-inter text-[14px] sm:text-[16px] lg:text-[18px] text-vmb-text-main leading-relaxed">
            VMB salons experience fewer cancellations, stronger revenue per
            chair, and clients who actively prompt your services. Thoughtful
            incentives turn guests into loyal ambassadors - driving steady
            growth with less risk.
          </p>

          <div className="w-full sm:w-auto">
            <PrimaryButton
              text="Be Part of Something More Personal"
              variant="pill"
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-5 py-2 text-[12px] sm:text-[16px]"
              authMode={"signup"}
              authType={"salon"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
