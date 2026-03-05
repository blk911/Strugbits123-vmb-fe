import React from "react";
import serviceImage from "../../../assets/service.jpg";

function ServiceCard() {
  return (
    <div className="w-full p-[6px]">
      <div className="w-full flex flex-col gap-y-[10px]">
        <div className="w-[133px] h-[22px] bg-white rounded-[8px]">
          <span
            className="max-xl:text-[12px] text-vmb-text-muted absolute top-1 right-1 xl:text-[14px] max-xl:leading-[30px]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            09:00 AM - 05:00 PM
          </span>
        </div>
        <div className="w-full height-[200px]">
          <img src={serviceImage} alt="" />
        </div>
        <span
          className="max-xl:text-[18px] text-vmb-primary xl:text-[20px] max-xl:leading-[30px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          Veloura Beauty Lounge
        </span>
        <span
          className="max-xl:text-[14px] text-vmb-text-muted xl:text-[16px] max-xl:leading-[30px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </span>
      </div>
    </div>
  );
}

export default ServiceCard;
