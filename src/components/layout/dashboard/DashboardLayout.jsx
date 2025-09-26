import React from "react";
import { Outlet } from "react-router-dom";
import logo from "../../../assets/logo.png";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import DashboardFooter from "./DashboardFooter/DashboardFooter";
import DashboardHeader from "./DashboardHeader/DashboardHeader";

import { DashboardModalProvider, useDashboardModal } from "../../../pages/ModalProvider";
import AddServiceModal from "../../dashboard/saloon/home/serviceSection/Modals/AddServiceModal";
import EditProfileModal from "../../dashboard/saloon/home/salonProfile/Modals/EditProfile";
import InviteModal from "../../dashboard/saloon/home/quickInvites/Modals/InviteModal";
import EditAdminProfile from "../../dashboard/admin/home/Modals/editAdminProfile";
import ApproveSaloons from "../../dashboard/admin/home/Modals/ApproveSaloons";

function DashboardModals() {
  const { activeModal, closeModal } = useDashboardModal();

  return (
    <>
      <AddServiceModal isOpen={activeModal === "addService"} onClose={closeModal} />
      <EditProfileModal isOpen={activeModal === "editProfile"} onClose={closeModal} />
      <InviteModal isOpen={activeModal === "invite"} onClose={closeModal} />
      <EditAdminProfile isOpen={activeModal === "editAdminProfile"} onClose={closeModal} />
      <ApproveSaloons isOpen={activeModal === "approveSaloons"} onClose={closeModal} />
    </>
  );
}


function DashboardLayout() {
  return (
    <DashboardModalProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="max-sm:min-w-[20%] xl:min-w-[15%] bg-white/70 backdrop-blur-md sticky top-0 h-screen flex flex-col">
          <div className="h-[70px] flex items-center px-[20px]">
            <img src={logo} alt="Logo" className="h-[50px]" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <DashboardSidebar />
          </div>
        </aside>
        {/* ---End--- */}

        <div className="w-[80%] sm:w-[100%] sm:flex-1 flex flex-col">
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
