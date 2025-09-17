import React from "react";

import pic1 from "../../../assets/gift-1.png";
import pic2 from "../../../assets/gift-2.png";
import Button from "../../../components/common/Button";

function Card({ img, title, desc, style, border, btnText }) {
  return (
    <div
      className="w-[526px] flex flex-col rounded-[20px] overflow-hidden"
      style={{
        ...style,
        border: border,
      }}
    >
      <div className="h-[223px] w-full overflow-hidden rounded-t-[20px]">
        <img src={img} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="w-full flex flex-col px-[30px] pt-[27px] pb-[40px]">
        <span
          className="max-xl:text-[25px] xl:text-[30px] text-[#581838] mt-[24px] mb-[10px]"
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
          <Button text={btnText} classes={"w-max capitalize"} textclass={"text-[16px]"} />
        </div>
      </div>
    </div>
  );
}

function GiftsAndInvite() {
  const card1Shadow = {
    boxShadow: `
      -4px 10px 24px 0px #FF92A51A,
      -14px 42px 44px 0px #FF92A517,
      -32px 94px 60px 0px #FF92A50D,
      -57px 167px 71px 0px #FF92A503,
      -89px 262px 77px 0px #FF92A500
    `,
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-[25px] px-[10px]">
      <Card
        img={pic1}
        title="Gifting Made Easy"
        desc="Give the gift of essential self-care and glow-from-within moments."
        style={card1Shadow}
        border="1px solid #581838"
        btnText="Gift a NMB gift card"
      />
      <Card
        img={pic2}
        title="Invite & Earn"
        desc="Salon owners can invite others to join and grow together."
        style={{}}
        border="1px solid #58183833"
        btnText="Invite the best salon"
      />
    </div>
  );
}

export default GiftsAndInvite;
