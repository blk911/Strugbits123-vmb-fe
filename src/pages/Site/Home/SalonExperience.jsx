import React from "react";
import pic1 from "../../../assets/salon-experience.png";
import pic2 from "../../../assets/admin_dashboard.png";
import PrimaryButton from "../../../components/common/site/PrimaryButton";
import { useNavigate } from "react-router-dom";

function SalonExperience({
  heading = "Ready to Own Your Client Network?",
  primaryButtonText = "Get your salon onboard",
  primaryAuthType = "salon",
  secondaryButtonText = "Gift Your First Service",
  secondaryAuthType = "salon",
}) {
  const navigate = useNavigate();

  const imgShadow = {
    boxShadow: `
      -9px 9px 28px 0px rgba(0,0,0,0.1),
      -34px 38px 51px 0px rgba(0,0,0,0.09),
      -77px 85px 69px 0px rgba(0,0,0,0.05),
      -136px 152px 82px 0px rgba(0,0,0,0.01),
      -213px 237px 89px 0px rgba(0,0,0,0)
    `,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  };

  return (
    <div
      className="w-screen bg-no-repeat bg-right bg-cover lg:px-[15px] px-[10px] h-full lg:h-[406px]"
      style={{
        backgroundImage: `url(${pic1})`,
      }}
    >
      <div className="w-full h-full flex max-lg:flex-col gap-y-[30px] lg:flex-row justify-center items-center lg:gap-x-[50px]">
        <div className="flex flex-col items-center p-3 w-full lg:w-[640px]">
          <h4 className="text-[25px] sm:text-[30px] md:text-[35px] xl:text-[40px] text-center text-white mb-[10px] font-poppins font-bold">
            {heading}
          </h4>

          <div className="flex flex-col sm:flex-row gap-x-[20px] gap-y-[10px]">
            <PrimaryButton
              text={primaryButtonText}
              variant="pillOutline"
              className="w-fit p-[5px] pl-[15px]"
              onClick={() => navigate("/register")}
              authMode={"signup"}
              authType={primaryAuthType}
            />

            <PrimaryButton
              text={secondaryButtonText}
              variant="pillOutline"
              className="w-fit p-[5px] pl-[15px]"
              onClick={() => navigate("/register")}
              authMode={"signup"}
              authType={secondaryAuthType}
            />
          </div>
        </div>

        <img
          src={pic2}
          alt=""
          className="
            w-full
            max-w-[500px]
            xl:max-w-[600px]
            h-auto
            self-center lg:self-end
            object-contain
            translate-y-[10px]
          "
          style={imgShadow}
        />
      </div>
    </div>
  );
}

export default SalonExperience;
