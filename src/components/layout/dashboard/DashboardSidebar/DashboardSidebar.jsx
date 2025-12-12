import React from "react";
import { menus } from "../../../../config/menuConfig";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function DashboardSidebar() {
  const { role } = useSelector((state) => state.role);
  const roleMap = {
    "salon-owner": "salonOwner",
    customer: "customer",
    admin: "admin",
  };

  const items = menus[roleMap[role]] || [];

  return (
    <div className="h-full bg-white flex flex-col border bt-[1px] border-[#E5E7EB] ">
      <div className="flex flex-col gap-y-[10px] px-[16px] lg:px-[20px] py-[30px]">
        {items.map((item, idx) => (
          <NavLink
            to={item.path}
            key={idx}
            end
            className={({ isActive }) =>
              `flex justify-start items-center max-[1100px]:flex-col flex-row gap-2 py-[8px] sm:px-[4px]
   rounded-[14px] transition-all duration-200
   ${
     isActive ? "bg-[#FF92A5] text-white" : "bg-white text-[#581838]"
   } text-center `
            }
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex  items-center justify-center flex-shrink-0 rounded-full w-9 h-9

  `}
                >
                  {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                </span>

                <span className=" max-[1100px]:text-center text-left text-wrap  text-[10px] sm:text-[12px]  xl:text-[14px]   break-all max-sm:hidden ">
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
