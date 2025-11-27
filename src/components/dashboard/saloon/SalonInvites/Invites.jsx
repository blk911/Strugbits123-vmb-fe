import { CellRenderers } from "./CellRenderers";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";

const pendingData = [
  {
    id: 1,
    Email: "elitejuan@gmail.com",
    message:
      "Hi! You’ve been invited to check out our salon. Explore our services and book your next appointment with us.",
    serviceName: ["Hair Cutting", "Spa", "Facial"],
    discount: 10,
    inviteDate: "02-08-2025",
    status: "Pending",
  },
  {
    id: 2,
    Email: "maria@gmail.com",
    message:
      "Exclusive invite! Enjoy premium beauty services with a special discount just for you.",
    serviceName: ["Manicure", "Pedicure", "Massage"],
    discount: 15,
    inviteDate: "03-08-2025",
    status: "Accepted",
  },
  {
    id: 3,
    Email: "john@gmail.com",
    message:
      "We’d love to have you! Claim your special offer before it expires.",
    serviceName: ["Highlight", "Hair Color", "Blow Dry"],
    discount: 20,
    inviteDate: "01-08-2025",
    status: "Pending",
  },
  {
    id: 4,
    Email: "sarah@gmail.com",
    message:
      "Special invitation: Get pampered with luxury nail services at a great discount!",
    serviceName: ["Nail Art", "Gel Polish", "French Tips"],
    discount: 12,
    inviteDate: "04-08-2025",
    status: "Accepted",
  },
];

const originalRows = {
  Pending: pendingData.filter((r) => r.status === "Pending"),
  Accepted: pendingData.filter((r) => r.status === "Accepted"),
};

const tabs = {
  Pending: pendingData.filter((r) => r.status === "Pending"),
  Accepted: pendingData.filter((r) => r.status === "Accepted"),
  All: pendingData,
};

const tabOrder = ["All", "Pending", "Accepted"];

export default function Invites() {
  const handleRowClick = {
    Pending: () => {},
    Accepted: () => {},
  };

  return (
    <>
      <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
        <TabbedTable
          tabs={tabs}
          tabOrder={tabOrder}
          defaultTab="All"
          cellRenderers={CellRenderers}
          onRowClick={handleRowClick}
        />
      </div>
    </>
  );
}
