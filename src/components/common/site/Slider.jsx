import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiMapPin } from "react-icons/fi";
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
      {direction === "left" ?
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.71865 13.7072C7.53862 13.8947 7.29449 14 7.03993 14C6.78537 14 6.54124 13.8947 6.36121 13.7072L0.601211 7.70721C0.421238 7.51969 0.320136 7.26538 0.320136 7.00021C0.320136 6.73505 0.421238 6.48074 0.601211 6.29322L6.36121 0.293214C6.54227 0.111055 6.78477 0.0102614 7.03648 0.0125397C7.28818 0.014818 7.52896 0.119988 7.70696 0.305396C7.88495 0.490803 7.98591 0.741617 7.9881 1.00381C7.99028 1.26601 7.89352 1.51861 7.71865 1.70722L3.59737 6.00021L14.7199 6.00021C14.9745 6.00021 15.2187 6.10557 15.3988 6.29311C15.5788 6.48064 15.6799 6.735 15.6799 7.00021C15.6799 7.26543 15.5788 7.51978 15.3988 7.70732C15.2187 7.89486 14.9745 8.00021 14.7199 8.00021L3.59737 8.00021L7.71865 12.2932C7.89862 12.4807 7.99973 12.7351 7.99973 13.0002C7.99973 13.2654 7.89862 13.5197 7.71865 13.7072Z"
            fill="var(--vmb-secondary)"
          />
        </svg>
      : <svg
          width="20"
          height="20"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.28123 0.292787C8.46125 0.105316 8.70539 0 8.95995 0C9.2145 0 9.45864 0.105316 9.63867 0.292787L15.3987 6.29279C15.5786 6.48031 15.6797 6.73462 15.6797 6.99979C15.6797 7.26495 15.5786 7.51926 15.3987 7.70679L9.63867 13.7068C9.45761 13.8889 9.21511 13.9897 8.9634 13.9875C8.71169 13.9852 8.47091 13.88 8.29292 13.6946C8.11493 13.5092 8.01397 13.2584 8.01178 12.9962C8.00959 12.734 8.10635 12.4814 8.28123 12.2928L12.4025 7.99979H1.27995C1.02534 7.99979 0.781159 7.89443 0.601124 7.70689C0.421089 7.51936 0.319946 7.265 0.319946 6.99979C0.319946 6.73457 0.421089 6.48022 0.601124 6.29268C0.781159 6.10514 1.02534 5.99979 1.27995 5.99979H12.4025L8.28123 1.70679C8.10125 1.51926 8.00015 1.26495 8.00015 0.999786C8.00015 0.734622 8.10125 0.480314 8.28123 0.292787Z"
            fill="var(--vmb-secondary)"
          />
        </svg>
      }
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
  } = useGetSalonByIdQuery(
    { id: salon._id },
    {
      skip: !salon._id,
    },
  );
  const handleViewSalon = () => {
    if (!salon._id) return;
    if (isSuccess && salonResponse?.data) {
      dispatch(setSelectedSalon(salonResponse.data));
      if (user?.role === "customer" || user?.role === "admin") {
        navigate(`/salon/${salon._id}`);
      } else if (user?._id === salon._id) {
        navigate(`/salon-detail`);
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
      className="bg-white rounded-[16px] border border-vmb-secondary/20 overflow-hidden w-full xl:max-w-[340px] flex flex-col cursor-pointer"
      onClick={handleViewSalon}
    >
      <img
        src={imageUrl}
        alt={salon.salonName}
        className="w-full h-[200px] object-cover"
      />
      <div className="p-[16px] flex flex-col">
        <span className="text-vmb-primary text-[18px] font-medium line-clamp-1 font-poppins">
          {salon.salonName || "Unnamed Salon"}
        </span>

        <div className="flex items-center gap-2 text-vmb-text-muted text-[15px] mt-3">
          <FiMapPin className="text-vmb-secondary text-[18px] flex-shrink-0" />

          <span className="lg:text-[12px] xl:text-[14px] font-normal line-clamp-1 font-inter text-vmb-secondary ">
            {salon.salonAddress ?
              `${salon.salonAddress}, ${salon.salonZipcode}`
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
      <div className="w-full py-20 text-center text-vmb-primary text-2xl">
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
      <div className="w-full py-20 text-center text-vmb-text-muted text-2xl font-medium">
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
            "linear-gradient(90deg, var(--vmb-bg) 0%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-[60px] sm:w-[200px] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(270deg, var(--vmb-bg) 0%, rgba(255,255,255,0) 100%)",
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
