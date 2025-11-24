import React from "react";
import pic1 from "../../../assets/pic-1.png";
import pic2 from "../../../assets/pic-2.png";
import pic3 from "../../../assets/pic-3.png";
import pic4 from "../../../assets/pic-4.png";
import Button from "../../../components/common/site/Button";

function HeroSection() {
  return (
    <div
      className="h-auto lg:h-[658px] xl:h-[700px] w-full py-[37px] px-[26px]"
      style={{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), linear-gradient(180deg, #FF92A5 0%, #FFFFFF 100%)`,
      }}
    >
      <div className="flex flex-row h-full w-full justify-center gap-x-[20px]">
        <div className="max-sm:hidden h-full flex flex-col justify-between">
          <img
            src={pic1}
            alt=""
            className="max-xl:h-[179px] max-xl:w-[195px] xl:h-[220px] xl:w-[240px]"
          />
          <img
            src={pic3}
            alt=""
            className="max-xl:h-[118px] max-xl:w-[129px] xl:h-[145px] xl:w-[160px] ml-[21px]"
          />
        </div>
        <div className="h-full flex flex-col justify-center items-center gap-y-[31px] xl:gap-y-[45px]">
          <h2
            className="text-[70px] sm:text-[100px] xl:text-[140px] font-normal text-center  text-[#581838] leading-[70px] lg:leading-[90px] xl:leading-[100px]"
            style={{
              fontFamily: "Italianno, cursive",
              fontWeight: 400,
              fontStyle: "normal",
              letterSpacing: "0%",
            }}
          >
            Connecting Salons & Customers
          </h2>
          <h3
            className="text-[20px] max-sm:leading-[30px] sm:text-[35px] xl:text-[50px] font-medium text-center text-[#581838]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              letterSpacing: "0%",
            }}
          >
            the Smart Way – Through Gifting & Invites
          </h3>
          <p
            className="lg:text-[20px] xl:text-[22px] font-normal text-center text-[#581838]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              lineHeight: "28px",
              letterSpacing: "0%",
            }}
          >
            Send salon services as gifts to friends & family, and let every
            occasion shine. Salon owners <br /> can also invite each other to
            grow together on one platform.
          </p>
          <Button text={"Share the Gift of Beauty"} />
        </div>
        <div className="max-sm:hidden h-full flex flex-col justify-between">
          <img
            src={pic2}
            alt=""
            className="max-xl:h-[118px] max-xl:w-[129px] xl:h-[145px] xl:w-[160px]"
          />
          <img
            src={pic4}
            alt=""
            className="max-xl:h-[186px] max-xl:w-[202px] xl:h-[230px] xl:w-[250px]"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
