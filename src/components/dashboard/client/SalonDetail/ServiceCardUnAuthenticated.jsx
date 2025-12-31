import { FaGift, FaRegCalendarAlt } from "react-icons/fa";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import AppButton from "../../../common/site/AppButton";
import { useNavigate } from "react-router-dom";

export default function ServiceCardAnonymous({ services, salon }) {
  const {
    _id,
    serviceName,
    serviceImage,
    serviceDuration,
    servicePrice,
    description,
  } = services;
  const navigate = useNavigate();
  return (
    <div className="border border-[#58183880] rounded-[12px] p-4 sm:p-5 h-full flex flex-col gap-4 hover:shadow-md transition-all duration-300">
 
     <div className="relative w-full h-[200px] shrink-0">
        <img
          src={serviceImage}
          alt={serviceName}
          className="w-full h-full object-cover rounded-md"
        />
        <div
          className="absolute top-3 right-3 bg-white text-[#6B7280]
                     text-[12px] px-3 py-[4px] rounded-[8px] shadow-sm"
        >
          {serviceDuration} min
        </div>
      </div>
    <div className="flex justify-between items-start min-h-[48px] gap-2">
          <h4
            className="text-[#581838] font-semibold text-[16px] sm:text-[18px]
                       leading-[22px] line-clamp-2 max-w-[70%]"
          >
            {serviceName}
          </h4>

          <span className="text-[#6B7280] font-bold text-[16px] sm:text-[18px]">
            ${servicePrice}
          </span>
        </div>
   <p
          className="text-[#4B5563] text-[14px] sm:text-[15px]
                     leading-[18px] line-clamp-2 "
        >
          {description || "\u00A0"}
        </p>

      <div className="flex  mt-2">
        <AppButton
          fullWidth={false}
          variant="ghost-pink-light"
          size="custom"
          onClick={() => navigate("/register")}
          className="py-[10px] px-[15px] text-[15px] sm:text-[16px]  font-medium w-full "
        >
          Register to Book
        </AppButton>
      </div>
    </div>
  );
}
