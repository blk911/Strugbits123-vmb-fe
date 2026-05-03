import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaCalendarAlt, FaEnvelope } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa6";
import SectionWrapper from "./SectionWrapper";
import InviteCard from "./InviteCard";
import AppointmentCard from "./AppointmentCard";
import ServiceCard from "./ServiceCard";
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
import { useDashboardModal } from "../../../../pages/ModalProvider";
import serviceIcon from "../../../../assets/Services_Icon.png";

const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export default function MainSection() {
  const navigate = useNavigate();
  const { openModal } = useDashboardModal();

  const { data: servicesRes, isLoading: loadingServices } = useGetServicesQuery();
  const { data: invitesRes, isLoading: loadingInvites } = useGetSalonInvitesQuery({ status: "pending", sort: "newest" });
  const { data: appointmentsRes, isLoading: loadingAppointments } = useGetSalonAppointmentsQuery({ status: "pending", sort: "newest" });
  const { data: rescheduleRes, isLoading: loadingReschedule } = useGetSalonAppointmentsQuery({ status: "reschedule-requested", sort: "newest" });
  const { data: statsRes, isLoading: loadingStats } = useGetDailyStatsQuery();

  const services = servicesRes?.data?.items?.slice(0, 6) || [];
  const pendingInvites = invitesRes?.data?.items || [];
  const pendingAppointments = appointmentsRes?.data?.items || [];
  const rescheduleAppointments = rescheduleRes?.data?.items || [];
  const todaysAppointments = statsRes?.data?.appointmentsCount || 0;
  const totalServicesCount = statsRes?.data?.totalServicesCount || 0;

  let selectedAppointments = [];
  if (pendingAppointments.length > 0) selectedAppointments.push(pendingAppointments[0]);
  if (rescheduleAppointments.length > 0) selectedAppointments.push(rescheduleAppointments[0]);
  if (selectedAppointments.length < 2) {
    if (pendingAppointments.length > 1) selectedAppointments.push(pendingAppointments[1]);
    else if (rescheduleAppointments.length > 1) selectedAppointments.push(rescheduleAppointments[1]);
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(inviteSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onInviteSubmit = (data) => {
    openModal("sendTreat", { email: data.email });
    reset();
  };

  const getAppointmentProps = (item) => ({
    icon: item.salon?.salonImage || SalonImage,
    from: item.requestedFrom?.name || "Client",
    service: item.services?.map((s) => s.name).join(", ") || "No Service",
    price: `$${item.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0}`,
    statusText: item.status === "pending" ? "Pending" : "Reschedule requested",
    statusClass:
      item.status === "pending"
        ? "bg-vmb-pending/20 text-vmb-pending"
        : "bg-vmb-secondary/20 text-vmb-secondary",
    timeAgo: formatTimeAgo(item?.timeline[0]?.timestamp || item.createdAt),
    data: item,
  });

  return (
    <div className="flex flex-col gap-7 font-poppins">
      {/* ── Hero Invite Banner ── */}
      <div
        className="rounded-[16px] overflow-hidden"
        style={{ background: "var(--vmb-primary)" }}
      >
        <div className="px-8 py-10 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 min-w-0">
            <p
              className="font-cormorant text-[11px] tracking-[0.22em] uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Invite Only Platform
            </p>
            <h2
              className="font-playfair text-[32px] sm:text-[38px] leading-[1.15] text-white"
            >
              Send an Invitation
            </h2>
            <p
              className="text-[14px] mt-2 font-poppins"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Grow your clientele — one invitation at a time.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onInviteSubmit)}
            className="w-full lg:w-[360px] flex flex-col gap-3"
          >
            <div>
              <input
                type="email"
                {...register("email")}
                placeholder="client@email.com"
                className={`w-full rounded-[10px] px-4 py-3 text-[14px] font-poppins placeholder:text-white/40 text-white focus:outline-none transition-colors ${
                  errors.email
                    ? "border border-red-400 bg-white/10"
                    : "border border-white/20 bg-white/10 focus:border-white/40"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 pl-1">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!isValid}
              className={`flex items-center justify-center gap-2 rounded-[10px] py-3 text-[14px] font-semibold transition-all duration-200 ${
                isValid
                  ? "text-vmb-primary cursor-pointer hover:brightness-95"
                  : "cursor-not-allowed opacity-50"
              }`}
              style={{ background: isValid ? "var(--vmb-gold)" : "rgba(184,150,106,0.4)", color: isValid ? "#fff" : "rgba(255,255,255,0.5)" }}
            >
              <FaEnvelope className="w-4 h-4" />
              Send Invite
            </button>
          </form>
        </div>

        {/* Pending invite strip */}
        {!loadingInvites && pendingInvites.length > 0 && (
          <div
            className="px-8 py-3 flex items-center justify-between gap-4"
            style={{ background: "rgba(0,0,0,0.15)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-[12px] font-poppins" style={{ color: "rgba(255,255,255,0.5)" }}>
              {pendingInvites.length} pending invite{pendingInvites.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => navigate("/salon-invites")}
              className="text-[12px] font-semibold underline transition hover:opacity-80"
              style={{ color: "var(--vmb-gold)" }}
            >
              View All
            </button>
          </div>
        )}
      </div>

      {/* ── Metric Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          label="Pending Appointments"
          value={pendingAppointments.length}
          isLoading={loadingAppointments}
        />
        <MetricCard
          label="Today's Appointments"
          value={todaysAppointments}
          isLoading={loadingStats}
        />
        <MetricCard
          label="Total Services"
          value={totalServicesCount}
          isLoading={loadingStats}
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Services */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <SectionWrapper className="p-6 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1"
                  style={{ color: "var(--vmb-gold)" }}
                >
                  Menu
                </p>
                <h3
                  className="font-playfair text-[22px]"
                  style={{ color: "var(--vmb-primary)" }}
                >
                  Services
                </h3>
              </div>
              <button
                onClick={() => navigate("/salon-detail")}
                className="text-[13px] font-semibold font-poppins px-4 py-2 rounded-[8px] transition hover:opacity-80"
                style={{ background: "var(--vmb-primary)", color: "#fff" }}
              >
                Manage
              </button>
            </div>

            {loadingServices ? (
              <div className="flex justify-center py-8">
                <LoadingIndicator />
              </div>
            ) : services.length === 0 ? (
              <p className="text-center py-8 text-[14px]" style={{ color: "var(--vmb-text-muted)" }}>
                No services added yet
              </p>
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service._id}
                  title={service.serviceName}
                  desc={service.description}
                  price={service.servicePrice}
                />
              ))
            )}
          </SectionWrapper>

          {/* Appointments */}
          <SectionWrapper className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-1"
                  style={{ color: "var(--vmb-gold)" }}
                >
                  Queue
                </p>
                <h3
                  className="font-playfair text-[22px]"
                  style={{ color: "var(--vmb-primary)" }}
                >
                  Appointments
                </h3>
              </div>
              <button
                onClick={() => navigate("/appointments")}
                className="text-[12px] font-medium underline transition hover:opacity-70"
                style={{ color: "var(--vmb-text-muted)" }}
              >
                View All
              </button>
            </div>

            {loadingAppointments || loadingReschedule ? (
              <div className="flex justify-center py-6">
                <LoadingIndicator size="sm" />
              </div>
            ) : selectedAppointments.length === 0 ? (
              <p className="text-center py-6 text-[14px]" style={{ color: "var(--vmb-text-muted)" }}>
                No pending appointments
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {selectedAppointments.map((item) => (
                  <AppointmentCard key={item._id} {...getAppointmentProps(item)} isLoading={false} />
                ))}
              </div>
            )}
          </SectionWrapper>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <SalonProfilePanel />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, isLoading }) {
  return (
    <div
      className="rounded-[14px] px-6 py-5 flex flex-col gap-2"
      style={{
        background: "var(--vmb-card-warm)",
        border: "1px solid var(--vmb-border-light)",
        boxShadow: "0 2px 16px rgba(15, 61, 62, 0.06)",
      }}
    >
      <p className="text-[11px] font-poppins font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--vmb-text-muted)" }}>
        {label}
      </p>
      <p
        className="font-playfair leading-none"
        style={{ fontSize: 48, color: "var(--vmb-primary)", lineHeight: 1 }}
      >
        {isLoading ? "—" : value}
      </p>
    </div>
  );
}
