import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "../../../assets/logo.png";
import DashboardSidebar from "./DashboardSidebar/DashboardSidebar";
import DashboardFooter from "./DashboardFooter/DashboardFooter";
import DashboardHeader from "./DashboardHeader/DashboardHeader";

import {
  DashboardModalProvider,
  useDashboardModal,
} from "../../../pages/ModalProvider";
import EditAdminProfile from "../../dashboard/admin/home/Modals/editAdminProfile";
import ApproveSaloons from "../../dashboard/admin/home/Modals/ApproveSaloons";
import {
  AppointmentScheduledModal,
  BookAppointmentModal,
  ExclusiveInviteModal,
  GiftServiceModal,
  TreatModal,
  TreatRequestModal,
  OfferClaimedModal,
  OfferExpiredModal,
  ProfileSettingsModal,
  ChangePasswordModal,
} from "../../dashboard/client/Modals";

function DashboardModals() {
  const { activeModal, modalData, closeModal } = useDashboardModal();

  return (
    <>
      <ChangePasswordModal
        isOpen={activeModal === "changePassword"}
        closeModal={closeModal}
      />
      <ProfileSettingsModal
        isOpen={activeModal === "profileSettings"}
        closeModal={closeModal}
        user={modalData}
      />

      <OfferClaimedModal
        isOpen={activeModal === "offerClaimed"}
        closeModal={closeModal}
        data={modalData}
      />
      <OfferExpiredModal
        isOpen={activeModal === "offerExpired"}
        closeModal={closeModal}
        data={modalData}
      />
      <ExclusiveInviteModal
        isOpen={activeModal === "exclusiveInvite"}
        closeModal={closeModal}
        initialData={modalData}
      />
      <TreatRequestModal
        isOpen={activeModal === "treatRequest"}
        closeModal={closeModal}
        initialData={modalData}
      />
      <TreatModal
        isOpen={activeModal === "treat"}
        closeModal={closeModal}
        initialData={modalData}
      />
      <AppointmentScheduledModal
        isOpen={activeModal === "appointmentScheduled"}
        closeModal={closeModal}
        initialData={modalData}
      />
      <GiftServiceModal
        isOpen={activeModal === "giftService"}
        closeModal={closeModal}
        initialData={modalData}
      />
      <BookAppointmentModal
        isOpen={activeModal === "bookAppointment"}
        closeModal={closeModal}
      />

      <EditAdminProfile
        isOpen={activeModal === "editAdminProfile"}
        onClose={closeModal}
      />
      <ApproveSaloons
        isOpen={activeModal === "approveSaloons"}
        onClose={closeModal}
      />
    </>
  );
}

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <DashboardModalProvider>
      <div className="flex min-h-screen overflow-hidden">
        <aside
          className={`
            fixed inset-y-0 left-0 z-40
            bg-white/70 backdrop-blur-md
            flex flex-col
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${sidebarOpen ? "w-[20%] xl:w-[15%]" : "w-0"}
          `}
        >
          <div className="h-[70px] flex items-center px-[20px]">
            <img src={logo} alt="Logo" className="h-[50px]" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <DashboardSidebar />
          </div>
        </aside>

        <div
          className={`
            flex-1 flex flex-col
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? "ml-[20%] xl:ml-[15%]" : "ml-0"}
          `}
        >
          <DashboardHeader toggleSidebar={toggleSidebar} />

          <main className="flex-1 overflow-y-auto bg-[#EFEFEF] ">
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
