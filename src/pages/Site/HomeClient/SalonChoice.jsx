import React from "react";
import salonDashboardImg from "../../../assets/salon_owner_dashboard.png";
import Button from "../../../components/common/site/Button";
import customerDashboardImg from "../../../assets/customer_dashboard.png";
function List({ items }) {
  return (
    <ul className="list-disc pl-5 text-vmb-text-muted">
      {items.map((item, idx) => {
        const isObjectItem =
          typeof item === "object" && item !== null && "lead" in item;
        return (
          <li key={idx} className="mb-1.5">
            <span
              className="max-xl:text-[14px] xl:text-[15px] leading-tight text-vmb-text-muted font-poppins font-normal"
            >
              {isObjectItem ? (
                <>
                  <strong className="font-semibold text-vmb-primary">
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
          className="max-xl:text-[16px] xl:text-[16px] text-vmb-secondary uppercase font-poppins font-medium"
        >
          {label}
        </span>
        <span
          className="max-xl:text-[30px] xl:text-[30px] text-vmb-primary leading-[30px] font-poppins font-normal"
        >
          {title}
        </span>
        {subtitle && (
          <span
            className="max-xl:text-[15px] xl:text-[16px] leading-tight text-vmb-text-muted font-poppins font-medium"
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
        label="VMB Clients"
        title="How The VMB Model Works"
        listItems={[
          { lead: "Secure Your Spot With Confidence", detail: "Commitment-based invitations reduce last-minute chaos and protect the time you count on." },
          { lead: "Turn Invitations Into Perks", detail: "Invite friends, request gifted services, or book intentionally — and unlock credits and exclusive upgrades." },
          { lead: "Be Rewarded for Loyalty", detail: "Your repeat visits and referrals earn tangible rewards, not just points — real value you can use." },
          { lead: "Build Your Co-Marketing Account", detail: "As the network grows, so do your perks — giving you better access and member-only advantages." },
        ]}
        btnText="Register Your Salon Today"
        classes="max-md:flex-col max-md:w-full "
      />
      <SalonCard
        img={customerDashboardImg}
        label="Co-Marketing Program"
        title="Your Circle Grows, You Benefit."
        subtitle="The salons you love. The friends you trust. All connected."
        listItems={[
          "Join VMB and secure your place in the network",
          "Invite friends to schedule or receive gifts",
          "When they book, your circle expands",
          "As the network grows, so do your member rewards",
        ]}
        btnText="Create Free Account"
        classes="max-md:flex-col max-md:w-full flex-row-reverse"
      />
    </div>
  );
}

export default SalonChoice;
