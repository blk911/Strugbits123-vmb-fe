import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock, FaEdit, FaCamera } from "react-icons/fa";
import AutoCarousel from "../../../components/dashboard/client/SalonDetail/AutoCarousel";
import { BsClockFill } from "react-icons/bs";
import AppButton from "../../../components/common/site/AppButton";
import ServicesSection from "../../../components/dashboard/saloon/SalonDetail/ServicesSection";
import { useDashboardModal } from "../../ModalProvider";
import { useUser } from "../../../hooks/useUser";
import LoadingIndicator from "../../../components/common/LoadingIndicator/LoadingIndicator";
import { convertTo12Hour } from "../../../utils/HelperFunctions";

export default function SalonDetail() {
  const { user, loading } = useUser();
  const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!user) return null;
  const { openModal } = useDashboardModal();

  return (
    <div className=" bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full relative">
        <div className="w-full relative">
          <AutoCarousel
            images={user?.salonPhotos}
            heightClass="h-[180px] sm:h-[220px] md:h-[300px] rounded-tl-xl rounded-tr-xl"
          />

          <div
            className="
        absolute 
        -bottom-[70px] sm:-bottom-[90px] md:-bottom-[110px]
        left-1/2 sm:left-6 
        -translate-x-1/2 sm:translate-x-0
        w-[95px] h-[95px] 
        sm:w-[120px] sm:h-[120px] 
        md:w-[140px] md:h-[140px]
        rounded-full overflow-hidden 
        border-4 border-white shadow-md bg-white z-20
      "
          >
            <img
              src={user?.profilePic}
              alt={user?.salonName}
              className="w-full h-full object-cover"
            />
  <button
   onClick={() => openModal("salonprofileSettings")}
    className="
      absolute 
      bottom-2 right-3 sm:bottom-2.5 sm:right-5
      w-6 h-6 sm:w-8 sm:h-8 
      rounded-full 
      bg-[#FF92A5]
      flex items-center justify-center
      shrink-0
      shadow-md
      hover:scale-105 transition
      cursor-pointer
    "
  >
    <FaCamera className="text-white text-[11px] sm:text-sm shrink-0" />
  </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full mt-[80px] sm:mt-[20px] md:mt-[30px]">
          <div className="flex flex-col px-3 sm:px-6 md:px-8 text-center sm:text-left w-full lg:w-[70%]">
            <div className="sm:pl-[150px] md:pl-[160px]">
              <h1 className="text-[#581838] font-bold text-[20px] sm:text-[26px] md:text-[30px] leading-tight">
                {user?.salonName}
              </h1>
              <p className="text-[#4B5563] text-[14px] sm:text-[16px] md:text-[18px] leading-[22px] mt-1">
                {user?.description || "Where beauty meets luxury ✨"}
              </p>
            </div>

            <div
              className="
          flex flex-wrap justify-center sm:justify-start 
          items-center gap-3 sm:gap-4
          text-[12px] sm:text-[13px] text-[#00000080] 
          mt-3 sm:mt-4
          sm:pl-[150px] md:pl-[160px]
        "
            >
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>
                  {user?.salonAddress}
                  {/* {salon?.distance?.toFixed(1)} miles */}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaPhoneAlt />
                <span>{user?.phoneNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <BsClockFill />
                <span>
                  {user?.startTime && user?.endTime
                    ? `${user.startTime} - ${user.endTime}`
                    : "09:00 AM - 05:00 PM"}
                </span>
              </div>

              <div className="bg-[#FF92A54D] rounded-[5px] px-2 py-[4px] text-[11px] sm:text-[12px] text-[#581838] whitespace-nowrap">
                {/* {user?.workingDays.map((day) => day.slice(0, 3)).join("-") ||
                  "Mon - Thu - Fri"} */}
                  {(() => {
      const currentDays = user?.workingDays || [];
      if (currentDays.length === 0) return "No working days set";

      return days
        .filter((day) => currentDays.includes(day))
        .map((day) => day.slice(0, 3))
        .join("-");
    })()}
              </div>

              <AppButton
                leftIcon={<FaEdit />}
                variant="primary"
                className="w-[180px] md:w-[200px] h-[40px] block lg:hidden "
                onClick={() => openModal("salonprofileSettings")}
              >
                Edit Salon Profile
              </AppButton>
            </div>
          </div>

          <div className="flex md:w-[30%] items-center justify-center md:justify-end mt-6 md:mt-0 max-lg:hidden">
            <AppButton
              leftIcon={<FaEdit />}
              variant="primary"
              className="w-[180px] md:w-[200px] h-[40px]  "
              onClick={() => openModal("salonprofileSettings")}
            >
              Edit Salon Profile
            </AppButton>
          </div>
        </div>
      </div>

      <ServicesSection />
    </div>
  );
}
