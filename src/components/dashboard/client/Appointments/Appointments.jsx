import React, { useState } from "react";
import AppointmentTable from "./AppointmentsTable";
import { CellRenderers } from "./CellRenderers";

const pendingData = [
  {
    id: 1,
    salonName: "Beauty Salon & Spa",
    serviceName: [
      "Hair Color",
      "Body Massage",
      "Nail Painting",
      "Facial",
      "Spa",
    ],
    payersEmail: "elitejuan@gmail.com",
    appointmentDate: "02-08-2025",
    appointmentTime: "01:30 PM",
    status: "Pending",
  },
  {
    id: 2,
    salonName: "Glam Studio",
    serviceName: ["Nail Painting", "Facial", "Hair Color"],
    payersEmail: "maria@gmail.com",
    appointmentDate: "03-08-2025",
    appointmentTime: "02:00 PM",
    status: "Pending",
  },
];

const rescheduleData = [
  {
    id: 3,
    salonName: "Luxe Hair & Spa",
    serviceName: ["Highlight", "Massage", "Pedicure"],
    payersEmail: "john@gmail.com",
    appointmentDate: "04-08-2025",
    appointmentTime: "11:00 AM",
    status: "Reschedule",
  },
];

const holdData = [
  {
    id: 4,
    salonName: "Elegant Nails",
    serviceName: ["Manicure", "Spa Treatment"],
    payersEmail: "sarah@gmail.com",
    appointmentDate: "05-08-2025",
    appointmentTime: "03:30 PM",
    status: "Hold",
  },
];

const confirmedData = [
  {
    id: 5,
    salonName: "Royal Beauty",
    serviceName: ["Hair Color", "Facial", "Body Massage"],
    payersEmail: "alex@gmail.com",
    appointmentDate: "06-08-2025",
    appointmentTime: "10:00 AM",
    status: "Confirmed",
  },
];

const declineData = [
  {
    id: 6,
    salonName: "Urban Salon",
    serviceName: ["Nail Art", "Hair Cut"],
    payersEmail: "emma@gmail.com",
    appointmentDate: "07-08-2025",
    appointmentTime: "04:00 PM",
    status: "Decline",
  },
];

const tabs = {
  Pending: pendingData,
  Reschedule: rescheduleData,
  Hold: holdData,
  Confirmed: confirmedData,
  Decline: declineData,
};

function Appointments() {
  const [activeTab, setActiveTab] = useState("Pending");

  return (
    <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF] ">
      <div className="w-full">
        <AppointmentTable
          data={tabs[activeTab]}
          cellRenderers={CellRenderers}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}

export default Appointments;
