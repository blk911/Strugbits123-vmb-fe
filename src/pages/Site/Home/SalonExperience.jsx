import React from "react";
import pic1 from "../../../assets/salon-experience.png";
import pic2 from "../../../assets/dashboard-1.png";
import Button from "../../../components/common/Button";

function SalonExperience() {
  // Custom box shadow for the image
  const imgShadow = {
    boxShadow: `
            -9px 9px 28px 0px #1F14181A,
            -34px 38px 51px 0px #1F141817,
            -77px 85px 69px 0px #1F14180D,
            -136px 152px 82px 0px #1F141803,
            -213px 237px 89px 0px #1F141800
        `,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  };

  return (
    <div
      className="max-lg:h-auto lg:h-auto lg:pt-[50px] w-full bg-no-repeat bg-right bg-cover max-lg:pt-[60px] lg:px-[15px] px-[10px]"
      style={{
        backgroundImage: `url(${pic1})`,
      }}
    >
      <div className="w-full h-full flex max-lg:flex-col gap-y-[30px] lg:flex-row justify-end items-center lg:gap-x-[50px] xl:gap-x-[145px]">
        <div className="flex flex-col w-full lg:w-[506px]">
          <h4
            className="max-xl:text-[35px] xl:text-[40px] text-[#FFFFFF] mb-[10px]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
            }}
          >
            Ready to Experience the
            <br />
            New Era of Salon Invites?
          </h4>
          <div className="flex flex-col sm:flex-row gap-x-[20px] gap-y-[10px]">
            <Button
              text="List Your Salon Now"
              classes={"bg-[#FFFFFF] text-[#581838] w-max"}
              textclass={"text-[16px]"}
            />
            <Button
              text="Gift Your First Service"
              classes={"bg-[#FFFFFF] text-[#581838] w-max"}
              textclass={"text-[16px]"}
            />
          </div>
        </div>
        <img
          src={pic2}
          alt=""
          className="h-[400px] max-lg:w-full lg:w-[600px] self-end"
          style={imgShadow}
        />
      </div>
    </div>
  );
}

export default SalonExperience;
