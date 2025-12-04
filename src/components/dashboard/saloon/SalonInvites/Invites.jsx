import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { CellRenderers } from "./CellRenderers";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetSalonInvitesQuery } from "../../../../store/api";

const PAGE_SIZE = 10;

export default function Invites() {
  const location = useLocation();
  const { openModal } = useDashboardModal();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "All"
  );
  const [allPage, setAllPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [acceptedPage, setAcceptedPage] = useState(1);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetSalonInvitesQuery({
    page:
      activeTab === "All"
        ? allPage
        : activeTab === "Pending"
        ? pendingPage
        : acceptedPage,
    limit: PAGE_SIZE,
    sort: "newest",
    refetchOnMountOrArgChange: true,

    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const invites = response?.data?.items || [];
  const totalPages = response?.data?.pages || 1;

  const transformedData = invites.map((invite) => ({
    id: invite._id,
    Email: invite.inviteeEmail || "N/A",
    message: invite.message || "No message",
    serviceName: invite.services.serviceName || "N/A",
    discount: invite.discountPercentage ?? 0,
    inviteDate: invite.createdAt
      ? new Date(invite.createdAt).toLocaleDateString("en-GB")
      : "N/A",
    status: invite.status.charAt(0).toUpperCase() + invite.status.slice(1),
    _modalData: invite,
  }));

  const allInvites = transformedData;
  const pendingInvites = transformedData.filter((i) => i.status === "Pending");
  const acceptedInvites = transformedData.filter((i) => i.status === "Claimed");

  const cleanDataForTable = (data) =>
    data.map(({ _modalData, ...rest }) => rest);

  const tabs = {
    All: cleanDataForTable(allInvites),
    Pending: cleanDataForTable(pendingInvites),
    Accepted: cleanDataForTable(acceptedInvites),
  };

  const originalRows = {
    All: allInvites,
    Pending: pendingInvites,
    Accepted: acceptedInvites,
  };

  // const totalPagesByTab = {
  //   All: totalPages,
  //   Pending: totalPages,
  //   Accepted: totalPages,
  // };
  const totalPagesByTab = {
    All: totalPages,
    Pending: Math.ceil(pendingInvites.length / PAGE_SIZE),
    Accepted: Math.ceil(acceptedInvites.length / PAGE_SIZE),
  };
  const handleRowClick = {
    All: () => {},
    Pending: () => {},
    Accepted: () => {},
  };

  const handlePageChange = (tab, page) => {
    if (tab === "All") setAllPage(page);
    if (tab === "Pending") setPendingPage(page);
    if (tab === "Accepted") setAcceptedPage(page);
  };

  const currentPage =
    activeTab === "All"
      ? allPage
      : activeTab === "Pending"
      ? pendingPage
      : acceptedPage;

  return (
    <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
      <TabbedTable
        tabs={tabs}
        tabOrder={["All", "Pending", "Accepted"]}
        defaultTab="All"
        cellRenderers={CellRenderers}
        tabLabelMap={{
          All: "All",
          Pending: "Pending",
          Accepted: "Accepted",
        }}
        location={location}
        setExternalActiveTab={setActiveTab}
        onRowClick={handleRowClick}
        currentPage={currentPage}
        totalPages={totalPagesByTab[activeTab]}
        onPageChange={(page) => handlePageChange(activeTab, page)}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </div>
  );
}
