import React from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { CellRenderers } from "./CellRenderers";

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

  const handleRowClick = (row) => {
    // openModal("inviteDetails");
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
