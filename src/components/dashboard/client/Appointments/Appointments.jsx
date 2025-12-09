import React, { useEffect, useState } from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { CellRenderers } from "./CellRenderers";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetUserAppointmentsQuery } from "../../../../store/api";
import {
  ConfirmConfirmation,
  DeclineConfirmation,
  RescheduleSentConfirmation,
} from "../Modals/appointmentTabsModals/ConfirmationModals";
import RescheduleDirectModal from "../Modals/appointmentTabsModals/RescheduleDirectModal";
import HoldDirectModal from "../Modals/appointmentTabsModals/HoldDirectModal";
import DeclineDirectModal from "../Modals/appointmentTabsModals/DeclineDirectModal";

const PAGE_SIZE = 10;

export default function Appointments({
  searchQuery = "",
  sortOption = "Newest",
}) {
  const { openModal } = useDashboardModal();
  const sortMap = {
    Newest: "newest",
    Oldest: "oldest",
  };

  const sortValue = sortMap[sortOption] || "newest";
  const [activeTab, setActiveTab] = useState("Pending");

  const [pendingPage, setPendingPage] = useState(1);
  const [reschedulePage, setReschedulePage] = useState(1);
  const [holdPage, setHoldPage] = useState(1);
  const [confirmedPage, setConfirmedPage] = useState(1);
  const [declinedPage, setDeclinedPage] = useState(1);
  const [scheduledPage, setScheduledPage] = useState(1);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showHold, setShowHold] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [showConfirmSuccess, setShowConfirmSuccess] = useState(false);
  const [showDeclineSuccess, setShowDeclineSuccess] = useState(false);
  const [showRescheduleSent, setShowRescheduleSent] = useState(false);
  const [directData, setDirectData] = useState(null);

  const {
    data: pendingData,
    isLoading: loadingPending,
    isFetching: fetchingPending,
    refetch: refetchPending,
  } = useGetUserAppointmentsQuery({
    page: pendingPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "pending",
  });
  const {
    data: rescheduleData,
    isLoading: loadingReschedule,
    isFetching: fetchingReschedule,
    refetch: refetchReschedule,
  } = useGetUserAppointmentsQuery({
    page: reschedulePage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "reschedule-requested",
  });

  const {
    data: holdData,
    isLoading: loadingHold,
    isFetching: fetchingHold,
    refetch: refetchHold,
  } = useGetUserAppointmentsQuery({
    page: holdPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "hold",
  });

  const {
    data: confirmedData,
    isLoading: loadingConfirmed,
    isFetching: fetchingConfirmed,
    refetch: refetchConfirmed,
  } = useGetUserAppointmentsQuery({
    page: confirmedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "confirmed",
  });
  const {
    data: scheduledData,
    isLoading: loadingScheduled,
    isFetching: fetchingScheduled,
    refetch: refetchScheduled,
  } = useGetUserAppointmentsQuery({
    page: confirmedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "scheduled",
  });

  const {
    data: declinedData,
    isLoading: loadingDeclined,
    isFetching: fetchingDeclined,
    refetch: refetchDeclined,
  } = useGetUserAppointmentsQuery({
    page: declinedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "declined",
  });
  useEffect(() => {
    refetchConfirmed();
    refetchDeclined();
    refetchHold();
    refetchPending();
    refetchReschedule();
    refetchScheduled();
  }, [
    refetchConfirmed,
    refetchDeclined,
    refetchHold,
    refetchPending,
    refetchReschedule,
    refetchScheduled,
  ]);
  const currentData =
    activeTab === "Pending"
      ? pendingData
      : activeTab === "Reschedule"
      ? rescheduleData
      : activeTab === "Hold"
      ? holdData
      : activeTab === "Confirmed"
      ? confirmedData
      : activeTab === "Scheduled"
      ? scheduledData
      : declinedData;

  const isLoading =
    activeTab === "Pending"
      ? loadingPending
      : activeTab === "Reschedule"
      ? loadingReschedule
      : activeTab === "Hold"
      ? loadingHold
      : activeTab === "Confirmed"
      ? loadingConfirmed
      : activeTab === "Scheduled"
      ? loadingScheduled
      : loadingDeclined;

  const isFetching =
    activeTab === "Pending"
      ? fetchingPending
      : activeTab === "Reschedule"
      ? fetchingReschedule
      : activeTab === "Hold"
      ? fetchingHold
      : activeTab === "Confirmed"
      ? fetchingConfirmed
      : activeTab === "Scheduled"
      ? fetchingScheduled
      : fetchingDeclined;

  const appointments = currentData?.data?.items || [];
  console.log("Client Appointments===>", appointments);
  const totalPages = currentData?.data?.pages || 1;
  const transformedAppointments = appointments.map((appt) => ({
    id: appt?._id,
    salonName: appt?.salon?.salonName || "Unknown Salon",
    serviceName: appt.services?.map((s) => s.serviceName || s.name) || [],
    payersEmail: appt?.requestedFrom?.email || "N/A",
    appointmentDate: appt?.appointmentDate
      ? new Date(appt?.appointmentDate).toLocaleDateString("en-GB")
      : "N/A",
    appointmentTime: appt?.startTime || "N/A",
    status:
      appt?.status?.charAt(0).toUpperCase() + appt?.status?.slice(1) ||
      "Pending",
    _modalData: {
      salon: {
        name: appt?.salon?.salonName,
        description: appt?.salon?.salonDescription || "",
        image: appt?.salon?.salonImage || "/default-salon.jpg",
      },
      services: (appt.services || []).map((s) => ({
        name: s.serviceName || s.name,
        duration: `${s.duration || 60} min`,
        price: s.price || 0,
      })),
      appointment: {
        date: appt.appointmentDate,
        time: appt.startTime,
        id: appt._id,
      },
    },
  }));

  const cleanDataForTable = (data) =>
    data.map(({ _modalData, ...rest }) => rest);

  const tabs = {
    Pending: cleanDataForTable(transformedAppointments),
    Reschedule: cleanDataForTable(transformedAppointments),
    Hold: cleanDataForTable(transformedAppointments),
    Confirmed: cleanDataForTable(transformedAppointments),
    Scheduled: cleanDataForTable(transformedAppointments),
    Decline: cleanDataForTable(transformedAppointments),
  };

  const originalRows = {
    Pending: transformedAppointments,
    Reschedule: transformedAppointments,
    Hold: transformedAppointments,
    Confirmed: transformedAppointments,
    Scheduled: transformedAppointments,
    Decline: transformedAppointments,
  };

  const handleRowClick = {
    Pending: (cleanRow) => {
      const row = originalRows.Pending.find((r) => r.id === cleanRow.id);
      if (row?._modalData) openModal("appointmentScheduled", row._modalData);
    },
    Reschedule: (cleanRow) => {
      const row = originalRows.Reschedule.find((r) => r.id === cleanRow.id);
      if (row?._modalData) {
        setDirectData(row._modalData);
        setShowReschedule(true);
      }
    },
    Hold: (cleanRow) => {
      const row = originalRows.Hold.find((r) => r.id === cleanRow.id);
      if (row?._modalData) {
        setDirectData(row._modalData);
        setShowHold(true);
      }
    },
    // Confirmed: (cleanRow) => {
    //   const row = originalRows.Confirmed.find((r) => r.id === cleanRow.id);
    //   if (row?._modalData) openModal("appointmentScheduled", row._modalData);
    // },
    Scheduled: (cleanRow) => {
      const row = originalRows.Scheduled.find((r) => r.id === cleanRow.id);
      if (row?._modalData)
        openModal("rescheduleAppointmentClient", row._modalData);
    },
    Decline: (cleanRow) => {
      const row = originalRows.Decline.find((r) => r.id === cleanRow.id);
      if (row?._modalData) {
        setDirectData(row._modalData);
        setShowDecline(true);
      }
    },
  };

  const handlePageChange = (page) => {
    if (activeTab === "Pending") setPendingPage(page);
    if (activeTab === "Reschedule") setReschedulePage(page);
    if (activeTab === "Hold") setHoldPage(page);
    if (activeTab === "Confirmed") setConfirmedPage(page);
    if (activeTab === "Scheduled") setScheduledPage(page);
    if (activeTab === "Decline") setDeclinedPage(page);
  };

  const currentPage =
    activeTab === "Pending"
      ? pendingPage
      : activeTab === "Reschedule"
      ? reschedulePage
      : activeTab === "Hold"
      ? holdPage
      : activeTab === "Confirmed"
      ? confirmedPage
      : activeTab === "Scheduled"
      ? scheduledPage
      : declinedPage;

  return (
    <>
      <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
        <TabbedTable
          tabs={tabs}
          tabOrder={[
            "Pending",
            "Reschedule",
            "Hold",
            "Confirmed",
            "Scheduled",
            "Decline",
          ]}
          defaultTab="Pending"
          cellRenderers={CellRenderers}
          onRowClick={handleRowClick}
          setExternalActiveTab={setActiveTab}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>

      <RescheduleDirectModal
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        data={directData}
        onRescheduleSent={() => setShowRescheduleSent(true)}
      />
      <HoldDirectModal
        isOpen={showHold}
        onClose={() => setShowHold(false)}
        data={directData}
        onAccept={() => setShowConfirmSuccess(true)}
        onDecline={() => setShowDeclineSuccess(true)}
        onReschedule={() => setShowReschedule(true)}
      />
      <DeclineDirectModal
        isOpen={showDecline}
        onClose={() => setShowDecline(false)}
        data={directData}
      />

      <ConfirmConfirmation
        open={showConfirmSuccess}
        onClose={() => setShowConfirmSuccess(false)}
      />
      <DeclineConfirmation
        open={showDeclineSuccess}
        onClose={() => setShowDeclineSuccess(false)}
      />
      <RescheduleSentConfirmation
        open={showRescheduleSent}
        onClose={() => setShowRescheduleSent(false)}
      />
    </>
  );
}
