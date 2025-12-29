import { useNavigate } from "react-router-dom";
import AppButton from "../../../common/site/AppButton";
import { useDispatch } from "react-redux";
import { setSelectedSalon } from "../../../../store/features/selectedSalonSlice";



export default function SalonCard({ salon }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openDetail = () => {
    dispatch(setSelectedSalon(salon));
    navigate(`/salon/${salon?._id}`, { state: { salonId: salon?._id } });
  };

  return (
    <div className="border border-[#58183880] rounded-[12px] p-3 sm:p-4 
                    flex flex-col h-full hover:shadow-md transition-all duration-300">

      {/* Image */}
      <div className="relative w-full h-[180px] shrink-0">
        <img
          src={salon?.profilePic}
          alt={salon?.salonName}
          className="w-full h-full object-cover rounded-md"
        />
        <div className="absolute top-3 right-3 bg-white text-[#6B7280] 
                        text-[12px] px-3 py-[4px] rounded-[8px] shadow-sm">
          {salon?.startTime} - {salon?.endTime}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 mt-3 gap-2">

        {/* Name + Distance */}
        <div className="flex justify-between items-start min-h-[48px]">
          <h3 className="text-[#581838] font-medium text-[18px] leading-[24px] 
                         line-clamp-2 max-w-[60%]">
            {salon?.salonName}
          </h3>
          <span className="text-[#00000080] text-[12px] font-medium 
                           line-clamp-1 text-right min-w-[35%]">
            {salon?.distance || " "}
          </span>
        </div>

        {/* Description (fixed height) */}
        <p className="text-[#4B5563] text-[12px] font-medium leading-[14px] 
                      line-clamp-2 min-h-[28px]">
          {salon?.description || " "}
        </p>

        {/* Spacer pushes button down */}
        <div className="flex-1" />

        {/* Button */}
        <AppButton
          variant="primary"
          size="custom"
          onClick={openDetail}
          className="text-[16px] font-medium py-2 w-full"
        >
          View Services
        </AppButton>
      </div>
    </div>
  );
}
