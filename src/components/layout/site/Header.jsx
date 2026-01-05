import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import Button from "../../common/site/Button";
import { useNavigate } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className="w-full bg-white py-[20px] px-[50px]">
      <div className="flex gap-2 flex-col sm:flex-row justify-between items-center">
        <img
          src={logo}
          alt="Logo"
          className="h-[69px] w-[108px] cursor-pointer"
          onClick={() => navigate("/")}
        />
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
          <ul className="flex items-center gap-[20px] text-[#4B5563]">
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
                text={"Register Your Salon Today"}
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
              <Button text={"Register Your Salon Today"} />
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
