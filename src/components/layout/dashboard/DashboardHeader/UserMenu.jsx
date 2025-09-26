import React, { useState, useRef, useEffect } from "react";
import profile from "../../../../assets/dashboard/profile.jpg";
import Dropdown from "../../../common/dashboard/Dropdown/Dropdown";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useSelector } from "react-redux";

function UserMenu() {
  const { role } = useSelector((state) => state.role)

  const [open, setOpen] = useState(false);
  const { openModal } = useDashboardModal();
  const ref = useRef(null);

  const toggle = () => setOpen((prev) => !prev);

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
    { label: "Profile Setting", onClick: () => role == "admin" ? openModal("editAdminProfile") : openModal("editProfile") },
    { label: "Log Out", onClick: () => console.log("Log out"), danger: true },
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
