import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";
import { FaBars, FaTimes } from "react-icons/fa";
import PrimaryButton from "../../common/site/PrimaryButton";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        h-[58px] sm:h-[68px] md:h-[76px]
        bg-[#fffdfb]/92 backdrop-blur-xl
        border-b border-[#ded3cc]
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
      <div className="hidden sm:flex items-center gap-0 border border-[#ded3cc] bg-[#f5eee9]">
        <PrimaryButton
          text="For Salon"
          variant="header"
          isActive={selected === "salon"}
          onClick={() => handleNav("/salon")}
          className="min-w-[136px]"
        />

        <PrimaryButton
          text="For Customer"
          variant="header"
          isActive={selected === "customer"}
          onClick={() => handleNav("/")}
          className="min-w-[150px]"
        />
      </div>
      <div className="hidden sm:flex items-center">
        <PrimaryButton
          text="Login"
          variant="gold"
          onClick={() => navigate("/register")}
          className="w-full sm:w-auto text-[12px] sm:text-[14px]"
          authMode={"login"}
          authType={selected}
        />
      </div>

      {/* Mobile Hamburger */}
      <div className="sm:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            w-[38px] h-[38px]
            flex items-center justify-center
            rounded-[4px]
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
            bg-[#fffdfb]/98 backdrop-blur-xl
            border-b border-[#ded3cc]
            shadow-lg
            sm:hidden
            animate-fadeIn
          "
        >
          <div className="flex flex-col p-3 gap-2">
            <button
              onClick={() => handleNav("/salon")}
              className={`
                w-full text-left px-4 py-3 rounded-[4px]
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
                w-full text-left px-4 py-3 rounded-[4px]
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
            <button
              onClick={() => {
                dispatch(setAuthMode("login"));
                dispatch(setAuthType(selected));
                handleNav("/register");
              }}
              className="w-full text-center px-4 py-3 rounded-[4px] font-poppins text-[14px] bg-vmb-secondary text-white mt-1 hover:bg-vmb-primary transition-all duration-300"
            >
              <span>Login</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
