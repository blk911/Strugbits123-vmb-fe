import React from "react";
import logo from "../../../assets/footer_logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-vmb-primary border-t border-vmb-secondary">
      <div className="max-w-[1200px] mx-auto px-4 py-10 flex flex-col items-center">
        <div className="w-[140px] sm:w-[160px] h-auto">
          <img
            src={logo}
            alt="VMB Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="w-full max-w-[976px] h-[1px] bg-white/10 mt-8"></div>

        <div className="w-full max-w-[976px] mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white font-inter text-[12px]">
          <span className="text-center sm:text-left">
            © 2026 VMB. All rights reserved.
          </span>

          <span className="text-center sm:text-right">Made with care</span>
        </div>
      </div>
    </footer>
  );
}
