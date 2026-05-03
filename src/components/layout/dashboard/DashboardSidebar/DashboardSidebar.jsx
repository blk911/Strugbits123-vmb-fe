import React from "react";
import { menus } from "../../../../config/menuConfig";
import { NavLink, Link } from "react-router-dom";
import { useUser } from "../../../../hooks/useUser";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import { LuExternalLink } from "react-icons/lu";

function DashboardSidebar() {
  const { user, loading } = useUser();
  const role = user?.role;
  const roleMap = {
    "salon-owner": "salonOwner",
    customer: "customer",
    admin: "admin",
  };

  if (loading) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center border-r border-vmb-primary/10"
        style={{ background: "var(--vmb-sidebar-bg)" }}
      >
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
    <div
      className="h-full flex flex-col border-r border-vmb-primary/10"
      style={{ background: "var(--vmb-sidebar-bg)" }}
    >
      <nav className="flex flex-col gap-y-1 px-3 py-6 flex-1">
        {items.map((item, idx) => (
          <NavLink
            to={item.path}
            key={idx}
            end
            className={({ isActive }) =>
              `flex items-center max-[1100px]:flex-col max-[1100px]:text-center flex-row gap-2.5 px-3 py-2.5
               rounded-[10px] transition-all duration-200 font-poppins font-medium
               ${
                 isActive
                   ? "bg-vmb-primary text-white shadow-sm"
                   : "text-vmb-secondary hover:bg-vmb-primary/[0.08]"
               }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex-shrink-0">
                  {React.cloneElement(item.icon, {
                    className: `w-[18px] h-[18px] ${isActive ? "text-white" : "text-vmb-secondary"}`,
                  })}
                </span>
                <span className="text-[11px] sm:text-[12px] xl:text-[13px] leading-tight max-sm:hidden">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {role === "salon-owner" && (
        <div className="px-3 pb-6">
          <div
            className="h-px mb-4"
            style={{ background: "var(--vmb-border-light)" }}
          />
          <Link
            to="/salon-detail"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] transition-all duration-200 hover:bg-vmb-primary/[0.08] group"
          >
            <LuExternalLink
              className="w-[18px] h-[18px] flex-shrink-0"
              style={{ color: "var(--vmb-gold)" }}
            />
            <span
              className="text-[11px] sm:text-[12px] xl:text-[13px] font-poppins font-medium leading-tight max-sm:hidden"
              style={{ color: "var(--vmb-gold)" }}
            >
              Your Salon Page
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default DashboardSidebar;
