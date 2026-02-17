import Marquee from "react-fast-marquee";
import stylingImg from "../../../assets/scroller/styling.png";
import lipsImg from "../../../assets/scroller/lips.png";
import browsImg from "../../../assets/scroller/brows.png";
import waxingImg from "../../../assets/scroller/waxing.png";
import spaImg from "../../../assets/scroller/spa.png";
import nailsImg from "../../../assets/scroller/nails.png";
import resortsImg from "../../../assets/scroller/resorts.png";

const services = [
  { image: stylingImg, label: "Styling" },
  { image: lipsImg, label: "Lips" },
  { image: browsImg, label: "Brows" },
  { image: waxingImg, label: "Waxing" },
  { image: spaImg, label: "Spa" },
  { image: nailsImg, label: "Nails" },
  { image: resortsImg, label: "Resorts" },
];

export default function LogoMarquee() {
  return (
    <div className="w-full pt-2 pb-4 sm:pt-3 sm:pb-5">
      <div className="vmb-container overflow-hidden">
        <Marquee gradient={false} speed={45} autoFill>
          {services.map((service) => (
            <div
              key={service.label}
              className="vmb-card mx-3 w-[110px] sm:w-[124px] flex flex-col items-center p-2.5 opacity-80 transition-opacity hover:opacity-100"
            >
              <img
                src={service.image}
                alt={service.label}
                className="h-10 w-14 rounded-lg object-cover sm:h-12 sm:w-16"
              />
              <span className="mt-1 text-[11px] font-medium uppercase tracking-wide vmb-muted">
                {service.label}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
