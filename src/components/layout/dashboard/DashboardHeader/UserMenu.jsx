import React, { useState, useRef, useEffect } from "react";
import profile from "../../../../assets/dashboard/profile.jpg";
import Dropdown from "../../../common/dashboard/Dropdown/Dropdown";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearRole } from "../../../../store/features/roleSlice";
import { setAuthMode } from "../../../../store/features/authSlice";
import { useNavigate } from "react-router-dom";

import { useLogoutMutation } from "../../../../store/api/authApi";
import { clearUser } from "../../../../store/features/userSlice";
import { useUser } from "../../../../hooks/useUser";
function UserMenu() {
  const { role } = useSelector((state) => state.role);

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
      dispatch(clearUser());
      dispatch(setAuthMode("login"));
      navigate("/register");
    } catch (error) {
      console.error("Logout failed:", error);

      dispatch(clearRole());
      dispatch(setAuthMode("login"));
      navigate("/register");
    }
  };
  const menuItems = [
    {
      label: "Profile Setting",
      onClick: () => {
        openModal("profileSettings", {
          fullName: user?.name || "John Doe",
          email: user?.email || "john.doe@example.com",
          phone: user?.phoneNumber || "+1 555 123 4567",
        });
      },
    },
    {
      label: "Change Password",
      onClick: () => openModal("changePassword"),
    },
    {
      label: isLoading ? "Logging out..." : "Log Out",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <div
        className="h-[40px] w-[40px] rounded-full overflow-hidden cursor-pointer"
        style={{
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #E5E7EB",
        }}
        onClick={toggle}
      >
        <img src={profile} alt="profile" className="h-full w-full" />
      </div>

      {open && <Dropdown items={menuItems} />}
    </div>
  );
}

export default UserMenu;
