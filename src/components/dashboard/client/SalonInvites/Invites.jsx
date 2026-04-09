import React, { useEffect, useState } from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { CellRenderers } from "./CellRenderers";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetUserInvitesQuery } from "../../../../store/api";
import { ConfirmConfirmation } from "../Modals/appointmentTabsModals/ConfirmationModals";
import { formatDuration, formatDate } from "../../../../utils/HelperFunctions";
import SalonImage from "../../../../assets/salon-1.png";
const PAGE_SIZE = 10;

export default function Invites({
  searchQuery = "",
  sortOption = "Newest",
  initialTab = "All",
}) {
  const { openModal } = useDashboardModal();
  const sortMap = {
    Newest: "newest",
    Oldest: "oldest",
  };

  const sortValue = sortMap[sortOption] || "newest";
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState(initialTab);

  const [allPage, setAllPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [claimedPage, setClaimedPage] = useState(1);
  const [unclaimedPage, setUnclaimedPage] = useState(1);

  const {
    data: allData,
    isLoading: loadingAll,
    isFetching: fetchingAll,
    refetch: refetchAll,
  } = useGetUserInvitesQuery({
    page: allPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
  });
  const {
    data: pendingData,
    isLoading: loadingPending,
    isFetching: fetchingPending,
    refetch: refetchPending,
  } = useGetUserInvitesQuery({
    page: pendingPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "pending",
  });
  const {
    data: claimedData,
    isLoading: loadingClaimed,
    isFetching: fetchingClaimed,
    refetch: refetchClaimed,
  } = useGetUserInvitesQuery({
    page: claimedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "claimed",
  });

  const {
    data: unclaimedData,
    isLoading: loadingUnclaimed,
    isFetching: fetchingUnclaimed,
    refetch: refetchUnclaimed,
  } = useGetUserInvitesQuery({
    page: unclaimedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "unclaimed",
  });

  useEffect(() => {
    refetchAll();
    refetchClaimed();
    refetchPending();
    refetchUnclaimed();
  }, [refetchAll, refetchClaimed, refetchPending, refetchUnclaimed]);
  const currentData =
    activeTab === "All" ? allData
    : activeTab === "Pending" ? pendingData
    : activeTab === "Claimed" ? claimedData
    : unclaimedData;
  const isLoading =
    activeTab === "All" ? loadingAll
    : activeTab === "Pending" ? loadingPending
    : activeTab === "Claimed" ? loadingClaimed
    : loadingUnclaimed;
  const isFetching =
    activeTab === "All" ? fetchingAll
    : activeTab === "Pending" ? fetchingPending
    : activeTab === "Claimed" ? fetchingClaimed
    : fetchingUnclaimed;

  const invites = currentData?.data?.items || [];
  const totalPages = currentData?.data?.pages || 1;

  const transformedData = invites.map((invite) => ({
    id: invite._id,
    salonName: invite.salonName || "Unknown Salon",
    salonEmail: invite.salonEmail || "N/A",
    serviceName: invite.services?.serviceName || "N/A",
    discount: `${invite.discountPercentage}%`,
    expiresOn: invite.expiresOn ? formatDate(invite.expiresOn) : "N/A",
    status: invite.status.charAt(0).toUpperCase() + invite.status.slice(1),
    _modalData: {
      name: invite.salonName,
      image: invite.salonProfilePic || SalonImage,
      description: invite.salonDesc || "N/A",
      salonId: invite.salonId,
      inviteId: invite._id,
      services:
        invite.services ?
          [
            {
              id: invite.services._id,
              name: invite.services.serviceName,
              price: invite.services.servicePrice || 0,
              duration:
                formatDuration(invite.services.serviceDuration) || "N/A",
            },
          ]
        : [],
      discount: invite.discountPercentage,
      onBookingSuccess: () => setShowBookingSuccess(true),
    },
  }));

  const cleanDataForTable = (data) =>
    data.map(({ _modalData, ...rest }) => rest);

  const tabs = {
    All: cleanDataForTable(transformedData),
    Pending: cleanDataForTable(transformedData),
    Claimed: cleanDataForTable(transformedData),
    Unclaimed: cleanDataForTable(transformedData),
  };

  const originalRows = {
    All: transformedData,
    Pending: transformedData,
    Claimed: transformedData,
    Unclaimed: transformedData,
  };

  const handleRowClick = {
    All: (cleanRow) => openWithData(cleanRow, "All"),
    Pending: (cleanRow) => {
      const row = originalRows.Pending.find((r) => r.id === cleanRow.id);
      if (row?._modalData) openModal("exclusiveInvite", row._modalData);
    },
    Claimed: (cleanRow) => {
      const row = originalRows.Claimed.find((r) => r.id === cleanRow.id);
      if (row?._modalData) openModal("offerClaimed", row._modalData);
    },
    Unclaimed: (cleanRow) => {
      const row = originalRows.Unclaimed.find((r) => r.id === cleanRow.id);
      if (row?._modalData) openModal("offerExpired", row._modalData);
    },
  };
  const openWithData = (cleanRow, tab) => {
    const row = originalRows[tab].find((r) => r.id === cleanRow.id);
    if (!row?._modalData) return;

    const status = cleanRow.status;

    if (status === "Pending") {
      openModal("exclusiveInvite", row._modalData);
    } else if (status === "Claimed") {
      openModal("offerClaimed", row._modalData);
    } else if (status === "Unclaimed") {
      openModal("offerExpired", row._modalData);
    }
  };
  const handlePageChange = (page) => {
    if (activeTab === "All") setAllPage(page);
    if (activeTab === "Pending") setPendingPage(page);
    if (activeTab === "Claimed") setClaimedPage(page);
    if (activeTab === "Unclaimed") setUnclaimedPage(page);
  };

  const currentPage =
    activeTab === "All" ? allPage
    : activeTab === "Pending" ? pendingPage
    : activeTab === "Claimed" ? claimedPage
    : unclaimedPage;

  return (
    <>
      <div className="w-full flex flex-col gap-y-[31px] py-6 bg-vmb-bg-soft">
        <TabbedTable
          tabs={tabs}
          tabOrder={["All", "Pending", "Claimed", "Unclaimed"]}
          defaultTab={activeTab}
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

      <ConfirmConfirmation
        open={showBookingSuccess}
        onClose={() => setShowBookingSuccess(false)}
        title="Appointment Successfully Booked"
        subtitle={
          <>
            Thank you for accepting our invite.
            <br />
            Your booking details have been shared with the salon — they’ll
            notify you once everything is finalized.
          </>
        }
      />
    </>
  );
}
