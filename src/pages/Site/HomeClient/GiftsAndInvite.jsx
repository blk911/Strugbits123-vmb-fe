import React from "react";

import pic1 from "../../../assets/brand/benefits/girls-night.jpg";
import pic2 from "../../../assets/brand/benefits/invite_sent.jpeg";
import Button from "../../../components/common/site/Button";

function Card({ img, title, desc, btnText }) {
  return (
    <div
      className="vmb-card w-[526px] flex flex-col rounded-[20px] overflow-hidden bg-white hover:shadow-sm transition-shadow"
    >
      <div className="h-[223px] w-full overflow-hidden rounded-t-[20px]">
        <img src={img} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="w-full flex flex-col px-[30px] pt-[27px] pb-[40px]">
        <span
          className="max-xl:text-[25px] xl:text-[30px] vmb-title mt-[24px] mb-[10px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 520,
          }}
        >
          {title}
        </span>
        <span
          className="max-xl:text-[14px] xl:text-[16px] max-xl:leading-[20px] mt-[10px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          {desc}
        </span>
        <div className="mt-[30px]">
          <Button
            text={btnText}
            classes={"w-max capitalize"}
            textclass={"text-[16px]"}
            navigateTo={"register"}
          />
        </div>
      </div>
    </div>
  );
}

function GiftsAndInvite() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-[25px] px-[10px]">
      <Card
        img={pic1}
          title={`Did someone say "Party"!`}
        desc="You love sharing the best finds. VMB makes it easy to turn those moments into something more — with earned credits, exclusive upgrades, and thoughtful perks for you and your friends."
        btnText="Gift a NMB gift card"
      />
      <Card
        img={pic2}
        title="Gifts and invitations are personal, intentional."
        desc={`There are moments when you or someone special needs a little attention, a confidence booster, a timely reset. VMB makes it effortless to give and receive the glam, the refresh, or the reset she'll actually love \u2014 secure, thoughtful, and easy to use.`}
        btnText="Invite the best salon"
      />
    </div>
  );
}

export default GiftsAndInvite;
