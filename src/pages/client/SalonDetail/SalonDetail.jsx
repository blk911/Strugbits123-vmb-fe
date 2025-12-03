import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { salons as salonsData } from "../../../components/dashboard/client/Home/mockData";
import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock } from "react-icons/fa";
import AutoCarousel from "../../../components/dashboard/client/SalonDetail/AutoCarousel";
import ServicesSection from "../../../components/dashboard/client/SalonDetail/ServicesSection";
import { useSelectedSalon } from "../../../hooks/useSelectedSalon";
import LoadingIndicator from "../../../components/common/LoadingIndicator/LoadingIndicator";

export default function SalonDetail() {
  const navigate = useNavigate();
  const { salon: selectedSalon, loading } = useSelectedSalon();
  console.log("Selected Salon==>", selectedSalon);
  const salon = salonsData[0];

  useEffect(() => {
    if (!loading && !selectedSalon) {
      navigate("/salons", { replace: true });
    }
  }, [selectedSalon, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFEFEF]">
        <LoadingIndicator />
      </div>
    );
  }

  if (!selectedSalon) return null;

  return (
    <div className=" bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full relative">
        <div className="w-full relative z-0">
          <AutoCarousel
            images={selectedSalon?.salonPhotos}
            heightClass="h-[192px]   rounded-tl-xl rounded-tr-xl"
          />

          <div
            className="
        absolute sm:-bottom-[115px] -bottom-[75px]
        left-1/2 sm:left-6 
        -translate-x-1/2 sm:translate-x-0
        w-[110px] sm:w-[130px] md:w-[149px]
        h-[110px] sm:h-[130px] md:h-[149px]
        rounded-full overflow-hidden border-4 border-white shadow-md bg-white z-20
      "
          >
            <img
              src={selectedSalon?.profilePic}
              alt={selectedSalon?.salonName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div
          className="
      relative z-10 
      flex flex-col
      mt-[90px] sm:mt-[16px]
      px-3 sm:px-6 md:px-8
      text-center sm:text-left
    "
        >
          <div className="sm:pl-[160px]">
            <h1 className="text-[#581838] font-bold text-[22px] sm:text-[26px] md:text-[30px] leading-tight">
              {selectedSalon?.salonName}
            </h1>
            <p className="text-[#4B5563] text-[14px] sm:text-[16px] md:text-[18px] leading-[22px] mt-1">
              {selectedSalon?.description}
            </p>
          </div>

          <div
            className="
        flex flex-wrap justify-center sm:justify-start 
        items-center gap-3 sm:gap-4
        text-[11px] sm:text-[13px] text-[#00000080] mt-3 sm:mt-4
        sm:pl-[160px]
      "
          >
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#00000080]" />
              <span>
                {selectedSalon?.salonAddress} | {selectedSalon?.distance}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#00000080]" />
              <span>{selectedSalon?.phoneNumber}</span>
            </div>

            <div className="flex items-center gap-2 ">
              <FaRegClock className="text-[#00000080]" />
              <span>
                {selectedSalon?.startTime} - {selectedSalon?.endTime}
              </span>
            </div>

            <div className="bg-[#FF92A54D] rounded-[5px] px-2 py-[4px] text-[11px] sm:text-[12px] text-[#581838] whitespace-nowrap">
              {selectedSalon?.workingDays
                .map((day) => day.slice(0, 3))
                .join("-")}
            </div>
          </div>
        </div>
      </div>

      <ServicesSection
        services={selectedSalon?.services}
        salon={selectedSalon}
      />
    </div>
  );
}
