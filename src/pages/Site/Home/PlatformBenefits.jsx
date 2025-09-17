import React from "react";
import pic1 from "../../../assets/logos/platform-logo-1.png";
import pic2 from "../../../assets/logos/platform-logo-2.png";
import pic3 from "../../../assets/logos/platform-logo-3.png";

function Card({ img, title, desc }) {
  return (
    <div className="max-xl:max-w-[274px] xl:w-[400px] flex flex-col justify-center items-center">
      <img src={img} alt="" className="w-[60px] h-[60px]" />
      <span
        className="max-xl:text-[20px] xl:text-[25px] text-[#581838] mt-[24px] mb-[10px]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 520,
        }}
      >
        {title}
      </span>
      <span
        className="max-xl:text-[14px] xl:text-[16px] text-[#4B5563] max-xl:leading-[20px]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
        }}
      >
        {desc}
      </span>
    </div>
  );
}


function PlatformBenefits() {
  return (
    <div className="w-full text-center flex flex-col justify-center items-center gap-y-[50px]  sm:pb-[150px] px-[10px]">
      <h3
        className="max-xl:text-[25px] xl:text-[35px] capitalize text-[#581838]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
        }}
      >
        The smarter way to gift & grow salons
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[100px] gap-y-[50px]">
        <Card
          img={pic1}
          title="Send Beauty as a Gift"
          desc="Surprise friends & family with salon services – a unique way to share care."
        />
        <Card
          img={pic2}
          title="Salon Owner Invites"
          desc="Salon owners can invite others to join and grow together."
        />
        <Card
          img={pic3}
          title="One Platform, Many Salons"
          desc="Discover salons, connect, and be part of a growing beauty network."
        />
      </div>
    </div>
  );
}

export default PlatformBenefits;
