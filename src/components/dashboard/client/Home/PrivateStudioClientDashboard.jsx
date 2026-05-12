import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaGift,
  FaHeart,
  FaPaperPlane,
  FaRegStar,
  FaShareAlt,
  FaStore,
  FaUsers,
} from "react-icons/fa";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useUser } from "../../../../hooks/useUser";

const perks = [
  {
    title: "Your salon offer",
    text: "See the perks your favorite salons made available for you and your circle.",
    icon: FaStore,
  },
  {
    title: "Invite friends",
    text: "Share with people who would actually love the service, event, or self-care moment.",
    icon: FaShareAlt,
  },
  {
    title: "Earn rewards",
    text: "When someone books through your invite, you can receive salon credits or special access.",
    icon: FaGift,
  },
];

const shareReasons = [
  "A friend has a birthday, wedding, trip, or big event coming up",
  "Someone asks who does your hair, brows, lashes, nails, or skin",
  "Your salon drops a limited offer that deserves the right audience",
];

const quickActions = [
  {
    title: "Request a gift",
    text: "Ask a salon for a treat or service moment.",
    icon: FaGift,
    action: "treat",
  },
  {
    title: "View invites",
    text: "Track pending and past salon invitations.",
    icon: FaPaperPlane,
    route: "/salon-invites",
  },
  {
    title: "Explore salons",
    text: "Find studios and services near you.",
    icon: FaStore,
    route: "/salons",
  },
];

export default function PrivateStudioClientDashboard() {
  const { openModal } = useDashboardModal();
  const { user } = useUser();
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")?.[0] || "there";

  const runAction = (item) => {
    if (item.action) openModal(item.action);
    if (item.route) navigate(item.route);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#f7f3ec] font-poppins text-[#103f3d]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[8px] bg-white shadow-[0_18px_56px_-38px_rgba(39,46,45,0.7)]">
          <div className="grid gap-0 lg:grid-cols-[1fr_420px]">
            <div className="px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#a6783f]">
                VMB Client Circle
              </p>
              <h1 className="mt-4 max-w-3xl font-studio-serif text-4xl leading-[1.06] sm:text-5xl lg:text-[56px]">
                Share salon perks with people who trust your taste.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#5e6b68]">
                Hey {firstName}, VMB helps you pass along offers from salons
                you like, give friends a better reason to book, and earn
                rewards when your circle shows up.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/salon-invites", { state: { tab: "Pending" } })
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-[#0d4542] px-5 text-sm font-bold text-white transition hover:bg-[#123f3d]"
                >
                  <FaPaperPlane aria-hidden />
                  See My Invites
                </button>
                <button
                  type="button"
                  onClick={() => openModal("treat")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border border-[#0d4542]/20 px-5 text-sm font-bold text-[#0d4542] transition hover:bg-[#eef4f1]"
                >
                  <FaGift aria-hidden />
                  Request A Gift
                </button>
              </div>
            </div>

            <div className="bg-[#0d4542] p-5 text-white lg:p-7">
              <div className="flex h-full flex-col justify-between rounded-[8px] border border-white/14 bg-white/8 p-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e2c58f]">
                    Why Share
                  </p>
                  <h2 className="mt-3 font-studio-serif text-3xl">
                    Your recommendation carries the trust ads cannot buy.
                  </h2>
                </div>
                <div className="mt-8 space-y-3">
                  {shareReasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex items-start gap-3 rounded-[8px] bg-white/10 px-3 py-3"
                    >
                      <FaHeart
                        className="mt-1 shrink-0 text-[#f0d39a]"
                        aria-hidden
                      />
                      <p className="text-sm leading-6 text-white/82">
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <article
                key={perk.title}
                className="rounded-[8px] border border-[#e2d8c8] bg-white p-5"
              >
                <Icon className="text-xl text-[#b58246]" aria-hidden />
                <h2 className="mt-5 text-lg font-bold">{perk.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#5e6b68]">
                  {perk.text}
                </p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[8px] border border-[#e2d8c8] bg-white p-6 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a6783f]">
              How It Works
            </p>
            <h2 className="mt-3 font-studio-serif text-4xl leading-tight">
              A warm invite feels personal, useful, and easy to act on.
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["Pick", "Choose an offer or salon moment worth sharing."],
                ["Send", "Invite someone who fits the service or occasion."],
                ["Earn", "Receive perks when your recommendation converts."],
              ].map(([title, text], index) => (
                <div
                  key={title}
                  className="rounded-[8px] bg-[#fbf8f2] p-4 ring-1 ring-[#eadfce]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d4542] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5e6b68]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] bg-[#e9ddca] p-6 sm:p-7">
            <FaRegStar className="text-2xl text-[#a6783f]" aria-hidden />
            <h2 className="mt-4 font-studio-serif text-3xl">
              Best people to invite
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5e6b68]">
              Think about the friends who ask for your recommendations, the
              people planning a celebration, or anyone who would appreciate a
              trusted salon introduction.
            </p>
            <button
              type="button"
              onClick={() => navigate("/salons")}
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-[6px] bg-[#0d4542] px-4 text-sm font-bold text-white transition hover:bg-[#123f3d]"
            >
              <FaUsers aria-hidden />
              Find A Salon
            </button>
          </div>
        </section>

        <section className="rounded-[8px] bg-white p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.7)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a6783f]">
                Quick Actions
              </p>
              <h2 className="mt-2 font-studio-serif text-3xl">
                Keep your perks moving.
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => runAction(item)}
                  className="rounded-[8px] border border-[#eadfce] bg-[#fbf8f2] p-5 text-left transition hover:border-[#0d4542]/30 hover:bg-[#f5efe5]"
                >
                  <Icon className="text-xl text-[#0d4542]" aria-hidden />
                  <h3 className="mt-4 font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5e6b68]">
                    {item.text}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[8px] border border-[#d9ccb9] bg-[#0d4542] p-6 text-white sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e2c58f]">
                Personal Perks
              </p>
              <h2 className="mt-2 font-studio-serif text-3xl">
                The best share is the one that feels like a favor.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/76">
                VMB is not about blasting discounts. It is about matching a
                salon moment to a person who will value it.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                navigate("/salon-invites", { state: { tab: "Pending" } })
              }
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-white px-5 text-sm font-bold text-[#0d4542] transition hover:bg-[#f0d39a]"
            >
              <FaCalendarCheck aria-hidden />
              Review Invites
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
