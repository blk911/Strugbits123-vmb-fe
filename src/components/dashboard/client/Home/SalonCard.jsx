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
    <div className="border border-[#58183880] rounded-[12px] p-3 sm:p-4 flex flex-col gap-3 hover:shadow-md transition-all duration-300">
      <div className="relative w-full">
        <img
          src={salon?.profilePic}
          alt={name}
          className="w-full h-[180px] object-cover rounded-md"
        />
        <div className="absolute top-3 right-3 bg-white text-[#6B7280] text-[12px] px-3 py-[4px] rounded-[8px] shadow-sm">
          {salon?.startTime} - {salon?.endTime}
        </div>
      </div>

      <div className="flex items-start justify-between">
        <h3 className="text-[#581838] font-medium text-[18px] leading-[24px]">
          {salon?.salonName}
        </h3>
        <span className="text-[#00000080] text-[12px] font-medium">
          {salon?.distance}
        </span>
      </div>

      <p className="text-[#4B5563] text-[12px] font-medium leading-[14px]">
        {salon?.description}
      </p>

      <AppButton
        variant="primary"
        size="custom"
        onClick={openDetail}
        className="text-[16px] font-medium  py-2 "
      >
        View Services
      </AppButton>
    </div>
  );
}
