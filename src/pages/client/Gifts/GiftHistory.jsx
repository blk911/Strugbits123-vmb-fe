import { IoFilter } from "react-icons/io5";
import Requests from "../../../components/dashboard/client/Gifts/Requests";

export default function GiftHistory() {
  return (
    <div className="min-h-screen bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col w-full sm:w-auto">
            <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-bold leading-[30px] sm:leading-[34px] md:leading-[36px] text-[#581838]">
              Gifts History
            </h1>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[22px] sm:leading-[23px] md:leading-[24px] mt-1 text-[#4B5563]">
              Manage your gifts efficiently.
            </p>
          </div>

          <div className="flex-grow sm:flex-grow-0 w-full  max-w-[660px]">
            <input
              type="text"
              placeholder="Search (salon, service)"
              className="w-full border border-[#9CA3AF4D] bg-[#F8F8F8] rounded-[10px] px-4 py-2 text-[#4B5563] text-[15px] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#FF92A5]/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 justify-between border border-[#9CA3AF4D] rounded-[10px] px-4 py-2 cursor-pointer hover:bg-[#F9FAFB] transition-all">
            <span className="text-[16px] font-semibold text-[#6B7280]">
              Sort
            </span>
            <IoFilter className="text-[#6B7280] text-[16px] ml-2" />
          </div>
        </div>
      </div>

      <Requests />
    </div>
  );
}
