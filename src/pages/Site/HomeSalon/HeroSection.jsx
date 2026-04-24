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
          min-h-[420px] sm:min-h-[480px] lg:min-h-[560px]
          flex items-center
        "
      >
        <img
          src="/hero-bg2.jpg"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />

        <div
          className="
            backdrop-blur-sm
            bg-white/85
            border border-vmb-primary/10
            rounded-[16px] sm:rounded-[20px]
            p-4 sm:p-6 lg:py-[30px] lg:pl-[30px] lg:pr-[18px]
            flex flex-col gap-[20px]
            mx-2 sm:mx-6 lg:ml-[37px]
            w-full
            max-w-[700px]
          "
        >
          <div>
            <h1 className="font-lato font-bold text-[24px] sm:text-[34px] lg:text-[45px] text-vmb-primary">
              Why VMB?
            </h1>

            <h2 className="mt-2 font-lato font-semibold text-[18px] sm:text-[24px] lg:text-[35px] text-vmb-primary leading-snug">
              You Get Attention. We Turn It Into Cash.
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-inter text-[14px] sm:text-[16px] lg:text-[18px] text-vmb-primary/80 font-semibold leading-relaxed">
              You're already getting views. Likes. DMs. Most of it goes nowhere.
            </p>

            <p className="font-inter text-[14px] sm:text-[16px] lg:text-[18px] text-vmb-primary/80 leading-relaxed">
              VMB sits on top of your social and converts that attention into
              trusted clients who show up prepaid and join your exclusive client
              co-marketing network.
            </p>

            <p className="font-inter text-[14px] sm:text-[16px] lg:text-[18px] text-vmb-primary/80 leading-relaxed">
              No ads. No monthly fees. No disruption.
            </p>

            <p className="font-inter text-[14px] sm:text-[16px] lg:text-[18px] text-vmb-primary/80 leading-relaxed">
              Just turn it on and start converting.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <PrimaryButton
              text="Be Part of Something More Personal"
              variant="pill"
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto p-[5px] pl-[15px]  text-[12px] sm:text-[16px]"
              authMode={"signup"}
              authType={"salon"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
