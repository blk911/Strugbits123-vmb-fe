import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { CellRenderers } from "./CellRenderers";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";

const myRequestsData = [
  {
    id: 1,
    payersEmail: "elitejuan@gmail.com",
    salonName: "Beauty Salon & Spa",
    serviceName: [
      "Hair Color",
      "nails",
      "Highlight and lowlight",
      "HydraFacial",
    ],
    requestDate: "02-08-2025",
    status: "Accepted",
  },
  {
    id: 2,
    payersEmail: "maria@gmail.com",
    salonName: "Glam Studio",
    serviceName: ["Nail Painting", "Facial"],
    requestDate: "03-08-2025",
    status: "Pending",
  },
];
const receivedRequestsData = [
  {
    id: 1,
    senderEmail: "elitejuan@gmail.com",
    giftedServices: [
      "Hair Color",
      "nails",
      "Highlight and lowlight",
      "HydraFacial",
    ],
    dateReceived: "02-08-2025",
    price: "$150",
    paidPrice: "$120",
    giftStatus: "Accepted",
  },
  {
    id: 2,
    senderEmail: "maria@gmail.com",
    giftedServices: ["Nail Painting", "Facial"],
    dateReceived: "03-08-2025",
    price: "$100",
    paidPrice: "$80",
    giftStatus: "Rejected",
  },
];

const tabs = {
  myRequests: myRequestsData,
  receivedRequests: receivedRequestsData,
};
const tabOrder = ["myRequests", "receivedRequests"];
const labelMap = {
  myRequests: "My Requests",
  receivedRequests: "Received Requests",
};

export default function Requests() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab ?? "myRequests"
  );

  return (
    <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
      <TabbedTable
        tabs={tabs}
        tabOrder={tabOrder}
        defaultTab="myRequests"
        cellRenderers={CellRenderers}
        tabLabelMap={labelMap}
        location={location}
        setExternalActiveTab={setActiveTab}
      />
    </div>
  );
}
