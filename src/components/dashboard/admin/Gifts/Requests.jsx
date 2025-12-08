import React, { useEffect, useState } from "react";
import Table from "../../../common/dashboard/Table/Table";
import Pagination from "../../../common/dashboard/Table/Pagination";
import { CellRenderers } from "./CellRenderers";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetAllGiftsAdminQuery } from "../../../../store/api";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import {
  FaCalendarCheck,
  FaEye,
  FaPaperPlane,
  FaRegHandPointer,
} from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import userAvatar from "../../../../assets/user_icon.png";
import SalonImage from "../../../../assets/salon-1.png";
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
          phone: gift.requesterId?.phoneNumber || "+1 XXX XXX XXXX",
          avatar: "/default-user.jpg",
        },
        receiver: {
          name: gift.receiverName || "Receiver",
          email: gift.receiverEmail,
          phone: "+1 XXX XXX XXXX",
          avatar: "/default-user.jpg",
        },
        salon: {
          name: gift.salonId?.salonName,
          desc: gift.salonId?.description || "Premium Beauty Services",
          email: gift.salonId?.email,
          phone: gift.salonId?.phoneNumber || "+1 XXX XXX XXXX",
          serviceRequested: gift.services?.map((s) => s.serviceName).join(", "),
          image: gift.salonId?.profilePic || "/default-salon.jpg",
        },
      },
      timelineItems: gift.timeline || [],
    },
  }));

  const cleanData = transformedData.map(({ _modalData, ...rest }) => rest);

  const handleRowClick = (row) => {
    const fullRow = transformedData.find((r) => r.id === row.id);
    if (fullRow?._modalData) {
      // openModal("giftRequestHistory", fullRow._modalData);
      openModal("giftRequestHistory", {
        timelineItems: [
          {
            icon: <FaPaperPlane className="w-4 h-4" />,
            iconBg: "bg-[#FF92A54D]",
            barColor: "bg-[#FF92A5]",
            title: "Gift Request Sent",
            dateBy: "01-08-2025 | By: Sarah Johnson (Sender)",
            body: "Gift request sent to Juliana Sauve for Hair Color service.",
          },
          {
            icon: <FaEye className="w-4 h-4" />,
            iconBg: "bg-[#FF92A54D]",
            barColor: "bg-[#FF92A5]",
            title: "Gift Accepted",
            dateBy: "02-08-2025 | By: Juliana Sauve (Receiver)",
            body: "Receiver accepted the gift and paid for the services.",
          },
          {
            icon: <FaRegHandPointer className="w-4 h-4" />,
            iconBg: "bg-[#FF92A54D]",
            barColor: "bg-[#FF92A5]",

            title: "Salon Responded",
            titleColor: "text-[#581838]",

            dateBy: "03-08-2025 | By: Bella Beauty Salon",
            body: "Salon proposed available appointment slot for 05-08-2025, 3:30 PM.",
          },
          {
            icon: <FaCalendarCheck className="w-4 h-4" color="white" />,
            iconBg: "bg-[#FF92A5]",

            title: "User Confirmed Appointment",
            dateBy: "04-08-2025 | Status: Confirmed | By: Sarah Johnson",
            body: "Receiver confirmed appointment date and time.",
            smallTopLabel: true,
          },
          {
            icon: <GiCheckMark className="w-4 h-4" color="#9CA3AF66" />,
            iconBg: "bg-[#F3F4F6]",
            iconBorderColor: "#E5E7EB",
            title: "Appointment Created",
            titleColor: "text-[#6B7280]",
            dateBy: "04-08-2025 | Status: Confirmed | By: Sarah Johnson",
            body: "Receiver confirmed appointment date and time.",
            smallTopLabel: true,
          },
          {
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
              requestFrom: "Rescheduled request from Sarah Johnson:",
              requestMessage:
                "• Message: I’d like to reschedule my booking. Please update the appointment time as per the new availability. 5pm on Wednesday 01 Nov, 2025",
              acceptedBy:
                "Rescheduled request Accepted from Bella Beauty Salon:",
              newAppointment: "• New appointment time/date:",
              appointmentDateTime: "• 28-10-2025 | 05:00 PM on 01 Nov, 2025",
            },
          },
        ],
        treatSection: {
          sender: {
            name: "Sarah Johnson",
            email: "juliana@gmail.com",
            phone: "+14 256 365470",
            avatar: userAvatar,
          },
          receiver: {
            name: "Juliana Sauvé",
            email: "juliana@gmail.com",
            phone: "+14 256 365470",
            avatar: userAvatar,
          },
          salon: {
            name: "Bella Beauty Salon",
            desc: "Premium Beauty Services",
            email: "bella@gmail.com",
            phone: "+1 (555) 123-4567",
            serviceRequested: ["Hair Color", "Hair Color", "Hair Color"].join(
              ", "
            ),
            image: SalonImage,
          },
        },
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center flex-1 bg-white w-full justify-center rounded-[10px] p-6 shadow-sm">
        <LoadingIndicator size="xl" />
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
