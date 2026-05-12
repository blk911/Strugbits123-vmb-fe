import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useUser } from "../../../../hooks/useUser";

const champagne = "#F7E7CE";

const DROPS = [
  {
    id: "1",
    title: "Mother's Day VIP Share",
    subtitle: "For you",
    shares: 2840,
    claimed: 412,
    imageTone: "from-rose-500/30 via-fuchsia-900/20 to-slate-900/90",
    accent: "from-rose-400 to-pink-600",
  },
  {
    id: "2",
    title: "Bridal Party Connect",
    subtitle: "Near you",
    shares: 1922,
    claimed: 267,
    imageTone: "from-amber-400/25 via-orange-900/15 to-slate-900/90",
    accent: "from-amber-400 to-orange-500",
  },
  {
    id: "3",
    title: "New Year Glow Circuit",
    subtitle: "Trending",
    shares: 3511,
    claimed: 589,
    imageTone: "from-emerald-400/20 via-teal-900/20 to-slate-900/90",
    accent: "from-emerald-400 to-teal-500",
  },
];

const STORY_AVATARS = [
  "https://i.pravatar.cc/96?img=44",
  "https://i.pravatar.cc/96?img=33",
  "https://i.pravatar.cc/96?img=16",
  "https://i.pravatar.cc/96?img=52",
  "https://i.pravatar.cc/96?img=47",
];

const CIRCLE_FEED = [
  {
    id: "a",
    avatar: "https://i.pravatar.cc/80?img=5",
    name: "Luminose Salon",
    text: "Dropped a limited Mother's Day gift lane — your circle gets early access.",
    time: "5m",
    meta: "Salon drop",
  },
  {
    id: "b",
    avatar: "https://i.pravatar.cc/80?img=9",
    name: "You",
    text: "Your gift request is in flight · studios are matching tone & timing.",
    time: "24m",
    meta: "Request status",
  },
  {
    id: "c",
    avatar: "https://i.pravatar.cc/80?img=22",
    name: "Avery",
    text: "Accepted your salon invite — added to your Circle for shared drops.",
    time: "1h",
    meta: "Invite",
  },
  {
    id: "d",
    avatar: "https://i.pravatar.cc/80?img=38",
    name: "Velvet Room",
    text: "Posted a Bridal Party Connect card — 3 friends saved it this hour.",
    time: "2h",
    meta: "Social proof",
  },
];

function CircleMeshCompact() {
  return (
    <div
      className="relative h-36 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent overflow-hidden"
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-90"
        viewBox="0 0 200 140"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="clientGoldLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7E7CE" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#F7E7CE" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F7E7CE" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {[
          [100, 70, 48, 38],
          [100, 70, 152, 34],
          [100, 70, 92, 102],
          [48, 38, 152, 34],
          [92, 102, 152, 34],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#clientGoldLine)"
            strokeWidth="1"
          />
        ))}
        {[
          [100, 70, 12],
          [48, 38, 9],
          [152, 34, 10],
          [92, 102, 8],
          [28, 88, 6],
          [172, 96, 7],
        ].map(([cx, cy, r], i) => (
          <circle
            key={`n-${i}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="rgba(15,23,42,0.85)"
            stroke="#F7E7CE"
            strokeOpacity={i === 0 ? 0.9 : 0.28 + i * 0.04}
            strokeWidth={i === 0 ? 1.5 : 0.9}
          />
        ))}
      </svg>
      <p className="absolute top-2.5 left-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#F7E7CE]/40">
        Your graph
      </p>
    </div>
  );
}

function FeedPost({ item }) {
  return (
    <article className="group rounded-3xl border border-white/[0.07] bg-white/[0.035] backdrop-blur-md px-4 py-4 sm:px-5 transition hover:border-white/[0.12] hover:bg-white/[0.05]">
      <div className="flex gap-3 sm:gap-4">
        <div className="relative shrink-0">
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F7E7CE]/50 via-transparent to-transparent opacity-70 blur-[2px]" />
          <img
            src={item.avatar}
            alt=""
            className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover ring-2 ring-white/10"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-semibold text-[#F7E7CE]/95 text-[15px]">
              {item.name}
            </span>
            <span className="text-slate-500 text-xs">· {item.time}</span>
          </div>
          {item.meta ?
            <span className="mt-0.5 inline-flex rounded-full border border-[#F7E7CE]/20 bg-[#F7E7CE]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#F7E7CE]/70">
              {item.meta}
            </span>
          : null}
          <p className="mt-2 text-[15px] leading-snug text-slate-200/95">
            {item.text}
          </p>
          <div
            className="mt-3 flex items-center gap-5 text-slate-500 text-xs"
            aria-hidden
          >
            <span className="inline-flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7E7CE]/50" />
              Save
            </span>
            <span className="inline-flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7E7CE]/35" />
              Nudge
            </span>
            <span className="inline-flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7E7CE]/25" />
              Share
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PrivateStudioClientDashboard() {
  const { openModal } = useDashboardModal();
  const { user } = useUser();
  const navigate = useNavigate();

  const profileSrc = user?.profilePic || user?.userProfile;

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden font-studio-sans">
      <div
        className="pointer-events-none absolute inset-0 bg-slate-950"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#F7E7CE]/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="relative z-[1] mx-auto max-w-6xl px-4 py-6 text-slate-300 sm:px-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:gap-3 no-scrollbar">
            <div
              className="relative h-[72px] w-[72px] shrink-0 rounded-full p-[3px] bg-gradient-to-tr from-[#F7E7CE] via-[#F7E7CE]/40 to-transparent"
              title="You"
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white/5 bg-slate-900/90">
                {profileSrc ?
                  <img
                    src={profileSrc}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                : <span className="px-1 text-center text-[8px] font-medium uppercase tracking-widest text-[#F7E7CE]/45">
                    You
                  </span>
                }
              </div>
            </div>
            {STORY_AVATARS.map((src, i) => (
              <button
                key={src}
                type="button"
                className="relative shrink-0 rounded-full p-[2.5px] bg-gradient-to-tr from-[#F7E7CE]/80 via-white/20 to-transparent transition hover:opacity-95"
              >
                <img
                  src={src}
                  alt=""
                  className="h-[68px] w-[68px] rounded-full border border-black/20 object-cover"
                />
                {i === 0 ?
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-1.5 py-px text-[9px] font-semibold text-[#F7E7CE] ring-1 ring-white/10">
                    New
                  </span>
                : null}
              </button>
            ))}
            <button
              type="button"
              className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border border-dashed border-white/15 bg-white/[0.03] text-lg text-[#F7E7CE]/60 transition hover:border-[#F7E7CE]/35 hover:bg-white/[0.06]"
              aria-label="Discover"
            >
              +
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-studio-serif text-2xl font-medium tracking-tight text-[#F7E7CE] sm:text-3xl">
                The Private Studio
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Hey{" "}
                <span className="text-slate-400">
                  {user?.name || "there"}
                </span>
                <span className="text-slate-600"> · </span>
                <span className="text-slate-500">Good to see you back.</span>
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 sm:mt-0">
              <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-slate-400 ring-1 ring-white/[0.06]">
                Gifts &amp; invites
              </span>
              <span className="rounded-full bg-[#F7E7CE]/10 px-3 py-1 text-[11px] font-medium text-[#F7E7CE]/80 ring-1 ring-[#F7E7CE]/20">
                Circle on
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_min(340px,100%)] lg:items-start lg:gap-6">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F7E7CE]/55">
                Circle feed
              </h2>
              <span className="text-xs text-slate-500">Latest first</span>
            </div>
            <div className="flex flex-col gap-3">
              {CIRCLE_FEED.map((item) => (
                <FeedPost key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-2 pt-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F7E7CE]/55">
                  Drops for you
                </h2>
                <span className="text-xs text-slate-500">Swipe →</span>
              </div>
              <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-2">
                {DROPS.map((c) => (
                  <article
                    key={c.id}
                    className="w-[min(280px,calc(100vw-3rem))] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md transition hover:border-[#F7E7CE]/25"
                  >
                    <div
                      className={`relative h-28 bg-gradient-to-br ${c.imageTone}`}
                    >
                      <div
                        className={`absolute left-3 top-3 h-9 w-9 rounded-2xl bg-gradient-to-br ${c.accent} opacity-90 shadow-lg`}
                      />
                      <span className="absolute bottom-2 left-3 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                        {c.subtitle}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-studio-serif text-lg leading-tight text-[#F7E7CE]">
                        {c.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-3 text-xs tabular-nums text-slate-400">
                        <span>
                          <strong className="text-[#F7E7CE]/90">
                            {c.shares.toLocaleString()}
                          </strong>{" "}
                          shares
                        </span>
                        <span className="text-slate-600">·</span>
                        <span>
                          <strong className="text-[#F7E7CE]/90">
                            {c.claimed}
                          </strong>{" "}
                          claimed
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F7E7CE]/45">
                Gift
              </p>
              <p className="mt-2 font-studio-serif text-xl text-[#F7E7CE]">
                Request a treat
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Same flow as your dashboard banner — opens the gift request
                experience.
              </p>
              <button
                type="button"
                onClick={() => openModal("treat")}
                className="mt-4 w-full rounded-2xl py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:brightness-105 active:scale-[0.99]"
                style={{
                  background: `linear-gradient(135deg, ${champagne} 0%, #e8d5b0 100%)`,
                }}
              >
                Request a gift
              </button>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#F7E7CE]/90">
                  Salon invites
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Pending and history — same destination as before.
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate("/salon-invites", { state: { tab: "Pending" } })
                }
                className="mt-3 w-full rounded-2xl border border-[#F7E7CE]/25 bg-[#F7E7CE]/5 py-2.5 text-sm font-semibold text-[#F7E7CE] transition hover:bg-[#F7E7CE]/10"
              >
                Open invites
              </button>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#F7E7CE]/90">
                  Your salons
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  Map
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Browse nearby studios (mock mesh below).
              </p>
              <div className="mt-3">
                <CircleMeshCompact />
              </div>
              <button
                type="button"
                onClick={() => navigate("/salons")}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.07]"
              >
                Explore salons
              </button>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5">
              <p className="text-xs text-slate-500">
                Profile &amp; account settings use the same modal as the header
                menu.
              </p>
              <button
                type="button"
                onClick={() => openModal("profileSettings", user)}
                className="mt-3 w-full text-left text-sm font-semibold text-[#F7E7CE] underline-offset-4 hover:underline"
              >
                Edit profile
              </button>
            </div>

            <div className="rounded-3xl border border-dashed border-white/10 bg-transparent px-4 py-3 text-center">
              <p className="text-[11px] text-slate-500">
                Visual prototype · mock feed &amp; drops
              </p>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
