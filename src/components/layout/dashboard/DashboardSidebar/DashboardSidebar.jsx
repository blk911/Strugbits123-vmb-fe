import React from "react";
import { menus } from "../../../../config/menuConfig";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function DashboardSidebar() {
  const { role } = useSelector((state) => state.role);
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
              `flex items-center gap-x-[16px] py-[12px] sm:pl-[12px] sm:pr-[66px]
   rounded-[14px] transition-all duration-200 max-xl:text-[16px] xl:text-[16px]
   ${isActive ? "sm:bg-[#FF92A5] text-white" : "bg-white text-[#581838]"}`
            }
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center flex-shrink-0 rounded-full w-9 h-9
    ${isActive ? "bg-white text-[#FF92A5]" : "bg-[#FCECEF] text-[#581838]"}
  `}
                >
                  {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                </span>

                <span className="flex-1 min-w-[100px] break-words hidden xl:inline">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default DashboardSidebar;
