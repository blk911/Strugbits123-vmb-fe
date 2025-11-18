import React, { useState } from "react";
import { CellRenderers } from "./CellRenderers";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import salonImg1 from "../../../../assets/salon-1.png";
import salonImg2 from "../../../../assets/salon-2.png";

import { ConfirmConfirmation } from "../Modals/appointmentTabsModals/ConfirmationModals";

const salonImages = {
  "Bella Beauty Salon": salonImg1,
  "Glam Studio": salonImg2,
  "Luxe Hair & Spa": salonImg1,
  "Elegant Nails": salonImg2,
};

const pendingData = [
  {
    id: 1,
    salonName: "Bella Beauty Salon",
    salonEmail: "elitejuan@gmail.com",
    serviceName: ["Hair Cutting", "Spa", "Facial"],
    discount: "10%",
    expiresOn: "02-08-2025",
    status: "Pending",
    _modalData: {
      name: "Bella Beauty Salon",
      image: salonImages["Bella Beauty Salon"],
      services: [
        { id: 1, name: "Hair Cutting", duration: 60, price: 80 },
        { id: 2, name: "Spa", duration: 90, price: 150 },
        { id: 3, name: "F1 Facial", duration: 60, price: 120 },
      ],
      discount: 10,
    },
  },
  {
    id: 2,
    salonName: "Glam Studio",
    salonEmail: "maria@gmail.com",
    serviceName: ["Manicure", "Pedicure", "Massage"],
    discount: "15%",
    expiresOn: "03-08-2025",
    status: "Pending",
    _modalData: {
      name: "Glam Studio",
      image: salonImages["Glam Studio"],
      services: [
        { id: 1, name: "Manicure", duration: 60, price: 50 },
        { id: 2, name: "Pedicure", duration: 60, price: 65 },
        { id: 3, name: "Massage", duration: 90, price: 120 },
      ],
      discount: 15,
    },
  },
];

const claimedData = [
  {
    id: 3,
    salonName: "Luxe Hair & Spa",
    salonEmail: "john@gmail.com",
    serviceName: ["Highlight", "Hair Color"],
    discount: "20%",
    expiresOn: "04-08-2025",
    status: "Claimed",
    _modalData: {
      name: "Luxe Hair & Spa",
      image: salonImages["Luxe Hair & Spa"],
      services: [
        { id: 1, name: "Highlight", duration: 180, price: 200 },
        { id: 2, name: "Hair Color", duration: 120, price: 95 },
      ],
      discount: 20,
    },
  },
];

const unclaimedData = [
  {
    id: 4,
    salonName: "Elegant Nails",
    salonEmail: "sarah@gmail.com",
    serviceName: ["Nail Art", "Gel Polish"],
    discount: "12%",
    expiresOn: "05-08-2025",
    status: "Unclaimed",
    _modalData: {
      name: "Elegant Nails",
      image: salonImages["Elegant Nails"],
      services: [
        { id: 1, name: "Nail Art", duration: 90, price: 70 },
        { id: 2, name: "Gel Polish", duration: 45, price: 45 },
      ],
      discount: 12,
    },
  },
];

const cleanRow = (row) => {
  const { _modalData, ...rest } = row;
  return rest;
};

const tabs = {
  Pending: pendingData.map(cleanRow),
  Claimed: claimedData.map(cleanRow),
  Unclaimed: unclaimedData.map(cleanRow),
};

const tabOrder = ["Pending", "Claimed", "Unclaimed"];
const originalRows = {
  Pending: pendingData,
  Claimed: claimedData,
  Unclaimed: unclaimedData,
};

export default function Invites() {
  const { openModal } = useDashboardModal();
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  const handleRowClick = {
    Pending: (cleanRow) => {
      const fullRow = originalRows.Pending.find((r) => r.id === cleanRow.id);
      if (fullRow?._modalData) {
        openModal("exclusiveInvite", {
          ...fullRow._modalData,
          onBookingSuccess: () => setShowBookingSuccess(true),
        });
      }
    },
    Claimed: (cleanRow) => {
      const fullRow = originalRows.Claimed.find((r) => r.id === cleanRow.id);
      if (fullRow?._modalData) {
        openModal("offerClaimed", {
          ...fullRow._modalData,
          onBookingSuccess: () => setShowBookingSuccess(true),
        });
      }
    },
    Unclaimed: (cleanRow) => {
      const fullRow = originalRows.Unclaimed.find((r) => r.id === cleanRow.id);
      if (fullRow?._modalData) {
        openModal("offerExpired", {
          ...fullRow._modalData,
          onBookingSuccess: () => setShowBookingSuccess(true),
        });
      }
    },
  };

  return (
    <>
      <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
        <TabbedTable
          tabs={tabs}
          tabOrder={tabOrder}
          defaultTab="Pending"
          cellRenderers={CellRenderers}
          onRowClick={handleRowClick}
        />
      </div>

      <ConfirmConfirmation
        open={showBookingSuccess}
        onClose={() => setShowBookingSuccess(false)}
        title="Appointment Successfully Booked"
        subtitle={
          <>
            Thank you for accepting our invite.
            <br />
            Your booking details have been shared with the salon — they’ll
            notify you once everything is finalized.
          </>
        }
      />
    </>
  );
}
