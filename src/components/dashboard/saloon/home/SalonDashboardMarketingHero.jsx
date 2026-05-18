import React from "react";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useUser } from "../../../../hooks/useUser";

/**
 * Marketing / onboarding hero — not shown on operational dashboard by default.
 * Retained for reuse under Network, onboarding flows, or future routes.
 */
export default function SalonDashboardMarketingHero() {
  const { openModal } = useDashboardModal();
  const { user } = useUser();
  const profileSrc = user?.profilePic || user?.userProfile || user?.image;
  const ownerName = user?.name || "Salon Owner";

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#fffdfb_0%,#faf4ee_42%,#f3e8df_100%)] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 shadow-[0_24px_80px_-48px_rgba(164,95,118,0.35)] ring-1 ring-[#e8ddd4]/90">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <div className="relative z-[1] flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-7">
        <div className="min-w-0 flex-1 lg:max-w-[560px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#b8966a]">
            Private Client Network
          </p>
          <h1 className="mt-2 font-studio-serif text-[1.45rem] font-medium leading-[1.12] tracking-tight text-[#2f2a28] sm:text-[1.7rem] sm:leading-[1.08] lg:text-[1.85rem]">
            Create a private client circle around the people who support your
            business most.
          </h1>
          <p className="mt-2 max-w-xl text-[14px] leading-[1.55] text-[#5f5654] sm:text-[15px]">
            Instead of posting to the world, create a more direct relationship
            with the people who actually support your business.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => openModal("exclusiveInvite")}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#c9a86a] px-7 text-[13px] font-semibold tracking-wide text-white shadow-[0_14px_40px_-18px_rgba(201,168,106,0.75)] transition hover:bg-[#d2b27a] hover:shadow-[0_18px_44px_-16px_rgba(201,168,106,0.55)]"
            >
              Invite your first clients
            </button>
            <button
              type="button"
              onClick={() => openModal("recordWelcomeMessage")}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[#2f2a28]/12 bg-white/50 px-6 text-[13px] font-medium tracking-wide text-[#3d3634] backdrop-blur-sm transition hover:border-[#c9a86a]/35 hover:bg-white/75"
            >
              Record welcome message
            </button>
          </div>
        </div>

        <div className="flex w-full flex-1 items-center lg:justify-end">
          <div className="w-full max-w-[380px] space-y-2 rounded-2xl bg-white/55 p-4 shadow-[0_20px_60px_-40px_rgba(47,42,40,0.25)] ring-1 ring-[#efe4db] backdrop-blur-[2px] sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a45f76]/85">
              Your clients will see this first
            </p>
            <div className="relative overflow-hidden rounded-xl bg-[#f5eee9] ring-1 ring-[#e8ddd4]">
              <div className="aspect-[2/1] w-full max-h-[148px] overflow-hidden sm:max-h-[158px] lg:max-h-[132px]">
                {profileSrc ?
                  <img
                    src={profileSrc}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.02]"
                  />
                : <div className="flex h-full min-h-[88px] items-center justify-center bg-[#efe6df] font-studio-serif text-3xl text-[#c9a86a]/90">
                    {ownerName.charAt(0)}
                  </div>
                }
              </div>
            </div>
            <p className="text-[12px] leading-[1.45] text-[#5f5654]">
              &ldquo;Hi, I&apos;m {ownerName.split(" ")[0]} — welcome. This is a
              private space for clients who trust us with their rituals and
              referrals.&rdquo;
            </p>
            <p className="font-studio-serif text-xs italic leading-snug text-[#6b5458]">
              Clients join because of you — not software.
            </p>
            <button
              type="button"
              onClick={() => openModal("exclusiveInvite")}
              className="w-full rounded-full border border-[#c9a86a]/40 bg-[#fffdfb]/80 py-2 text-xs font-semibold tracking-wide text-[#2f2a28] transition hover:border-[#c9a86a]/65 hover:bg-white"
            >
              Preview invite experience
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
