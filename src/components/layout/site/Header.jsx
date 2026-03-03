// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import PrimaryButton from "../../common/site/PrimaryButton";

// const Header = () => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();

//   const selected = pathname === "/salon" ? "salon" : "customer";

//   return (
//     <div
//       className="
//         fixed top-0 left-0 w-full z-50
//         h-[60px] sm:h-[70px] md:h-[79px]
//         bg-white/80 backdrop-blur-xl
//         border-b border-black/10
//         px-2 sm:px-6 md:px-12
//         flex items-center justify-between
//       "
//     >
//       {/* Logo */}
//       <img
//         src="/logo.png"
//         alt="Logo"
//         className="
//           w-[60px] sm:w-[75px] md:w-[84px]
//           h-auto object-contain
//           cursor-pointer
//         "
//         onClick={() => navigate("/")}
//       />

//       {/* Buttons */}
//       <div className="flex items-center gap-2 sm:gap-4">
//         <PrimaryButton
//           text="For Salon"
//           variant="header"
//           isActive={selected === "salon"}
//           onClick={() => navigate("/salon")}
//           className="min-w-[110px] sm:min-w-[140px]"
//         />

//         <PrimaryButton
//           text="For Customer"
//           variant="header"
//           isActive={selected === "customer"}
//           onClick={() => navigate("/")}
//           className="min-w-[110px] sm:min-w-[140px]"
//         />
//       </div>
//     </div>
//   );
// };

// export default Header;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import PrimaryButton from "../../common/site/PrimaryButton";

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const selected = pathname === "/salon" ? "salon" : "customer";

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div
      className="
        fixed top-0 left-0 w-full z-50
        h-[60px] sm:h-[70px] md:h-[79px]
        bg-white/80 backdrop-blur-xl
        border-b border-black/10
        px-3 sm:px-6 md:px-12
        flex items-center justify-between
      "
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo"
        className="
          w-[60px] sm:w-[75px] md:w-[84px]
          h-auto object-contain
          cursor-pointer
        "
        onClick={() => handleNav("/")}
      />

      {/* Desktop Buttons */}
      <div className="hidden sm:flex items-center gap-3 md:gap-4">
        <PrimaryButton
          text="For Salon"
          variant="header"
          isActive={selected === "salon"}
          onClick={() => handleNav("/salon")}
          className="min-w-[140px]"
        />

        <PrimaryButton
          text="For Customer"
          variant="header"
          isActive={selected === "customer"}
          onClick={() => handleNav("/")}
          className="min-w-[150px]"
        />
      </div>

      {/* Mobile Hamburger */}
      <div className="sm:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            w-[38px] h-[38px]
            flex items-center justify-center
            rounded-lg
            bg-vmb-primary
            text-white
          "
        >
          {menuOpen ?
            <FaTimes size={18} />
          : <FaBars size={18} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className="
            absolute top-full left-0 w-full
            bg-white/95 backdrop-blur-xl
            border-b border-black/10
            shadow-lg
            sm:hidden
            animate-fadeIn
          "
        >
          <div className="flex flex-col p-3 gap-2">
            <button
              onClick={() => handleNav("/salon")}
              className={`
                w-full text-left px-4 py-3 rounded-lg
                font-poppins text-[14px]
                flex items-center justify-between
                ${
                  selected === "salon" ?
                    "bg-vmb-primary text-white"
                  : "bg-transparent text-vmb-primary"
                }
              `}
            >
              <span>For Salon</span>
            </button>

            <button
              onClick={() => handleNav("/")}
              className={`
                w-full text-left px-4 py-3 rounded-lg
                font-poppins text-[14px]
                flex items-center justify-between
                ${
                  selected === "customer" ?
                    "bg-vmb-primary text-white"
                  : "bg-transparent text-vmb-primary"
                }
              `}
            >
              <span>For Customer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
