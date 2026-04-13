import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CellRenderers } from "./CellRenderers";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import {
  useRequestedGiftsQuery,
  useRecievedGiftsQuery,
} from "../../../../store/api";
import { formatDate } from "../../../../utils/HelperFunctions";
const PAGE_SIZE = 10;

export default function Requests({ searchQuery = "", sortOption = "Newest" }) {
  const location = useLocation();
  const { openModal } = useDashboardModal();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "myRequests",
  );

  const [myRequestsPage, setMyRequestsPage] = useState(1);
  const [receivedRequestsPage, setReceivedRequestsPage] = useState(1);
  const [advancedSort, setAdvancedSort] = useState({
    field: "createdAt",
    order: -1,
  });
  const sortMap = {
    Newest: "newest",
    Oldest: "oldest",
  };

  const sortValue = sortMap[sortOption] || "newest";
  const {
    data: requestedData,
    isLoading: loadingRequested,
    isFetching: fetchingRequested,
    refetch: refetchRequested,
  } = useRequestedGiftsQuery({
    page: myRequestsPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    sortBy: advancedSort.field,
    sortOrder: advancedSort.order,
  });

  const {
    data: receivedData,
    isLoading: loadingReceived,
    isFetching: fetchingReceived,
    refetch: refetchReceived,
  } = useRecievedGiftsQuery({
    page: receivedRequestsPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    sortBy: advancedSort.field,
    sortOrder: advancedSort.order,
  });

  useEffect(() => {
    refetchRequested();
    refetchReceived();
  }, [refetchReceived, refetchRequested]);
  const myRequestsData = (requestedData?.data?.items || []).map((gift) => ({
    id: gift._id,
    payersEmail: gift.receiverEmail,
    salonName: gift.salonId?.salonName || "Unknown Salon",
    serviceName: gift.services.map((s) => s.serviceName || s.name),
    requestDate: formatDate(gift.createdAt),
    status: gift.status.charAt(0).toUpperCase() + gift.status.slice(1),
    _modalData: {
      isSubmitted: true,
      gift,
      selectedSalon: gift.salonId?.salonName,
      selectedServices: gift.services.map((s) => s.serviceName || s.name),
      email: gift.receiverEmail,
      message: gift.message || "No message",
    },
  }));

  const receivedRequestsData = (receivedData?.data?.items || []).map(
    (gift) => ({
      id: gift._id,
      senderEmail: gift.requesterId?.email || "Unknown",
      giftedServices: gift.services.map((s) => s.serviceName || s.name),
      dateReceived: formatDate(gift.createdAt),
      price: `$${gift.services.reduce(
        (sum, s) => sum + Number(s.servicePrice || 0),
        0,
      )}`,
      paidPrice:
        gift.isPaid ?
          `$${
            gift.services.reduce(
              (sum, s) => sum + Number(s.servicePrice || 0),
              0,
            ) *
              0.1 +
            gift.services.reduce(
              (sum, s) => sum + Number(s.servicePrice || 0),
              0,
            )
          } `
        : "-",
      giftStatus:
        gift.isPaid ? "Accepted"
        : gift.status === "pending" ? "Pending"
        : "Declined",
      _modalData: {
        gift,
        salon: {
          name: gift.salonId?.salonName,
          description: gift.salonId?.description,
          image: gift.salonId?.profilePic,
        },
        services: gift.services.map((s) => ({
          name: s.serviceName || s.name,
          duration: `${s.serviceDuration} min`,
          price: s.servicePrice,
        })),
        sender: {
          name: gift.requesterId?.name || "Someone",
          email: gift.requesterId?.email,
          message: gift.message,
        },
      },
    }),
  );

  const cleanDataForTable = (data) =>
    data.map(({ _modalData, ...rest }) => rest);

  const tabs = {
    myRequests: cleanDataForTable(myRequestsData),
    receivedRequests: cleanDataForTable(receivedRequestsData),
  };

  const originalRows = {
    myRequests: myRequestsData,
    receivedRequests: receivedRequestsData,
  };

  const totalPages = {
    myRequests: requestedData?.data?.pages || 1,
    receivedRequests: receivedData?.data?.pages || 1,
  };

  const handleRowClick = {
    myRequests: (cleanRow) => {
      const row = originalRows.myRequests.find((r) => r.id === cleanRow.id);
      if (row?._modalData) {
        openModal("treat", row._modalData);
      }
    },
    receivedRequests: (cleanRow) => {
      const row = originalRows.receivedRequests.find(
        (r) => r.id === cleanRow.id,
      );
      if (row?._modalData) {
        openModal("treatRequest", row._modalData);
      }
    },
  };

  const handlePageChange = (tab, page) => {
    if (tab === "myRequests") setMyRequestsPage(page);
    if (tab === "receivedRequests") setReceivedRequestsPage(page);
  };

  const isLoading =
    activeTab === "myRequests" ? loadingRequested : loadingReceived;
  const isFetching =
    activeTab === "myRequests" ? fetchingRequested : fetchingReceived;
  const handleSort = (field, order) => {
    setAdvancedSort({ field, order });
    setMyRequestsPage(1);
    setReceivedRequestsPage(1);
  };

  const sortFields = {
    salonName: "salonName",
    payersEmail: "clientEmail",
    requestDate: "createdAt",
    status: "status",
    senderEmail: "clientEmail",
    dateReceived: "createdAt",
    giftStatus: "status",
  };
  return (
    <div className="w-full flex flex-col gap-y-[31px] rounded-[10px] py-6 bg-vmb-bg-soft">
      <TabbedTable
        tabs={tabs}
        tabOrder={["myRequests", "receivedRequests"]}
        defaultTab="myRequests"
        cellRenderers={CellRenderers}
        tabLabelMap={{
          myRequests: "My Requests",
          receivedRequests: "Received Requests",
        }}
        location={location}
        setExternalActiveTab={setActiveTab}
        onRowClick={handleRowClick}
        currentPage={
          activeTab === "myRequests" ? myRequestsPage : receivedRequestsPage
        }
        totalPages={totalPages[activeTab]}
        onPageChange={(page) => handlePageChange(activeTab, page)}
        isLoading={isLoading}
        isFetching={isFetching}
        onSort={handleSort}
        sortBy={advancedSort.field}
        sortOrder={advancedSort.order}
        sortFields={sortFields}
      />
    </div>
  );
}
