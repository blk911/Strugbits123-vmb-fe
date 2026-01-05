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
} from "../../../../store/api";
import { formatTimeAgo } from "../../../../utils/HelperFunctions";
import SalonImage from "../../../../assets/salon-1.png";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

export default function MainSection() {
  const navigate = useNavigate();

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
    } else if (rescheduleAppointments.length > 1 && selectedAppointments.length < 2) {
      selectedAppointments.push(rescheduleAppointments[1]);
    }
  }
  const getInviteProps = (item) => ({
    img: item?.inviteeProfilePic || SalonImage,
    salon: item.fullName,
    service: item?.services?.serviceName || "No Service",
    statusText: "Pending",
    statusColor: "#FF9500",
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
    statusColor: item.status === "pending" ? "#FF9500" : "#FF92A5",
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

      {isLoading ? (
        <div className="flex justify-center py-6">
          <LoadingIndicator size="sm" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="flex flex-col gap-4">
          {items.slice(0, 2).map((item) => (
            <CardComponent
              key={item._id}
              {...getCardProps(item)}
              isLoading={false}
            />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {renderCardSection({
            title: "Invites",
            icon: <FaUser className="text-[#FF92A5]" />,
            items: pendingInvites,
            isLoading: loadingInvites,
            emptyMessage: "No pending invites received",
            CardComponent: InviteCard,
            navigateTo: "/saloninvites",
            getCardProps: getInviteProps,
          })}

          {renderCardSection({
            title: "Pending Appointments",
            icon: <FaCalendarAlt className="text-[#FF92A5]" />,
            items: selectedAppointments,
            isLoading: loadingAppointments || loadingReschedule,
            emptyMessage: "No appointments to show",
            CardComponent: AppointmentCard,
            navigateTo: "/appointments",
            getCardProps: getAppointmentProps,
          })}
        </div>

        <SectionWrapper className="p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-[18px] font-semibold text-[#581838]">
              Services
            </h3>
            <button
              onClick={() => navigate("/salon-detail")}
              className="bg-[#FF92A5] text-white rounded-[8px] px-6 py-2 text-[16px] hover:bg-[#ff7a8a] transition cursor-pointer"
            >
              Manage Services
            </button>
          </div>

          {loadingServices ? (
            <div className="flex justify-center py-6">
              <LoadingIndicator />
            </div>
          ) : services.length === 0 ? (
            <p className="text-gray-500 text-center">No services added yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
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
          )}
        </SectionWrapper>
      </div>

      <div className="lg:col-span-1 flex flex-col gap-6">
        <QuickInvitePanel />
        <SalonProfilePanel />
      </div>
    </div>
  );
}

function Header({ icon, title, onViewAll }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex items-center justify-center sm:justify-start gap-3">
        {icon}
        <p className="text-[18px] font-semibold text-[#581838]">{title}</p>
      </div>
      <p
        onClick={onViewAll}
        className="underline text-[14px] font-medium text-[#9CA3AF] cursor-pointer text-center sm:text-right hover:text-[#FF92A5] transition"
      >
        View All
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-6 text-gray-500">
      <p className="text-[14px]">{message}</p>
    </div>
  );
}
