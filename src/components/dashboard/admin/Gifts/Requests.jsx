import React from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { CellRenderers } from "./CellRenderers";
// import userAvatar from "../../../../assets/user_icon.png";

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

  const handleRowClick = (row) => {
    // openModal("treatRequest")
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
