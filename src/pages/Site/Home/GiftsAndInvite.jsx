import React from "react";

import pic1 from "../../../assets/brand/benefits/girls-night.jpg";
import pic2 from "../../../assets/brand/benefits/invite_sent.jpeg";
import Button from "../../../components/common/site/Button";
import PrimaryButton from "../../../components/common/site/PrimaryButton";
import { useNavigate } from "react-router-dom";

function Card({ img, title, desc, btnText, type, mode }) {
  const navigate = useNavigate();
  return (
    <div
      className="
        w-full max-w-[630px]
        flex flex-col
        rounded-[20px]
        border border-vmb-primary/20 hover:border-vmb-secondary
        bg-white
        hover:shadow-2xl
        overflow-hidden
        pb-[20px] sm:pb-[30px]
      "
    >
      <div className="w-full h-[223px] overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-[20px] px-6 sm:px-10 pt-6  ">
        <h3 className="font-poppins font-medium text-[22px] sm:text-[25px] text-vmb-primary leading-snug">
          {title}
        </h3>

        <p className="font-poppins font-normal text-[14px] text-vmb-secondary leading-relaxed">
          {desc}
        </p>
        <PrimaryButton
          text={btnText}
          variant="pillLight"
          className="w-fit p-[5px] pl-[15px]"
          onClick={() => navigate("/register")}
          authType={type}
          authMode={mode}
        />
      </div>
    </div>
  );
}

function GiftsAndInvite({ cards }) {
  return (
    <section className="w-full ">
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center items-stretch">
        <Card
          img={pic1}
          title={cards[0].title}
          desc={cards[0].desc}
          btnText="Gift A VMB Gift Card"
          type={cards[0].type}
          mode={cards[0].mode}
        />

        <Card
          img={pic2}
          title={cards[1].title}
          desc={cards[1].desc}
          btnText="Invite The Best Salon"
          type={cards[1].type}
          mode={cards[1].mode}
        />
      </div>
    </section>
  );
}

export default GiftsAndInvite;
