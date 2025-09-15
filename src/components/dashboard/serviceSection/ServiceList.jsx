import React from 'react'
import editIcon from './icons/edit.svg'
import deleteIcon from './icons/delete.svg'
import temp from './icons/temp.svg'

function ServiceList() {

    return (
        <div className='w-full'>
            <div className='w-full rounded-[10px] flex items-center justify-between bg-[#FF92A51A] py-[16px] px-[20px]'>
                <div className='flex max-sm:flex-col items-center gap-x-[12px] max-sm:gap-y-[10px]'>
                    <div className='rounded-[8px]  flex max-sm:self-start  justify-center items-center border-1 border-[#E5E7EB] bg-white h-[40px] px-[12px]'>
                        <img src={temp} alt="Edit" />
                    </div>
                    <div className='flex flex-col'>
                        <span
                            className="max-xl:text-[16px] text-[#581838] xl:text-[18px] max-xl:leading-[20px]"
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 500,
                            }}
                        >
                            Hair Cut & Style
                        </span>
                        <span
                            className="max-xl:text-[14px] text-[#581838] xl:text-[16px] max-xl:leading-[20px]"
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 400,
                            }}
                        >
                            60 min • $45
                        </span>
                    </div>
                </div>

                <div className='flex w-[90px] items-center  gap-x-[11px]'>
                    <div className='w-full h-[36px] flex items-center justify-center rounded-[5px] bg-white'>
                        <img src={editIcon} alt="Edit" className='cursor-pointer' />
                    </div>
                    <div className='w-full h-[36px] flex items-center justify-center rounded-[5px] bg-white'>
                        <img src={deleteIcon} alt="Delete" className='cursor-pointer' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceList