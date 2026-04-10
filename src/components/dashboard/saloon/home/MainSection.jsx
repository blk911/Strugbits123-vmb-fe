// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUser } from "react-icons/fa6";
// import { FaCalendarAlt } from "react-icons/fa";
// import SectionWrapper from "./SectionWrapper";
// import InviteCard from "./InviteCard";
// import AppointmentCard from "./AppointmentCard";
// import ServiceCard from "./ServiceCard";
// import QuickInvitePanel from "./QuickInvitePanel";
// import SalonProfilePanel from "./SalonProfilePanel";
// import {
//   useGetSalonInvitesQuery,
//   useGetSalonAppointmentsQuery,
//   useGetServicesQuery,
// } from "../../../../store/api";
// import { formatTimeAgo } from "../../../../utils/HelperFunctions";
// import SalonImage from "../../../../assets/salon-1.png";
// import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
// import { useDashboardModal } from "../../../../pages/ModalProvider";

// export default function MainSection() {
//   const navigate = useNavigate();
//   const { openModal } = useDashboardModal();

//   const { data: servicesRes, isLoading: loadingServices } =
//     useGetServicesQuery();
//   const { data: invitesRes, isLoading: loadingInvites } =
//     useGetSalonInvitesQuery({
//       status: "pending",
//       sort: "newest",
//     });
//   const { data: appointmentsRes, isLoading: loadingAppointments } =
//     useGetSalonAppointmentsQuery({
//       status: "pending",
//       sort: "newest",
//     });
//   const { data: rescheduleRes, isLoading: loadingReschedule } =
//     useGetSalonAppointmentsQuery({
//       status: "reschedule-requested",
//       sort: "newest",
//     });
//   const services = servicesRes?.data?.items?.slice(0, 4) || [];
//   const pendingInvites = invitesRes?.data?.items || [];
//   const pendingAppointments = appointmentsRes?.data?.items || [];
//   const rescheduleAppointments = rescheduleRes?.data?.items || [];

//   let selectedAppointments = [];
//   if (pendingAppointments.length > 0) {
//     selectedAppointments.push(pendingAppointments[0]);
//   }
//   if (rescheduleAppointments.length > 0) {
//     selectedAppointments.push(rescheduleAppointments[0]);
//   }
//   if (selectedAppointments.length < 2) {
//     if (pendingAppointments.length > 1 && selectedAppointments.length < 2) {
//       selectedAppointments.push(pendingAppointments[1]);
//     } else if (
//       rescheduleAppointments.length > 1 &&
//       selectedAppointments.length < 2
//     ) {
//       selectedAppointments.push(rescheduleAppointments[1]);
//     }
//   }
//   const getInviteProps = (item) => ({
//     img: item?.inviteeProfilePic || SalonImage,
//     salon: item.fullName,
//     service: item?.services?.serviceName || "No Service",
//     statusText: "Pending",
//     statusClass: "bg-vmb-pending/20 text-vmb-pending",
//     timeAgo: formatTimeAgo(item.createdAt || item.createdAt),
//     data: item,
//   });

//   const getAppointmentProps = (item) => ({
//     icon: item.salon?.salonImage || SalonImage,
//     from: item.requestedFrom?.name || "Client",
//     service: item.services?.map((s) => s.name).join(", ") || "No Service",
//     price: `$${
//       item.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0
//     }`,
//     statusText: item.status === "pending" ? "Pending" : "Reschedule requested",
//     statusClass:
//       item.status === "pending" ?
//         "bg-vmb-pending/20 text-vmb-pending"
//       : "bg-vmb-secondary/20 text-vmb-secondary",
//     timeAgo: formatTimeAgo(item?.timeline[0]?.timestamp || item.createdAt),
//     data: item,
//   });
//   const renderCardSection = ({
//     title,
//     icon,
//     items,
//     isLoading,
//     emptyMessage,
//     CardComponent,
//     navigateTo,
//     getCardProps,
//   }) => (
//     <SectionWrapper className="p-4 flex flex-col gap-4">
//       <Header
//         icon={icon}
//         title={title}
//         onViewAll={() => navigate(navigateTo)}
//       />

//       {isLoading ?
//         <div className="flex justify-center py-6">
//           <LoadingIndicator size="sm" />
//         </div>
//       : items.length === 0 ?
//         <EmptyState message={emptyMessage} />
//       : <div className="flex flex-col gap-4">
//           {items.slice(0, 2).map((item) => (
//             <CardComponent
//               key={item._id}
//               {...getCardProps(item)}
//               isLoading={false}
//               onClick={
//                 title === "Invites" ? () => openModal("sendTreat", item) : null
//               }
//             />
//           ))}
//         </div>
//       }
//     </SectionWrapper>
//   );
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//       <div className="lg:col-span-3 flex flex-col gap-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
//           {renderCardSection({
//             title: "Invites",
//             icon: <FaUser className="text-vmb-secondary" />,
//             items: pendingInvites,
//             isLoading: loadingInvites,
//             emptyMessage: "No pending invites received",
//             CardComponent: InviteCard,
//             navigateTo: "/saloninvites",
//             getCardProps: getInviteProps,
//           })}

//           {renderCardSection({
//             title: "Pending Appointments",
//             icon: <FaCalendarAlt className="text-vmb-secondary" />,
//             items: selectedAppointments,
//             isLoading: loadingAppointments || loadingReschedule,
//             emptyMessage: "No appointments to show",
//             CardComponent: AppointmentCard,
//             navigateTo: "/appointments",
//             getCardProps: getAppointmentProps,
//           })}
//         </div>

//         <SectionWrapper className="p-6 flex flex-col gap-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <h3 className="text-[18px] font-semibold text-vmb-primary">
//               Services
//             </h3>
//             <div className="flex flex-col sm:flex-row gap-2">
//               <button
//                 onClick={() => navigate("/salon-detail")}
//                 className="bg-vmb-secondary text-white rounded-[8px] px-6 py-2 text-[12px] sm:text-[14px] md:text-[16px]  hover:opacity-90 transition cursor-pointer"
//               >
//                 View All
//               </button>
//               <button
//                 onClick={() => navigate("/salon-detail")}
//                 className="bg-vmb-secondary text-white rounded-[8px] px-6 py-2 text-[12px] sm:text-[14px] md:text-[16px]  hover:opacity-90 transition cursor-pointer"
//               >
//                 Manage Services
//               </button>
//             </div>
//           </div>

//           {loadingServices ?
//             <div className="flex justify-center py-6">
//               <LoadingIndicator />
//             </div>
//           : services.length === 0 ?
//             <p className="bg-vmb-pending/20 text-vmb-pending text-center">
//               No services added yet
//             </p>
//           : <div className="grid grid-cols-1 gap-6">
//               {services.map((service) => (
//                 <ServiceCard
//                   key={service._id}
//                   img={service.serviceImage}
//                   title={service.serviceName}
//                   desc={service.description}
//                   price={service.servicePrice}
//                 />
//               ))}
//             </div>
//           }
//         </SectionWrapper>
//       </div>

//       <div className="lg:col-span-1 flex flex-col gap-6">
//         <QuickInvitePanel />
//         <SalonProfilePanel />
//       </div>
//     </div>
//   );
// }

// function Header({ icon, title, onViewAll }) {
//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//       <div className="flex items-center justify-center sm:justify-start gap-3">
//         {icon}
//         <p className="text-[18px] font-semibold text-vmb-primary">{title}</p>
//       </div>
//       <p
//         onClick={onViewAll}
//         className="underline text-[14px] font-medium text-vmb-text-muted/50 cursor-pointer text-center sm:text-right hover:text-vmb-secondary transition"
//       >
//         View All
//       </p>
//     </div>
//   );
// }

// function EmptyState({ message }) {
//   return (
//     <div className="text-center py-6 text-vmb-text-muted">
//       <p className="text-[14px]">{message}</p>
//     </div>
//   );
// }
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import SectionWrapper from "./SectionWrapper";
import InviteCard from "./InviteCard";
import AppointmentCard from "./AppointmentCard";
import ServiceCard from "./ServiceCard";
import QuickInvitePanel from "./QuickInvitePanel";
import SalonProfilePanel from "./SalonProfilePanel";
import {
  useGetSalonInvitesQuery,
  useGetSalonAppointmentsQuery,
  useGetServicesQuery,
  useGetDailyStatsQuery,
} from "../../../../store/api";
import { formatTimeAgo } from "../../../../utils/HelperFunctions";
import SalonImage from "../../../../assets/salon-1.png";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import { FaCalendarCheck } from "react-icons/fa6";
import { RiFlowerLine } from "react-icons/ri";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import serviceIcon from "../../../../assets/Services_Icon.png";
export default function MainSection() {
  const navigate = useNavigate();
  const { openModal } = useDashboardModal();

  const { data: servicesRes, isLoading: loadingServices } =
    useGetServicesQuery();
  const { data: invitesRes, isLoading: loadingInvites } =
    useGetSalonInvitesQuery({
      status: "pending",
      sort: "newest",
    });
  const { data: appointmentsRes, isLoading: loadingAppointments } =
    useGetSalonAppointmentsQuery({
      status: "pending",
      sort: "newest",
    });
  const { data: rescheduleRes, isLoading: loadingReschedule } =
    useGetSalonAppointmentsQuery({
      status: "reschedule-requested",
      sort: "newest",
    });
  const services = servicesRes?.data?.items?.slice(0, 4) || [];
  const pendingInvites = invitesRes?.data?.items || [];
  const pendingAppointments = appointmentsRes?.data?.items || [];
  const rescheduleAppointments = rescheduleRes?.data?.items || [];

  let selectedAppointments = [];
  if (pendingAppointments.length > 0) {
    selectedAppointments.push(pendingAppointments[0]);
  }
  if (rescheduleAppointments.length > 0) {
    selectedAppointments.push(rescheduleAppointments[0]);
  }
  if (selectedAppointments.length < 2) {
    if (pendingAppointments.length > 1 && selectedAppointments.length < 2) {
      selectedAppointments.push(pendingAppointments[1]);
    } else if (
      rescheduleAppointments.length > 1 &&
      selectedAppointments.length < 2
    ) {
      selectedAppointments.push(rescheduleAppointments[1]);
    }
  }
  const getInviteProps = (item) => ({
    img: item?.inviteeProfilePic || SalonImage,
    salon: item.fullName,
    service: item?.services?.serviceName || "No Service",
    statusText: "Pending",
    statusClass: "bg-vmb-pending/20 text-vmb-pending",
    timeAgo: formatTimeAgo(item.createdAt || item.createdAt),
    data: item,
  });

  const getAppointmentProps = (item) => ({
    icon: item.salon?.salonImage || SalonImage,
    from: item.requestedFrom?.name || "Client",
    service: item.services?.map((s) => s.name).join(", ") || "No Service",
    price: `$${
      item.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0
    }`,
    statusText: item.status === "pending" ? "Pending" : "Reschedule requested",
    statusClass:
      item.status === "pending" ?
        "bg-vmb-pending/20 text-vmb-pending"
      : "bg-vmb-secondary/20 text-vmb-secondary",
    timeAgo: formatTimeAgo(item?.timeline[0]?.timestamp || item.createdAt),
    data: item,
  });
  const renderCardSection = ({
    title,
    icon,
    items,
    isLoading,
    emptyMessage,
    CardComponent,
    navigateTo,
    getCardProps,
  }) => (
    <SectionWrapper className="p-4 flex flex-col gap-4">
      <Header
        icon={icon}
        title={title}
        onViewAll={() => navigate(navigateTo)}
      />

      {isLoading ?
        <div className="flex justify-center py-6">
          <LoadingIndicator size="sm" />
        </div>
      : items.length === 0 ?
        <EmptyState message={emptyMessage} />
      : <div className="flex flex-col gap-4">
          {items.slice(0, 2).map((item) => (
            <CardComponent
              key={item._id}
              {...getCardProps(item)}
              isLoading={false}
              onClick={
                title === "Invites" ? () => openModal("sendTreat", item) : null
              }
            />
          ))}
        </div>
      }
    </SectionWrapper>
  );
  const { data: statsRes, isLoading: loadingStats } = useGetDailyStatsQuery();
  const todaysAppointments = statsRes?.data?.appointmentsCount || 0;
  const totalServicesCount = statsRes?.data?.totalServicesCount || 0;

  return (
    <div className="flex flex-col gap-[30px] font-poppins">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[30px] items-stretch">
        <div className="lg:col-span-4 flex">
          <SectionWrapper className="px-4 py-3 flex flex-col gap-2 w-full lg:min-h-[127px] h-auto justify-between">
            <Header
              icon={<FaUser className="text-vmb-secondary" />}
              title="Invites"
              onViewAll={() => navigate("/saloninvites")}
            />
            <div className="flex-grow flex items-center">
              {loadingInvites ?
                <div className="w-full flex justify-center items-center">
                  <LoadingIndicator size="sm" />
                </div>
              : pendingInvites.length === 0 ?
                <div className="w-full flex justify-center items-center text-vmb-text-muted text-[14px]">
                  No pending invites
                </div>
              : <InviteCard
                  {...getInviteProps(pendingInvites[0])}
                  isLoading={false}
                  onClick={() => openModal("sendTreat", pendingInvites[0])}
                  className="w-full !p-[10px] !border !border-black/10 hover:!border-vmb-secondary rounded-[10px] !bg-transparent"
                />
              }
            </div>
          </SectionWrapper>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-[30px]">
          <MetricCard
            icon={
              <FaCalendarCheck className="text-[24px] text-vmb-secondary" />
            }
            title="Pending Appointments"
            value={pendingAppointments.length}
            isLoading={loadingAppointments}
          />
          <MetricCard
            icon={
              <FaCalendarCheck className="text-[24px] text-vmb-secondary" />
            }
            title="Today's Appointment"
            value={todaysAppointments}
            isLoading={loadingStats}
          />
          <MetricCard
            icon={serviceIcon}
            title="Total Services"
            value={totalServicesCount}
            isLoading={loadingStats}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[30px] items-start">
        <div className="lg:col-span-8 ">
          <SectionWrapper className="p-6 flex flex-col gap-6 h-full min-h-[400px]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-[18px] font-semibold text-vmb-primary">
                Services
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* <button
                  onClick={() => navigate("/salon-detail")}
                  className="bg-vmb-secondary text-white rounded-[8px] px-6 py-2 text-[12px] sm:text-[14px] md:text-[16px]  hover:opacity-90 transition cursor-pointer"
                >
                  View All
                </button> */}
                <button
                  onClick={() => navigate("/salon-detail")}
                  className="bg-vmb-secondary text-white rounded-[8px] px-6 py-2 text-[12px] sm:text-[14px] md:text-[16px]  hover:opacity-90 transition cursor-pointer"
                >
                  Manage Services
                </button>
              </div>
            </div>

            {loadingServices ?
              <div className="flex justify-center py-6">
                <LoadingIndicator />
              </div>
            : services.length === 0 ?
              <p className="bg-vmb-pending/20 text-vmb-pending text-center p-4 rounded">
                No services added yet
              </p>
            : <div className="grid grid-cols-1 gap-6">
                {services.map((service) => (
                  <ServiceCard
                    key={service._id}
                    img={service.serviceImage}
                    title={service.serviceName}
                    desc={service.description}
                    price={service.servicePrice}
                  />
                ))}
              </div>
            }
          </SectionWrapper>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-[30px]">
          <QuickInvitePanel />
          <SalonProfilePanel />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, isLoading }) {
  return (
    <div className="w-full min-h-[127px] bg-white rounded-[10px] p-[15px] flex flex-col gap-[10px] shadow-[0px_4px_10px_rgba(0,0,0,0.05)] border border-vmb-primary/5">
      <div className="shrink-0">
        {title === "Total Services" ?
          <img src={icon} />
        : icon}
      </div>
      <div className="flex flex-col justify-end h-full">
        <p className="text-[14px] xl:text-[16px] font-medium text-[#4B5563] leading-tight">
          {title}
        </p>
        <p className="text-[24px] xl:text-[30px] font-bold text-[#0F3D3E] leading-none mt-1">
          {isLoading ? "..." : value}
        </p>
      </div>
    </div>
  );
}

function Header({ icon, title, onViewAll }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex items-center justify-center sm:justify-start gap-3">
        {icon}
        <p className="text-[18px] font-semibold text-vmb-primary">{title}</p>
      </div>
      <p
        onClick={onViewAll}
        className="underline text-[14px] font-medium text-vmb-text-muted/50 cursor-pointer text-center sm:text-right hover:text-vmb-secondary transition"
      >
        View All
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-6 text-vmb-text-muted">
      <p className="text-[14px]">{message}</p>
    </div>
  );
}
