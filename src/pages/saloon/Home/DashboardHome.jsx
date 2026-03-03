import React from "react";

import Overview from "../../../components/dashboard/saloon/home/Overview";
import MainSection from "../../../components/dashboard/saloon/home/MainSection";
import { useUser } from "../../../hooks/useUser";
import AppButton from "../../../components/common/site/AppButton";
import { useDashboardModal } from "../../ModalProvider";

function DashboardHome() {
  const { openModal } = useDashboardModal();
  const { user } = useUser();
  const reasons = user?.holdReason
    ? user.holdReason.split("|").map((r) => r.trim())
    : [];
  return (
    <div className="p-6 flex flex-col gap-8 font-poppins">
      <Overview />
      {!(user?.status === "hold") && <MainSection />}
      {user?.status === "hold" && (
        <div className="border border-vmb-error/20 bg-white p-[25px] rounded-[12px] flex flex-col gap-[10px]">
          <h2 className="text-vmb-error font-semibold text-[18px]">
            Your salon verification request was Hold.
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {reasons.map((reason, index) => (
              <li key={index} className="text-[14px] font-medium text-vmb-text-main">
                {reason}
              </li>
            ))}
          </ul>
          <AppButton
            variant="custom"
            fontWeight="bold"
            className="bg-vmb-error text-white"
            onClick={() => openModal("salonprofileSettings")}
          >
            Re-submit for Verification
          </AppButton>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;
