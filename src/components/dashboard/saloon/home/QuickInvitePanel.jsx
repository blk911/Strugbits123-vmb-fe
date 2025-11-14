import { FaUser, FaEnvelope } from "react-icons/fa6";
import SectionWrapper from "./SectionWrapper";

export default function QuickInvitePanel() {
  return (
    <SectionWrapper className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <FaUser className="text-[#FF92A5] w-[20px] h-[20px]" />
        <p className="text-[18px] font-semibold text-[#581838]">
          Quick Invites
        </p>
      </div>

      <p className="text-[14px] text-[#374151] font-medium">
        Send Email Invite
      </p>

      <input
        className="border border-[#E5E7EB] rounded-[8px] px-3 py-2"
        placeholder="Enter email"
      />

      <button className="flex items-center justify-center border border-[#E5E7EB] bg-[#FF92A5] text-white rounded-[8px] py-2 gap-2">
        <FaEnvelope />
        <span className="text-[16px]">Send Invite</span>
      </button>
    </SectionWrapper>
  );
}
