import { FaUser, FaEnvelope } from "react-icons/fa6";
import SectionWrapper from "./SectionWrapper";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useState } from "react";

export default function QuickInvitePanel() {
  const { openModal } = useDashboardModal();
  const [email, setEmail] = useState("");
  const handleSendInvite = () => {
    if (!email.trim()) return;
    openModal("sendTreat", { email });
  };
  return (
    <SectionWrapper className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <FaUser className="text-[#FF92A5] w-[20px] h-[20px] shrink-0" />
        <p className="text-[18px] font-semibold text-[#581838]">
          Quick Invites
        </p>
      </div>

      <p className="text-[14px] text-[#374151] font-medium">
        Send Email Invite
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-[#E5E7EB] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#FF92A5]"
        placeholder="Enter email"
      />
      <button
        disabled={!email.trim()}
        onClick={handleSendInvite}
        className={`flex items-center justify-center rounded-[8px] py-2 gap-2 transition-all duration-200 ${
          email.trim()
            ? "bg-[#FF92A5] text-white cursor-pointer hover:bg-[#ff7a8e]"
            : "bg-[#FFB3C1] text-white/70 cursor-not-allowed"
        }`}
      >
        <FaEnvelope />
        <span className="text-[16px]">Send Invite</span>
      </button>
    </SectionWrapper>
  );
}
