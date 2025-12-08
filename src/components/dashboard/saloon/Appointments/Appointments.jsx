import React, { useEffect, useState } from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { CellRenderers } from "./CellRenderers";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetSalonAppointmentsQuery } from "../../../../store/api";
import StatusAppointmentModal from "../Modals/StatusAppointmentModal";

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
  const [activeTab, setActiveTab] = useState("All");

  const [allPage, setAllPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [scheduledPage, setScheduledPage] = useState(1);
  const [reschedulePage, setReschedulePage] = useState(1);
  const [holdPage, setHoldPage] = useState(1);
  const [confirmedPage, setConfirmedPage] = useState(1);
  const [declinedPage, setDeclinedPage] = useState(1);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalType, setStatusModalType] = useState("hold");
  const [modalData, setModalData] = useState(null);

  const {
    data: allData,
    isLoading: loadingAll,
    isFetching: fetchingAll,
    refetch: refetchAll,
  } = useGetSalonAppointmentsQuery({
    page: allPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
  });
  console.log("All Data==>", allData);
  const {
    data: pendingData,
    isLoading: loadingPending,
    isFetching: fetchingPending,
    refetch: refetchPending,
  } = useGetSalonAppointmentsQuery({
    page: pendingPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "pending",
  });
  const {
    data: scheduledData,
    isLoading: loadingScheduled,
    isFetching: fetchingScheduled,
    refetch: refetchScheduled,
  } = useGetSalonAppointmentsQuery({
    page: scheduledPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "scheduled",
  });

  const {
    data: rescheduleData,
    isLoading: loadingReschedule,
    isFetching: fetchingReschedule,
    refetch: refetchReschedule,
  } = useGetSalonAppointmentsQuery({
    page: reschedulePage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "reschedule-requested",
  });
  console.log("Reschedule Requestes==>", rescheduleData);
  const {
    data: holdData,
    isLoading: loadingHold,
    isFetching: fetchingHold,
    refetch: refetchHold,
  } = useGetSalonAppointmentsQuery({
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
  } = useGetSalonAppointmentsQuery({
    page: confirmedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "confirmed",
  });

  const {
    data: declinedData,
    isLoading: loadingDeclined,
    isFetching: fetchingDeclined,
    refetch: refetchDeclined,
  } = useGetSalonAppointmentsQuery({
    page: declinedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "declined",
  });

  useEffect(() => {
    refetchAll();
    refetchPending();
    refetchScheduled();
    refetchReschedule();
    refetchHold();
    refetchConfirmed();
    refetchDeclined();
  }, [
    refetchAll,
    refetchPending,
    refetchScheduled,
    refetchReschedule,
    refetchHold,
    refetchConfirmed,
    refetchDeclined,
  ]);
  const currentData =
    activeTab === "All"
      ? allData
      : activeTab === "Pending"
      ? pendingData
      : activeTab === "Scheduled"
      ? scheduledData
      : activeTab === "Reschedule"
      ? rescheduleData
      : activeTab === "Hold"
      ? holdData
      : activeTab === "Confirmed"
      ? confirmedData
      : declinedData;

  const isLoading =
    activeTab === "All"
      ? loadingAll
      : activeTab === "Pending"
      ? loadingPending
      : activeTab === "Scheduled"
      ? loadingScheduled
      : activeTab === "Reschedule"
      ? loadingReschedule
      : activeTab === "Hold"
      ? loadingHold
      : activeTab === "Confirmed"
      ? loadingConfirmed
      : loadingDeclined;

  const isFetching =
    activeTab === "All"
      ? fetchingAll
      : activeTab === "Pending"
      ? fetchingPending
      : activeTab === "Scheduled"
      ? fetchingScheduled
      : activeTab === "Reschedule"
      ? fetchingReschedule
      : activeTab === "Hold"
      ? fetchingHold
      : activeTab === "Confirmed"
      ? fetchingConfirmed
      : fetchingDeclined;

  const appointments = currentData?.data?.items || [];
  const totalPages = currentData?.data?.pages || 1;

  const transformedAppointments = appointments.map((appt) => ({
    id: appt._id,
    salonName: appt.salonName || "Unknown Salon",
    serviceName: appt.services?.map((s) => s.serviceName || s.name) || [],
    payersEmail: appt.requestedBy.email || "N/A",
    appointmentDate: appt.appointmentDate
      ? new Date(appt.appointmentDate).toLocaleDateString("en-GB")
      : "N/A",
    appointmentTime: appt.startTime || "N/A",
    status: appt.status
      ? appt.status.charAt(0).toUpperCase() +
        appt.status.slice(1).replace("-", " ")
      : "Pending",
    _modalData: {
      salon: {
        name: appt.salonName,
        description: appt.salonDescription || "",
        image: appt.salonImage || "/default-salon.jpg",
      },
      services: (appt.services || []).map((s) => ({
        name: s.serviceName || s.name,
        duration: s.duration ? `${s.duration} min` : "N/A",
        price: s.price || 0,
      })),
      treatTo: {
        name: appt.requestedBy.name || "Client",
        email: appt.requestedBy.email || "N/A",
        phone: appt.requestedBy.phone || "N/A",
        image: appt.requestedBy.image || "/default-user.jpg",
      },
      treatBy: {
        name: appt.requestedFrom.name || "Payer",
        email: appt.requestedFrom.email || "N/A",
        phone: appt.requestedFrom.phone || "N/A",
        image: appt.requestedFrom.image || "/default-user.jpg",
      },
      appointment: {
        id: appt._id,
        date: appt.appointmentDate,
        time: appt.startTime,
        message: appt.reschduleReason || "",
      },
    },
  }));

  const cleanDataForTable = (data) =>
    data.map(({ _modalData, ...rest }) => rest);

  const tabs = {
    All: cleanDataForTable(transformedAppointments),
    Pending: cleanDataForTable(transformedAppointments),
    Scheduled: cleanDataForTable(transformedAppointments),
    Reschedule: cleanDataForTable(transformedAppointments),
    Hold: cleanDataForTable(transformedAppointments),
    Confirmed: cleanDataForTable(transformedAppointments),
    Decline: cleanDataForTable(transformedAppointments),
  };

  const originalRows = {
    All: transformedAppointments,
    Pending: transformedAppointments,
    Scheduled: transformedAppointments,
    Reschedule: transformedAppointments,
    Hold: transformedAppointments,
    Confirmed: transformedAppointments,
    Decline: transformedAppointments,
  };

  const handleRowClick = {
    All: (cleanRow) => openWithData(cleanRow, "All"),
    Pending: (cleanRow) => openWithData(cleanRow, "Pending"),
    Scheduled: (cleanRow) => openWithData(cleanRow, "Scheduled"),
    Reschedule: (cleanRow) => openWithData(cleanRow, "Reschedule"),
    Hold: (cleanRow) => openWithData(cleanRow, "Hold"),
    Confirmed: (cleanRow) => openWithData(cleanRow, "Confirmed"),
    Decline: (cleanRow) => openWithData(cleanRow, "Decline"),
  };

  const openWithData = (cleanRow, tab) => {
    const row = originalRows[tab].find((r) => r.id === cleanRow.id);
    if (!row?._modalData) return;

    const data = row._modalData;

    if (tab === "Pending") {
      openModal("scheduleAppointment", data);
    } else if (tab === "Reschedule") {
      openModal("rescheduleAppointment", data);
    } else if (tab === "Scheduled") {
      // openModal("scheduleAppointment", data);
    } else {
      const typeMap = {
        Hold: "hold",
        Confirmed: "confirmed",
        Decline: "declined",
      };
      setModalData(data);
      setStatusModalType(typeMap[tab] || "hold");
      setShowStatusModal(true);
    }
  };

  const handlePageChange = (page) => {
    if (activeTab === "All") setAllPage(page);
    else if (activeTab === "Pending") setPendingPage(page);
    else if (activeTab === "Scheduled") setScheduledPage(page);
    else if (activeTab === "Reschedule") setReschedulePage(page);
    else if (activeTab === "Hold") setHoldPage(page);
    else if (activeTab === "Confirmed") setConfirmedPage(page);
    else if (activeTab === "Decline") setDeclinedPage(page);
  };

  const currentPage =
    activeTab === "All"
      ? allPage
      : activeTab === "Pending"
      ? pendingPage
      : activeTab === "Scheduled"
      ? scheduledPage
      : activeTab === "Reschedule"
      ? reschedulePage
      : activeTab === "Hold"
      ? holdPage
      : activeTab === "Confirmed"
      ? confirmedPage
      : declinedPage;

  return (
    <>
      <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
        <TabbedTable
          tabs={tabs}
          tabOrder={[
            "All",
            "Pending",
            "Scheduled",
            "Reschedule",
            "Hold",
            "Confirmed",
            "Decline",
          ]}
          defaultTab="All"
          cellRenderers={CellRenderers}
          tabLabelMap={{
            All: "All",
            Pending: "Pending",
            Scheduled: "Scheduled",
            Reschedule: "Reschedule Requested",
            Hold: "On Hold",
            Confirmed: "Confirmed",
            Decline: "Declined",
          }}
          setExternalActiveTab={setActiveTab}
          onRowClick={handleRowClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>

      <StatusAppointmentModal
        isOpen={showStatusModal}
        closeModal={() => setShowStatusModal(false)}
        data={modalData}
        type={statusModalType}
      />
    </>
  );
}
