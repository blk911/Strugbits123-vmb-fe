import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCheck,
  FaGift,
  FaHandshake,
  FaMagic,
  FaPaperPlane,
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

const checklist = [
  "Complete your salon profile",
  "Add two signature services",
  "Create your first client offer",
  "Invite five loyal clients",
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

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#f7f3ec] font-poppins text-[#103f3d]">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[8px] bg-[#0d4542] text-white shadow-[0_22px_60px_-38px_rgba(13,69,66,0.8)]">
          <div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e2c58f]">
                Salon Growth Launchpad
              </p>
              <h1 className="mt-4 max-w-3xl font-studio-serif text-4xl leading-[1.04] text-white sm:text-5xl lg:text-[58px]">
                Grow through the clients who already love you.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/78">
                VMB helps salons generate new business by turning loyal clients
                into local advocates with shareable offers, lifestyle moments,
                and thoughtful incentives.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openModal("exclusiveInvite")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-[#f0d39a] px-5 text-sm font-bold text-[#103f3d] transition hover:bg-[#f6dfb1]"
                >
                  <FaGift aria-hidden />
                  Create First Offer
                </button>
                <button
                  type="button"
                  onClick={() => openModal("sendTreat")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border border-white/28 px-5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <FaPaperPlane aria-hidden />
                  Invite A Client
                </button>
              </div>
            </div>

            <div className="bg-[#e9ddca] p-5 text-[#103f3d] lg:p-7">
              <div className="h-full rounded-[8px] bg-white/72 p-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a6783f]">
                  First Campaign
                </p>
                <h2 className="mt-3 font-studio-serif text-3xl">
                  Launch path
                </h2>
                <div className="mt-5 space-y-3">
                  {checklist.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-[8px] border border-[#ded2bf] bg-white px-3 py-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0d4542] text-[10px] text-white">
                        {index === 0 ? <FaCheck aria-hidden /> : index + 1}
                      </span>
                      <span className="text-sm font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/salon-detail")}
                  className="mt-5 w-full rounded-[6px] bg-[#0d4542] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#123f3d]"
                >
                  Edit Salon Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <article
              key={item.label}
              className="rounded-[8px] border border-[#e2d8c8] bg-white px-5 py-5 shadow-[0_12px_34px_-28px_rgba(39,46,45,0.65)]"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a6783f]">
                {item.label}
              </p>
              <p className="mt-3 font-studio-serif text-4xl text-[#0d4542]">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-[#5e6b68]">{item.helper}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a6783f]">
              How VMB Works
            </p>
            <h2 className="mt-3 max-w-xl font-studio-serif text-4xl leading-tight">
              A simple referral system your clients understand immediately.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#5e6b68]">
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
                  className="rounded-[8px] border border-[#e2d8c8] bg-white p-5"
                >
                  <Icon className="text-xl text-[#b58246]" aria-hidden />
                  <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5e6b68]">
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
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a6783f]">
                Growth Tools
              </p>
              <h2 className="mt-2 font-studio-serif text-3xl">
                Built for warm, local discovery.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/salon-invites")}
              className="inline-flex min-h-10 items-center justify-center rounded-[6px] border border-[#0d4542]/20 px-4 text-sm font-bold text-[#0d4542] transition hover:bg-[#eef4f1]"
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
                  className="rounded-[8px] border border-[#eadfce] bg-[#fbf8f2] p-5"
                >
                  <Icon className="text-xl text-[#0d4542]" aria-hidden />
                  <h3 className="mt-4 font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5e6b68]">
                    {feature.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[8px] border border-[#d9ccb9] bg-[#0d4542] p-6 text-white sm:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e2c58f]">
                  Recommended Next Move
                </p>
                <h2 className="mt-2 font-studio-serif text-3xl">
                  Invite five clients who already send people your way.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/76">
                  Ask them to share a perk with someone in their circle. It
                  feels personal, gives the friend a reason to book, and
                  rewards the client for bringing you business.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openModal("sendTreat")}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-white px-5 text-sm font-bold text-[#0d4542] transition hover:bg-[#f0d39a]"
              >
                <FaPaperPlane aria-hidden />
                Send Invite
              </button>
            </div>
          </div>

          <div className="rounded-[8px] border border-[#e2d8c8] bg-white p-6">
            <FaRegLightbulb className="text-2xl text-[#b58246]" aria-hidden />
            <h3 className="mt-4 font-studio-serif text-2xl">Offer idea</h3>
            <p className="mt-2 text-sm leading-6 text-[#5e6b68]">
              "Bring a friend for a blowout, brow refresh, or pre-event glow.
              You both receive a salon credit after the visit."
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
