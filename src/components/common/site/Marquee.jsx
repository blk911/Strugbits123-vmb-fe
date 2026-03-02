import Marquee from "react-fast-marquee";
import waxingImg from "../../../assets/scroller/wax.png";
import stylingImg from "../../../assets/scroller/styling.png";
import spaImg from "../../../assets/scroller/spa.png";
import nailsImg from "../../../assets/scroller/nails.png";
import makeupImg from "../../../assets/scroller/makeup.png";
import lipsImg from "../../../assets/scroller/lips.png";
import lashingImg from "../../../assets/scroller/lashes.png";
import facialImg from "../../../assets/scroller/facial.png";
import browsImg from "../../../assets/scroller/brows.png";

const services = [
  { image: waxingImg, label: "WAXING" },
  { image: lipsImg, label: "LIPS" },
  { image: browsImg, label: "BROWS" },
  { image: spaImg, label: "SPA" },
  { image: nailsImg, label: "NAILS" },
  { image: stylingImg, label: "STYLING" },
  { image: makeupImg, label: "MAKEUP" },
  { image: facialImg, label: "FACIAL" },
  { image: lashingImg, label: "LASHES" },
];

export default function LogoMarquee() {
  return (
    <div className="w-full h-[146px]  flex items-center overflow-hidden">
      <Marquee gradient={false} speed={40} autoFill pauseOnHover>
        {services.map((service, index) => (
          <div
            key={`${service.label}-${index}`}
            className="mx-3 w-[120px] h-[146px] flex flex-col items-center justify-center flex-shrink-0"
          >
            <div
              className="
                w-[100px] h-[100px]
                rounded-full
                border-[1px] border-white
                flex items-center justify-center
                overflow-hidden
                bg-white/30 backdrop-blur-sm
                shadow-xl
              "
            >
              <img
                src={service.image}
                alt={service.label}
                className="w-[90%] h-[90%] object-cover rounded-full"
              />
            </div>

            <span className="mt-2 text-center font-['Poppins'] text-[16px] font-normal text-[#0F3D3E] leading-none">
              {service.label}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
