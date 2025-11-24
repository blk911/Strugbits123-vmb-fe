import React from "react";
import AdvancedTabbedTable from "./AdvancedTabbedTable";
import { FiEye, FiCheck, FiX } from "react-icons/fi";

import salon1 from "../../../../assets/salon-1.png";
import salon2 from "../../../../assets/salon-2.png";
import { useDashboardModal } from "../../../../pages/ModalProvider";

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
    phone: "+1 (555) 123-4567",
    ownerPhone: "+1 (555) 987-6543",
    submittedDate: "2025-10-23",
    status: "Pending",
    address: "123 Beauty Street, Fashion District, New York, NY 10001",
    timing: "09:00 AM - 07:00 PM",
    workingDays: "Mon, Tue, Wed, Thu, Fri, Sat",
    licenseDoc: "bella-beauty-license-2025.pdf",
    description:
      "Bella Beauty Salon is a premium full-service salon offering expert hair styling, coloring, bridal makeup, nail art, and relaxing spa treatments. We pride ourselves on using organic and cruelty-free products.",
  },
  {
    id: 2,
    image: salonImages["Glow Haven Spa"],
    salonName: "Glow Haven Spa",
    ownerName: "Ahmed Khan",
    email: "ahmed@glowhaven.com",
    phone: "+1 (555) 234-5678",
    ownerPhone: "+1 (555) 876-5432",
    submittedDate: "2025-11-05",
    status: "Pending",
    address:
      "456 Serenity Lane, Downtown Wellness District, Los Angeles, CA 90210",
    timing: "10:00 AM - 08:00 PM",
    workingDays: "Mon, Tue, Wed, Thu, Fri, Sun",
    licenseDoc: "glow-haven-spa-certificate.pdf",
    description:
      "Glow Haven Spa offers a tranquil escape with luxury facials, deep tissue massages, body scrubs, and holistic wellness treatments. Your journey to radiant skin and inner peace starts here.",
  },
  {
    id: 3,
    image: salonImages["Luxe Nail Studio"],
    salonName: "Luxe Nail Studio",
    ownerName: "Sophia Chen",
    email: "sophia@luxenails.com",
    phone: "+1 (555) 345-6789",
    ownerPhone: "+1 (555) 765-4321",
    submittedDate: "2025-09-18",
    status: "Active",
    address: "789 Glamour Ave, Upper East Side, Manhattan, NY 10021",
    timing: "10:00 AM - 09:00 PM",
    workingDays: "Tue, Wed, Thu, Fri, Sat, Sun",
    licenseDoc: "luxe-nails-business-license.pdf",
    description:
      "Specializing in artistic nail designs, gel extensions, and luxury manicure & pedicure experiences. Home to award-winning nail artists and Instagram-famous designs.",
  },
  {
    id: 4,
    image: salonImages["Urban Cuts & Color"],
    salonName: "Urban Cuts & Color",
    ownerName: "Michael Torres",
    email: "michael@urbancuts.com",
    phone: "+1 (555) 456-7890",
    ownerPhone: "+1 (555) 654-3210",
    submittedDate: "2025-11-15",
    status: "Rejected",
    address: "321 Trendy Blvd, Brooklyn, NY 11201",
    timing: "11:00 AM - 08:00 PM",
    workingDays: "Wed, Thu, Fri, Sat, Sun",
    licenseDoc: "urban-cuts-registration.pdf",
    description:
      "Modern barbershop and color studio offering precision cuts, bold colors, beard grooming, and urban styling for the fashion-forward client.",
  },
  {
    id: 5,
    image: salonImages["Royal Retreat Spa"],
    salonName: "Royal Retreat Spa",
    ownerName: "Emma Williams",
    email: "emma@royalretreat.com",
    phone: "+1 (555) 567-8901",
    ownerPhone: "+1 (555) 543-2109",
    submittedDate: "2025-11-20",
    status: "Active",
    address: "100 Royal Gardens, Palm Beach, FL 33480",
    timing: "08:00 AM - 10:00 PM",
    workingDays: "Mon, Tue, Wed, Thu, Fri, Sat, Sun",
    licenseDoc: "royal-retreat-spa-license.pdf",
    description:
      "An exclusive luxury spa offering royal-level treatments: hot stone therapy, aromatherapy, couples massages, and VIP skincare rituals in a palatial setting.",
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
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-gray-50 transition cursor-pointer"
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
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-green-50 transition cursor-pointer"
              title="Approve"
            >
              <FiCheck className="w-4 h-4 text-[#9CA3AFCC]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.("reject", row);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-red-50 transition cursor-pointer"
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
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-blue-50 transition cursor-pointer"
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
  const { openModal } = useDashboardModal();
  const handleAction = (action, row) => {
    console.log(`Action: ${action} →`, row.salonName);

    if (action === "view") {
      openModal("salonRequest", row);
    }
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
