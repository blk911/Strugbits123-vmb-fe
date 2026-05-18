import React, { useEffect, useReducer } from "react";
import { menus } from "../../../../config/menuConfig";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useUser } from "../../../../hooks/useUser";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import { LuExternalLink } from "react-icons/lu";
import {
  DEEP_INSIGHTS_DATASET_EVENT,
  deepInsightsPreferredPath,
} from "../../../../lib/deep-insights/storageKeys.js";

function DashboardSidebar() {
  const { user, loading } = useUser();
  const location = useLocation();
  const [, forceDeepInsightsNav] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const onDatasetChange = () => forceDeepInsightsNav();
    window.addEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDatasetChange);
    return () => window.removeEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDatasetChange);
  }, []);

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
    <div className="h-full bg-[#fffdfb]/90 flex flex-col border-r border-[#ded3cc]" lang="en">
      <div className="flex flex-col gap-y-[6px] px-[8px] py-[26px] flex-1 overflow-y-auto custom-scrollbar">
        {items.map((item, idx) => {
          if (item.type === "divider") {
            return (
              <div
                key={`divider-${idx}`}
                className="my-3 flex items-center gap-2 px-1 select-none"
                aria-hidden
              >
                <span className="h-px flex-1 border-t border-dashed border-[#c9bfb8]" />
                <span className="font-studio-sans text-[9px] tracking-[0.35em] text-[#a9a09b]">
                  ———————
                </span>
                <span className="h-px flex-1 border-t border-dashed border-[#c9bfb8]" />
              </div>
            );
          }

          const isGroupActive =
            (Array.isArray(item.activeGroupPrefixes) &&
              item.activeGroupPrefixes.some((p) =>
                location.pathname.startsWith(p),
              )) ||
            (typeof item.groupPath === "string" &&
              location.pathname.startsWith(item.groupPath)) ||
            (!item.groupPath &&
              item.children?.some((child) =>
                location.pathname.startsWith(child.path),
              )) ||
            false;

          if (item.children?.length) {
            const groupParentTo =
              item.deepInsightsPreferredEntry ? deepInsightsPreferredPath() : item.path;
            return (
              <div key={idx} className="flex flex-col gap-y-[4px]">
                <NavLink
                  to={groupParentTo}
                  className={`flex min-w-0 justify-start max-[1100px]:flex-col flex-row gap-2 py-[9px] sm:px-[8px]
   rounded-[4px] transition-all duration-200 border
   ${
     item.subtext ? "items-start" : "items-center"
   }
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
                    {item.menuIconUnstyled ?
                      item.icon
                    : React.cloneElement(item.icon, { className: "w-5 h-5" })}
                  </span>

                  {item.subtext ?
                    <span className="flex min-w-0 flex-col gap-0.5 text-left max-[1100px]:items-center max-[1100px]:text-center max-sm:hidden">
                      <span className="text-wrap break-words text-[11px] sm:text-[12px] xl:text-[13px] font-semibold leading-tight normal-case tracking-[0.02em]">
                        {item.name}
                      </span>
                      <span className="text-wrap break-words text-[9px] sm:text-[10px] xl:text-[11px] font-medium leading-tight normal-case tracking-[0.05em] text-inherit opacity-70">
                        {item.subtext}
                      </span>
                    </span>
                  : <span className="max-[1100px]:text-center text-left text-wrap text-[10px] sm:text-[11px] xl:text-[13px] uppercase tracking-[0.05em] hyphens-auto break-normal min-w-0 max-sm:hidden">
                      {item.name}
                    </span>
                  }
                </NavLink>

                <div className="ml-5 flex flex-col gap-y-[3px] border-l border-[#ded3cc] pl-2 max-[1100px]:ml-0 max-[1100px]:border-l-0 max-[1100px]:pl-0">
                  {item.children.map((child) => (
                    <NavLink
                      to={child.path}
                      key={child.path}
                      end
                      className={({ isActive }) =>
                        `flex min-w-0 justify-start items-center max-[1100px]:flex-col flex-row gap-2 rounded-[4px] px-2 py-[7px] transition-all duration-200 ${
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
                      <span className="max-[1100px]:text-center text-left text-wrap text-[10px] sm:text-[11px] xl:text-[12px] uppercase tracking-[0.04em] hyphens-auto break-normal min-w-0 max-sm:hidden">
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
                `flex min-w-0 justify-start items-center max-[1100px]:flex-col flex-row gap-2 py-[9px] sm:px-[8px]
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

                <span className="max-[1100px]:text-center text-left text-wrap text-[10px] sm:text-[11px] xl:text-[13px] uppercase tracking-[0.05em] hyphens-auto break-normal min-w-0 max-sm:hidden">
                  {item.name}
                </span>
              </>
            </NavLink>
          );
        })}
      </div>

      {role === "salon-owner" && (
        <div className="px-3 pb-6 flex-shrink-0">
          <div className="h-px mb-4 bg-[#ded3cc]" />
          <Link
            to="/salon-detail"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] transition-all duration-200 hover:bg-[#f5eee9] group"
          >
            <LuExternalLink className="w-[18px] h-[18px] flex-shrink-0 text-vmb-secondary" />
            <span className="text-[11px] sm:text-[12px] xl:text-[13px] font-medium leading-tight max-sm:hidden text-vmb-secondary">
              Your Salon Page
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default DashboardSidebar;
