import React, { useState } from "react";
import RequestsTable from "./RequestsTable";
import { CellRenderers } from "./CellRenderers";
import { useLocation } from "react-router-dom";
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

function Requests() {
  const location = useLocation();
  const defaultTab = location.state?.activeTab || "myRequests";
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF] ">
      <div className="w-full">
        <RequestsTable
          data={tabs[activeTab]}
          cellRenderers={CellRenderers}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}

export default Requests;
