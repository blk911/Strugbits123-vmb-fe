import LogoMarquee from "../../../components/common/site/Marquee";
import GiftsAndInvite from "./GiftsAndInvite";
import HeroSection from "./HeroSection";
import PlatformBenefits from "./PlatformBenefits";
import SalonChoice from "./SalonChoice";
import SalonExperience from "./SalonExperience";
import TopSalons from "./TopSalons";

function Home() {
  return (
    <>
      <HeroSection />
      <LogoMarquee />
      <PlatformBenefits />
      <GiftsAndInvite />
      <SalonChoice />
      <SalonExperience />
      <TopSalons />
    </>
  );
}

export default Home;
