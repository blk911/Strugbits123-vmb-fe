import React from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { CellRenderers } from "./CellRenderers";
import SalonImage from "../../../../assets/salon-1.png";
import { FaEye, FaPaperPlane, FaRegHandPointer } from "react-icons/fa";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { GiCheckMark } from "react-icons/gi";
import userAvatar from "../../../../assets/user_icon.png";
const allRequestsData = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    salonName: "Bella Beauty Salon 1",
    services: ["Hair Color", "HydraFacial Deluxe", "Balayage Highlights"],
    clientEmail: "elitejuan@gmail.com",
    status: "Confirmed",
  },
  {
    id: 2,
    clientName: "Maria Lopez",
    salonName: "Glam Studio",
    services: ["Luxury Manicure & Pedicure", "Lash Lift & Tint"],
    clientEmail: "maria@gmail.com",
    status: "Pending",
  },
  {
    id: 3,
    clientName: "Emma Wilson",
    salonName: "Luxe Beauty Lounge",
    services: ["Full Body Massage", "Nail Painting", "Eyebrow Threading"],
    clientEmail: "emma.w@gmail.com",
    status: "Declined",
  },
];

const tabsData = {
  All: allRequestsData,
  Confirmed: allRequestsData.filter((r) => r.status === "Confirmed"),
  Pending: allRequestsData.filter((r) => r.status === "Pending"),
  Declined: allRequestsData.filter((r) => r.status === "Declined"),
};

const tabOrder = ["All", "Confirmed", "Pending", "Declined"];

export default function Requests() {
  const { openModal } = useDashboardModal();

  const openWithData = (row) => {
    // openModal("treatRequest")
    console.log("Row==>", row);
    openModal("giftRequestHistory", {
      timelineItems: [
        {
          icon: <FaPaperPlane className="w-4 h-4" />,
          iconBg: "bg-[#FF92A54D]",
          title: "Gift Request Sent",
          titleColor: "#1F2937",
          dateBy: "01-08-2025 | By: Sarah Johnson (Sender)",
          body: "Gift request sent to Juliana Sauve for Hair Color service.",
        },
        {
          icon: <FaEye className="w-4 h-4" />,
          iconBg: "bg-[#FF92A54D]",
          title: "Gift Accepted",
          titleColor: "#1F2937",
          dateBy: "02-08-2025 | By: Juliana Sauve (Receiver)",
          body: "Receiver accepted the gift and paid for the services.",
        },
        {
          icon: <FaRegHandPointer className="w-4 h-4" />,
          iconBg: "bg-[#FF92A54D]",
          title: "Salon Responded",
          titleColor: "#1F2937",
          dateBy: "03-08-2025 | By: Bella Beauty Salon",
          body: "Salon proposed available appointment slot for 05-08-2025, 3:30 PM.",
        },
        {
          icon: <RiCalendarScheduleLine className="w-4 h-4" />,
          iconBg: "bg-[#FF92A54D]",
          title: "User Confirmed Appointment",
          titleColor: "#6B7280",
          dateBy: "04-08-2025 | Status: Confirmed | By: Sarah Johnson",
          body: "Receiver confirmed appointment date and time.",
          smallTopLabel: true,
        },
        {
          icon: <GiCheckMark className="w-4 h-4" color="#9CA3AF66" />,
          iconBg: "bg-[#F3F4F6]",
          iconBorderColor: "#E5E7EB",
          title: "Appointment Created",
          titleColor: "#6B7280",
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
          titleColor: "#6B7280",
          dateBy: "",
          body: null,
          reschedule: {
            requestFrom: "Rescheduled request from Sarah Johnson:",
            requestMessage:
              "• Message: I’d like to reschedule my booking. Please update the appointment time as per the new availability. 5pm on Wednesday 01 Nov, 2025",
            acceptedBy: "Rescheduled request Accepted from Bella Beauty Salon:",
            newAppointment: "• New appointment time/date:",
            appointmentDateTime: "• 28-10-2025 | 05:00 PM on 01 Nov, 2025",
          },
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
          serviceRequested: row.services.join(", "),
          image: SalonImage,
        },
      },
    });
  };
  const handleRowClick = {
    All: openWithData,
    Pending: openWithData,
    Confirmed: openWithData,
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
