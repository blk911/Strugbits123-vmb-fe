import React from "react";
import { menus } from "../../../../config/menuConfig";
import { useRole } from "../../../../context/RoleContext";
import { NavLink } from "react-router-dom";

function DashboardSidebar() {
  const { role } = useRole();
  const items = menus[role] || [];

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex flex-col gap-y-[10px] px-[20px] py-[30px]">
        {items.map((item, idx) => (
          <NavLink
            to={item.path}
            key={idx}
            end
            className={({ isActive }) =>
              `flex py-[12px] pl-[12px] sm:pr-[66px] rounded-[14px] items-center gap-x-[16px] max-xl:text-[16px] xl:text-[16px] max-xl:leading-[20px] ${
                isActive
                  ? "bg-[#FF92A5] text-white"
                  : "bg-white text-[#581838]"
              }`
            }
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-white" : "text-[#581838]"}>
                  {item.icon}
                </span>
                <span className="hidden xl:inline">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default DashboardSidebar;