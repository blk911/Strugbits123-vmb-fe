import React from "react";
import { FaGift } from "react-icons/fa6";
import { useUser } from "../../../hooks/useUser";

import GiftCardsSection from "../../../components/dashboard/client/Home/GiftCardsSection";
import WelcomeBanner from "../../../components/dashboard/client/Home/WelcomeBanner";
import SalonSection from "../../../components/dashboard/client/Home/SalonSection";
const DashboardHome = () => {
  const user = useUser();
  if (!user) return null;
  const cards = [1, 2, 3];
  return (
    <div className="flex flex-col  bg-[#EFEFEF] p-2 sm:p-7 font-[Poppins] gap-8">
      <WelcomeBanner
        user={user}
        onInviteClick={() => {}}
        onGiftClick={() => {}}
      />
      <GiftCardsSection />

      <SalonSection />
    </div>
  );
};

export default DashboardHome;
