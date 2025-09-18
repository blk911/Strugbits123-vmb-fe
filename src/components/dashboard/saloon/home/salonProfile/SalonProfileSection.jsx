import React from 'react'
import editIcon from './icons/edit.svg'
import profile from './images/profile.png'
import locationIcon from './icons/location.svg'
import phoneIcon from './icons/phone.svg'
import clockIcon from './icons/clock.svg'
import ratingIcon from './icons/rating.svg'
import Button from '../../../../common/dashboard/Button'
import { useDashboardModal } from '../../../../../pages/ModalProvider';


function Lists() {

  return (
    <div className='w-full flex flex-col gap-y-[8px] my-[22px]'>
      <div className='flex gap-x-[14px]'>
        <img src={locationIcon} alt="" />
        <span
          className="text-[16px] leading-[28px] font-poppins font-semibold text-[#4B5563]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
        >
          123 Beauty Street, NY 10001
        </span>

      </div>
      <div className='flex gap-x-[14px]'>
        <img src={phoneIcon} alt="" />
        <span
          className="text-[16px] leading-[28px] font-poppins font-semibold text-[#4B5563]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
        >
          (555) 123-4567
        </span>

      </div>
      <div className='flex gap-x-[14px]'>
        <img src={clockIcon} alt="" />
        <span
          className="text-[16px] leading-[28px] font-poppins font-semibold text-[#4B5563]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
        >
          9:00 AM - 8:00 PM
        </span>

      </div>
      <div className='flex gap-x-[14px]'>
        <img src={ratingIcon} alt="" />
        <span
          className="text-[16px] leading-[28px] font-poppins font-semibold text-[#4B5563]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
          }}
        >
          4.8 (245 reviews)
        </span>

      </div>

    </div>
  )
}

function SalonProfileSection() {
  const { openModal } = useDashboardModal();
  return (
    <div className='w-full flex h-min flex-col gap-y-[16px] bg-white rounded-[12px] p-[25px]'>

      <div className='w-full flex items-center justify-between'>
        <span
          className="text-[18px] leading-[28px] font-poppins font-semibold text-[#581838]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
          }}
        >
          Salon Profile
        </span>

        <img src={editIcon} alt="Edit" className='cursor-pointer' onClick={() => openModal("editProfile")} />
      </div>

      <div className='w-full flex flex-col items-center justify-center gap-y-[10px]'>
        <div className='rounded-full w-[80px] h-[80px] overflow-hidden'>
          <img src={profile} alt="" className='w-full h-full' />
        </div>
        <div className='flex flex-col gap-y-[2px] items-center'>
          <span
            className="text-[20px]  font-poppins font-semibold text-[#581838]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Bella Beauty Salon
          </span>
          <span
            className="text-[14px] font-popspins font-semibold text-[#4B5563]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
            }}
          >
            Premium Hair & Beauty
          </span>
        </div>

        <Lists />

      </div>
      <Button
        onClick={() => openModal("editProfile")}
        text="Edit Profile"
      />
    </div>
  )
}

export default SalonProfileSection