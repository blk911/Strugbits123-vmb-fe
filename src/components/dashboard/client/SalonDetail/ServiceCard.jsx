import { FaGift, FaRegCalendarAlt } from "react-icons/fa";

export default function ServiceCard({
  name,
  duration,
  price,
  description,
  image,
}) {
  return (
    <div className="border border-[#58183880] rounded-[12px] p-4 sm:p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-300">
      <div className="relative w-full">
        <img
          src={image}
          alt={name}
          className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover rounded-md"
        />
        <div className="absolute top-3 right-3 bg-white text-[#6B7280] text-[12px] sm:text-[13px] px-3 py-[4px] rounded-[8px] shadow-sm">
          {duration} min
        </div>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-2">
        <h4 className="text-[#581838] font-semibold text-[16px] sm:text-[18px] leading-[22px] sm:leading-[24px]">
          {name}
        </h4>
        <span className="text-[#6B7280] font-bold text-[16px] sm:text-[18px]">
          ${price}
        </span>
      </div>

      <p className="text-[#4B5563] text-[14px] leading-[18px] sm:text-[15px]">
        {description}
      </p>

      <div className="flex flex-col xl:flex-row gap-3 mt-2">
        <button className="flex-1 bg-[#FF92A54D] text-[#FF92A5] rounded-[8px] py-2 sm:py-2 px-2.5 flex items-center justify-center gap-2 hover:bg-[#FF92A533] transition-all">
          <FaGift className="text-[#FF92A5] text-[18px] sm:text-[20px] flex-shrink-0" />
          <span className="text-[15px] sm:text-[16px] font-medium">
            Request Service
          </span>
        </button>

        <button className="flex-1 border border-[#FF92A5] text-[#FF92A5] rounded-[8px] py-2 sm:py-2 px-2.5 flex items-center justify-center gap-2 hover:bg-[#FF92A50D] transition-all">
          <FaRegCalendarAlt className="text-[#FF92A5] text-[18px] sm:text-[20px] flex-shrink-0" />
          <span className="text-[15px] sm:text-[16px] font-medium">
            Book Now
          </span>
        </button>
      </div>
    </div>
  );
}
