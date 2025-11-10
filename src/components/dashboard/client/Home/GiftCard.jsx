import defaultUser from "../../../../assets/user_icon.png";
import { useNavigate } from "react-router-dom";
export default function GiftCard({
  icon: Icon,
  title,
  userName,
  packageName,

  status,
  statusColor,
  statusBg,
}) {
  const navigate = useNavigate();
  const handleViewAll = () => {
    if (title === "My Requests") {
      navigate("/gifts", { state: { activeTab: "myRequests" } });
    } else if (title === "Received Requests") {
      navigate("/gifts", { state: { activeTab: "receivedRequests" } });
    } else if (title === "Appointments") {
      navigate("/appointments");
    }
  };

  return (
    <div className="w-full h-full rounded-[12px] border border-[#F3F4F6] bg-white shadow-[0_4px_6px_#0000000D] p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-[#FF92A5]" />
          <span className="text-[18px] font-semibold text-[#581838]">
            {title}
          </span>
        </div>
        <span
          className="text-[14px] font-medium text-[#9CA3AF] underline cursor-pointer hover:text-[#FF92A5] transition-all"
          onClick={handleViewAll}
        >
          View All
        </span>
      </div>

      <div className="h-[1px] bg-[#D9D9D9] mb-3"></div>

      <div className="p-3 border border-[#0000001A] rounded-[10px] flex items-center justify-between cursor-pointer hover:border-2 hover:border-[#FF92A5]  transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={defaultUser}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-[#4B5563] font-semibold text-[14px] leading-[18px]">
              {userName}
            </p>
            <p className="text-[12px] text-[#4B5563]/70">{packageName}</p>
          </div>
        </div>

        <div className="text-center">
          <p
            className="font-semibold text-[10px] rounded-[4px] px-2 py-[2px]"
            style={{ color: statusColor, backgroundColor: statusBg }}
          >
            {status}
          </p>
          <p className="text-[10px] text-[#00000080] mt-1">2 days ago</p>
        </div>
      </div>
    </div>
  );
}
