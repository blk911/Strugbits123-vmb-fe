import SectionWrapper from "./SectionWrapper";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaCalendar,
} from "react-icons/fa";
import salonImg from "../../../../assets/salon-4.png";
export default function SalonProfilePanel() {
  return (
    <SectionWrapper className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[18px] font-semibold text-[#581838]">
          Salon Profile
        </p>
        <FaEdit className="text-[#FF92A5] shrink-0" />
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-[80px] h-[80px] rounded-full border border-[#E5E7EB] overflow-hidden">
          <img
            src={salonImg}
            alt="Salon"
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-[18px] font-semibold text-[#581838]">
          Bella Beauty Salon
        </p>
        <p className="text-[14px] text-[#4B5563]">Premium Hair & Beauty</p>
      </div>

      <div className="flex flex-col gap-3 ">
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-[#9CA3AF] shrink-0" />
          <p className="text-[14px] text-[#4B5563]">
            123 Beauty Street, NY 10001
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaPhone className="text-[#9CA3AF] shrink-0" />
          <p className="text-[14px] text-[#4B5563]">(555) 123-4567</p>
        </div>

        <div className="flex items-center gap-3">
          <FaClock className="text-[#9CA3AF]  shrink-0" />
          <p className="text-[14px] text-[#4B5563]">9:00 AM - 8:00 PM</p>
        </div>

        <div className="flex items-center gap-3">
          <FaCalendar className="text-[#9CA3AF] shrink-0" />
          <p className="text-[14px] text-[#4B5563]">Mon–Fri</p>
        </div>
      </div>

      <button className="w-full border border-[#E5E7EB] bg-[#FF92A5] text-white rounded-[8px] py-2">
        Edit Profile
      </button>
    </SectionWrapper>
  );
}
