import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useGetAllSalonsQuery, useGetSalonByIdQuery } from "../../../store/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedSalon } from "../../../store/features/selectedSalonSlice";
import { toastLoading } from "../../../utils/toast";
import { useUser } from "../../../hooks/useUser";

function Arrow({ onClick, direction }) {
  const posClass = direction === "left" ? "left-[10%]" : "right-[10%]";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className={`absolute top-1/2 ${posClass} -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer`}
    >
      {direction === "left" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.71865 13.7072C7.53862 13.8947 7.29449 14 7.03993 14C6.78537 14 6.54124 13.8947 6.36121 13.7072L0.601211 7.70721C0.421238 7.51969 0.320136 7.26538 0.320136 7.00021C0.320136 6.73505 0.421238 6.48074 0.601211 6.29322L6.36121 0.293214C6.54227 0.111055 6.78477 0.0102614 7.03648 0.0125397C7.28818 0.014818 7.52896 0.119988 7.70696 0.305396C7.88495 0.490803 7.98591 0.741617 7.9881 1.00381C7.99028 1.26601 7.89352 1.51861 7.71865 1.70722L3.59737 6.00021L14.7199 6.00021C14.9745 6.00021 15.2187 6.10557 15.3988 6.29311C15.5788 6.48064 15.6799 6.735 15.6799 7.00021C15.6799 7.26543 15.5788 7.51978 15.3988 7.70732C15.2187 7.89486 14.9745 8.00021 14.7199 8.00021L3.59737 8.00021L7.71865 12.2932C7.89862 12.4807 7.99973 12.7351 7.99973 13.0002C7.99973 13.2654 7.89862 13.5197 7.71865 13.7072Z"
            fill="#FFA1C3"
          />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.28123 0.292787C8.46125 0.105316 8.70539 0 8.95995 0C9.2145 0 9.45864 0.105316 9.63867 0.292787L15.3987 6.29279C15.5786 6.48031 15.6797 6.73462 15.6797 6.99979C15.6797 7.26495 15.5786 7.51926 15.3987 7.70679L9.63867 13.7068C9.45761 13.8889 9.21511 13.9897 8.9634 13.9875C8.71169 13.9852 8.47091 13.88 8.29292 13.6946C8.11493 13.5092 8.01397 13.2584 8.01178 12.9962C8.00959 12.734 8.10635 12.4814 8.28123 12.2928L12.4025 7.99979H1.27995C1.02534 7.99979 0.781159 7.89443 0.601124 7.70689C0.421089 7.51936 0.319946 7.265 0.319946 6.99979C0.319946 6.73457 0.421089 6.48022 0.601124 6.29268C0.781159 6.10514 1.02534 5.99979 1.27995 5.99979H12.4025L8.28123 1.70679C8.10125 1.51926 8.00015 1.26495 8.00015 0.999786C8.00015 0.734622 8.10125 0.480314 8.28123 0.292787Z"
            fill="#FFA1C3"
          />
        </svg>
      )}
    </button>
  );
}

function SalonCard({ salon }) {
  const imageUrl =
    salon.profilePic || "https://via.placeholder.com/340x200?text=No+Image";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useUser();
  const {
    data: salonResponse,
    isLoading: loadingSalon,
    isSuccess,
  } = useGetSalonByIdQuery(salon._id, {
    skip: !salon._id,
  });
  const handleViewSalon = () => {
    if (!salon._id) return;
    if (isSuccess && salonResponse?.data) {
      dispatch(setSelectedSalon(salonResponse.data));
      if (user?.role === "customer" || user?.role === "admin") {
        navigate(`/salon/${salon._id}`);
      } else if (user?._id === salon._id) {
        navigate(`/salondetail`);
      } else {
        navigate(`/salon-detail/${salon._id}`);
      }
      return;
    }

    if (loadingSalon) {
      toastLoading("Loading salon details...");
      return;
    }

    navigate(`/salon/${salon._id}`);
  };

  return (
    <div
      className="bg-white rounded-[16px] border border-[#F3EAF0] overflow-hidden w-auto xl:max-w-[340px] flex flex-col cursor-pointer"
      onClick={handleViewSalon}
    >
      <img
        src={imageUrl}
        alt={salon.salonName}
        className="w-full h-[200px] object-cover"
      />
      <div className="p-[16px] flex flex-col">
        <span
          className="text-[#581838] text-[22px] font-semibold"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
        >
          {salon.salonName || "Unnamed Salon"}
        </span>

        <div className="flex items-center gap-2 text-[#777] text-[15px] mt-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_86_333)">
              <path
                d="M5.9786 0C9.06408 0.0049819 11.5988 2.24248 11.9597 5.22352C12.1407 6.72183 11.6985 8.06881 10.9011 9.29997C9.54794 11.3893 8.14746 13.4493 6.75896 15.5161C6.32241 16.1663 5.67705 16.1607 5.23735 15.5055C3.85516 13.4468 2.46982 11.3899 1.10971 9.3174C0.429656 8.28117 0.0050953 7.13969 4.85119e-05 5.89234C-0.0119376 2.98603 2.19856 0.483867 5.11308 0.0548009C5.41714 0.0099638 5.71995 0.00809559 5.97797 0H5.9786ZM6.02339 0.772818C5.67642 0.771572 5.33198 0.794613 4.98817 0.851905C2.73415 1.23115 0.849801 3.38084 0.784193 5.6364C0.750758 6.78722 1.08637 7.8384 1.70334 8.78808C3.05966 10.8749 4.45636 12.9361 5.83035 15.0111C6.00762 15.2789 6.09089 15.1319 6.20066 14.9669C7.50147 13.0177 8.80732 11.0717 10.105 9.11999C10.7005 8.22388 11.1459 7.25676 11.2096 6.17569C11.3831 3.23575 9.01614 0.785272 6.02339 0.772818Z"
                fill="#FFA1C3"
              />
              <path
                d="M2.823 5.90888C2.823 4.16896 4.24619 2.7541 5.99743 2.75098C7.76002 2.74787 9.18384 4.1702 9.18006 5.93068C9.1769 7.66563 7.74614 9.07239 5.99049 9.06803C4.24051 9.06367 2.823 7.64944 2.823 5.90826V5.90888ZM8.3997 5.91947C8.40348 4.59429 7.34555 3.53252 6.01698 3.52878C4.67643 3.52504 3.61282 4.56439 3.60336 5.88833C3.59389 7.23718 4.64489 8.28961 6.00121 8.28961C7.34555 8.28961 8.39591 7.25151 8.39907 5.91947H8.3997Z"
                fill="#581838"
              />
            </g>
            <defs>
              <clipPath id="clip0_86_333">
                <rect width="12" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <span
            className="lg:text-[12px] xl:text-[14px] font-normal"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {salon.salonAddress
              ? `${salon.salonAddress}, ${salon.salonZipcode}`
              : "Address not available"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SalonSlider() {
  const { data, isLoading, isError, error } = useGetAllSalonsQuery();

  const salons = data?.data?.items || [];

  const settings = {
    dots: false,
    infinite: salons.length > 1,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: salons.length > 5 ? <Arrow direction="right" /> : null,
    prevArrow: salons.length > 5 ? <Arrow direction="left" /> : null,
    responsive: [
      { breakpoint: 1694, settings: { slidesToShow: 4, centerMode: false } },
      { breakpoint: 1412, settings: { slidesToShow: 3, centerMode: false } },
      { breakpoint: 900, settings: { slidesToShow: 2, centerMode: false } },
      { breakpoint: 600, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 text-center text-[#581838] text-2xl">
        Loading salons...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-20 text-center text-red-600 text-xl">
        Error loading salons: {error?.message || "Something went wrong"}
      </div>
    );
  }

  if (salons.length === 0) {
    return (
      <div className="w-full py-20 text-center text-[#777777] text-2xl font-medium">
        No Salons to Show
      </div>
    );
  }

  return (
    <div className="w-full px-[10px] py-8 relative">
      <div
        className="absolute left-0 top-0 h-full w-[60px] sm:w-[200px] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-[60px] sm:w-[200px] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(270deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
        }}
      />

      <Slider {...settings}>
        {salons.map((salon) => (
          <div key={salon._id} className="px-2">
            <SalonCard salon={salon} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
