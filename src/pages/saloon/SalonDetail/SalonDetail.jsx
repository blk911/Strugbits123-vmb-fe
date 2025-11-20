import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { salons as salonsData } from "../../../components/dashboard/client/Home/mockData";
import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock, FaEdit } from "react-icons/fa";
import AutoCarousel from "../../../components/dashboard/client/SalonDetail/AutoCarousel";
import ServicesSection from "../../../components/dashboard/client/SalonDetail/ServicesSection";
import AppButton from "../../../components/common/site/AppButton";

export default function SalonDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const salon = salonsData[0];

  return (
    <div className=" bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      {/* <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full relative">
        <div className="w-full relative z-0">
          <AutoCarousel
            images={salon?.images}
            heightClass="h-[192px]  rounded-tl-xl rounded-tr-xl"
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
              src={salon?.image}
              alt={salon?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex w-full flex-col md:flex-row">
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
                {salon?.name}
              </h1>
              <p className="text-[#4B5563] text-[14px] sm:text-[16px] md:text-[18px] leading-[22px] mt-1">
                Where beauty meets luxury ✨
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
                  {salon?.address} | {salon.distance.toFixed(1)} miles
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-[#00000080]" />
                <span>{salon?.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                sm:pl-[160px] "
                <FaRegClock className="text-[#00000080]" />
                <span>{salon?.hours}</span>
              </div>

              <div className="bg-[#FF92A54D] rounded-[5px] px-2 py-[4px] text-[11px] sm:text-[12px] text-[#581838] whitespace-nowrap">
                Mon-Thru-Fri
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-end">
            <AppButton
              leftIcon={<FaEdit />}
              variant="primary"
              className="max-w-[290px] max-h-[40px]  self-center"
            >
              Edit Salon Profile
            </AppButton>
          </div>
        </div>
      </div> */}
      <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full relative">
        <div className="w-full relative">
          <AutoCarousel
            images={salon?.images}
            heightClass="h-[180px] sm:h-[220px] md:h-[260px] rounded-tl-xl rounded-tr-xl"
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
              src={salon?.image}
              alt={salon?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full mt-[80px] sm:mt-[20px] md:mt-[30px]">
          <div className="flex flex-col px-3 sm:px-6 md:px-8 text-center sm:text-left w-full lg:w-[70%]">
            <div className="sm:pl-[150px] md:pl-[160px]">
              <h1 className="text-[#581838] font-bold text-[20px] sm:text-[26px] md:text-[30px] leading-tight">
                {salon?.name}
              </h1>
              <p className="text-[#4B5563] text-[14px] sm:text-[16px] md:text-[18px] leading-[22px] mt-1">
                Where beauty meets luxury ✨
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
                  {salon?.address} | {salon?.distance?.toFixed(1)} miles
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaPhoneAlt />
                <span>{salon?.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <FaRegClock />
                <span>{salon?.hours}</span>
              </div>

              <div className="bg-[#FF92A54D] rounded-[5px] px-2 py-[4px] text-[11px] sm:text-[12px] text-[#581838] whitespace-nowrap">
                Mon–Thu–Fri
              </div>

              <AppButton
                leftIcon={<FaEdit />}
                variant="primary"
                className="w-[180px] md:w-[200px] h-[40px] block lg:hidden "
              >
                Edit Salon Profile
              </AppButton>
            </div>
          </div>

          <div className="flex md:w-[30%] items-end justify-center md:justify-end mt-6 md:mt-0 max-lg:hidden">
            <AppButton
              leftIcon={<FaEdit />}
              variant="primary"
              className="w-[180px] md:w-[200px] h-[40px]  "
            >
              Edit Salon Profile
            </AppButton>
          </div>
        </div>
      </div>

      <ServicesSection services={salon?.services} salon={salon} />
    </div>
  );
}
