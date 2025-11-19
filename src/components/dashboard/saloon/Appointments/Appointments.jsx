import React, { useState } from "react";
import { CellRenderers } from "./CellRenderers";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import salonImg1 from "../../../../assets/salon-1.png";
import salonImg2 from "../../../../assets/salon-2.png";
import RescheduleDirectModal from "../../client/Modals/appointmentTabsModals/RescheduleDirectModal";
import HoldDirectModal from "../../client/Modals/appointmentTabsModals/HoldDirectModal";
import DeclineDirectModal from "../../client/Modals/appointmentTabsModals/DeclineDirectModal";
import {
  ConfirmConfirmation,
  DeclineConfirmation,
  RescheduleSentConfirmation,
} from "../../client/Modals/appointmentTabsModals/ConfirmationModals";

const salonImages = {
  "Beauty Salon & Spa": salonImg1,
  "Glam Studio": salonImg2,
  "Luxe Hair & Spa": salonImg1,
  "Elegant Nails": salonImg2,
  "Royal Beauty": salonImg1,
  "Urban Salon": salonImg2,
};

const createAppointmentData = () => [
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
    _modalData: {
      salon: {
        name: "Beauty Salon & Spa",
        description: "Luxury beauty and wellness",
        image: salonImages["Beauty Salon & Spa"],
      },
      services: [
        { name: "Hair Color", duration: "2 Hr", price: 95 },
        { name: "Body Massage", duration: "1 Hr", price: 80 },
        { name: "Nail Painting", duration: "45 Min", price: 35 },
        { name: "Facial", duration: "1 Hr", price: 110 },
        { name: "Spa", duration: "90 Min", price: 150 },
      ],
      appointment: {
        date: "02-08-2025",
        time: "01:30 PM",
      },
    },
  },
  {
    id: 2,
    salonName: "Glam Studio",
    serviceName: ["Nail Painting", "Facial", "Hair Color"],
    payersEmail: "maria@gmail.com",
    appointmentDate: "03-08-2025",
    appointmentTime: "02:00 PM",
    status: "Pending",
    _modalData: {
      salon: {
        name: "Glam Studio",
        description: "Premium Beauty Services",
        image: salonImages["Glam Studio"],
      },
      services: [
        { name: "Nail Painting", duration: "1 Hr", price: 45 },
        { name: "Facial", duration: "75 Min", price: 120 },
        { name: "Hair Color", duration: "2 Hr", price: 90 },
      ],
      appointment: {
        date: "03-08-2025",
        time: "02:00 PM",
      },
    },
  },
  {
    id: 3,
    salonName: "Luxe Hair & Spa",
    serviceName: ["Highlight", "Massage", "Pedicure"],
    payersEmail: "john@gmail.com",
    appointmentDate: "04-08-2025",
    appointmentTime: "11:00 AM",
    status: "Reschedule",
    _modalData: {
      salon: {
        name: "Luxe Hair & Spa",
        description: "High-end hair & spa",
        image: salonImg1,
      },
      services: [
        { name: "Highlight", duration: "3 Hr", price: 180 },
        { name: "Massage", duration: "1 Hr", price: 90 },
        { name: "Pedicure", duration: "1 Hr", price: 60 },
      ],
      appointment: { date: "04-08-2025", time: "11:00 AM" },
    },
  },
  {
    id: 4,
    salonName: "Elegant Nails",
    serviceName: ["Manicure", "Spa Treatment"],
    payersEmail: "sarah@gmail.com",
    appointmentDate: "05-08-2025",
    appointmentTime: "03:30 PM",
    status: "Hold",
    _modalData: {
      salon: {
        name: "Elegant Nails",
        description: "Nail art specialists",
        image: salonImg2,
      },
      services: [
        { name: "Manicure", duration: "45 Min", price: 40 },
        { name: "Spa Treatment", duration: "2 Hr", price: 160 },
      ],
      appointment: { date: "05-08-2025", time: "03:30 PM" },
    },
  },
  {
    id: 5,
    salonName: "Royal Beauty",
    serviceName: ["Hair Color", "Facial", "Body Massage"],
    payersEmail: "alex@gmail.com",
    appointmentDate: "06-08-2025",
    appointmentTime: "10:00 AM",
    status: "Confirmed",
    _modalData: {
      salon: {
        name: "Royal Beauty",
        description: "Royal treatment guaranteed",
        image: salonImg1,
      },
      services: [
        { name: "Hair Color", duration: "2 Hr", price: 100 },
        { name: "Facial", duration: "1 Hr", price: 130 },
        { name: "Body Massage", duration: "90 Min", price: 110 },
      ],
      appointment: { date: "06-08-2025", time: "10:00 AM" },
    },
  },
  {
    id: 6,
    salonName: "Urban Salon",
    serviceName: ["Nail Art", "Hair Cut"],
    payersEmail: "emma@gmail.com",
    appointmentDate: "07-08-2025",
    appointmentTime: "04:00 PM",
    status: "Decline",
    _modalData: {
      salon: {
        name: "Urban Salon",
        description: "Modern urban vibes",
        image: salonImg2,
      },
      services: [
        { name: "Nail Art", duration: "90 Min", price: 70 },
        { name: "Hair Cut", duration: "45 Min", price: 55 },
      ],
      appointment: { date: "07-08-2025", time: "04:00 PM" },
    },
  },
];

const allAppointments = createAppointmentData();
const cleanRow = (row) => {
  const { _modalData, ...clean } = row;
  return clean;
};
const tabsForTable = {
  Pending: allAppointments.filter((a) => a.status === "Pending").map(cleanRow),
  Reschedule: allAppointments
    .filter((a) => a.status === "Reschedule")
    .map(cleanRow),
  Hold: allAppointments.filter((a) => a.status === "Hold").map(cleanRow),
  Confirmed: allAppointments
    .filter((a) => a.status === "Confirmed")
    .map(cleanRow),
  Decline: allAppointments.filter((a) => a.status === "Decline").map(cleanRow),
};

const tabOrder = ["Pending", "Reschedule", "Hold", "Confirmed", "Decline"];

export default function Appointments() {
  const { openModal } = useDashboardModal();
  const [directData, setDirectData] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showHold, setShowHold] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [showConfirmSuccess, setShowConfirmSuccess] = useState(false);
  const [showDeclineSuccess, setShowDeclineSuccess] = useState(false);
  const [showRescheduleSent, setShowRescheduleSent] = useState(false);
  const openWithData = (cleanRow) => {
    const fullRow = allAppointments.find((r) => r.id === cleanRow.id);
    const data = fullRow?._modalData;
    if (!data) return;

    setDirectData(data);

    if (cleanRow.status === "Reschedule") setShowReschedule(true);
    else if (cleanRow.status === "Hold") setShowHold(true);
    else if (cleanRow.status === "Decline") setShowDecline(true);
    else openModal("appointmentScheduled", data);
  };

  const handleRowClick = {
    Pending: openWithData,
    Reschedule: openWithData,
    Hold: openWithData,
    Decline: openWithData,
  };

  return (
    <>
      <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
        <TabbedTable
          tabs={tabsForTable}
          tabOrder={tabOrder}
          defaultTab="Pending"
          cellRenderers={CellRenderers}
          onRowClick={handleRowClick}
        />
      </div>
      <RescheduleDirectModal
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        data={directData}
        onRescheduleSent={() => setShowRescheduleSent(true)}
      />
      <HoldDirectModal
        isOpen={showHold}
        onClose={() => setShowHold(false)}
        data={directData}
        onAccept={() => setShowConfirmSuccess(true)}
        onDecline={() => setShowDeclineSuccess(true)}
        onReschedule={() => setShowReschedule(true)}
      />
      <DeclineDirectModal
        isOpen={showDecline}
        onClose={() => setShowDecline(false)}
        data={directData}
      />

      <ConfirmConfirmation
        open={showConfirmSuccess}
        onClose={() => setShowConfirmSuccess(false)}
      />
      <DeclineConfirmation
        open={showDeclineSuccess}
        onClose={() => setShowDeclineSuccess(false)}
      />
      <RescheduleSentConfirmation
        open={showRescheduleSent}
        onClose={() => setShowRescheduleSent(false)}
      />
    </>
  );
}
