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
  RescheduleDirectModal,
} from "../../dashboard/client/Modals";
import {
  RescheduleAppointmentModal,
  ScheduleAppointmentModal,
  SendTreatModal,
  SalonProfileSettingsModal,
  AddServiceModal,
  DeleteConfirmModal,
} from "../../dashboard/saloon/Modals";
import {
  ConfirmConfirmation,
  DeclineConfirmation,
  HoldConfirmation,
  RescheduleSentConfirmation,
} from "../../dashboard/client/Modals/appointmentTabsModals/ConfirmationModals";
import {
  AppointmentRequestHistoryModal,
  GiftRequestHistoryModal,
  RejectionSentModal,
  SalonInviteTrackingModal,
  SalonRequestModal,
  SalonVerificationRejectionModal,
} from "../../dashboard/admin/Modals";

function DashboardModals() {
  const { activeModal, modalData, closeModal } = useDashboardModal();
  const [showConfirmSuccess, setShowConfirmSuccess] = useState(false);

  const [confirmationConfig, setConfirmationConfig] = useState(null);
  const handleSuccess = (type) => {
    if (type === "schedule") {
      setConfirmationConfig({
        title: "Appointment Successfully Scheduled",
        subtitle:
          "Appointment has been successfully scheduled!\nThe client has been informed and will confirm shortly.",
      });
    } else if (type === "reschedule") {
      setConfirmationConfig({
        title: "Appointment Rescheduled",
        subtitle: "We’ve informed your client about the new schedule details.",
      });
    } else if (type === "sendTreat") {
      setConfirmationConfig({
        title: "Invite Sent Successfully!",
        subtitle:
          "Your invite is on its way. The recipient will get it in their inbox soon.",
      });
    } else if (type === "salonVerfication") {
      setConfirmationConfig({
        title: "Salon Verification Approved",
        subtitle:
          "The salon has been successfully verified and approved. The owner can now access their salon dashboard and manage services.",
      });
    }
    setShowConfirmSuccess(true);
  };
  return (
    <>
      <DeclineConfirmation
        open={activeModal === "declineAppointmentClient"}
        onClose={closeModal}
      />
      <HoldConfirmation
        open={activeModal === "holdAppointmentClient"}
        onClose={closeModal}
      />

      <RescheduleSentConfirmation
        open={activeModal === "rescheduleSent"}
        onClose={closeModal}
      />
      <RescheduleDirectModal
        isOpen={activeModal === "rescheduleAppointmentClient"}
        onClose={closeModal}
        data={modalData}
      />
      <AppointmentRequestHistoryModal
        isOpen={activeModal === "appointmentRequestHistory"}
        onClose={closeModal}
        data={modalData}
      />
      <SalonInviteTrackingModal
        isOpen={activeModal === "salonInviteTracking"}
        onClose={closeModal}
        data={modalData}
      />
      <GiftRequestHistoryModal
        isOpen={activeModal === "giftRequestHistory"}
        onClose={closeModal}
        data={modalData}
      />
      <RejectionSentModal
        isOpen={activeModal === "rejectionSent"}
        onClose={closeModal}
      />
      <SalonVerificationRejectionModal
        isOpen={activeModal === "salonRejection"}
        onClose={closeModal}
        salonId={modalData?.salonId}
        salonName={modalData?.salonName}
      />
      <SalonRequestModal
        isOpen={activeModal === "salonRequest"}
        closeModal={closeModal}
        data={modalData}
        onAccept={() => handleSuccess("salonVerfication")}
      />
      <DeleteConfirmModal
        isOpen={activeModal === "delete"}
        closeModal={closeModal}
        id={modalData}
      />
      <AddServiceModal
        isOpen={activeModal === "addService"}
        closeModal={closeModal}
        initialData={modalData}
      />
      <SalonProfileSettingsModal
        isOpen={activeModal === "salonprofileSettings"}
        closeModal={closeModal}
      />
      <SendTreatModal
        isOpen={activeModal === "sendTreat"}
        closeModal={closeModal}
        initialData={modalData}
        onAccept={() => handleSuccess("sendTreat")}
      />
      <ConfirmConfirmation
        open={activeModal === "salonApprovedSuccess"}
        onClose={closeModal}
        title={modalData?.title}
        subtitle={modalData?.subtitle}
      />
      <ConfirmConfirmation
        open={showConfirmSuccess}
        onClose={() => {
          setShowConfirmSuccess(false);
        }}
        title={confirmationConfig?.title}
        subtitle={confirmationConfig?.subtitle}
      />
      <BookAppointmentModal
        isOpen={activeModal === "bookAppointment"}
        closeModal={closeModal}
        initialData={modalData}
      />
      <ScheduleAppointmentModal
        isOpen={activeModal === "scheduleAppointment"}
        closeModal={closeModal}
        initialData={modalData}
        onAccept={() => handleSuccess("schedule")}
      />
      <RescheduleAppointmentModal
        isOpen={activeModal === "rescheduleAppointment"}
        closeModal={closeModal}
        initialData={modalData}
        onAccept={() => handleSuccess("reschedule")}
      />
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
            ${sidebarOpen ? "w-[24%] md:w-[16%] xl:w-[14%]" : "w-0"}
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
            ${sidebarOpen ? "ml-[24%] md:ml-[16%] xl:ml-[14%]" : "ml-0"}
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
