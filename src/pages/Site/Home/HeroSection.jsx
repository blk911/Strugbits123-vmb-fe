import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/common/site/PrimaryButton";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        w-full max-w-[1280px]
        mx-auto
        px-3 sm:px-6 md:px-8
        py-6 sm:py-8
        min-h-[420px] sm:min-h-[480px] md:min-h-[543px]
        rounded-2xl
        bg-cover bg-center
      "
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <div
        className="
          w-full md:max-w-[610px]
          bg-white/80 backdrop-blur-sm
          rounded-xl sm:rounded-2xl
          p-4 sm:p-6 md:p-[30px]
          flex flex-col gap-4 sm:gap-5
        "
      >
        <div className="flex flex-col gap-2 sm:gap-[10px]">
          <h1
            className="
            font-lato font-bold
            text-2xl sm:text-3xl md:text-[45px]
            text-vmb-primary
            leading-tight
          "
          >
            Why VMB?
          </h1>

          <h2
            className="
            font-lato font-semibold
            text-lg sm:text-2xl md:text-[35px]
            text-vmb-primary
            leading-snug
          "
          >
            The Salons You Trust. The People You Trust. Connected.
          </h2>
        </div>

        <div className="flex flex-col gap-2 sm:gap-[10px]">
          <p
            className="
            font-lato font-bold
            text-sm sm:text-base md:text-[18px]
            text-vmb-secondary
          "
          >
            Your favorite nail tech. Your hair stylist. Your esthetician. You
            already move through a trusted circle.
          </p>

          <p
            className="
            font-lato
            text-sm sm:text-base md:text-[18px]
            text-vmb-text-main
            leading-relaxed
          "
          >
            VMB turns your circle into a shared experience — where you connect,
            gift, and bring each other in.
          </p>
          <p
            className="
            font-lato
            text-sm sm:text-base md:text-[18px]
            text-vmb-text-main
            leading-relaxed
          "
          >
            VMB turns what you already do into something real — shared
            experiences, trusted connections, and better outcomes...finally!
            Sharing what you love actually pays off.
          </p>
        </div>

        <PrimaryButton
          text="It's Time — Bring Your Circle In"
          variant="pill"
          onClick={() => navigate("/register")}
          className="w-fit p-[5px] pl-[15px] "
          authMode={"signup"}
          authType={"customer"}
        />
      </div>
    </div>
  );
};

export default HeroSection;
