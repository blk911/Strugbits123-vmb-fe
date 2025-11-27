import React from "react";

import { useUser } from "../../../hooks/useUser";

import GiftCardsSection from "../../../components/dashboard/client/Home/GiftCardsSection";
import WelcomeBanner from "../../../components/dashboard/client/Home/WelcomeBanner";
import SalonSection from "../../../components/dashboard/client/Home/SalonSection";
import { useDashboardModal } from "../../ModalProvider";
import LoadingIndicator from "../../../components/common/LoadingIndicator/LoadingIndicator";
const DashboardHome = () => {
  const { user, loading } = useUser();
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
    <div className="flex flex-col  bg-[#EFEFEF] p-2 sm:p-7 font-[Poppins] gap-8">
      <WelcomeBanner
        user={user}
        onInviteClick={() => {}}
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
