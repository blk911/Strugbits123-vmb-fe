import React, { useState } from "react";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { CellRenderers } from "./CellRenderers";
import { FiEye, FiCheck, FiX } from "react-icons/fi";

import salon1 from "../../../../assets/salon-1.png";
import salon2 from "../../../../assets/salon-2.png";

const createSalonData = () => [
  {
    id: 1,
    // image: salon1,
    salonName: "Bella Beauty Salon",
    ownerName: "Jessica Miller",
    email: "jessica.m@example.com",
    submittedDate: "2025-10-23",
    status: "Active",
  },
  {
    id: 2,
    // image: salon2,
    salonName: "Glow Haven Spa",
    ownerName: "Ahmed Khan",
    email: "ahmed@glowhaven.com",
    submittedDate: "2025-11-05",
    status: "Pending",
  },
  {
    id: 3,
    // image: salon1,
    salonName: "Luxe Nail Studio",
    ownerName: "Sophia Chen",
    email: "sophia@luxenails.com",
    submittedDate: "2025-09-18",
    status: "Inactive",
  },
  {
    id: 4,
    // image: salon2,
    salonName: "Urban Cuts & Color",
    ownerName: "Michael Torres",
    email: "michael@urbancuts.com",
    submittedDate: "2025-11-15",
    status: "Rejected",
  },
  {
    id: 5,
    // image: salon1,
    salonName: "Royal Retreat Spa",
    ownerName: "Emma Williams",
    email: "emma@royalretreat.com",
    submittedDate: "2025-11-20",
    status: "Active",
  },
];

const allSalons = createSalonData();

const tabsForTable = {
  All: allSalons,
  Pending: allSalons.filter((s) => s.status === "Pending"),
  Active: allSalons.filter((s) => s.status === "Active"),
  Inactive: allSalons.filter((s) => s.status === "Inactive"),
  Rejected: allSalons.filter((s) => s.status === "Rejected"),
};

const tabOrder = ["All", "Pending", "Active", "Inactive", "Rejected"];

export default function AllSalons() {
  const handleAction = (action, row) => {
    console.log(`Action: ${action} on salon:`, row.salonName);
  };

  const handleRowClick = {
    All: (row) => handleAction("view", row),
    Pending: (row) => handleAction("view", row),
    Active: (row) => handleAction("view", row),
    Inactive: (row) => handleAction("view", row),
    Rejected: (row) => handleAction("view", row),
  };

  return (
    <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
      <TabbedTable
        tabs={tabsForTable}
        tabOrder={tabOrder}
        defaultTab="All"
        cellRenderers={CellRenderers}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
