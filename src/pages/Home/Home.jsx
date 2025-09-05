
import LogoMarquee from '../../components/Marquee'
import GiftsAndInvite from './GiftsAndInvite'
import HeroSection from './HeroSection'
import PlatformBenefits from './PlatformBenefits'
import SalonChoice from './SalonChoice'
import SalonExperience from './SalonExperience'

function Home() {
  return (
    <>
    <HeroSection />
    <LogoMarquee />
    <PlatformBenefits />
    <GiftsAndInvite />
    <SalonChoice />
    <SalonExperience />
    </>
  )
}

export default Home