import React from 'react'
import { FaGift } from "react-icons/fa6";
import { useUser } from '../../../hooks/useUser';
import defaultUser from '../../../assets/user_icon.png'
const DashboardHome = () => {
const user = useUser();
if (!user) return null;
const cards = [1, 2, 3];
  return (
    <div className='flex flex-col min-h-screen bg-[#EFEFEF] p-7 font-[Poppins]'>

<div className="relative bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div className="w-full sm:w-auto">
      <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-bold leading-[30px] sm:leading-[34px] md:leading-[36px] text-[#581838]">
        Hey {user?.fullName}!
      </h1>
      <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[22px] sm:leading-[23px] md:leading-[24px] mt-1 text-[#4B5563]">
        Good to see you back.
      </p>

      <div className="mt-3 md:hidden bg-[#FF92A5] rounded-[10px] px-3 py-2 text-white text-[14px] leading-[22px]">
        You have a new salon invitation!{" "}
        <span className="font-bold underline cursor-pointer">Click Here</span>
      </div>
    </div>

    <button className="flex items-center justify-center gap-2 bg-[#FF92A54D] rounded-[8px] px-3 sm:px-4 py-2 text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#581838] hover:bg-[#FF92A566] transition-all w-fit">
      <FaGift className="text-[#FF97A7] text-[18px]" />
      Request a Gift
    </button>
  </div>

  <div className="hidden md:block absolute bottom-[-14px] left-[-1px] bg-[#FF92A5] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] px-3 sm:px-4 py-1 w-[350px] md:w-[400px] text-white text-[15px] md:text-[16px] leading-[23px] md:leading-[24px]">
    You have a new salon invitation!{" "}
    <span className="font-bold underline cursor-pointer">Click Here</span>
  </div>
</div>


<div className="mt-7 rounded-[12px] bg-white border border-[#F3F4F6] shadow-[0_4px_6px_#0000000D] w-full max-w-full p-6">
      <div className="flex gap-6 overflow-x-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex-1 min-w-[320px] max-w-[380px] rounded-[12px] border border-[#F3F4F6] bg-white shadow-[0_4px_6px_#0000000D] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaGift size={20} className="text-[#FF92A5]" />
                <span className="text-[18px] font-semibold text-[#581838]">
                  Recent Gifts
                </span>
              </div>
              <span className="text-[14px] font-medium text-[#9CA3AF] underline cursor-pointer">
                View All
              </span>
            </div>

            <div className="h-[1px] bg-[#D9D9D9] mb-3"></div>

            <div className="p-3 border border-[#0000001A] rounded-[10px] flex items-center justify-between">
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
                    Sarah Johnson
                  </p>
                  <p className="text-[12px] text-[#4B5563]/70">
                    Luxury Spa Package • $85
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[#FF9500] font-semibold text-[10px] bg-[#FF950033] rounded-[4px] px-2 py-[2px]">
                  Completed
                </p>
                <p className="text-[10px] text-[#00000080] mt-1">
                  2 days ago
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>


      </div>
  )
}

export default DashboardHome