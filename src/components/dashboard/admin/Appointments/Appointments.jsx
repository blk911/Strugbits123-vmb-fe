import React from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { CellRenderers } from "./CellRenderers";
import {
  FaCalendarCheck,
  FaEye,
  FaPaperPlane,
  FaRegHandPointer,
} from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import SalonImage from "../../../../assets/salon-1.png";
import userAvatar from "../../../../assets/person_icon.png";
const allAppointmentsData = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    salonName: "Beauty Salon & Spa",
    serviceName: [
      "Hair Color",
      "Body Massage",
      "Nail Painting",
      "Facial",
      "Spa",
    ],
    clientEmail: "elitejuan@gmail.com",

    status: "Pending",
  },
  {
    id: 2,
    clientName: "Maria Chen",
    salonName: "Glam Studio",
    serviceName: ["Nail Painting", "Facial", "Hair Color"],
    clientEmail: "maria@gmail.com",

    status: "Pending",
  },
  {
    id: 3,
    clientName: "Emma Wilson",
    salonName: "Luxe Hair & Spa",
    serviceName: ["Highlight", "Massage", "Pedicure"],
    clientEmail: "john@gmail.com",

    status: "Hold",
  },
  {
    id: 4,
    clientName: "Olivia Brown",
    salonName: "Royal Beauty",
    serviceName: ["Hair Color", "Facial", "Body Massage"],
    clientEmail: "alex@gmail.com",

    status: "Confirmed",
  },
  {
    id: 5,
    clientName: "Sophia Martinez",
    salonName: "Urban Salon",
    serviceName: ["Nail Art", "Hair Cut"],
    clientEmail: "emma@gmail.com",

    status: "Declined",
  },
];

const tabsData = {
  All: allAppointmentsData,
  Pending: allAppointmentsData.filter((a) => a.status === "Pending"),
  Confirmed: allAppointmentsData.filter((a) => a.status === "Confirmed"),
  Hold: allAppointmentsData.filter((a) => a.status === "Hold"),
  Declined: allAppointmentsData.filter((a) => a.status === "Declined"),
};

const tabOrder = ["All", "Pending", "Confirmed", "Hold", "Declined"];

export default function Appointments() {
  const { openModal } = useDashboardModal();

  const openWithData = (row) => {
    // openModal("appointmentDetails");
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
          name: row.clientName,
          email: row.clientEmail,
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
          serviceRequested: row.serviceName.join(", "),
          image: SalonImage,
        },
      },
    });
  };
  const handleRowClick = {
    All: openWithData,
    Pending: openWithData,
    Confirmed: openWithData,
    Hold: openWithData,
    Declined: openWithData,
  };
  return (
    <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
      <TabbedTable
        tabs={tabsData}
        tabOrder={tabOrder}
        defaultTab="All"
        onRowClick={handleRowClick}
        cellRenderers={CellRenderers}
      />
    </div>
  );
}
