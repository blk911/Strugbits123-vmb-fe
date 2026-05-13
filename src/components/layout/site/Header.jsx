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

  const navItems = [
    { label: "Services", path: "/" },
    { label: "Salon Growth", path: "/salon" },
    { label: "Gift Certificates", path: "/" },
    { label: "Schedule A Reservation", path: "/register", active: true },
    { label: "Rewards", path: "/" },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#ded3cc] bg-[#fffdfb]/96 backdrop-blur-xl">
      <div className="relative flex h-[76px] items-center justify-between gap-4 px-3 sm:px-6 md:px-12">
        <button
          type="button"
          onClick={() => handleNav("/")}
          className="hidden flex-col items-start text-left text-vmb-primary sm:flex"
        >
          <span className="font-studio-serif text-[28px] font-semibold uppercase leading-none tracking-[0.2em] sm:text-[34px] sm:tracking-[0.22em]">
            VMB
          </span>
          <span className="mt-0.5 text-[10px] font-semibold lowercase tracking-[0.16em] text-vmb-text-muted sm:text-[11px] sm:tracking-[0.18em]">
            Ven Me, Baby
          </span>
        </button>

        <img
          src="/logo.png"
          alt="Logo"
          className="h-auto w-[52px] flex-shrink-0 cursor-pointer object-contain sm:hidden"
          onClick={() => handleNav("/")}
        />

        <div className="hidden flex-1 items-center justify-end gap-2 sm:flex md:gap-3">
          <PrimaryButton
            text="Book Now"
            variant="header"
            isActive
            onClick={() => navigate("/register")}
            className="min-w-0 !px-4 sm:!px-[14px]"
            authMode={"login"}
            authType={selected}
          />
          <PrimaryButton
            text="Gift Cards"
            variant="header"
            isActive
            onClick={() => navigate("/register")}
            className="min-w-0 !px-4 sm:!px-[14px]"
            authMode={"signup"}
            authType={selected}
          />
          <PrimaryButton
            text="Products"
            variant="header"
            isActive
            onClick={() => handleNav("/about")}
            className="min-w-0 !px-4 sm:!px-[14px]"
          />
        </div>

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
      </div>

      <nav className="hidden h-[42px] items-stretch border-t border-[#ded3cc] bg-[#fffdfb] sm:flex">
        <div className="flex shrink-0 items-end self-stretch border-r border-[#ded3cc] bg-[#f5eee9]">
          <PrimaryButton
            text="Spa + Salon"
            variant="header"
            isActive={selected === "salon"}
            onClick={() => handleNav("/salon")}
            className="min-w-[100px] md:min-w-[116px]"
          />
          <PrimaryButton
            text="Client"
            variant="header"
            isActive={selected === "customer"}
            onClick={() => handleNav("/")}
            className="min-w-[88px] md:min-w-[104px]"
          />
          <PrimaryButton
            text="Products"
            variant="header"
            onClick={() => handleNav("/about")}
            className="min-w-[100px] md:min-w-[116px]"
          />
        </div>
        <div className="flex min-w-0 flex-1 items-stretch justify-center overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                if (item.path === "/register") {
                  dispatch(setAuthMode("login"));
                  dispatch(setAuthType(selected));
                }
                handleNav(item.path);
              }}
              className={`shrink-0 px-4 text-[12px] font-bold uppercase tracking-[0.08em] transition md:px-5 md:text-[13px] ${
                item.active ?
                  "bg-vmb-primary text-white"
                : "text-vmb-primary hover:bg-[#f5eee9]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

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
              onClick={() => handleNav("/about")}
              className="w-full text-left px-4 py-3 rounded-[4px] font-poppins text-[14px] text-vmb-primary bg-[#f5eee9]"
            >
              Products
            </button>
            <button
              onClick={() => {
                dispatch(setAuthMode("login"));
                dispatch(setAuthType(selected));
                handleNav("/register");
              }}
              className="w-full text-center px-4 py-3 rounded-[4px] font-poppins text-[14px] bg-[#fffdfb] text-vmb-primary underline decoration-vmb-secondary decoration-2 underline-offset-4"
            >
              Book Now
            </button>
            <button
              onClick={() => {
                dispatch(setAuthMode("signup"));
                dispatch(setAuthType(selected));
                handleNav("/register");
              }}
              className="w-full text-center px-4 py-3 rounded-[4px] font-poppins text-[14px] bg-[#fffdfb] text-vmb-primary underline decoration-vmb-secondary decoration-2 underline-offset-4"
            >
              Gift Cards
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
    </header>
  );
};

export default Header;
