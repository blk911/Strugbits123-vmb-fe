import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useUser } from "../../../../hooks/useUser";
import {
  useGetSalonInvitesQuery,
  useGetSalonAppointmentsQuery,
  useGetDailyStatsQuery,
} from "../../../../store/api";
import HeroCommandBar from "../revenue-command/HeroCommandBar";
import RelationshipFlow from "../revenue-command/RelationshipFlow";
import InviteEngine from "../revenue-command/InviteEngine";
import ConciergeModule from "../revenue-command/ConciergeModule";
import MomentumModule from "../revenue-command/MomentumModule";
import CampaignCarousel from "../revenue-command/CampaignCarousel";

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
    const pendingGifts = invitesRes?.data?.items?.length ?? 0;
    const pendingAppts = appointmentsRes?.data?.items?.length ?? 0;
    const todaysAppts = statsRes?.data?.appointmentsCount ?? 0;
    const warmLeads = 12 + pendingGifts + pendingAppts;
    const activityCount = pendingAppts + Math.min(todaysAppts, 9);
    const referralActivity =
      activityCount > 0 ? `${activityCount} live` : "Quiet";
    const referralFlow = 1240 + pendingGifts * 120 + pendingAppts * 95;
    return {
      warmLeads: String(warmLeads),
      pendingGifts: String(pendingGifts),
      referralActivity,
      aiHandoffs: "3",
      vipClients: "8",
      referralFlowDisplay: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(referralFlow),
    };
  }, [invitesRes, appointmentsRes, statsRes]);

  const warmLeadsToday =
    Number.parseInt(stats.warmLeads, 10) || 12;

  const handleInviteAction = (modal) => {
    if (modal === "sendTreat") openModal("sendTreat");
    else openModal("exclusiveInvite");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-[#080c16] via-[#0c1220] to-[#101828] font-studio-sans text-slate-200">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <HeroCommandBar
          salonName={user?.salonName}
          stats={stats}
          onDraftInvite={() => openModal("exclusiveInvite")}
          onOpenConcierge={() => navigate("/appointments")}
          onCreateGiftRequest={() => openModal("sendTreat")}
        />

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,65%)_minmax(0,35%)] lg:gap-10">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <RelationshipFlow />
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start">
            <InviteEngine onAction={handleInviteAction} />
            <ConciergeModule
              activeConversations={2}
              waitingHandoffs={1}
              warmLeadsToday={warmLeadsToday}
              onOpenInbox={() => navigate("/salon-invites")}
              onReviewHandoffs={() => navigate("/appointments")}
              onContinueSms={() => openModal("exclusiveInvite")}
            />
            <MomentumModule />
          </div>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <CampaignCarousel
              onExclusiveInvite={() => openModal("exclusiveInvite")}
            />
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
