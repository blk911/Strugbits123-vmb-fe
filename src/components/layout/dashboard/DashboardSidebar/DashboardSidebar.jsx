import React from "react";
import { menus } from "../../../../config/menuConfig";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "../../../../hooks/useUser";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

function DashboardSidebar() {
  const { user, loading } = useUser();
  const location = useLocation();
  const role = user?.role;
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
  items = items
    .filter((item) => !item.allowedRoles || item.allowedRoles.includes(role))
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) => !child.allowedRoles || child.allowedRoles.includes(role),
      ),
    }));
  if (role === "salon-owner" && user?.status === "hold") {
    items = items.filter((item) => item.name === "Dashboard");
  }
  if (user?.isSuspended) {
    items = items.filter((item) => item.name === "Dashboard");
  }
  return (
    <div className="h-full bg-white/50 flex flex-col border-r border-vmb-primary/10 ">
      <div className="flex flex-col gap-y-[10px] px-[8px]  py-[30px]">
        {items.map((item, idx) => {
          const isGroupActive =
            item.children?.some((child) =>
              location.pathname.startsWith(child.path),
            ) || false;

          if (item.children?.length) {
            return (
              <div key={idx} className="flex flex-col gap-y-[4px]">
                <NavLink
                  to={item.path}
                  className={`flex justify-start items-center max-[1100px]:flex-col flex-row gap-2 py-[8px] sm:px-[4px]
   rounded-[14px] transition-all duration-200
   ${
     isGroupActive ?
       "bg-vmb-secondary text-white shadow-sm"
     : "bg-transparent text-vmb-primary hover:bg-vmb-secondary/10"
   } text-center `}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                  }}
                >
                  <span className="flex items-center justify-center flex-shrink-0 rounded-full w-9 h-9">
                    {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                  </span>

                  <span className="max-[1100px]:text-center text-left text-wrap text-[10px] sm:text-[12px] xl:text-[14px] break-all max-sm:hidden">
                    {item.name}
                  </span>
                </NavLink>

                <div className="ml-5 flex flex-col gap-y-[3px] border-l border-vmb-primary/10 pl-2 max-[1100px]:ml-0 max-[1100px]:border-l-0 max-[1100px]:pl-0">
                  {item.children.map((child) => (
                    <NavLink
                      to={child.path}
                      key={child.path}
                      end
                      className={({ isActive }) =>
                        `flex justify-start items-center max-[1100px]:flex-col flex-row gap-2 rounded-[10px] px-2 py-[6px] transition-all duration-200 ${
                          isActive ?
                            "bg-vmb-secondary/20 text-vmb-primary"
                          : "bg-transparent text-vmb-primary/70 hover:bg-vmb-secondary/10"
                        } text-center`
                      }
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      <span className="flex items-center justify-center flex-shrink-0 rounded-full w-7 h-7">
                        {React.cloneElement(child.icon, {
                          className: "w-4 h-4",
                        })}
                      </span>
                      <span className="max-[1100px]:text-center text-left text-wrap text-[10px] sm:text-[11px] xl:text-[12px] break-all max-sm:hidden">
                        {child.name}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }

          return (
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
              <>
                <span className="flex items-center justify-center flex-shrink-0 rounded-full w-9 h-9">
                  {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                </span>

                <span className=" max-[1100px]:text-center text-left text-wrap  text-[10px] sm:text-[12px]  xl:text-[14px]   break-all max-sm:hidden ">
                  {item.name}
                </span>
              </>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardSidebar;
