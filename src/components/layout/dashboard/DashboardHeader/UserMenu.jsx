import React, { useState, useRef, useEffect } from "react";
import profile from "../../../../assets/dashboard/profile.jpg";
import Dropdown from "../../../common/dashboard/Dropdown/Dropdown";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearRole } from "../../../../store/features/roleSlice";
import { setAuthMode } from "../../../../store/features/authSlice";
import { useNavigate } from "react-router-dom";
function UserMenu() {
  const { role } = useSelector((state) => state.role);

  const [open, setOpen] = useState(false);
  const { openModal } = useDashboardModal();
  const ref = useRef(null);
  const dispatch = useDispatch();
  const toggle = () => setOpen((prev) => !prev);
const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: "Profile Setting",
      onClick: () =>
        role == "admin"
          ? openModal("editAdminProfile")
          : openModal("editProfile"),
    },
    {
      label: "Log Out",
      onClick: () => {
        dispatch(clearRole());
        dispatch(setAuthMode("login"));
        navigate("/register");
      },
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
