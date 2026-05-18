import React from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import { TbExternalLink } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useUser } from "../../../../hooks/useUser";

/** Mock public slug until owner settings provide a real slug */
const SALON_OWNER_PUBLIC_PAGE_SLUG = "preview-salon";

function DashboardHeader({ toggleSidebar }) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <header className="h-[68px] w-full border-b border-[#ded3cc] bg-[#fffdfb]/92 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center">
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d2b48a] bg-[#f8eee9] text-xl text-vmb-primary hover:bg-[#ead6cf] focus:outline-none transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <HiMenuAlt2 />
        </button>

        {user?.role === "salon-owner" && user?.salonName && (
          <h1 className="ml-3 min-w-0 truncate font-studio-serif font-semibold uppercase tracking-[0.08em] text-vmb-primary text-[14px] sm:ml-4 sm:text-[18px] lg:text-[30px]">
            {user.salonName}
          </h1>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-x-3 sm:gap-x-5">
        {user?.role === "salon-owner" ?
          <button
            type="button"
            title="Open your public salon page"
            aria-label="Open your public salon page"
            onClick={() => navigate(`/salon/${SALON_OWNER_PUBLIC_PAGE_SLUG}`)}
            className="flex h-[36px] items-center justify-center gap-1.5 rounded-[4px] border border-[#ded3cc] bg-[#f5eee9] px-2 text-vmb-primary hover:bg-[#efe3dc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a574]/45 sm:h-[42px] sm:gap-[10px] sm:px-[10px]"
          >
            <TbExternalLink className="shrink-0 text-[17px] sm:text-[19px]" aria-hidden />
            <span className="whitespace-nowrap font-poppins text-[9px] font-semibold uppercase tracking-[0.06em] sm:text-[12px] sm:tracking-[0.04em]">
              View salon page
            </span>
          </button>
        : null}
        <UserMenu />
      </div>
    </header>
  );
}

export default DashboardHeader;
