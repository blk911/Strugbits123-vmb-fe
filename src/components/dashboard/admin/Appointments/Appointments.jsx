import React, { useEffect, useState } from "react";
import Table from "../../../common/dashboard/Table/Table";
import Pagination from "../../../common/dashboard/Table/Pagination";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import { CellRenderers } from "./CellRenderers";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetAdminAppointmentsQuery } from "../../../../store/api";
import {
  FaCalendarCheck,
  FaEye,
  FaPaperPlane,
  FaRegHandPointer,
} from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import userAvatar from "../../../../assets/person_icon.png";
import SalonImage from "../../../../assets/salon-1.png";

const PAGE_SIZE = 10;

export default function Appointments({
  searchQuery = "",
  sortOption = "Newest",
}) {
  const { openModal } = useDashboardModal();
  const [currentPage, setCurrentPage] = useState(1);

  const sortMap = { Newest: "newest", Oldest: "oldest" };
  const sortValue = sortMap[sortOption] || "newest";

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminAppointmentsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
  });
  useEffect(() => {
    refetch();
  }, [refetch]);
  const appointments = response?.data?.items || [];
  console.log("Appointments Data Recieved==>", appointments);
  const totalPages = response?.data?.pages || 1;

  const transformedData = appointments.map((appt) => ({
    id: appt._id,
    clientName: appt?.requestedBy?.name || "Unknown",
    salonName: appt.salon.salonName || "Unknown Salon",
    serviceName: appt.services?.map((s) => s.serviceName || s.name) || [],
    clientEmail: appt.requestedBy?.email || "N/A",
    appointmentDate: appt.appointmentDate
      ? new Date(appt.appointmentDate).toLocaleDateString("en-GB")
      : "N/A",
    appointmentTime: appt.startTime || "N/A",
    status: appt.status
      ? appt.status.charAt(0).toUpperCase() +
        appt.status.slice(1).replace("-", " ")
      : "Pending",
    _modalData: {
      appointment: appt,
      treatSection: {
        sender: {
          name: appt.clientName || appt.requestedByName || "Client",
          email: appt.clientEmail || appt.requestedByEmail || "N/A",
          phone: appt.clientPhone || "+1 XXX XXX XXXX",
          avatar: userAvatar,
        },
        receiver: {
          name: appt.salonOwnerName || "Salon Owner",
          email: appt.salonEmail || "N/A",
          phone: appt.salonPhone || "+1 XXX XXX XXXX",
          avatar: userAvatar,
        },
        salon: {
          name: appt.salon.salonName,
          desc: appt.salon.salonDescription || "Premium Beauty Services",
          email: appt.salon.salonEmail,
          phone: appt.salon.salonPhone,
          serviceRequested:
            appt.services?.map((s) => s.serviceName).join(", ") || "N/A",
          image: appt.salonImage || SalonImage,
        },
      },
      timelineItems: appt.timeline || [],
    },
  }));

  const cleanData = transformedData.map(({ _modalData, ...rest }) => rest);

  const handleRowClick = (row) => {
    const fullRow = transformedData.find((r) => r.id === row.id);
    if (fullRow?._modalData) {
      // openModal("appointmentRequestHistory", fullRow._modalData);
      openModal("appointmentRequestHistory", {
        timelineItems: [
          {
            icon: <FaPaperPlane className="w-4 h-4" />,
            iconBg: "bg-[#FF92A54D]",
            barColor: "bg-[#FF92A5]",
            title: "Appointment Request Created",
            dateBy: "01-08-2025 | By: Sarah Johnson",
            body: "User booked service at Bella Beauty Salon.",
          },
          {
            icon: <FaEye className="w-4 h-4" />,
            iconBg: "bg-[#FF92A54D]",
            barColor: "bg-[#FF92A5]",
            title: "Salon Accepted Request",
            dateBy: "02-08-2025",
            body: "Salon reviewed the booking and accepted.",
          },
          {
            icon: <GiCheckMark className="w-4 h-4" color="#9CA3AF66" />,
            iconBg: "bg-[#F3F4F6]",
            iconBorderColor: "#E5E7EB",
            title: "Appointment Created",
            titleColor: "#6B7280",
            dateBy: "03-08-2025, 11:05 AM",
            body: "Booking created for 06-08-2025 | 2:00 PM.",
            smallTopLabel: true,
          },
        ],
        treatSection: {
          sender: {
            name: "Sarah Johnson",
            email: "sarah@gmail.com",
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
            name: row.salonName,
            desc: "Premium Beauty Services",
            email: "bella@gmail.com",
            phone: "+1 (555) 123-4567",
            serviceRequested: ["Facial", "Manicure"].join(", "),
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
      <div className=" flex items-center justify-center bg-white rounded-[10px] p-10 shadow-sm ">
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
