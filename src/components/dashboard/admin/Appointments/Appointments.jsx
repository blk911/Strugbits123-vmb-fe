import React, { useEffect, useState } from "react";
import Table from "../../../common/dashboard/Table/Table";
import Pagination from "../../../common/dashboard/Table/Pagination";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import { CellRenderers } from "./CellRenderers";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetAdminAppointmentsQuery } from "../../../../store/api";
import {
  FaCalendarCheck,
  FaClock,
  FaEye,
  FaPaperPlane,
  FaRegHandPointer,
} from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import userAvatar from "../../../../assets/person_icon.png";
import SalonImage from "../../../../assets/salon-1.png";
import { FiX } from "react-icons/fi";
import { formatDate } from "../../../../utils/HelperFunctions";
const PAGE_SIZE = 10;

export default function Appointments({
  searchQuery = "",
  sortOption = "Newest",
}) {
  const { openModal } = useDashboardModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedSort, setAdvancedSort] = useState({
    field: "createdAt",
    order: -1,
  });

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
    sortBy: advancedSort.field,
    sortOrder: advancedSort.order,
  });
  useEffect(() => {
    refetch();
  }, [refetch]);
  const appointments = response?.data?.items || [];
  const totalPages = response?.data?.pages || 1;

  const mapTimeline = (timeline = [], appt) => {
    return timeline.map((item, index) => {
      const isLast = index === timeline.length - 1;
      const tag = item.tag?.toLowerCase();
      const base = {
        iconBg: isLast ? "bg-vmb-bg-soft" : "bg-vmb-secondary/30",
        barColor: isLast ? "bg-vmb-primary/10" : "bg-vmb-secondary",
        titleColor: isLast ? "text-vmb-text-muted" : "text-vmb-primary",
      };

      switch (tag) {
        case "requested":
        case "appointment-created":
          return {
            ...base,
            icon: <FaPaperPlane className="w-4 h-4" />,
            title: "Appointment Request Created",
            dateBy: `${formatDate(item.timestamp)} | By: ${
              appt.requestedBy?.name || "Client"
            }`,
            body: item.description || "Appointment request was created.",
          };

        case "salon-accepted":
        case "appointment-proposed":
          return {
            ...base,
            icon: <FaEye className="w-4 h-4" />,
            title: "Salon Accepted Request",
            dateBy: `${formatDate(item.timestamp)} | By: ${
              appt.salon?.salonName || "Salon"
            }`,
            body:
              item.description || "Salon reviewed and accepted the booking.",
          };

        case "confirmed":
        case "user-confirmed":
          return {
            ...base,
            icon: <FaCalendarCheck className="w-4 h-4" color="white" />,
            iconBg: "bg-vmb-secondary",
            title: "Appointment Confirmed",
            dateBy: `${formatDate(item.timestamp)} | Status: Confirmed`,
            body: item.description || "Client confirmed the appointment.",
            smallTopLabel: true,
          };

        case "scheduled":
          return {
            ...base,
            icon: <GiCheckMark className="w-4 h-4 text-vmb-muted/40" />,
            iconBg: "bg-vmb-bg-soft",
            iconBorderColor: "var(--vmb-primary-soft)",
            title: "Appointment Scheduled",
            titleColor: "text-vmb-text-muted",
            dateBy: `${formatDate(item.timestamp)} | Status: Confirmed`,
            body: item.description || "Appointment scheduled successfully.",
            smallTopLabel: true,
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
            title: "Reschedule Requested",
            titleColor: "text-vmb-text-muted",
            dateBy: "",
            body: null,
            reschedule: {
              requestFrom: `Rescheduled request from ${
                appt?.salon?.salonName || "Salon"
              }`,
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
            title: "Appointment Declined",
            dateBy: `${formatDate(item.timestamp)} | By: Receiver/Salon`,
            body: item.description || "Appointment was declined.",
          };

        case "hold":
          return {
            ...base,
            icon: <FaClock className="w-4 h-4" />,
            iconBg: "bg-vmb-pending/20",
            barColor: "bg-vmb-pending",
            title: "On Hold",
            dateBy: `${formatDate(item.timestamp)}`,
            body: item.description || "Appointment is on hold.",
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

  const transformedData = appointments.map((appt) => ({
    id: appt._id,
    clientName: appt?.requestedBy?.name || "Unknown",
    salonName: appt?.salon.salonName || "Unknown Salon",
    serviceName: appt?.services?.map((s) => s.serviceName || s.name) || [],
    clientEmail: appt.requestedBy?.email || "N/A",
    appointmentDate:
      appt.appointmentDate ? formatDate(appt.appointmentDate) : "N/A",
    appointmentTime: appt.startTime || "N/A",
    status:
      appt.status ?
        appt.status.charAt(0).toUpperCase() +
        appt.status.slice(1).replace("-", " ")
      : "Pending",
    _modalData: {
      appointment: appt,
      treatSection: {
        sender: {
          name: appt.requestedBy?.name || appt.requestedByName || "Client",
          email: appt.requestedBy?.email || appt.requestedByEmail || "N/A",
          phone: appt.requestedBy?.phone || "",
          avatar: appt.requestedBy?.image || userAvatar,
        },
        receiver: {
          name: appt.requestedFrom?.name || "Salon Owner",
          email: appt.requestedFrom?.email || "",
          phone: appt.requestedFrom?.phone || "",
          avatar: appt.requestedFrom?.image || userAvatar,
        },
        salon: {
          salonId: appt.salon.salonId,
          name: appt.salon.salonName,
          desc: appt.salon.salonDescription || "",
          email: appt.salon.salonEmail,
          phone: appt.salon.salonPhone,
          serviceRequested: appt.services,
          discount: appt.type === "invite" ? appt.services[0]?.discount : 0,
          image: appt.salon.salonImage || SalonImage,
        },
      },
      timelineItems: mapTimeline(appt.timeline, appt),
    },
  }));

  const cleanData = transformedData.map(({ _modalData, ...rest }) => rest);

  const handleRowClick = (row) => {
    const fullRow = transformedData.find((r) => r.id === row.id);
    if (fullRow?._modalData) {
      openModal("appointmentRequestHistory", fullRow._modalData);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSort = (field, order) => {
    setAdvancedSort({ field, order });
    setCurrentPage(1);
  };

  const sortFields = {
    clientName: "clientName",
    salonName: "salonName",
    clientEmail: "clientEmail",
    appointmentDate: "appointmentDate",
    appointmentTime: "appointmentTime",
    status: "status",
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
      <div className="p-4 md:p-6 overflow-x-auto">
        <Table
          data={cleanData}
          cellRenderers={CellRenderers}
          onRowClick={handleRowClick}
          onSort={handleSort}
          sortBy={advancedSort.field}
          sortOrder={advancedSort.order}
          sortFields={sortFields}
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
