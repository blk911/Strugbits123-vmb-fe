import React from "react";
import SalonSlider from "../../components/Slider";

function TopSalons() {
  return (
    <div className="w-full flex flex-col items-center sm:mt-[100px] sm:mb-[150px] mt-[50px] px-[10px]">
      <h3
        className="max-xl:text-[25px] xl:text-[35px] text-[#581838]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
        }}
      >
        Top Salons
      </h3>
      <SalonSlider />
    </div>
  );
}

export default TopSalons;
