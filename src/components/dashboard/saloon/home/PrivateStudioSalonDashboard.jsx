import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaGift,
  FaHandshake,
  FaMagic,
  FaPaperPlane,
  FaPlay,
  FaRegLightbulb,
  FaShareAlt,
  FaUsers,
} from "react-icons/fa";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useUser } from "../../../../hooks/useUser";
import {
  useGetDailyStatsQuery,
  useGetSalonAppointmentsQuery,
  useGetSalonInvitesQuery,
} from "../../../../store/api";

const launchSteps = [
  {
    title: "Choose an offer",
    text: "Start with a service, VIP perk, seasonal moment, or limited opening.",
    icon: FaGift,
  },
  {
    title: "Invite trusted clients",
    text: "Send it to the people who already love your work and will talk about it.",
    icon: FaUsers,
  },
  {
    title: "Turn shares into bookings",
    text: "Their circle sees a warm recommendation, not a cold ad.",
    icon: FaCalendarAlt,
  },
];

const featureCards = [
  {
    title: "Client-powered referrals",
    text: "Use existing client trust to reach friends, family, coworkers, and event circles.",
    icon: FaShareAlt,
  },
  {
    title: "Salon-controlled incentives",
    text: "Decide what clients and new guests receive before an invite goes out.",
    icon: FaHandshake,
  },
  {
    title: "Lifestyle-based offers",
    text: "Build campaigns around birthdays, bridal parties, nights out, events, and self-care.",
    icon: FaMagic,
  },
  {
    title: "Quick invite engine",
    text: "Send the first invite from this page and keep momentum moving.",
    icon: FaPaperPlane,
  },
];

const videoGuides = [
  {
    title: "Salon Setup",
    meta: "5 min",
    text: "Profile, services, hours, and the first offer foundation.",
  },
  {
    title: "Superstar Clients",
    meta: "Guide",
    text: "Find the clients most likely to bring in trusted referrals.",
  },
  {
    title: "New Biz Promos",
    meta: "Guide",
    text: "Build shareable offers that create fresh booking reasons.",
  },
  {
    title: "Create Your Bench",
    meta: "Guide",
    text: "Grow a warm list of clients ready for the right campaign.",
  },
  {
    title: "Special Occasions",
    meta: "Guide",
    text: "Use parties, trips, weddings, and holidays as invite moments.",
  },
];

export default function PrivateStudioSalonDashboard() {
  const { openModal } = useDashboardModal();
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: invitesRes } = useGetSalonInvitesQuery({
    status: "pending",
    sort: "newest",
  });
  const { data: appointmentsRes } = useGetSalonAppointmentsQuery({
    status: "pending",
    sort: "newest",
  });
  const { data: statsRes } = useGetDailyStatsQuery();

  const stats = useMemo(() => {
    const pendingInvites = invitesRes?.data?.items?.length ?? 0;
    const pendingAppts = appointmentsRes?.data?.items?.length ?? 0;
    const todaysAppts = statsRes?.data?.appointmentsCount ?? 0;

    return [
      {
        label: "Pending Invites",
        value: pendingInvites,
        helper: "client shares ready for follow-up",
      },
      {
        label: "Appointments",
        value: pendingAppts,
        helper: "booking requests in your queue",
      },
      {
        label: "Today",
        value: todaysAppts,
        helper: "scheduled visits on the calendar",
      },
    ];
  }, [appointmentsRes, invitesRes, statsRes]);

  const profileSrc = user?.profilePic || user?.userProfile || user?.image;
  const salonName = user?.salonName || "Preview Salon";
  const ownerName = user?.name || "Salon Owner";

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#f5eee9] font-poppins text-[#333232]">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[8px] border border-[#e2d6cf] bg-[linear-gradient(120deg,#fffdfb_0%,#f7ece9_52%,#ead6cf_100%)] text-[#333232] shadow-[0_22px_60px_-42px_rgba(164,95,118,0.55)]">
          <div className="flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a45f76]">
                Salon Growth Launchpad
              </p>
              <h1 className="mt-3 max-w-4xl font-studio-serif text-4xl leading-[1.05] text-[#333232] sm:text-5xl">
                Grow through the clients who already love you.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#5f5654]">
                Turn loyal clients into local advocates with shareable offers,
                lifestyle moments, and incentives that bring new business back
                to your chair.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openModal("exclusiveInvite")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] bg-[#b88f45] px-5 text-sm font-bold text-white transition hover:bg-[#c0a05a]"
                >
                  <FaGift aria-hidden />
                  Create First Offer
                </button>
                <button
                  type="button"
                  onClick={() => openModal("sendTreat")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] border border-[#b88f45]/45 bg-white/45 px-5 text-sm font-bold text-[#333232] transition hover:bg-white/75"
                >
                  <FaPaperPlane aria-hidden />
                  Invite A Client
                </button>
              </div>
            </div>

            <div className="flex w-full max-w-[360px] shrink-0 items-center gap-4 rounded-[8px] border border-white/70 bg-white/55 p-4 shadow-[0_18px_40px_-30px_rgba(164,95,118,0.65)] backdrop-blur">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#c0a05a]/70 bg-[#fff8f4] text-[#333232]">
                {profileSrc ? (
                  <img
                    src={profileSrc}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-studio-serif text-3xl">
                    {ownerName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a45f76]">
                  Owner Profile
                </p>
                <h2 className="mt-1 truncate font-studio-serif text-2xl">
                  {salonName}
                </h2>
                <p className="mt-1 truncate text-sm text-[#6b6262]">
                  {ownerName}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/salon-detail")}
                  className="mt-3 rounded-[4px] bg-[#333232] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#a45f76]"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[8px] bg-white p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.7)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a45f76]">
                How-To Guides
              </p>
              <h2 className="mt-2 font-studio-serif text-3xl">
                Get the salon growth engine moving.
              </h2>
            </div>
            <span className="text-sm font-semibold text-[#6b6262]">
              Video placeholders
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {videoGuides.map((guide) => (
              <article
                key={guide.title}
                className="overflow-hidden rounded-[8px] border border-[#e2d6cf] bg-[#fffdfb]"
              >
                <div className="flex aspect-video items-center justify-center bg-[linear-gradient(135deg,#fff8f4_0%,#ead6cf_55%,#d9b7ad_100%)] text-[#333232]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[#a45f76] shadow-[0_10px_24px_-14px_rgba(164,95,118,0.8)] ring-1 ring-[#b88f45]/30">
                    <FaPlay className="ml-0.5 text-sm" aria-hidden />
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold leading-tight">
                      {guide.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-[#eadfd8] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7f5362]">
                      {guide.meta}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#6b6262]">
                    {guide.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <article
              key={item.label}
              className="rounded-[8px] border border-[#e2d6cf] bg-white px-5 py-5 shadow-[0_12px_34px_-28px_rgba(39,46,45,0.65)]"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a45f76]">
                {item.label}
              </p>
              <p className="mt-3 font-studio-serif text-4xl text-[#333232]">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-[#6b6262]">{item.helper}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a45f76]">
              How VMB Works
            </p>
            <h2 className="mt-3 max-w-xl font-studio-serif text-4xl leading-tight">
              A simple referral system your clients understand immediately.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#6b6262]">
              The dashboard should guide the salon owner toward one useful
              action: create something worth sharing, then invite clients who
              are proud to pass it along.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {launchSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="rounded-[8px] border border-[#e2d6cf] bg-white p-5"
                >
                  <Icon className="text-xl text-[#b88f45]" aria-hidden />
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6b6262]">
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[8px] bg-white p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.7)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a45f76]">
                Growth Tools
              </p>
              <h2 className="mt-2 font-studio-serif text-3xl">
                Built for warm, local discovery.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/salon-invites")}
              className="inline-flex min-h-10 items-center justify-center rounded-[4px] border border-[#333232]/20 px-4 text-sm font-bold text-[#333232] transition hover:bg-[#f5eee9]"
            >
              View Invites
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-[8px] border border-[#e2d6cf] bg-[#fffdfb] p-5"
                >
                  <Icon className="text-xl text-[#333232]" aria-hidden />
                  <h3 className="mt-4 font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6b6262]">
                    {feature.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[8px] border border-[#ded3cc] bg-[linear-gradient(120deg,#fffdfb_0%,#f3e6e2_100%)] p-6 text-[#333232] sm:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a45f76]">
                  Recommended Next Move
                </p>
                <h2 className="mt-2 font-studio-serif text-3xl">
                  Invite five clients who already send people your way.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b6262]">
                  Ask them to share a perk with someone in their circle. It
                  feels personal, gives the friend a reason to book, and
                  rewards the client for bringing you business.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openModal("sendTreat")}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[4px] bg-[#b88f45] px-5 text-sm font-bold text-white transition hover:bg-[#c0a05a]"
              >
                <FaPaperPlane aria-hidden />
                Send Invite
              </button>
            </div>
          </div>

          <div className="rounded-[8px] border border-[#e2d6cf] bg-white p-6">
            <FaRegLightbulb className="text-2xl text-[#b88f45]" aria-hidden />
            <h3 className="mt-4 font-studio-serif text-2xl">Offer idea</h3>
            <p className="mt-2 text-sm leading-6 text-[#6b6262]">
              "Bring a friend for a blowout, brow refresh, or pre-event glow.
              You both receive a salon credit after the visit."
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
