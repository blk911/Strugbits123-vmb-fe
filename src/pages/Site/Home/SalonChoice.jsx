import React from "react";
import salonDashboardImg from "../../../assets/salon_owner_dashboard.png";
import customerDashboardImg from "../../../assets/customer_dashboard.png";
import PrimaryButton from "../../../components/common/site/PrimaryButton";
import { useNavigate } from "react-router-dom";

function FeatureBlock({
  img,
  label,
  title,
  descriptionBlock,
  bulletPoints,
  buttonText,
  reverse = false,
  authMode = null,
  authType = null,
}) {
  const navigate = useNavigate();

  return (
    <div
      className={`
        w-full max-w-[1200px] mx-auto
        flex flex-col lg:flex-row
        ${reverse ? "lg:flex-row-reverse" : ""}
        items-center
        gap-10 lg:gap-20
        py-12
      `}
    >
      <div className="w-full lg:w-[556px] h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden rounded-[20px] self-start">
        <img src={img} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="w-full lg:w-[556px] flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <span className="font-poppins font-medium text-[16px] tracking-[5px] text-vmb-secondary uppercase">
            {label}
          </span>

          <h2 className="font-poppins font-normal text-[26px] sm:text-[30px] text-vmb-primary leading-snug">
            {title}
          </h2>
        </div>

        {descriptionBlock && (
          <div className="flex flex-col gap-[5px]">
            {descriptionBlock.map((item, index) => (
              <div key={index} className="flex flex-col gap-[5px]">
                <h4 className="font-lato font-semibold text-[14px] text-vmb-primary">
                  {item.heading}
                </h4>
                <p className="font-poppins font-normal text-[14px] text-vmb-secondary leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {bulletPoints && (
          <div className="flex flex-col gap-[10px]">
            <p className="font-lato font-bold text-[14px] text-vmb-primary">
              The salons you love. The friends you trust. All connected.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {bulletPoints.map((point, i) => (
                <li
                  key={i}
                  className="font-poppins font-normal text-[14px] text-vmb-secondary"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-2">
          <PrimaryButton
            text={buttonText}
            variant="pillLight"
            onClick={() => navigate("/register")}
            className="w-fit pl-[15px] p-[5px] "
            authMode={authMode}
            authType={authType}
          />
        </div>
      </div>
    </div>
  );
}

export default function SalonChoice({ blocks }) {
  return (
    <section className="w-full ">
      <FeatureBlock img={salonDashboardImg} {...blocks[0]} />

      <FeatureBlock img={customerDashboardImg} reverse {...blocks[1]} />
    </section>
  );
}
