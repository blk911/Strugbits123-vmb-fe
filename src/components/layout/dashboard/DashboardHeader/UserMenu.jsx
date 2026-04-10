import React, { useState, useRef, useEffect } from "react";
import profile from "../../../../assets/dashboard/profile.jpg";
import Dropdown from "../../../common/dashboard/Dropdown/Dropdown";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useDispatch } from "react-redux";
import { clearRole } from "../../../../store/features/roleSlice";
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
      dispatch(clearRole());
      dispatch(logoutAction());
      dispatch(setAuthMode("login"));
      navigate("/register");
    } catch (error) {
      console.error("Logout failed:", error);

      dispatch(clearRole());
      dispatch(logoutAction());
      dispatch(setAuthMode("login"));
      navigate("/register");
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
          className="h-[40px] w-[40px] rounded-full overflow-hidden cursor-pointer border-b border-vmb-primary/10"
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
        className={`flex items-center justify-center w-auto h-[36px] sm:w-[128px] sm:h-[48px] rounded-[10px] gap-2 sm:gap-[12px] bg-vmb-secondary/30 px-3 sm:px-[10px] py-1 sm:py-[12px] text-vmb-primary hover:opacity-80 transition-all ${
          isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={isLoading}
      >
        <TbLogout2 className="text-[18px] sm:text-[21px]" />
        <span className="text-[13px] sm:text-[16px] font-poppins">
          {isLoading ? "Logging out..." : "Log Out"}
        </span>
      </button>
    </div>
  );
}

export default UserMenu;
