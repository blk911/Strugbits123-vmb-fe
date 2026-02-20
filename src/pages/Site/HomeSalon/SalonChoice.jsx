import React from "react";
import salonDashboardImg from "../../../assets/salon_owner_dashboard.png";
import Button from "../../../components/common/site/Button";
import customerDashboardImg from "../../../assets/customer_dashboard.png";
function List({ items }) {
  return (
    <ul className="list-disc pl-5" style={{ color: "#777777" }}>
      {items.map((item, idx) => {
        const isObjectItem =
          typeof item === "object" && item !== null && "lead" in item;
        return (
          <li key={idx} className="mb-1.5">
            <span
              className="max-xl:text-[14px] xl:text-[15px] leading-tight text-[#777777]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            >
              {isObjectItem ? (
                <>
                  <strong className="font-semibold text-[#581838]">
                    {item.lead}
                  </strong>
                  <br />
                  {item.detail}
                </>
              ) : (
                item
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function SalonCard({
  img,
  label,
  title,
  subtitle,
  listItems,
  btnText,
  classes = "",
}) {
  return (
    <div
      className={`flex max-xl:gap-x-[20px] lg:gap-x-[70px] gap-y-[20px] items-center ${classes}`}
    >
      <div
        className="vmb-card max-md:w-full lg:w-[400px] xl:w-[500px] h-[411px] overflow-hidden bg-white"
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
        {subtitle && (
          <span
            className="max-xl:text-[15px] xl:text-[16px] leading-tight vmb-muted"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            {subtitle}
          </span>
        )}
        <List items={listItems} />
        <Button
          text={btnText}
          classes={"!bg-white mt-[30px] w-max"}
          navigateTo={"register"}
          type={label === "Salon Owners" ? "salon" : "customer"}
        />
      </div>
    </div>
  );
}

function SalonChoice() {
  const salonOwnerList = [
    {
      lead: "Replace Cancellations With Commitment",
      detail: "Pre-paid invitations reduce no-shows and protect your schedule.",
    },
    {
      lead: "Turn Invitations Into Revenue",
      detail:
        "Clients invite friends, request gifted services, and book together — intentionally.",
    },
    {
      lead: "Reward Loyalty That Promotes You",
      detail: "Built-in incentives turn satisfied clients into active ambassadors.",
    },
    {
      lead: "Grow Through Co-Marketing",
      detail: "Salons who build the network share in its growth.",
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center py-[60px] sm:py-[150px] sm:gap-y-[150px] gap-y-[50px] sm:px-[50px] px-[10px] ">
      <SalonCard
        img={salonDashboardImg}
        label="Salon Owners"
        title="How The VMB Model Works"
        listItems={salonOwnerList}
        btnText="Register Your Salon Today"
        classes="max-md:flex-col max-md:w-full "
      />
      <SalonCard
        img={customerDashboardImg}
        label="For Customers"
        title="Beauty Is Better Shared; Even Better Gifted!"
        subtitle="The salons you love. The friends you trust. All connected."
        listItems={[
          "Schedule together",
          "Send experiences as gifts",
          "Discover salons through real relationships",
          "Benefit when your circle grows",
        ]}
        btnText="Create Free Account"
        classes="max-md:flex-col max-md:w-full flex-row-reverse"
      />
    </div>
  );
}

export default SalonChoice;
