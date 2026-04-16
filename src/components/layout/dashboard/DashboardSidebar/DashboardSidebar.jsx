import React from "react";
import { menus } from "../../../../config/menuConfig";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUser } from "../../../../hooks/useUser";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

function DashboardSidebar() {
  const { role } = useSelector((state) => state.role);
  const { user, loading } = useUser();
  const roleMap = {
    "salon-owner": "salonOwner",
    customer: "customer",
    admin: "admin",
  };
  if (loading) {
    return (
      <div className="h-full bg-white/50 flex flex-col items-center justify-center border-r border-vmb-primary/10">
        <LoadingIndicator size="md" />
      </div>
    );
  }
  let items = menus[roleMap[role]] || [];
  if (role === "salon-owner" && user?.status === "hold") {
    items = items.filter((item) => item.name === "Dashboard");
  }
  if (user?.isSuspended) {
    items = items.filter((item) => item.name === "Dashboard");
  }
  return (
    <div className="h-full bg-white/50 flex flex-col border-r border-vmb-primary/10 ">
      <div className="flex flex-col gap-y-[10px] px-[8px]  py-[30px]">
        {items.map((item, idx) => (
          <NavLink
            to={item.path}
            key={idx}
            end
            className={({ isActive }) =>
              `flex justify-start items-center max-[1100px]:flex-col flex-row gap-2 py-[8px] sm:px-[4px]
   rounded-[14px] transition-all duration-200
   ${
     isActive ?
       "bg-vmb-secondary text-white shadow-sm"
     : "bg-transparent text-vmb-primary hover:bg-vmb-secondary/10"
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
