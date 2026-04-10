import React from "react";

import { useUser } from "../../../hooks/useUser";

import GiftCardsSection from "../../../components/dashboard/client/Home/GiftCardsSection";
import WelcomeBanner from "../../../components/dashboard/client/Home/WelcomeBanner";
import SalonSection from "../../../components/dashboard/client/Home/SalonSection";
import { useDashboardModal } from "../../ModalProvider";
import LoadingIndicator from "../../../components/common/LoadingIndicator/LoadingIndicator";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const { openModal } = useDashboardModal();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!user) return null;
  return (
    <div
      className="h-full flex flex-col   mb-6 p-2 sm:p-7 font-poppins gap-8 no-scrollbar"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <WelcomeBanner
        user={user}
        onInviteClick={() =>
          navigate("/salon-invites", { state: { tab: "Pending" } })
        }
        onGiftClick={() => {
          openModal("treat");
        }}
      />
      <GiftCardsSection />

      <SalonSection />
    </div>
  );
};

export default DashboardHome;
