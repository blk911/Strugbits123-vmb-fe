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
    <div
      className="border border-vmb-primary/10 rounded-[12px] p-3 sm:p-4 
                    flex flex-col h-full hover:shadow-md transition-all duration-300"
    >
      <div className="relative w-full h-[180px] shrink-0">
        <img
          src={salon?.profilePic}
          alt={salon?.salonName}
          className="w-full h-full object-cover rounded-md"
        />
        <div
          className="absolute top-3 right-3 bg-white/80 text-vmb-text-muted 
                        text-[12px] px-3 py-[4px] rounded-[8px] shadow-sm"
        >
          {salon?.startTime} - {salon?.endTime}
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-3 gap-3">
        <div className="hidden sm:flex justify-between items-start ">
          <h3
            className="text-vmb-primary font-medium text-[18px] leading-[24px] 
                         line-clamp-2 max-w-[60%]"
          >
            {salon?.salonName}
          </h3>
          <span
            className="text-vmb-text-muted/50 text-[12px] font-medium 
                           line-clamp-1 text-right min-w-[35%]"
          >
            {salon?.distance || " "}
          </span>
        </div>
        <div className="flex-col  flex sm:hidden items-start ">
          <h3
            className="text-vmb-primary font-medium text-[18px] leading-[24px] 
                         line-clamp-2 "
          >
            {salon?.salonName}
          </h3>
          <span
            className="text-vmb-text-muted/50 text-[12px] font-medium 
                           line-clamp-1 text-right "
          >
            {salon?.distance || " "}
          </span>
        </div>
        <p
          className="text-vmb-text-muted text-[12px] font-medium leading-[14px] 
                      line-clamp-2 "
        >
          {salon?.description || " "}
        </p>

        <div className="flex-1" />

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
