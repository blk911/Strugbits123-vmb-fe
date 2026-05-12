import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
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
    { label: "Products", path: "/about" },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#ded3cc] bg-[#fffdfb]/96 backdrop-blur-xl">
      <div className="relative flex h-[76px] items-center justify-between px-3 sm:px-6 md:px-12">
        <div className="hidden sm:flex items-end gap-0 self-end border border-b-0 border-[#ded3cc] bg-[#f5eee9]">
          <PrimaryButton
            text="Spa + Salon"
            variant="header"
            isActive={selected === "salon"}
            onClick={() => handleNav("/salon")}
            className="min-w-[116px]"
          />

          <PrimaryButton
            text="Client"
            variant="header"
            isActive={selected === "customer"}
            onClick={() => handleNav("/")}
            className="min-w-[104px]"
          />

          <PrimaryButton
            text="Products"
            variant="header"
            onClick={() => handleNav("/about")}
            className="min-w-[116px]"
          />
        </div>

        <button
          type="button"
          onClick={() => handleNav("/")}
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center text-vmb-primary sm:flex"
        >
          <span className="font-studio-serif text-[42px] font-semibold uppercase leading-none tracking-[0.22em]">
            VMB
          </span>
          <span className="mt-0.5 text-[11px] font-semibold lowercase tracking-[0.18em] text-vmb-text-muted">
            Ven Me, Baby
          </span>
        </button>

        <img
          src="/logo.png"
          alt="Logo"
          className="h-auto w-[60px] cursor-pointer object-contain sm:hidden"
          onClick={() => handleNav("/")}
        />

        <div className="hidden items-center gap-3 sm:flex">
          <PrimaryButton
            text="Book Now"
            variant="gold"
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto text-[12px] sm:text-[13px]"
            authMode={"login"}
            authType={selected}
          />
          <PrimaryButton
            text="Gift Cards"
            variant="gold"
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto text-[12px] sm:text-[13px]"
            authMode={"signup"}
            authType={selected}
          />
          <button
            type="button"
            onClick={() => handleNav("/about")}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center text-xl text-vmb-primary transition hover:text-vmb-secondary"
          >
            <FaSearch aria-hidden />
          </button>
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

      <nav className="hidden h-[42px] items-stretch justify-center border-t border-[#ded3cc] bg-[#fffdfb] sm:flex">
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
            className={`px-5 text-[13px] font-bold uppercase tracking-[0.08em] transition ${
              item.active ?
                "bg-vmb-primary text-white"
              : "text-vmb-primary hover:bg-[#f5eee9]"
            }`}
          >
            {item.label}
          </button>
        ))}
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
