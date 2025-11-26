import React from "react";
import pic1 from "../../../assets/dashboard-1.png";
import Button from "../../../components/common/site/Button";

function List({ items }) {
  return (
    <ul className="list-disc pl-5" style={{ color: "#777777" }}>
      {items.map((item, idx) => (
        <li key={idx} className="mb-3">
          <span
            className="max-xl:text-[14px] xl:text-[16px] text-[#777777] mt-[24px] mb-[10px]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SalonCard({ img, label, title, listItems, btnText, classes = "" }) {
  const shadow = {
    boxShadow: `
      -4px 10px 24px 0px #FF92A51A,
      -14px 42px 44px 0px #FF92A517,
      -32px 94px 60px 0px #FF92A50D,
      -57px 167px 71px 0px #FF92A503,
      -89px 262px 77px 0px #FF92A500
    `,
  };

  return (
    <div
      className={`flex max-xl:gap-x-[20px] lg:gap-x-[70px] gap-y-[20px] items-center ${classes}`}
    >
      <div
        className="max-md:w-full lg:w-[400px] xl:w-[500px] h-[411px] border-1 border-[#581838] rounded-[10px] overflow-hidden"
        style={shadow}
      >
        <img src={img} alt="" className="w-full h-full " />
      </div>
      <div className="max-md:w-full lg:w-[483px] flex flex-col gap-y-[10px]">
        <span
          className="max-xl:text-[16px] xl:text-[16px] text-[#FF92A5] uppercase"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span
          className="max-xl:text-[30px] xl:text-[30px] text-[#581838] leading-[30px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
        >
          {title}
        </span>
        <List items={listItems} />
        <Button text={btnText} classes={"!bg-white mt-[30px] w-max"} />
      </div>
    </div>
  );
}

function SalonChoice() {
  const salonOwnerList = [
    "Create your salon profile with complete details.",
    "Manage directly from the portal – no hassle, no missed clients.",
    "Invite to new salon owners.",
    "Boost visibility and gain new customers from our growing network.",
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center py-[60px] sm:py-[150px] sm:gap-y-[150px] gap-y-[50px] sm:px-[50px] px-[10px] ">
      <SalonCard
        img={pic1}
        label="Salon Owners"
        title="Grow Your Salon Business with Us"
        listItems={salonOwnerList}
        btnText="Register Your Salon Today"
        classes="max-md:flex-col max-md:w-full "
      />
      <SalonCard
        img={pic1}
        label="For Customers"
        title="Your Beauty. Your Choice. Anytime, Anywhere."
        listItems={[
          "Find and book your favorite salons with just a few clicks.",
          "Browse services, timings, and real-time availability before booking.",
          "Send a salon experience as a gift to friends & family (spa, haircut, makeover, etc.).",
          "Enjoy exclusive deals and discounts from partnered salons.",
        ]}
        btnText="Create Free Account"
        classes="max-md:flex-col max-md:w-full flex-row-reverse"
      />
    </div>
  );
}

export default SalonChoice;
