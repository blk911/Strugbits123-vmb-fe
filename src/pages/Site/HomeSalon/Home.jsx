import LogoMarquee from "../../../components/common/site/Marquee";
import GiftsAndInvite from "./GiftsAndInvite";
import HeroSection from "./HeroSection";
import PlatformBenefits from "./PlatformBenefits";
import SalonChoice from "./SalonChoice";
import SalonExperience from "./SalonExperience";
import TopSalons from "./TopSalons";

function HomeSalon() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <LogoMarquee />
      <PlatformBenefits />
      <GiftsAndInvite />
      <SalonChoice />
      <SalonExperience />
      <TopSalons />
    </div>
  );
}

export default HomeSalon;
