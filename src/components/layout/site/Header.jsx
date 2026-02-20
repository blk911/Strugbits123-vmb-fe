import React, { useState } from "react";
import Button from "../../common/site/Button";
import { useNavigate, useLocation } from "react-router-dom";
import logoV2 from "../../../assets/brand/benefits/Logo v2.png";

const PAGE_LABELS = { "/salon": "SALON", "/client": "CLIENT" };

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pageLabel = PAGE_LABELS[pathname] ?? null;
  return (
    <nav className="w-full">
      <div className="flex gap-3 flex-col sm:flex-row justify-between items-center">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => navigate("/")}
          aria-label="Go to homepage"
        >
          <img src={logoV2} alt="VMB logo" className="h-20 w-auto" />
        </button>
        {/* <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-center items-center w-12 h-12 rounded focus:outline-none"
            aria-label="Open menu"
          >
            <span className="block w-8 h-1 bg-[#7a2c3a] mb-2 rounded"></span>
            <span className="block w-8 h-1 bg-[#7a2c3a] mb-2 rounded"></span>
            <span className="block w-8 h-1 bg-[#7a2c3a] rounded"></span>
          </button>
        </div> */}
        <div>
          <ul className="flex items-center gap-5 vmb-muted">
            {pageLabel && (
              <li className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border" style={{ borderColor: "var(--vmb-border)", color: "var(--vmb-muted)" }}>
                {pageLabel}
              </li>
            )}
            {/* <li>
              <a href="" className="text-[#4B5563]">
                Salon Owner
              </a>
            </li>
            <li>
              <a href="" className="text-[#4B5563]">
                For Customers
              </a>
            </li>
            <li>
              <a href="" className="text-[#4B5563]">
                About
              </a>
            </li>
            <li>
              <a href="" className="text-[#4B5563]">
                Contact
              </a>
            </li> */}
            <li>
              <Button
                text={"Get Started"}
                navigateTo={"register"}
                type={"salon"}
              />
            </li>
          </ul>
        </div>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex flex-col items-center justify-center">
          <ul className="flex flex-col gap-8 text-2xl text-[#4B5563]">
            {/* <li>
              <a href="" className="text-[#4B5563]">
                Salon Owner
              </a>
            </li>
            <li>
              <a href="" className="text-[#4B5563]">
                For Customers
              </a>
            </li>
            <li>
              <a href="" className="text-[#4B5563]">
                About
              </a>
            </li>
            <li>
              <a href="" className="text-[#4B5563]">
                Contact
              </a>
            </li> */}
            <li>
              <Button text={"Get Started"} />
            </li>
          </ul>
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-4xl text-[#7a2c3a] font-bold"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
      )}
    </nav>
  );
}

export default Header;
