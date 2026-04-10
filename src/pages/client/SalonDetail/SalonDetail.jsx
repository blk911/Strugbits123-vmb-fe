import { useParams, useNavigate } from "react-router-dom";
import { useGetSalonByIdQuery } from "../../../store/api";
import { useSelectedSalon } from "../../../hooks/useSelectedSalon";
import LoadingIndicator from "../../../components/common/LoadingIndicator/LoadingIndicator";
import { useEffect } from "react";
import AutoCarousel from "../../../components/dashboard/client/SalonDetail/AutoCarousel";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { BsClockFill } from "react-icons/bs";
import ServicesSection from "../../../components/dashboard/client/SalonDetail/ServicesSection";
import { useUser } from "../../../hooks/useUser";
export default function SalonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { salon: reduxSalon, loading: reduxLoading } = useSelectedSalon();
  const { user } = useUser();
  let userLat = undefined;
  let userLng = undefined;
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  if (user?.location?.coordinates) {
    const [lng, lat] = user.location.coordinates;
    userLat = lat;
    userLng = lng;
  }
  const {
    data: apiData,
    isLoading: apiLoading,
    isError,
  } = useGetSalonByIdQuery(
    { id, userLat, userLng },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  // const {
  //   data: apiData,
  //   isLoading: apiLoading,
  //   isError,
  // } = useGetSalonByIdQuery(
  //   (id)
  //   , {
  //   refetchOnMountOrArgChange: true,

  // });
  const salon = apiData?.data || reduxSalon;
  const isLoading = apiLoading && !salon;

  useEffect(() => {
    if (!isLoading && !salon) {
      navigate("/salons", { replace: true });
    }
  }, [salon, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vmb-bg-soft">
        <LoadingIndicator />
      </div>
    );
  }

  if (!salon) return null;

  return (
    <div className=" p-7 font-poppins gap-8 flex flex-col">
      <div className="bg-white border border-vmb-primary/10 rounded-[12px] shadow-sm p-4 sm:p-5 md:p-6 w-full max-w-full relative">
        <div className="w-full relative z-0">
          <AutoCarousel
            images={salon.salonPhotos}
            heightClass="h-[180px] sm:h-[220px] md:h-[300px] rounded-tl-xl rounded-tr-xl"
          />
          <div className="absolute sm:-bottom-[115px] -bottom-[75px] left-1/2 sm:left-6 -translate-x-1/2 sm:translate-x-0 w-[110px] sm:w-[130px] md:w-[149px] h-[110px] sm:h-[130px] md:h-[149px] rounded-full overflow-hidden border-4 border-white shadow-md bg-white z-20">
            <img
              src={salon.profilePic}
              alt={salon.salonName}
              className="w-full h-full object-cover "
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col mt-[90px] sm:mt-[16px] px-3 sm:px-6 md:px-8 text-center sm:text-left">
          <div className="sm:pl-[160px]">
            <h1 className="text-vmb-primary font-bold text-[22px] sm:text-[26px] md:text-[30px] leading-tight">
              {salon.salonName}
            </h1>
            <p className="text-vmb-text-muted text-[14px] sm:text-[16px] md:text-[18px] leading-[22px] mt-1">
              {salon.description || "Premium Beauty Services"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 text-[11px] sm:text-[13px] text-vmb-text-muted/50 mt-3 sm:mt-4 sm:pl-[160px]">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <span>
                {salon.salonAddress}
                {salon.distance !== "-" ? ` | ${salon.distance}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt />
              <span>{salon.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <BsClockFill />
              <span>
                {salon.startTime} - {salon.endTime}
              </span>
            </div>
            <div className="bg-vmb-secondary/30 rounded-[5px] px-2 py-[4px] text-[11px] sm:text-[12px] text-vmb-primary">
              {/* {salon.workingDays?.map((d) => d.slice(0, 3)).join(" · ")} */}
              {(() => {
                const currentDays = salon?.workingDays || [];
                if (currentDays.length === 0) return "No working days set";

                return days
                  .filter((day) => currentDays.includes(day))
                  .map((day) => day.slice(0, 3))
                  .join("-");
              })()}
            </div>
          </div>
        </div>
      </div>

      <ServicesSection services={salon?.services} salon={salon} />
    </div>
  );
}
