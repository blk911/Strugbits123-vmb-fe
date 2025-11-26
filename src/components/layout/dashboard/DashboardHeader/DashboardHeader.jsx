import React from "react";
import { HiMenuAlt2 } from "react-icons/hi";
import NotificationIcon from "./NotificationIcon";
import UserMenu from "./UserMenu";

function DashboardHeader({ toggleSidebar }) {
  return (
    <header className="h-[70px] w-full bg-white/30 backdrop-blur-md shadow-sm sticky top-0 z-50 flex items-center justify-between px-6">
      <button
        onClick={toggleSidebar}
        className="text-2xl text-gray-700 hover:text-gray-900 focus:outline-none transition-colors  cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <HiMenuAlt2 />
      </button>

      <div className="flex items-center gap-x-[20px]">
        <UserMenu />
      </div>
    </header>
  );
}

export default DashboardHeader;
