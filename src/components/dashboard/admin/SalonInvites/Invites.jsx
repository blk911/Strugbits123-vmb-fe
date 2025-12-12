import React, { useEffect, useState } from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { CellRenderers } from "./CellRenderers";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetAdminInvitesQuery } from "../../../../store/api";
import {
  FaCalendarCheck,
  FaClock,
  FaPaperPlane,
  FaRegHandPointer,
} from "react-icons/fa";
import SalonImage from "../../../../assets/salon-1.png";
import userAvatar from "../../../../assets/person_icon.png";
import { FiX } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
const PAGE_SIZE = 10;

export default function Invites({ searchQuery = "", sortOption = "Newest" }) {
  const { openModal } = useDashboardModal();

  const [activeTab, setActiveTab] = useState("All");

  const [allPage, setAllPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [claimedPage, setClaimedPage] = useState(1);
  const [unclaimedPage, setUnclaimedPage] = useState(1);
  const [bookedPage, setBookedPage] = useState(1);

  const sortMap = { Newest: "newest", Oldest: "oldest" };
  const sortValue = sortMap[sortOption] || "newest";

  const {
    data: allData,
    isLoading: loadingAll,
    isFetching: fetchingAll,
    refetch: refetchAll,
  } = useGetAdminInvitesQuery({
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
  } = useGetAdminInvitesQuery({
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
  } = useGetAdminInvitesQuery({
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
  } = useGetAdminInvitesQuery({
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
      : activeTab === "Unclaimed"
      ? unclaimedData
      : bookedData;

  const isLoading =
    activeTab === "All"
      ? loadingAll
      : activeTab === "Pending"
      ? loadingPending
      : activeTab === "Claimed"
      ? loadingClaimed
      : activeTab === "Unclaimed"
      ? loadingUnclaimed
      : false;

  const isFetching =
    activeTab === "All"
      ? fetchingAll
      : activeTab === "Pending"
      ? fetchingPending
      : activeTab === "Claimed"
      ? fetchingClaimed
      : activeTab === "Unclaimed"
      ? fetchingUnclaimed
      : false;

  const invites = currentData?.data?.items || [];
  const totalPages = currentData?.data?.pages || 1;
  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const mapTimeline = (timeline = []) => {
    return timeline.map((item, index) => {
      const isLast = index === timeline.length - 1;
      const tag = item.tag?.toLowerCase();

      const base = {
        iconBg: isLast ? "bg-[#F3F4F6]" : "bg-[#FF92A54D]",
        barColor: isLast ? "bg-[#E5E7EB]" : "bg-[#FF92A5]",
        titleColor: isLast ? "text-[#6B7280]" : "text-[#581838]",
      };

      switch (tag) {
        case "invited":
        case "invitation-created":
          return {
            ...base,
            icon: <FaPaperPlane className="w-4 h-4" />,
            title: "Invitation Sent",
            dateBy: `${formatDate(item.timestamp)}, ${formatTime(
              item.timestamp
            )} by Salon`,
            body: item.description || "Invitation sent to client.",
          };

        case "accepted":
        case "claimed":
          return {
            ...base,
            icon: <FaRegHandPointer className="w-4 h-4" />,
            title: "User Responded",
            titleColor: "text-[#581838]",
            dateBy: `${formatDate(item.timestamp)}, ${formatTime(
              item.timestamp
            )}`,
            body: item.description || "Client accepted the invitation.",
          };

        case "scheduled":
        case "booked":
        case "appointment-created":
          return {
            ...base,
            icon: <FaCalendarCheck className="w-4 h-4" color="white" />,
            iconBg: "bg-[#FF92A5]",
            title: "Appointment Created",
            dateBy: `${formatDate(item.timestamp)}, ${formatTime(
              item.timestamp
            )}`,
            body: item.description || "Client booked an appointment.",
            smallTopLabel: true,
          };

        case "declined":
        case "rejected":
          return {
            ...base,
            icon: <FiX className="w-4 h-4" />,
            iconBg: "bg-red-100",
            barColor: "bg-red-500",
            title: "Invitation Declined",
            dateBy: `${formatDate(item.timestamp)}, ${formatTime(
              item.timestamp
            )}`,
            body: item.description || "Client declined the invitation.",
          };

        case "hold":
          return {
            ...base,
            icon: <FaClock className="w-4 h-4" />,
            iconBg: "bg-[#FFAA0033]",
            barColor: "bg-[#FFAA00]",
            title: "On Hold",
            dateBy: `${formatDate(item.timestamp)}`,
            body: item.description || "Invitation is on hold.",
          };

        case "reschedule-requested":
        case "rescheduled":
          return {
            ...base,
            icon: (
              <RiCalendarScheduleLine className="w-4 h-4" color="#9CA3AF66" />
            ),
            iconBg: "bg-[#F3F4F6]",
            iconBorderColor: "#E5E7EB",
            title: "Reschedule",
            titleColor: "text-[#6B7280]",
            dateBy: "",
            body: null,
            reschedule: {
              requestFrom: "Reschedule request from client:",
              requestMessage: `• Message: ${
                item.description || "Reschedule requested"
              }`,
              acceptedBy: "Reschedule request accepted:",
              newAppointment: "• New appointment time/date:",
              appointmentDateTime: `• ${formatDate(item.newDate)} | ${
                item.newTime || "Time TBD"
              }`,
            },
          };

        default:
          return {
            ...base,
            icon: <FaPaperPlane className="w-4 h-4" />,
            title: item.event || "Event Occurred",
            dateBy: `${formatDate(item.timestamp)}, ${formatTime(
              item.timestamp
            )}`,
            body: item.description || "No details available.",
          };
      }
    });
  };
  const transformedData = invites.map((invite) => ({
    id: invite._id,
    salonName: invite.salonName || "Unknown Salon",
    Email: invite.inviteeEmail || "N/A",
    message: invite.message || "No message",
    serviceName: invite.services?.serviceName || "N/A",
    discount: invite.discountPercentage
      ? `${invite.discountPercentage}%`
      : "0%",
    inviteDate: invite.createdAt
      ? new Date(invite.createdAt).toLocaleDateString("en-GB")
      : "N/A",
    status:
      invite.status?.charAt(0).toUpperCase() + invite.status?.slice(1) ||
      "Pending",
    _modalData: {
      status: invite.status?.charAt(0).toUpperCase() + invite.status?.slice(1),
      timelineItems: mapTimeline(invite.timeline),
      salonInfo: {
        salonId: invite.salonId,
        image: invite.salonProfilePic || "/default-salon.jpg",
        name: invite.salonName,
        desc: invite.salonDesc || "Premium Beauty Services",
        email: invite.salonEmail,
        phone: invite.salonPhone || "",
        service: invite.services?.serviceName,
        discount: invite.discountPercentage
          ? `${invite.discountPercentage}%`
          : "0%",
        message: invite.message || "No message provided.",
      },
      clientInfo: {
        name: invite.inviteeName || "",
        email: invite.inviteeEmail,
        phone: invite.inviteePhone || "",
        avatar: invite.inviteeAvatar || userAvatar,
      },
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
    Pending: (cleanRow) => openWithData(cleanRow, "Pending"),
    Claimed: (cleanRow) => openWithData(cleanRow, "Claimed"),
    Unclaimed: (cleanRow) => openWithData(cleanRow, "Unclaimed"),
  };

  const openWithData = (cleanRow, tab) => {
    const row = originalRows[tab].find((r) => r.id === cleanRow.id);
    if (row?._modalData) {
      openModal("salonInviteTracking", row._modalData);
    }
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
      : activeTab === "Unclaimed"
      ? unclaimedPage
      : 1;

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
