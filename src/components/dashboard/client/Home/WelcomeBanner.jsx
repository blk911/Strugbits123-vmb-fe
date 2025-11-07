import { FaGift } from "react-icons/fa6";

export default function WelcomeBanner({ user, onGiftClick, onInviteClick }) {
  return (
    <div className="relative bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-bold leading-[30px] sm:leading-[34px] md:leading-[36px] text-[#581838]">
            Hey {user?.fullName || "there"}!
          </h1>
          <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[22px] sm:leading-[23px] md:leading-[24px] mt-1 text-[#4B5563]">
            Good to see you back.
          </p>

          <div className="mt-3 md:hidden bg-[#FF92A5] rounded-[10px] px-3 py-2 text-white text-[14px] leading-[22px]">
            You have a new salon invitation!{" "}
            <span
              className="font-bold underline cursor-pointer"
              onClick={onInviteClick}
            >
              Click Here
            </span>
          </div>
        </div>

        <button
          className="flex items-center cursor-pointer justify-center gap-2 bg-[#FF92A54D] rounded-[8px] px-3 sm:px-4 py-2 text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#581838] hover:bg-[#FF92A566] transition-all w-fit"
          onClick={onGiftClick}
        >
          <FaGift className="text-[#FF97A7] text-[18px]" />
          Request a Gift
        </button>
      </div>

      <div className="hidden md:block absolute bottom-[-14px] left-[-1px] bg-[#FF92A5] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] px-3 sm:px-4 py-1 w-[350px] md:w-[400px] text-white text-[15px] md:text-[16px] leading-[23px] md:leading-[24px]">
        You have a new salon invitation!{" "}
        <span
          className="font-bold underline cursor-pointer"
          onClick={onInviteClick}
        >
          Click Here
        </span>
      </div>
    </div>
  );
}
