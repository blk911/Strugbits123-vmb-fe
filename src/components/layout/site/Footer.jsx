import React from "react";
import logo from "../../../assets/footer_logo.png";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#ded3cc] bg-[#fffdfb]">
      <div className="max-w-[1200px] mx-auto px-4 py-10 flex flex-col items-center">
        <div className="w-[140px] sm:w-[160px] h-auto">
          <img
            src={logo}
            alt="VMB Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="w-full max-w-[976px] h-[1px] bg-[#ded3cc] mt-8"></div>

        <div className="w-full max-w-[976px] mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-vmb-text-muted font-inter text-[12px]">
          <span className="text-center sm:text-left ">
            © 2026 VMB. All rights reserved.
          </span>

          <span className="text-center sm:text-right">Made with care</span>
        </div>
      </div>
    </footer>
  );
}
