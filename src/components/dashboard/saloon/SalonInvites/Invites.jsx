import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { CellRenderers } from "./CellRenderers";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetSalonInvitesQuery } from "../../../../store/api";

const PAGE_SIZE = 10;

export default function Invites({ searchQuery = "", sortOption = "Newest" }) {
  const location = useLocation();
  const { openModal } = useDashboardModal();
  const sortMap = {
    Newest: "newest",
    Oldest: "oldest",
  };

  const sortValue = sortMap[sortOption] || "newest";
  const [activeTab, setActiveTab] = useState("All");

  const [allPage, setAllPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [claimedPage, setClaimedPage] = useState(1);
  const [unclaimedPage, setUnclaimedPage] = useState(1);

  const {
    data: allData,
    isLoading: loadingAll,
    isFetching: fetchingAll,

    refetch: refetchAll,
  } = useGetSalonInvitesQuery({
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
  } = useGetSalonInvitesQuery({
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
  } = useGetSalonInvitesQuery({
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
  } = useGetSalonInvitesQuery({
    page: unclaimedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "unclaimed",
  });

  useEffect(() => {
    refetchAll();
    refetchPending();
    refetchClaimed();
    refetchUnclaimed();
  }, [refetchAll, refetchPending, refetchClaimed, refetchUnclaimed]);
  const currentData =
    activeTab === "All"
      ? allData
      : activeTab === "Pending"
      ? pendingData
      : activeTab === "Claimed"
      ? claimedData
      : unclaimedData;

  const isLoading =
    activeTab === "All"
      ? loadingAll
      : activeTab === "Pending"
      ? loadingPending
      : activeTab === "Claimed"
      ? loadingClaimed
      : loadingUnclaimed;

  const isFetching =
    activeTab === "All"
      ? fetchingAll
      : activeTab === "Pending"
      ? fetchingPending
      : activeTab === "Claimed"
      ? fetchingClaimed
      : fetchingUnclaimed;

  const invites = currentData?.data?.items || [];
  const totalPages = currentData?.data?.pages || 1;

  const transformedData = invites.map((invite) => ({
    id: invite._id,
    Email: invite.inviteeEmail || "N/A",
    message: invite.message || "No message",
    serviceName: invite.services?.serviceName || "N/A",
    discount: `${invite.discountPercentage}%`,
    inviteDate: invite.createdAt
      ? new Date(invite.createdAt).toLocaleDateString("en-GB")
      : "N/A",
    status: invite.status.charAt(0).toUpperCase() + invite.status.slice(1),
    _modalData: invite,
  }));

  const cleanDataForTable = (data) =>
    data.map(({ _modalData, ...rest }) => rest);

  const tabs = {
    All: cleanDataForTable(transformedData),
    Pending: cleanDataForTable(transformedData),
    Claimed: cleanDataForTable(transformedData),
    Unclaimed: cleanDataForTable(transformedData),
  };

  const handleRowClick = {
    All: () => {},
    Pending: () => {},
    Claimed: () => {},
    Unclaimed: () => {},
  };

  const handlePageChange = (page) => {
    if (activeTab === "All") setAllPage(page);
    else if (activeTab === "Pending") setPendingPage(page);
    else if (activeTab === "Claimed") setClaimedPage(page);
    else if (activeTab === "Unclaimed") setUnclaimedPage(page);
  };

  const currentPage =
    activeTab === "All"
      ? allPage
      : activeTab === "Pending"
      ? pendingPage
      : activeTab === "Claimed"
      ? claimedPage
      : unclaimedPage;

  return (
    <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
      <TabbedTable
        tabs={tabs}
        tabOrder={["All", "Pending", "Claimed", "Unclaimed"]}
        defaultTab="All"
        cellRenderers={CellRenderers}
        tabLabelMap={{
          All: "All",
          Pending: "Pending",
          Claimed: "Claimed",
          Unclaimed: "Unclaimed",
        }}
        location={location}
        setExternalActiveTab={setActiveTab}
        onRowClick={handleRowClick}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </div>
  );
}
