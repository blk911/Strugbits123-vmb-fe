import React from "react";
import heroBg from "../../../assets/salon_hero_bg.png";
import PrimaryButton from "../../../components/common/site/PrimaryButton";
import { useNavigate } from "react-router-dom";

export default function WhyVMBHero() {
  const navigate = useNavigate();

  return (
    <section className="w-full px-4 ">
      <div
        className="
          w-full max-w-[1280px]
          mx-auto
          rounded-[20px]
          overflow-hidden
          relative
          min-h-[420px] lg:min-h-[543px]
          flex items-start
        "
      >
        <img
          src={heroBg}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1] "
        />
        <div
          className="
            backdrop-blur-sm
            bg-white/80
            border border-vmb-primary/10
            rounded-[20px]
            p-[20px] sm:p-[30px]
            flex flex-col gap-[20px]

            mt-[30px] sm:mt-[50px] lg:mt-[73px]
            ml-[16px] sm:ml-[30px] lg:ml-[37px]

            max-w-[562px]
          "
        >
          <div>
            <h1 className="font-lato font-bold text-[30px] sm:text-[38px] lg:text-[45px] text-vmb-primary">
              Why VMB?
            </h1>

            <h2 className="font-lato font-semibold text-[22px] sm:text-[28px] lg:text-[35px] text-vmb-primary leading-snug">
              Fewer Cancellations. Loyal Clients. Long-term Stability
            </h2>
          </div>

          <p className="font-inter text-[15px] sm:text-[17px] lg:text-[18px] text-vmb-text-main leading-relaxed">
            VMB salons experience fewer cancellations, stronger revenue per
            chair, and clients who actively promote your services. Thoughtful
            incentives turn guests into loyal ambassadors — driving steady
            growth with less risk.
          </p>

          <div>
            <PrimaryButton
              text="Be Part of Something More Personal"
              variant="pill"
              onClick={() => navigate("/register")}
              className="px-5 py-2"
              authMode={"signup"}
              authType={"salon"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
