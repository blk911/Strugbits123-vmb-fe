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
      <div className="w-full lg:w-[556px] h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden rounded-[20px]">
        <img src={img} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="w-full lg:w-[556px] flex flex-col gap-6">
        <span className="font-poppins font-medium text-[16px] tracking-[5px] text-[#5C8374] uppercase">
          {label}
        </span>

        <h2 className="font-poppins font-normal text-[26px] sm:text-[30px] text-[#0F3D3E] leading-snug">
          {title}
        </h2>

        {descriptionBlock && (
          <div className="flex flex-col gap-5">
            {descriptionBlock.map((item, index) => (
              <div key={index}>
                <h4 className="font-poppins font-semibold text-[14px] text-[#0F3D3E]">
                  {item.heading}
                </h4>
                <p className="font-poppins font-normal text-[14px] text-[#5C8374] leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {bulletPoints && (
          <div className="flex flex-col gap-4">
            <p className="font-lato font-bold text-[14px] text-[#0F3D3E]">
              The salons you love. The friends you trust. All connected.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {bulletPoints.map((point, i) => (
                <li
                  key={i}
                  className="font-poppins font-normal text-[14px] text-[#5C8374]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4">
          <PrimaryButton
            text={buttonText}
            variant="pillLight"
            onClick={() => navigate("/register")}
            className="w-fit px-4 py-2"
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
    <section className="w-full px-4">
      <FeatureBlock img={salonDashboardImg} {...blocks[0]} />

      <FeatureBlock img={customerDashboardImg} reverse {...blocks[1]} />
    </section>
  );
}
