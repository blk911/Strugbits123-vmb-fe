import React from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { CellRenderers } from "./CellRenderers";

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

  const handleRowClick = (row) => {
    // openModal("appointmentDetails");
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
