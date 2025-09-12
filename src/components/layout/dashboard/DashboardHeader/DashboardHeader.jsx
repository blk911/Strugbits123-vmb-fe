import React from "react";
import NotificationIcon from "./NotificationIcon";
import UserMenu from "./UserMenu";

function DashboardHeader() {
  return (
    <header className="h-[70px] w-full bg-white/30 backdrop-blur-md shadow-sm border-b sticky top-0 z-50 flex items-center justify-end px-6 gap-x-[20px]">
      <NotificationIcon />
      <UserMenu />
    </header>
  );
}

export default DashboardHeader;
