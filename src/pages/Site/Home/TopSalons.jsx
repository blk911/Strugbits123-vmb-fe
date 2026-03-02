import React from "react";
import SalonSlider from "../../../components/common/site/Slider";

function TopSalons() {
  return (
    <div className="w-full flex flex-col items-center  px-[10px]">
      <h3 className="text-[25px]  text-[#0F3D3E] font-semibold font-poppins">
        Salons
      </h3>
      <SalonSlider />
    </div>
  );
}

export default TopSalons;
