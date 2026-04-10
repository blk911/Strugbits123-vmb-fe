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
import userAvatar from "../../../../assets/user.png";
import { FiX } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { formatDate } from "../../../../utils/HelperFunctions";
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
    activeTab === "All" ? allData
    : activeTab === "Pending" ? pendingData
    : activeTab === "Claimed" ? claimedData
    : activeTab === "Unclaimed" ? unclaimedData
    : bookedData;

  const isLoading =
    activeTab === "All" ? loadingAll
    : activeTab === "Pending" ? loadingPending
    : activeTab === "Claimed" ? loadingClaimed
    : activeTab === "Unclaimed" ? loadingUnclaimed
    : false;

  const isFetching =
    activeTab === "All" ? fetchingAll
    : activeTab === "Pending" ? fetchingPending
    : activeTab === "Claimed" ? fetchingClaimed
    : activeTab === "Unclaimed" ? fetchingUnclaimed
    : false;

  const invites = currentData?.data?.items || [];
  const totalPages = currentData?.data?.pages || 1;

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
        iconBg: isLast ? "bg-vmb-bg-soft" : "bg-vmb-secondary/30",
        barColor: isLast ? "bg-vmb-primary/10" : "bg-vmb-secondary",
        titleColor: isLast ? "text-vmb-text-muted" : "text-vmb-primary",
      };

      switch (tag) {
        case "invited":
        case "invitation-created":
          return {
            ...base,
            icon: <FaPaperPlane className="w-4 h-4" />,
            title: "Invitation Sent",
            dateBy: `${formatDate(item.timestamp)}, ${formatTime(
              item.timestamp,
            )} by Salon`,
            body: item.description || "Invitation sent to client.",
          };

        case "accepted":
        case "claimed":
          return {
            ...base,
            icon: <FaRegHandPointer className="w-4 h-4" />,
            title: "User Responded",
            titleColor: "text-vmb-primary",
            dateBy: `${formatDate(item.timestamp)}, ${formatTime(
              item.timestamp,
            )}`,
            body: item.description || "Client accepted the invitation.",
          };

        case "scheduled":
        case "booked":
        case "appointment-created":
          return {
            ...base,
            icon: <FaCalendarCheck className="w-4 h-4" color="white" />,
            iconBg: "bg-vmb-secondary",
            title: "Appointment Created",
            dateBy: `${formatDate(item.timestamp)}, ${formatTime(
              item.timestamp,
            )}`,
            body: item.description || "Client booked an appointment.",
            smallTopLabel: true,
          };

        case "declined":
        case "rejected":
          return {
            ...base,
            icon: <FiX className="w-4 h-4" />,
            iconBg: "bg-vmb-bg-soft",
            barColor: "bg-vmb-primary/10",
            title: "Invitation Declined",
            dateBy: `${formatDate(item.timestamp)}, ${formatTime(
              item.timestamp,
            )}`,
            body: item.description || "Client declined the invitation.",
          };

        case "hold":
          return {
            ...base,
            icon: <FaClock className="w-4 h-4" />,
            iconBg: "bg-vmb-bg-soft",
            barColor: "bg-vmb-primary/10",
            title: "On Hold",
            dateBy: `${formatDate(item.timestamp)}`,
            body: item.description || "Invitation is on hold.",
          };

        case "reschedule-requested":
        case "rescheduled":
          return {
            ...base,
            icon: (
              <RiCalendarScheduleLine className="w-4 h-4 text-vmb-muted/40" />
            ),
            iconBg: "bg-vmb-bg-soft",
            iconBorderColor: "var(--vmb-primary-soft)",
            title: "Reschedule",
            titleColor: "text-vmb-text-muted",
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
              item.timestamp,
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
    discount:
      invite.discountPercentage ? `${invite.discountPercentage}%` : "0%",
    inviteDate: invite.createdAt ? formatDate(invite.createdAt) : "N/A",
    status:
      invite.status?.charAt(0).toUpperCase() + invite.status?.slice(1) ||
      "Pending",
    _modalData: {
      status: invite.status?.charAt(0).toUpperCase() + invite.status?.slice(1),
      timelineItems: mapTimeline(invite.timeline),
      salonInfo: {
        salonId: invite.salonId,
        image: invite.salonProfilePic || SalonImage,
        name: invite.salonName,
        desc: invite.salonDesc || "Premium Beauty Services",
        email: invite.salonEmail,
        phone: invite.salonPhone || "",
        service: invite.services?.serviceName,
        discount:
          invite.discountPercentage ? `${invite.discountPercentage}%` : "0%",
        message: invite.message || "No message provided.",
      },
      clientInfo: {
        name: invite.inviteeName || "",
        email: invite.inviteeEmail,
        phone: invite.inviteePhone || "",
        avatar: invite.inviteeProfilePic || userAvatar,
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
    activeTab === "All" ? allPage
    : activeTab === "Pending" ? pendingPage
    : activeTab === "Claimed" ? claimedPage
    : activeTab === "Unclaimed" ? unclaimedPage
    : 1;

  return (
    <div className="w-full flex flex-col gap-y-[31px] rounded-[10px] py-6 bg-vmb-bg-soft">
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
