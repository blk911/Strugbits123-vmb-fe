import React, { useEffect } from "react";
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
export default function MainSection() {
  const navigate = useNavigate();

  const { data: servicesRes, isLoading: loadingServices } =
    useGetServicesQuery();
  const { data: invitesRes } = useGetSalonInvitesQuery({
    status: "pending",
    sort: "newest",
  });
  const { data: appointmentsRes } = useGetSalonAppointmentsQuery({
    status: "pending",
    sort: "newest",
  });

  const services = servicesRes?.data?.items?.slice(0, 4) || [];
  const pendingInvites = invitesRes?.data?.items || [];
  const pendingAppointments = appointmentsRes?.data?.items || [];
  useEffect(() => {}, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <SectionWrapper className="p-4 flex flex-col gap-4">
            <Header
              icon={<FaUser className="text-[#FF92A5]" />}
              title="Invites"
              onViewAll={() => navigate("/saloninvites")}
            />
            {pendingInvites.length === 0 ? (
              <EmptyState message="No pending invites received" />
            ) : (
              <>
                <InviteCard
                  key={pendingInvites[0]._id}
                  img={pendingInvites[0]?.salonProfilePic || SalonImage}
                  salon={pendingInvites[0].salonName}
                  service={pendingInvites[0]?.services.serviceName}
                  statusText="Pending"
                  statusColor="#FF9500"
                  timeAgo={formatTimeAgo(pendingInvites[0].createdAt)}
                  data={pendingInvites[0]}
                />

                {pendingInvites[1] && (
                  <InviteCard
                    key={pendingInvites[1]._id}
                    img={pendingInvites[1]?.salonProfilePic || SalonImage}
                    salon={pendingInvites[1].salonName}
                    service={
                      pendingInvites[1]?.services.serviceName || "No Service"
                    }
                    statusText="Pending"
                    statusColor="#FF9500"
                    timeAgo={formatTimeAgo(pendingInvites[1].createdAt)}
                    data={pendingInvites[1]}
                  />
                )}
              </>
            )}
          </SectionWrapper>

          <SectionWrapper className="p-4 flex flex-col gap-4">
            <Header
              icon={<FaCalendarAlt className="text-[#FF92A5]" />}
              title="Pending Appointments"
              onViewAll={() => navigate("/appointments")}
            />

            {pendingAppointments.length === 0 ? (
              <EmptyState message="No appointments to show" />
            ) : (
              <>
                <AppointmentCard
                  key={pendingAppointments[0]._id}
                  icon={pendingAppointments[0].salon.salonImage || SalonImage}
                  from={pendingAppointments[0].requestedFrom?.name || "Client"}
                  service={pendingAppointments[0].services
                    ?.map((s) => s.name)
                    .join(", ")}
                  price={`$${pendingAppointments[0].services?.reduce(
                    (sum, s) => sum + (s.price || 0),
                    0
                  )}`}
                  statusText="Pending"
                  statusColor="#FF9500"
                  timeAgo={formatTimeAgo(
                    pendingAppointments[0].appointmentDate ||
                      pendingAppointments[0].createdAt
                  )}
                  data={pendingAppointments[0]}
                />

                {pendingAppointments[1] && (
                  <AppointmentCard
                    key={pendingAppointments[1]._id}
                    icon={pendingAppointments[1].salon.salonImage || SalonImage}
                    from={
                      pendingAppointments[1].requestedFrom?.name || "Client"
                    }
                    service={pendingAppointments[1].services
                      ?.map((s) => s.name)
                      .join(", ")}
                    price={`$${pendingAppointments[1].services?.reduce(
                      (sum, s) => sum + (s.price || 0),
                      0
                    )}`}
                    statusText="Pending"
                    statusColor="#FF9500"
                    timeAgo={formatTimeAgo(
                      pendingAppointments[1].appointmentDate ||
                        pendingAppointments[1].createdAt
                    )}
                    data={pendingAppointments[1]}
                  />
                )}
              </>
            )}
          </SectionWrapper>
        </div>

        <SectionWrapper className="p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-[18px] font-semibold text-[#581838]">
              Services
            </h3>
            <button
              onClick={() => navigate("/salondetail")}
              className="bg-[#FF92A5] text-white rounded-[8px] px-6 py-2 text-[16px] hover:bg-[#ff7a8a] transition cursor-pointer"
            >
              Manage Services
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {loadingServices ? (
              <p className="text-gray-500 col-span-2 text-center">
                Loading services...
              </p>
            ) : services.length > 0 ? (
              services.map((service) => (
                <ServiceCard
                  key={service._id}
                  img={service.serviceImage}
                  title={service.serviceName}
                  desc={service.description}
                  price={service.servicePrice}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-2 text-center">
                No services added yet
              </p>
            )}
          </div>
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
    <div className="text-center py-8 text-gray-500">
      <p className="text-[14px]">{message}</p>
    </div>
  );
}
