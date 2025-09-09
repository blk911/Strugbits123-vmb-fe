import Marquee from "react-fast-marquee";
import logo1 from '../assets/logos/logo-1.png'
import logo2 from '../assets/logos/logo-2.png'
import logo3 from '../assets/logos/logo-3.png'
import logo4 from '../assets/logos/logo-4.png'
import logo5 from '../assets/logos/logo-5.png'
import logo6 from '../assets/logos/logo-6.png'
import logo7 from '../assets/logos/logo-7.png'
import logo8 from '../assets/logos/logo-8.png'
import logo9 from '../assets/logos/logo-9.png'
import logo10 from '../assets/logos/logo-10.png'
import logo11 from '../assets/logos/logo-11.png'

export default function LogoMarquee() {
  return (
   <div className="flex justify-center items-center w-full">
    <div className="relative pt-[50px] sm:py-[58px] w-full max-w-[1920px] bg-white overflow-hidden">
  {/* Left gradient */}
  <div
    className="absolute left-0 top-0 h-full w-[120px] pointer-events-none z-10"
    style={{
      background: "linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)"
    }}
  />
  {/* Right gradient */}
  <div
    className="absolute right-0 top-0 h-full w-[120px] pointer-events-none z-10"
    style={{
      background: "linear-gradient(270deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)"
    }}
  />
  <Marquee gradient={false} speed={50}>
    <img src={logo1} alt="Logo 1" className="h-12 mx-4" />
    <img src={logo2} alt="Logo 2" className="h-12 mx-4" />
    <img src={logo3} alt="Logo 3" className="h-12 mx-4" />
    <img src={logo4} alt="Logo 4" className="h-12 mx-4" />
    <img src={logo5} alt="Logo 5" className="h-12 mx-4" />
    <img src={logo6} alt="Logo 6" className="h-12 mx-4" />
    <img src={logo7} alt="Logo 7" className="h-12 mx-4" />
    <img src={logo8} alt="Logo 8" className="h-12 mx-4" />
    <img src={logo9} alt="Logo 9" className="h-12 mx-4" />
    <img src={logo10} alt="Logo 10" className="h-12 mx-4" />
    <img src={logo11} alt="Logo 11" className="h-12 mx-4" />
  </Marquee>
</div>
   </div>

  );
}