import { FaGift, FaRegCalendarAlt } from "react-icons/fa";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import AppButton from "../../../common/site/AppButton";

export default function ServiceCard({ services, salon }) {
  const { openModal } = useDashboardModal();
  const {
    _id,
    serviceName,
    serviceImage,
    serviceDuration,
    servicePrice,
    description,
  } = services;
  const handleGiftClick = () => {
    openModal("giftService", {
      salon,
      service: { _id, serviceName, serviceDuration, servicePrice },
    });
  };
  const handleBookClick = () => {
    openModal("bookAppointment", {
      salon,
      service: { serviceName, serviceDuration, servicePrice },
    });
  };
  return (
    <div className="border border-[#58183880] rounded-[12px] p-4 sm:p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-300">
      <div className="relative w-full">
        <img
          src={serviceImage}
          alt={serviceName}
          className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover rounded-md"
        />
        <div className="absolute top-3 right-3 bg-white text-[#6B7280] text-[12px] sm:text-[13px] px-3 py-[4px] rounded-[8px] shadow-sm">
          {serviceDuration} min
        </div>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-2">
        <h4 className="text-[#581838] font-semibold text-[16px] sm:text-[18px] leading-[22px] sm:leading-[24px]">
          {serviceName}
        </h4>
        <span className="text-[#6B7280] font-bold text-[16px] sm:text-[18px]">
          ${servicePrice}
        </span>
      </div>

      <p className="text-[#4B5563] text-[14px] leading-[18px] sm:text-[15px]">
        {description}
      </p>

      <div className="flex flex-col xl:flex-row gap-3 mt-2">
        <AppButton
          leftIcon={
            <FaGift className="text-[#FF92A5] text-[18px] sm:text-[20px] flex-shrink-0" />
          }
          variant="ghost-pink-light"
          size="custom"
          onClick={handleGiftClick}
          className="py-2 sm:py-2 px-2.5 text-[15px] sm:text-[16px]  font-medium "
        >
          Request Service
        </AppButton>

        <AppButton
          leftIcon={
            <FaRegCalendarAlt className="text-[#FF92A5] text-[18px] sm:text-[20px] flex-shrink-0" />
          }
          variant="outline-pink"
          size="custom"
          onClick={handleBookClick}
          className="py-2 sm:py-2 px-2.5 text-[15px] sm:text-[16px]  font-medium "
        >
          Book Now
        </AppButton>
      </div>
    </div>
  );
}
