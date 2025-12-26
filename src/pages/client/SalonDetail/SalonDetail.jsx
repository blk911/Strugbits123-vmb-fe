import { useParams, useNavigate } from "react-router-dom";
import { useGetSalonByIdQuery } from "../../../store/api";
import { useSelectedSalon } from "../../../hooks/useSelectedSalon";
import LoadingIndicator from "../../../components/common/LoadingIndicator/LoadingIndicator";
import { useEffect } from "react";
import AutoCarousel from "../../../components/dashboard/client/SalonDetail/AutoCarousel";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { BsClockFill } from "react-icons/bs";
import ServicesSection from "../../../components/dashboard/client/SalonDetail/ServicesSection";
export default function SalonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { salon: reduxSalon, loading: reduxLoading } = useSelectedSalon();

  const {
    data: apiData,
    isLoading: apiLoading,
    isError,
  } = useGetSalonByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const salon = apiData?.data || reduxSalon;
  const isLoading = apiLoading && !salon;

  useEffect(() => {
    if (!isLoading && !salon) {
      navigate("/salons", { replace: true });
    }
  }, [salon, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFEFEF]">
        <LoadingIndicator />
      </div>
    );
  }

  if (!salon) return null;

  return (
    <div className="bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full relative">
        <div className="w-full relative z-0">
          <AutoCarousel
            images={salon.salonPhotos}
            heightClass="h-[192px] rounded-tl-xl rounded-tr-xl"
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
            <h1 className="text-[#581838] font-bold text-[22px] sm:text-[26px] md:text-[30px] leading-tight">
              {salon.salonName}
            </h1>
            <p className="text-[#4B5563] text-[14px] sm:text-[16px] md:text-[18px] leading-[22px] mt-1">
              {salon.description || "Premium Beauty Services"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 text-[11px] sm:text-[13px] text-[#00000080] mt-3 sm:mt-4 sm:pl-[160px]">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt />
              <span>{salon.salonAddress}</span>
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
            <div className="bg-[#FF92A54D] rounded-[5px] px-2 py-[4px] text-[11px] sm:text-[12px] text-[#581838]">
              {salon.workingDays?.map((d) => d.slice(0, 3)).join(" · ")}
            </div>
          </div>
        </div>
      </div>

      <ServicesSection services={salon?.services} salon={salon} />
    </div>
  );
}
