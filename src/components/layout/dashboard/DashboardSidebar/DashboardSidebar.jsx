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
      <div className="h-full bg-[#fffdfb]/90 flex flex-col items-center justify-center border-r border-[#ded3cc]">
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
    <div className="h-full bg-[#fffdfb]/90 flex flex-col border-r border-[#ded3cc] ">
      <div className="flex flex-col gap-y-[6px] px-[8px] py-[26px]">
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
                  className={`flex justify-start items-center max-[1100px]:flex-col flex-row gap-2 py-[9px] sm:px-[8px]
   rounded-[4px] transition-all duration-200 border
   ${
     isGroupActive ?
       "border-[#d2b48a] bg-[linear-gradient(135deg,#f8eee9,#e8cfc7)] text-[#333232] shadow-[0_10px_24px_-20px_rgba(164,95,118,0.7)]"
     : "border-transparent bg-transparent text-vmb-primary hover:border-[#ded3cc] hover:bg-[#f5eee9]"
   } text-center `}
                  style={{
                    fontFamily: "Libre Franklin, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  <span className="flex items-center justify-center flex-shrink-0 w-8 h-8">
                    {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                  </span>

                  <span className="max-[1100px]:text-center text-left text-wrap text-[10px] sm:text-[11px] xl:text-[13px] uppercase tracking-[0.05em] break-all max-sm:hidden">
                    {item.name}
                  </span>
                </NavLink>

                <div className="ml-5 flex flex-col gap-y-[3px] border-l border-[#ded3cc] pl-2 max-[1100px]:ml-0 max-[1100px]:border-l-0 max-[1100px]:pl-0">
                  {item.children.map((child) => (
                    <NavLink
                      to={child.path}
                      key={child.path}
                      end
                      className={({ isActive }) =>
                        `flex justify-start items-center max-[1100px]:flex-col flex-row gap-2 rounded-[4px] px-2 py-[7px] transition-all duration-200 ${
                          isActive ?
                            "bg-[#f3e3de] text-[#333232]"
                          : "bg-transparent text-vmb-primary/70 hover:bg-[#f5eee9]"
                        } text-center`
                      }
                      style={{
                        fontFamily: "Libre Franklin, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      <span className="flex items-center justify-center flex-shrink-0 w-7 h-7">
                        {React.cloneElement(child.icon, {
                          className: "w-4 h-4",
                        })}
                      </span>
                      <span className="max-[1100px]:text-center text-left text-wrap text-[10px] sm:text-[11px] xl:text-[12px] uppercase tracking-[0.04em] break-all max-sm:hidden">
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
                `flex justify-start items-center max-[1100px]:flex-col flex-row gap-2 py-[9px] sm:px-[8px]
   rounded-[4px] transition-all duration-200 border
   ${
     isActive ?
       "border-[#d2b48a] bg-[linear-gradient(135deg,#f8eee9,#e8cfc7)] text-[#333232] shadow-[0_10px_24px_-20px_rgba(164,95,118,0.7)]"
     : "border-transparent bg-transparent text-vmb-primary hover:border-[#ded3cc] hover:bg-[#f5eee9]"
   } text-center `
            }
              style={{
                fontFamily: "Libre Franklin, sans-serif",
                fontWeight: 600,
              }}
            >
              <>
                <span className="flex items-center justify-center flex-shrink-0 w-8 h-8">
                  {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                </span>

                <span className=" max-[1100px]:text-center text-left text-wrap text-[10px] sm:text-[11px] xl:text-[13px] uppercase tracking-[0.05em] break-all max-sm:hidden ">
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
