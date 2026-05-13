import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../../store/features/authSlice";

export default function HeroActions({
  onSendGift,
  onBookExperience,
  className = "",
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goRegisterSalon = () => {
    dispatch(setAuthType("salon"));
    dispatch(setAuthMode("signup"));
    navigate("/register");
  };

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${className}`}
    >
      <button
        type="button"
        onClick={goRegisterSalon}
        className="group relative overflow-hidden rounded-full bg-[#F7E7CE] px-6 py-2.5 text-[14px] font-semibold tracking-wide text-[#1a1520] shadow-[0_8px_32px_-8px_rgba(247,231,206,0.45)] transition duration-300 hover:brightness-[1.03] active:scale-[0.99] sm:min-w-[180px] sm:py-3 sm:text-[15px]"
      >
        <span className="relative z-[1]">Request Invite</span>
        <span
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100"
          aria-hidden
        />
      </button>
      <button
        type="button"
        onClick={onSendGift}
        className="rounded-full border border-white/[0.18] bg-[#1a2235]/55 px-6 py-2.5 text-[14px] font-semibold tracking-wide text-[#f8f4eb] backdrop-blur-md transition duration-300 hover:border-[#F7E7CE]/35 hover:bg-[#232f4a]/55 sm:py-3 sm:text-[15px]"
      >
        Send a Gift
      </button>
      <button
        type="button"
        onClick={onBookExperience}
        className="rounded-full border border-white/10 bg-transparent px-6 py-2.5 text-[14px] font-medium tracking-wide text-[#e8e2d6]/90 transition duration-300 hover:border-white/20 hover:bg-white/[0.04] sm:py-3 sm:text-[15px]"
      >
        Book Experience
      </button>
    </div>
  );
}
