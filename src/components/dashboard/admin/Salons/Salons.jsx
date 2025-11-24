import React from "react";
import AdvancedTabbedTable from "./AdvancedTabbedTable";
import { FiEye, FiCheck, FiX } from "react-icons/fi";

import salon1 from "../../../../assets/salon-1.png";
import salon2 from "../../../../assets/salon-2.png";

const salonImages = {
  "Bella Beauty Salon": salon1,
  "Glow Haven Spa": salon2,
  "Luxe Nail Studio": salon1,
  "Urban Cuts & Color": salon2,
  "Royal Retreat Spa": salon1,
};

const createSalonData = () => [
  {
    id: 1,
    image: salonImages["Bella Beauty Salon"],
    salonName: "Bella Beauty Salon",
    ownerName: "Jessica Miller",
    email: "jessica.m@example.com",
    submittedDate: "2025-10-23",
    status: "Active",
  },
  {
    id: 2,
    image: salonImages["Glow Haven Spa"],
    salonName: "Glow Haven Spa",
    ownerName: "Ahmed Khan",
    email: "ahmed@glowhaven.com",
    submittedDate: "2025-11-05",
    status: "Pending",
  },
  {
    id: 3,
    image: salonImages["Luxe Nail Studio"],
    salonName: "Luxe Nail Studio",
    ownerName: "Sophia Chen",
    email: "sophia@luxenails.com",
    submittedDate: "2025-09-18",
    status: "Inactive",
  },
  {
    id: 4,
    image: salonImages["Urban Cuts & Color"],
    salonName: "Urban Cuts & Color",
    ownerName: "Michael Torres",
    email: "michael@urbancuts.com",
    submittedDate: "2025-11-15",
    status: "Rejected",
  },
  {
    id: 5,
    image: salonImages["Royal Retreat Spa"],
    salonName: "Royal Retreat Spa",
    ownerName: "Emma Williams",
    email: "emma@royalretreat.com",
    submittedDate: "2025-11-20",
    status: "Active",
  },
];

const allSalons = createSalonData();

const tabsData = {
  All: allSalons,
  Pending: allSalons.filter((s) => s.status === "Pending"),
  Active: allSalons.filter((s) => s.status === "Active"),
  Inactive: allSalons.filter((s) => s.status === "Inactive"),
  Rejected: allSalons.filter((s) => s.status === "Rejected"),
};

const tabOrder = ["All", "Pending", "Active", "Inactive", "Rejected"];

const columns = [
  {
    key: "salonName",
    header: "Salon Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <img
          src={row.image}
          alt={row.salonName}
          className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
        />
        <span className="font-medium text-gray-800">{row.salonName}</span>
      </div>
    ),
  },
  { key: "ownerName", header: "Owner Name" },
  { key: "email", header: "Email" },
  { key: "submittedDate", header: "Submitted" },
  {
    key: "status",
    header: "Status",
    render: (row) => {
      const styles = {
        Active: "bg-[#4FCF0033] text-[#4FCF00]",
        Pending: "bg-[#FF950033] text-[#FF9500]",
        Inactive: "bg-[#4B556333] text-[#4B5563]",
        Rejected: "bg-[#DC262633] text-[#DC2626]",
      };
      return (
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium ${
            styles[row.status]
          }`}
        >
          {row.status}
        </span>
      );
    },
  },

  {
    key: "actions",
    header: "Actions",
    render: (row, onActionClick) => (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onActionClick?.("view", row);
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-gray-50 transition"
          title="View"
        >
          <FiEye className="w-4 h-4 text-[#9CA3AFCC]" />
        </button>

        {row.status === "Pending" && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.("approve", row);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-green-50 transition"
              title="Approve"
            >
              <FiCheck className="w-4 h-4 text-[#9CA3AFCC]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.("reject", row);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-red-50 transition"
              title="Reject"
            >
              <FiX className="w-4 h-4 text-[#9CA3AFCC]" />
            </button>
          </>
        )}

        {row.status === "Inactive" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.("reactivate", row);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-blue-50 transition"
            title="Reactivate"
          >
            <FiCheck className="w-4 h-4 text-[#9CA3AFCC]" />
          </button>
        )}
      </div>
    ),
  },
];

export default function AllSalons() {
  const handleAction = (action, row) => {
    console.log(`Action: ${action} →`, row.salonName);
  };

  const handleRowClick = (row) => {
    handleAction("view", row);
  };

  return (
    <div className="w-full flex flex-col gap-y-8 py-6 bg-[#EFEFEF]">
      <AdvancedTabbedTable
        tabs={tabsData}
        tabOrder={tabOrder}
        defaultTab="All"
        columns={columns}
        onRowClick={handleRowClick}
        onActionClick={handleAction}
      />
    </div>
  );
}
