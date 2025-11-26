import React from "react";
import logo from "../../../assets/logo.png";
import facebook from "../../../assets/icons/facebook.png";
import instagram from "../../../assets/icons/insta.png";
import twitter from "../../../assets/icons/twitter.png";
import linkedin from "../../../assets/icons/linkedin.png";

function FooterColumn({ title, items }) {
  return (
    <div className="flex flex-col items-start ">
      <span
        className="text-[18px] text-[#FF92A5] mb-[10px]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
        }}
      >
        {title}
      </span>
      {items.map((item, idx) => (
        <span
          key={idx}
          className="text-[14px] text-[#FFFFFF] mb-[10px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#581838] px-[50px] pt-[40px] pb-[20px] flex flex-col items-center">
      <div className=" grid w-[100%] lg:w-[100%] xl:w-[80%]  max-sm:w-full gap-y-[20px] grid-cols-1 sm:grid-cols-3 lg:grid-cols-[1fr_100px_100px_100px_100px_200px] xl:grid-cols-6 gap-x-[40px] items-start">
        <div className="flex flex-col items-start ">
          <img
            src={logo}
            alt="Logo"
            className="h-[102px] w-auto sm:w-[159px] mb-2"
          />

          <div className="flex gap-x-[27px] mt-[23px]">
            <img src={facebook} alt="Facebook" className="h-[14px] w-[7px]" />
            <img src={twitter} alt="Twitter" className="h-[14px] w-[18px]" />
            <img src={linkedin} alt="LinkedIn" className="h-[16px] w-[16px]" />
            <img
              src={instagram}
              alt="Instagram"
              className="h-[16px] w-[18px]"
            />
          </div>
        </div>
        <FooterColumn
          title="Quick Link"
          items={["Lorem", "Ipsum", "Lorem", "Ipsum", "Lorem", "Ipsum"]}
        />
        <FooterColumn
          title="Service"
          items={["Lorem", "Ipsum", "Lorem", "Ipsum", "Lorem", "Ipsum"]}
        />
        <FooterColumn
          title="Resource"
          items={["Lorem", "Ipsum", "Lorem", "Ipsum", "Lorem", "Ipsum"]}
        />
        <FooterColumn
          title="Company"
          items={["Lorem", "Ipsum", "Lorem", "Ipsum", "Lorem", "Ipsum"]}
        />
        <div className="flex flex-col items-start">
          <span
            className="text-[18px] text-[#FF92A5] mb-[10px]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
            }}
          >
            Newsletter
          </span>
          <span
            className="text-[14px] text-[#FFFFFF] mb-[10px]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            Subscribe our newsletter
          </span>
          <form className="flex items-center mt-2">
            <input
              type="email"
              placeholder="Your email"
              className="rounded-full px-4 py-2 xl:w-[289px] max-xl:w-auto h-[46px] outline-none bg-white text-[#581838] text-[14px] font-poppins"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
              }}
            />
            <button
              type="submit"
              className="ml-[-40px] bg-[#FF92A5] rounded-full w-[32px] h-[32px] flex items-center justify-center"
            >
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.639987 15.3004L2.57999 8.59037L0.639987 1.88037C0.399987 1.06037 1.23999 0.33037 2.01999 0.70037L17.12 7.69037C17.89 8.05037 17.89 9.15037 17.12 9.50037L2.01999 16.4904C1.23999 16.8504 0.399987 16.1304 0.639987 15.3004Z"
                  stroke="white"
                  stroke-width="1.2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2.57996 8.59082H7.36996"
                  stroke="white"
                  stroke-width="1.2"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
      <hr className="w-full border-t border-[#FFFFFF] opacity-30 my-8" />

      <div
        className="text-center text-[#FFFFFF] text-[14px]"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
      >
        © 2025 <span className="text-[#FF92A5]">Ven Me Baby</span> | All Right
        Reserved.
      </div>
    </footer>
  );
}

export default Footer;
