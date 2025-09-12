import React, { useState, useRef, useEffect } from "react";
import profile from "../../../../assets/dashboard/profile.jpg";
import Dropdown from "../../../common/Dropdown/Dropdown";

function UserMenu() {
  const [open, setOpen] = useState(false);
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
    { label: "Profile Setting", onClick: () => console.log("Profile") },
    {
      label: "Notification Setting",
      onClick: () => console.log("Notifications"),
    },
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
