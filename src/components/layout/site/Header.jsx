import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const pillBase =
  "inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.07em] transition sm:min-h-[42px] sm:px-5 sm:text-[12px]";
const pillIdle =
  "bg-vmb-primary text-white hover:brightness-110";
const pillActive =
  "bg-vmb-secondary text-white ring-2 ring-vmb-secondary ring-offset-2 ring-offset-[#fffdfb]";

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

  const goLogin = () => {
    dispatch(setAuthMode("login"));
    dispatch(setAuthType(selected));
    navigate("/register");
    setMenuOpen(false);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#ded3cc] bg-[#fffdfb]/96 backdrop-blur-xl">
      <div className="relative flex h-[76px] items-center justify-between gap-3 px-3 sm:gap-4 sm:px-6 md:px-12">
        <button
          type="button"
          onClick={() => handleNav("/")}
          className="flex min-w-0 flex-col items-start text-left text-vmb-primary"
        >
          <span className="font-studio-serif text-[24px] font-semibold uppercase leading-none tracking-[0.18em] sm:text-[32px] sm:tracking-[0.22em]">
            VMB
          </span>
          <span className="mt-0.5 font-studio-serif text-[11px] font-medium italic tracking-[0.06em] text-vmb-text-muted sm:text-[12px] sm:tracking-[0.08em]">
            Ven Me, Baby
          </span>
        </button>

        <div className="hidden flex-1 items-center justify-end gap-2 sm:flex md:gap-3">
          <button
            type="button"
            onClick={() => handleNav("/salon")}
            className={`${pillBase} ${
              selected === "salon" ? pillActive : pillIdle
            }`}
          >
            For Salon +
          </button>
          <button
            type="button"
            onClick={() => handleNav("/")}
            className={`${pillBase} ${
              selected === "customer" ? pillActive : pillIdle
            }`}
          >
            For Customer +
          </button>
          <button
            type="button"
            onClick={goLogin}
            className={`${pillBase} ${pillIdle} gap-2`}
          >
            <span
              className="size-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.85)]"
              aria-hidden
            />
            Login
          </button>
        </div>

        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-[4px] bg-vmb-primary text-white"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ?
              <FaTimes size={18} />
            : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {menuOpen ?
        <div className="absolute top-full left-0 w-full animate-fadeIn border-b border-[#ded3cc] bg-[#fffdfb]/98 shadow-lg backdrop-blur-xl sm:hidden">
          <div className="flex flex-col gap-2 p-3">
            <button
              type="button"
              onClick={() => handleNav("/salon")}
              className={`${pillBase} w-full ${
                selected === "salon" ? pillActive : pillIdle
              }`}
            >
              For Salon +
            </button>
            <button
              type="button"
              onClick={() => handleNav("/")}
              className={`${pillBase} w-full ${
                selected === "customer" ? pillActive : pillIdle
              }`}
            >
              For Customer +
            </button>
            <button
              type="button"
              onClick={goLogin}
              className={`${pillBase} w-full gap-2 ${pillIdle}`}
            >
              <span
                className="size-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.85)]"
                aria-hidden
              />
              Login
            </button>
          </div>
        </div>
      : null}
    </header>
  );
};

export default Header;
