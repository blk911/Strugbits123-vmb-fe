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
      service: { _id, serviceName, serviceDuration, servicePrice },
    });
  };

  return (
    <div
      className="border border-vmb-primary/50 rounded-[12px] p-4 sm:p-5
                 flex flex-col h-full hover:shadow-md transition-all duration-300"
    >
      <div className="relative w-full h-[200px] shrink-0">
        <img
          src={serviceImage}
          alt={serviceName}
          className="w-full h-full object-cover rounded-md"
        />
        <div
          className="absolute top-3 right-3 bg-white text-vmb-text-muted
                     text-[12px] px-3 py-[4px] rounded-[8px] shadow-sm"
        >
          {serviceDuration} min
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-4 gap-2">
        <div className="flex justify-between items-start  gap-2">
          <h4
            className="text-vmb-primary font-semibold text-[16px] sm:text-[18px]
                       leading-[22px] line-clamp-2 max-w-[70%]"
          >
            {serviceName}
          </h4>

          <span className="text-vmb-text-muted font-bold text-[16px] sm:text-[18px]">
            ${servicePrice}
          </span>
        </div>

        <p
          className="text-vmb-text-muted text-[14px] sm:text-[15px]
                     leading-[18px] line-clamp-2 "
        >
          {description || "\u00A0"}
        </p>

        <div className="flex-1" />

        <div className="w-full flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-[60%]">
            <AppButton
              leftIcon={<FaGift className="text-vmb-secondary text-[18px]" />}
              variant="ghost-pink-light"
              size="custom"
              onClick={handleGiftClick}
              className="py-[10px] px-[12px] text-[14px] font-medium 
                       whitespace-nowrap  "
            >
              Request Service
            </AppButton>
          </div>
          <div className="w-full md:w-[40%]">
            <AppButton
              leftIcon={
                <FaRegCalendarAlt className="text-vmb-secondary text-[18px]" />
              }
              variant="outline-pink"
              size="custom"
              onClick={handleBookClick}
              className="py-[10px] px-[12px] text-[14px] font-medium 
                       whitespace-nowrap "
            >
              Book Now
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
