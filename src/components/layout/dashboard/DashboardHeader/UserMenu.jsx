import React, { useState, useRef, useEffect } from "react";
import profile from "../../../../assets/dashboard/profile.jpg";
import Dropdown from "../../../common/dashboard/Dropdown/Dropdown";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useDispatch } from "react-redux";

import { setAuthMode } from "../../../../store/features/authSlice";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { useLogoutMutation } from "../../../../store/api/authApi";
import { logout as logoutAction } from "../../../../store/features/userSlice";
import { useUser } from "../../../../hooks/useUser";
function UserMenu() {
  const [open, setOpen] = useState(false);
  const { openModal } = useDashboardModal();
  const ref = useRef(null);
  const dispatch = useDispatch();
  const toggle = () => setOpen((prev) => !prev);
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const { user } = useUser();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = async () => {
    try {
      await logout().unwrap();

      dispatch(logoutAction());
      dispatch(setAuthMode("login"));
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);

      dispatch(logoutAction());
      dispatch(setAuthMode("login"));
      navigate("/");
    }
  };
  const menuItems = [
    {
      label: "Profile Settings",
      onClick: () => {
        openModal("profileSettings", user);
      },
    },
    {
      label: "Change Password",
      onClick: () => openModal("changePassword"),
    },
  ];

  return (
    <div className="flex items-center gap-x-6" ref={ref}>
      <div className="relative">
        <div
          className="h-[42px] w-[42px] overflow-hidden cursor-pointer border border-[#ded3cc] bg-[#f5eee9]"
          style={{
            backdropFilter: "blur(10px)",
          }}
          onClick={toggle}
        >
          <img
            src={user?.userProfile || user?.profilePic || profile}
            alt="profile"
            className="h-full w-full object-cover"
          />
        </div>

        {open && <Dropdown items={menuItems} />}
      </div>

      <button
        onClick={handleLogout}
        className={`flex items-center justify-center w-auto h-[36px] sm:w-[128px] sm:h-[42px] rounded-[4px] gap-2 sm:gap-[10px] border border-[#ded3cc] bg-[#f5eee9] px-3 sm:px-[10px] py-1 sm:py-[10px] text-vmb-primary hover:bg-[#efe3dc] transition-all ${
          isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={isLoading}
      >
        <TbLogout2 className="text-[18px] sm:text-[21px]" />
        <span className="text-[12px] sm:text-[13px] font-poppins font-semibold uppercase tracking-[0.04em]">
          {isLoading ? "Logging out..." : "Log Out"}
        </span>
      </button>
    </div>
  );
}

export default UserMenu;
