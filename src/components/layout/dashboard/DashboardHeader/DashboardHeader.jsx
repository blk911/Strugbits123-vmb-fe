import React from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import UserMenu from "./UserMenu";
import { useUser } from "../../../../hooks/useUser";

function DashboardHeader({ toggleSidebar }) {
  const { user } = useUser();
  return (
    <header className="h-[68px] w-full border-b border-[#ded3cc] bg-[#fffdfb]/92 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-10 items-center justify-center border border-[#d2b48a] bg-[#f8eee9] text-xl text-vmb-primary hover:bg-[#ead6cf] focus:outline-none transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <HiMenuAlt2 />
        </button>

        {user?.role === "salon-owner" && user?.salonName && (
          <h1 className="ml-4 font-studio-serif font-semibold tracking-[0.08em] uppercase text-vmb-primary text-[14px] sm:text-[18px] lg:text-[30px]">
            {user.salonName}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-x-[20px]">
        <UserMenu />
      </div>
    </header>
  );
}

export default DashboardHeader;
