import React from "react";

import ErrorBoundary from "../../../components/common/ErrorBoundary";
import PrivateStudioSalonDashboard from "../../../components/dashboard/saloon/home/PrivateStudioSalonDashboard";
import { useUser } from "../../../hooks/useUser";
import AppButton from "../../../components/common/site/AppButton";
import { useDashboardModal } from "../../ModalProvider";

function DashboardHome() {
  const { openModal } = useDashboardModal();
  const { user } = useUser();
  const reasons =
    user?.holdReason ? user.holdReason.split("|").map((r) => r.trim()) : [];
  const showPrivateStudio =
    !(user?.status === "hold" || user?.isSuspended);
  return (
    <div
      className={`flex flex-col gap-8 font-poppins ${showPrivateStudio ? "" : "p-6"}`}
    >
      {showPrivateStudio && (
        <ErrorBoundary title="We couldn’t load your dashboard.">
          <PrivateStudioSalonDashboard />
        </ErrorBoundary>
      )}
      {user?.isSuspended && (
        <div className="border border-red-500/20 bg-white p-[30px] rounded-[20px] flex flex-col items-center text-center gap-4 shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-[#0F3D3E] font-bold text-[24px]">
            This Account has been Suspended
          </h2>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 w-full max-w-[600px]">
            <p className="text-red-700 font-semibold mb-1">
              Reason for suspension:
            </p>
            <p className="text-[#4B5563] text-[16px]">
              {user?.suspensionReason ||
                "No specific reason provided by the administrator."}
            </p>
          </div>
          <p className="text-[#4B5563] text-[14px] mt-2">
            Please contact the administrator at support@vmb.com for more
            information.
          </p>
        </div>
      )}
      {user?.status === "hold" && !user?.isSuspended && (
        <div className="border border-vmb-error/20 bg-white p-[25px] rounded-[12px] flex flex-col gap-[10px]">
          <h2 className="text-vmb-error font-semibold text-[18px]">
            Your salon verification request was Hold.
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {reasons.map((reason, index) => (
              <li
                key={index}
                className="text-[14px] font-medium text-vmb-text-main"
              >
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
