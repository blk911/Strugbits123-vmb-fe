// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import { CellRenderers } from "./CellRenderers";
// import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
// import { useDashboardModal } from "../../../../pages/ModalProvider";

// const myRequestsData = [
//   {
//     id: 1,
//     payersEmail: "elitejuan@gmail.com",
//     salonName: "Beauty Salon & Spa",
//     serviceName: [
//       "Hair Color",
//       "nails",
//       "Highlight and lowlight",
//       "HydraFacial",
//     ],
//     requestDate: "02-08-2025",
//     status: "Accepted",
//   },
//   {
//     id: 2,
//     payersEmail: "maria@gmail.com",
//     salonName: "Glam Studio",
//     serviceName: ["Nail Painting", "Facial"],
//     requestDate: "03-08-2025",
//     status: "Pending",
//   },
// ];
// const receivedRequestsData = [
//   {
//     id: 1,
//     senderEmail: "elitejuan@gmail.com",
//     giftedServices: [
//       "Hair Color",
//       "nails",
//       "Highlight and lowlight",
//       "HydraFacial",
//     ],
//     dateReceived: "02-08-2025",
//     price: "$150",
//     paidPrice: "$120",
//     giftStatus: "Accepted",
//   },
//   {
//     id: 2,
//     senderEmail: "maria@gmail.com",
//     giftedServices: ["Nail Painting", "Facial"],
//     dateReceived: "03-08-2025",
//     price: "$100",
//     paidPrice: "$80",
//     giftStatus: "Rejected",
//   },
// ];

// const tabs = {
//   myRequests: myRequestsData,
//   receivedRequests: receivedRequestsData,
// };
// const tabOrder = ["myRequests", "receivedRequests"];
// const labelMap = {
//   myRequests: "My Requests",
//   receivedRequests: "Received Requests",
// };

// export default function Requests() {
//   const location = useLocation();
//   const [activeTab, setActiveTab] = useState(
//     location.state?.activeTab ?? "myRequests"
//   );
//   const { openModal } = useDashboardModal();

//   const handleRowClick = {
//     myRequests: (row) => {
//       openModal("giftService", {
//         salon: {
//           name: row.salonName,
//         },
//         service: {
//           name: row.serviceName[0],
//         },
//       });
//     },

//     receivedRequests: (row) => {
//       openModal("treatRequest", {
//         salon: {
//           name: "Beauty Salon & Spa",
//           image: "path/to/image",
//           description: "Premium Beauty Services",
//         },
//         services: row.giftedServices.map((name) => ({
//           name,
//           duration: "1 Hr",
//           price: 100,
//         })),
//         sender: {
//           name: row.senderEmail.split("@")[0],
//           email: row.senderEmail,
//           avatar: "path/to/avatar",
//           message: "Hey! Please treat me to this service! 💕",
//         },
//       });
//     },
//   };
//   return (
//     <div className="w-full flex flex-col gap-y-[31px] py-6 bg-[#EFEFEF]">
//       <TabbedTable
//         tabs={tabs}
//         tabOrder={tabOrder}
//         defaultTab="myRequests"
//         cellRenderers={CellRenderers}
//         tabLabelMap={labelMap}
//         location={location}
//         setExternalActiveTab={setActiveTab}
//         onRowClick={handleRowClick}
//       />
//     </div>
//   );
// }
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { CellRenderers } from "./CellRenderers";
import TabbedTable from "../../../common/dashboard/Table/TabbedTable";
import { useDashboardModal } from "../../../../pages/ModalProvider";

import salonImg1 from "../../../../assets/salon-1.png";
import salonImg2 from "../../../../assets/salon-2.png";
import userAvatar from "../../../../assets/user_icon.png";

const myRequestsData = [
  {
    id: 1,
    payersEmail: "elitejuan@gmail.com",
    salonName: "Bella Beauty Salon 1",
    serviceName: ["Hair Color", "HydraFacial Deluxe", "Balayage Highlights"],
    requestDate: "02-08-2025",
    status: "Accepted",

    _modalData: {
      selectedSalon: "Bella Beauty Salon 1",
      selectedSalonImage: salonImg1,
      services: [
        { name: "Hair Color", duration: 120, price: 95 },
        { name: "HydraFacial Deluxe", duration: 60, price: 120 },
        { name: "Balayage Highlights", duration: 180, price: 190 },
      ],
      email: "elitejuan@gmail.com",
      message:
        "Hey babe! Can you treat me to this? I've been working so hard lately. Love you!",
    },
  },
  {
    id: 2,
    payersEmail: "maria@gmail.com",
    salonName: "Glam Studio",
    serviceName: ["Luxury Manicure & Pedicure", "Lash Lift & Tint"],
    requestDate: "03-08-2025",
    status: "Pending",
    _modalData: {
      selectedSalon: "Glam Studio",
      selectedSalonImage: salonImg2,
      services: [
        { name: "Luxury Manicure & Pedicure", duration: 90, price: 85 },
        { name: "Lash Lift & Tint", duration: 60, price: 75 },
      ],
      email: "maria@gmail.com",
      message: "Pleaseeee treat me to this? I deserve it after this week!",
    },
  },
];

const receivedRequestsData = [
  {
    id: 1,
    senderEmail: "elitejuan@gmail.com",
    giftedServices: ["Full Head Color", "Keratin Treatment"],
    dateReceived: "02-08-2025",
    price: "$355",
    paidPrice: "$320",
    giftStatus: "Accepted",
    _modalData: {
      salon: {
        name: "Bella Beauty Salon 1",
        image: salonImg1,
        description: "Where beauty meets luxury",
      },
      services: [
        { name: "Full Head Color", duration: 120, price: 105 },
        { name: "Keratin Smoothing Treatment", duration: 150, price: 250 },
      ],
      sender: {
        name: "Juan",
        email: "elitejuan@gmail.com",
        avatar: userAvatar,
        message:
          "Hey love! Can you treat me to this? I miss you so much and deserve a little pamper day!",
      },
    },
  },
  {
    id: 2,
    senderEmail: "maria@gmail.com",
    giftedServices: ["Classic Haircut & Style", "Anti-Aging Facial"],
    dateReceived: "03-08-2025",
    price: "$205",
    paidPrice: "$180",
    giftStatus: "Rejected",
    _modalData: {
      salon: {
        name: "Glam Studio",
        image: salonImg2,
        description: "Premium Beauty Services",
      },
      services: [
        { name: "Classic Haircut & Style", duration: 45, price: 65 },
        { name: "Anti-Aging Facial", duration: 75, price: 140 },
      ],
      sender: {
        name: "Maria",
        email: "maria@gmail.com",
        avatar: userAvatar,
        message: "Pretty please? I’ve been so stressed lately",
      },
    },
  },
];

const cleanDataForTable = (data) => data.map(({ _modalData, ...rest }) => rest);

const tabs = {
  myRequests: cleanDataForTable(myRequestsData),
  receivedRequests: cleanDataForTable(receivedRequestsData),
};

const originalRows = {
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
  const { openModal } = useDashboardModal();

  const handleRowClick = {
    myRequests: (cleanRow) => {
      const row = originalRows.myRequests.find((r) => r.id === cleanRow.id);
      const d = row._modalData;
      console.log("Row Data==>", d);
      openModal("treat", {
        isSubmitted: true,
        selectedSalon: "Bella Beauty Salon",
        selectedServices: ["Haircuts", "Hydrafacial"],
        email: "mike.davis@example.com",
        message:
          "Hey babe! Can you treat me to this? I've been working so hard lately. Love you!",
      });
    },

    receivedRequests: (cleanRow) => {
      const row = originalRows.receivedRequests.find(
        (r) => r.id === cleanRow.id
      );
      const d = row._modalData;
      openModal("treatRequest", {
        salon: d.salon,
        services: d.services,
        sender: d.sender,
      });
    },
  };

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
        onRowClick={handleRowClick}
        // activeTab={activeTab}
      />
    </div>
  );
}
