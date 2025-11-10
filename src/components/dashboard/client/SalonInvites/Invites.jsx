import React, { useState } from "react";

import { CellRenderers } from "./CellRenderers";
import InvitesTable from "./InvitesTable";

const pendingData = [
  {
    id: 1,
    salonName: "Bella Beauty Salon",
    serviceName: ["Hair Cutting", "Spa", "Facial"],
    payersEmail: "elitejuan@gmail.com",
    discount: "10%",
    expiresOn: "02-08-2025",
    status: "Pending",
  },
  {
    id: 2,
    salonName: "Glam Studio",
    serviceName: ["Manicure", "Pedicure", "Massage"],
    payersEmail: "maria@gmail.com",
    discount: "15%",
    expiresOn: "03-08-2025",
    status: "Pending",
  },
];

const claimedData = [
  {
    id: 3,
    salonName: "Luxe Hair & Spa",
    serviceName: ["Highlight", "Hair Color"],
    payersEmail: "john@gmail.com",
    discount: "20%",
    expiresOn: "04-08-2025",
    status: "Claimed",
  },
];

const unclaimedData = [
  {
    id: 4,
    salonName: "Elegant Nails",
    serviceName: ["Nail Art", "Gel Polish"],
    payersEmail: "sarah@gmail.com",
    discount: "12%",
    expiresOn: "05-08-2025",
    status: "Unclaimed",
  },
];

const tabs = {
  Pending: pendingData,
  Claimed: claimedData,
  Unclaimed: unclaimedData,
};

function Invites() {
  const [activeTab, setActiveTab] = useState("Pending");

  return (
    <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
      <div className="w-full">
        <InvitesTable
          data={tabs[activeTab]}
          cellRenderers={CellRenderers}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          tabOrder={["Pending", "Claimed", "Unclaimed"]}
        />
      </div>
    </div>
  );
}

export default Invites;
