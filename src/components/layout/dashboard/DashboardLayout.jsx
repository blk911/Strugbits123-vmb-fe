import React from "react";
import { Outlet } from "react-router-dom";
import logo from "../../../assets/logo.png";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import DashboardFooter from "./DashboardFooter/DashboardFooter";
import DashboardHeader from "./DashboardHeader/DashboardHeader";

import { DashboardModalProvider, useDashboardModal } from "../../../pages/Dashboard/ModalProvider";
import AddServiceModal from "../../dashboard/serviceSection/Modals/AddServiceModal";
import EditProfileModal from "../../dashboard/salonProfile/Modals/EditProfile";
import InviteModal from "../../dashboard/quickInvites/Modals/InviteModal";

function DashboardModals() {
  const { activeModal, closeModal } = useDashboardModal();

  return (
    <>
      <AddServiceModal isOpen={activeModal === "addService"} onClose={closeModal} />
      <EditProfileModal isOpen={activeModal === "editProfile"} onClose={closeModal} />
      <InviteModal isOpen={activeModal === "invite"} onClose={closeModal} />
    </>
  );
}


function DashboardLayout() {
  return (
    <DashboardModalProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="min-w-[1%] xl:min-w-[15%] bg-white/70 backdrop-blur-md sticky top-0 h-screen flex flex-col">
          <div className="h-[70px] flex items-center px-[20px]">
            <img src={logo} alt="Logo" className="h-[50px]" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <DashboardSidebar />
          </div>
        </aside>
        {/* ---End--- */}

        <div className="w-[100%] sm:flex-1 flex flex-col">
          {/* Top Navbar with glassmorphism */}
          <DashboardHeader
            menuItems={[
              { label: "Profile Setting", onClick: () => console.log("Profile") },
              {
                label: "Notification Setting",
                onClick: () => console.log("Notifications"),
              },
              {
                label: "Log Out",
                onClick: () => console.log("Log out"),
                danger: true,
              },
            ]}
          />

          <main className="flex-1 overflow-y-auto  bg-gray-50">
            <Outlet />
          </main>

          <DashboardFooter />
        </div>
      </div>
      <DashboardModals />
    </DashboardModalProvider>
  );
}

export default DashboardLayout;
