import React from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { CellRenderers } from "./CellRenderers";
import SalonImage from "../../../../assets/salon-1.png";
import userAvatar from "../../../../assets/person_icon.png";
import {
  FaCalendarCheck,
  FaPaperPlane,
  FaRegHandPointer,
} from "react-icons/fa";

const allInvitesData = [
  {
    id: 1,
    salonName: "Bella Beauty Salon",
    Email: "elitejuan@gmail.com",
    message:
      "Hi! You’ve been invited to check out our salon. Explore our services and book your next appointment with us.",
    serviceName: ["Hair Cutting", "Spa", "Facial"],
    discount: 10,
    inviteDate: "02-08-2025",
    status: "Pending",
  },
  {
    id: 2,
    salonName: "Glam Studio",
    Email: "maria@gmail.com",
    message:
      "Exclusive invite! Enjoy premium beauty services with a special discount just for you.",
    serviceName: ["Manicure", "Pedicure", "Massage"],
    discount: 15,
    inviteDate: "03-08-2025",
    status: "Accepted",
  },
  {
    id: 3,
    salonName: "Luxe Nails & Spa",
    Email: "john@gmail.com",
    message:
      "We’d love to have you! Claim your special offer before it expires.",
    serviceName: ["Highlight", "Hair Color", "Blow Dry"],
    discount: 20,
    inviteDate: "01-08-2025",
    status: "Expired",
  },
  {
    id: 4,
    salonName: "Radiance Beauty Lounge",
    Email: "sarah@gmail.com",
    message:
      "Special invitation: Get pampered with luxury nail services at a great discount!",
    serviceName: ["Nail Art", "Gel Polish", "French Tips"],
    discount: 12,
    inviteDate: "04-08-2025",
    status: "Booked",
  },
  {
    id: 5,
    salonName: "Elite Hair Studio",
    Email: "lisa@gmail.com",
    message: "Your personalized invite is here — don’t miss out!",
    serviceName: ["Balayage", "Keratin Treatment"],
    discount: 25,
    inviteDate: "05-08-2025",
    status: "Pending",
  },
];

const tabsData = {
  All: allInvitesData,
  Pending: allInvitesData.filter((r) => r.status === "Pending"),
  Accepted: allInvitesData.filter((r) => r.status === "Accepted"),
  Booked: allInvitesData.filter((r) => r.status === "Booked"),
  Expired: allInvitesData.filter((r) => r.status === "Expired"),
};

const tabOrder = ["All", "Pending", "Accepted", "Booked", "Expired"];

export default function Invites() {
  const { openModal } = useDashboardModal();

  const openWithData = (row) => {
    // openModal("inviteDetails");
    openModal("salonInviteTracking", {
      timelineItems: [
        {
          icon: <FaPaperPlane className="w-4 h-4" />,
          title: "Invitation Sent",
          dateBy: "01-08-2025, 10:30 AM by Bella Beauty Salon",
          body: "Salon invited user to try Hair Color service with a 10% discount.",
        },

        {
          icon: <FaRegHandPointer className="w-4 h-4" />,
          titleColor: "text-[#581838]",
          title: "User Responded",
          dateBy: "02-08-2025, 09:00 AM",
          body: "User accepted.",
        },
        {
          icon: <FaCalendarCheck className="w-4 h-4" color="white" />,
          iconBg: "bg-[#FF92A5]",
          title: "Appointment Created",
          dateBy: "03-08-2025, 11:05 AM",
          body: "Booking created for 06-08-2025 | 2:00 PM.",
          smallTopLabel: true,
        },
      ],

      salonInfo: {
        image: SalonImage,
        name: "Bella Beauty Salon",
        desc: "Premium Beauty Services",
        email: "bella@gmail.com",
        phone: "+1 (555) 123-4567",
        service: "Hair Color",
        discount: "10%",
        message: `Hi Juliana,
I want you to experience my salon with Hair Cutting at an exclusive discount!
Signup and book today.`,
      },

      clientInfo: {
        name: "Sarah Johnson",
        email: "sarah@gmail.com",
        phone: "+1 (555) 123-4567",
        avatar: userAvatar,
      },
    });
  };
  const handleRowClick = {
    All: openWithData,
    Pending: openWithData,
    Accepted: openWithData,
    Booked: openWithData,
    Expired: openWithData,
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
