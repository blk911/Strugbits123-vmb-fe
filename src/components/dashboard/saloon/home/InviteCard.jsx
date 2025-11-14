import { FaUser } from "react-icons/fa6";
import defaultUser from "../../../../assets/user_icon.png";
export default function InviteCard({
  salon,
  service,
  statusText,
  statusColor,
  timeAgo,
}) {
  return (
    <div className="border border-[#0000001A] rounded-[10px] p-3 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={defaultUser}
          alt="User"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-[14px] font-semibold text-[#4B5563]">{salon}</p>
        <p className="text-[12px] text-[#4B5563]">{service}</p>
      </div>

      <div className="ml-auto flex flex-col items-end">
        <div
          className={`px-2 py-1 rounded bg-[${statusColor}33] text-[${statusColor}] text-[10px] font-semibold`}
        >
          {statusText}
        </div>
        <p className="text-[10px] text-[#00000080]">{timeAgo}</p>
      </div>
    </div>
  );
}
