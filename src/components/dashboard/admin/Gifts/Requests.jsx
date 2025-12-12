import React, { useEffect, useState } from "react";
import Table from "../../../common/dashboard/Table/Table";
import Pagination from "../../../common/dashboard/Table/Pagination";
import { CellRenderers } from "./CellRenderers";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetAllGiftsAdminQuery } from "../../../../store/api";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import {
  FaCalendarCheck,
  FaClock,
  FaEye,
  FaPaperPlane,
  FaRegHandPointer,
} from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import userAvatar from "../../../../assets/user_icon.png";
import SalonImage from "../../../../assets/salon-1.png";
import { FiX } from "react-icons/fi";
const PAGE_SIZE = 10;

export default function Requests({ searchQuery = "", sortOption = "Newest" }) {
  const { openModal } = useDashboardModal();

  const [currentPage, setCurrentPage] = useState(1);

  const sortMap = { Newest: "newest", Oldest: "oldest" };
  const sortValue = sortMap[sortOption] || "newest";

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllGiftsAdminQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);
  const gifts = response?.data?.items || [];
  const totalPages = response?.data?.pages || 1;
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const mapTimeline = (timeline = [], gift) => {
    return timeline.map((item, index) => {
      const isLast = index === timeline.length - 1;
      const tag = item.tag?.toLowerCase();

      const base = {
        iconBg: isLast ? "bg-[#F3F4F6]" : "bg-[#FF92A54D]",
        barColor: isLast ? "bg-[#E5E7EB]" : "bg-[#FF92A5]",
        titleColor: isLast ? "text-[#6B7280]" : "text-[#581838]",
      };

      switch (tag) {
        case "gift-requested":
          return {
            ...base,
            icon: <FaPaperPlane className="w-4 h-4" />,
            title: "Gift Request Sent",
            dateBy: `${formatDate(item.timestamp)} | By: ${
              gift.requesterId?.name || "Sender"
            } (Sender)`,
            body: item.description || "Gift request was created.",
          };

        case "accepted":
        case "paid":
        case "gift-accepted":
          return {
            ...base,
            icon: <FaEye className="w-4 h-4" />,
            title: "Gift Accepted",
            dateBy: `${formatDate(item.timestamp)} | By: Receiver`,
            body:
              item.description ||
              "Receiver accepted the gift and paid for the services.",
          };

        case "salon-responded":
        case "appointment-proposed":
          return {
            ...base,
            icon: <FaRegHandPointer className="w-4 h-4" />,
            title: "Salon Responded",
            titleColor: "text-[#581838]",
            dateBy: `${formatDate(item.timestamp)} | By: ${
              gift.salonId?.salonName || "Salon"
            }`,
            body:
              item.description || "Salon proposed available appointment slot.",
          };

        case "confirmed":
        case "scheduled":
          return {
            ...base,
            icon: <FaCalendarCheck className="w-4 h-4" color="white" />,
            iconBg: "bg-[#FF92A5]",
            title: "User Confirmed Appointment",
            dateBy: `${formatDate(item.timestamp)} | Status: Confirmed`,
            body:
              item.description ||
              "Receiver confirmed appointment date and time.",
            smallTopLabel: true,
          };

        case "appointment-created":
          return {
            ...base,
            icon: <GiCheckMark className="w-4 h-4" color="#9CA3AF66" />,
            iconBg: "bg-[#F3F4F6]",
            iconBorderColor: "#E5E7EB",
            title: "Appointment Created",
            titleColor: "text-[#6B7280]",
            dateBy: `${formatDate(item.timestamp)} | Status: Confirmed`,
            body: item.description || "Appointment created successfully.",
            smallTopLabel: true,
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
              requestFrom: "Rescheduled request from sender:",
              requestMessage: `• Message: ${
                item.description || "Reschedule requested"
              }`,
              acceptedBy: "Rescheduled request accepted:",
              newAppointment: "• New appointment time/date:",
              appointmentDateTime: `• ${formatDate(item.newDate)} | ${
                item.newTime || "Time TBD"
              }`,
            },
          };

        case "declined":
        case "rejected":
          return {
            ...base,
            icon: <FiX className="w-4 h-4" />,
            iconBg: "bg-red-100",
            barColor: "bg-red-500",
            title: "Gift Request Rejected",
            dateBy: `${formatDate(item.timestamp)} | By: Receiver`,
            body: item.description || "Gift request was rejected.",
          };

        case "hold":
          return {
            ...base,
            icon: <FaClock className="w-4 h-4" />,
            iconBg: "bg-[#FFAA0033]",
            barColor: "bg-[#FFAA00]",
            title: "On Hold",
            dateBy: `${formatDate(item.timestamp)}`,
            body: item.description || "Gift request is on hold.",
          };

        default:
          return {
            ...base,
            icon: <FaPaperPlane className="w-4 h-4" />,
            title: item.event || "Event Occurred",
            dateBy: formatDate(item.timestamp),
            body: item.description || "No details available.",
          };
      }
    });
  };
  const transformedData = gifts.map((gift) => ({
    id: gift._id,
    clientName: gift.requesterId?.name || "Unknown",
    salonName: gift.salonId?.salonName || "Unknown Salon",
    services: gift.services?.map((s) => s.serviceName || s.name) || [],
    clientEmail: gift.requesterId?.email || "N/A",
    status:
      gift.status?.charAt(0).toUpperCase() + gift.status?.slice(1) || "Pending",
    _modalData: {
      gift,

      treatSection: {
        sender: {
          name: gift.requesterId?.name || "Someone",
          email: gift.requesterId?.email,
          phone: gift.requesterId?.phoneNumber || "",
          avatar: gift.requesterId?.userProfile || userAvatar,
        },
        receiver: {
          name: gift.receiverName || "Receiver",
          email: gift.receiverEmail,
          phone: "",
          avatar: userAvatar,
        },
        salon: {
          salonId: gift.salonId?._id,
          name: gift.salonId?.salonName,
          desc: gift.salonId?.description || "Premium Beauty Services",
          email: gift.salonId?.email,
          phone: gift.salonId?.phoneNumber || "",
          serviceRequested: gift.services?.map((s) => s.serviceName).join(", "),
          image: gift.salonId?.profilePic || SalonImage,
        },
      },
      timelineItems: mapTimeline(gift.timeline, gift),
    },
  }));

  const cleanData = transformedData.map(({ _modalData, ...rest }) => rest);

  const handleRowClick = (row) => {
    const fullRow = transformedData.find((r) => r.id === row.id);
    if (fullRow?._modalData) {
      openModal("giftRequestHistory", fullRow._modalData);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center flex-1 bg-white w-full justify-center rounded-[10px] p-6 shadow-sm">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[10px] shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <Table
          data={cleanData}
          cellRenderers={CellRenderers}
          onRowClick={handleRowClick}
        />
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isFetching={isFetching}
          />
        </div>
      )}
    </div>
  );
}
