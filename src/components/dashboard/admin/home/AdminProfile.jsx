import React from 'react'
import profile from '../../../../assets/dashboard/profile.jpg'
import cameraIcon from '../../../../components/common/dashboard/icons/camera.svg'
import TextField from '../../../common/dashboard/TextField'
import Button from '../../../common/dashboard/Button'


function AdminProfile() {
    return (
        <div className='w-full bg-white rounded-[12px] px-[39px] py-[20px]'>
            <div className='w-full border-b pb-[20px] border-[#E5E7EB]'>
                <span
                    className="max-xl:text-[18px] text-[#581838] xl:text-[21px] max-xl:leading-[20px]"
                    style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                    }}
                >
                    Admin Profile
                </span>
            </div>

            <div className='grid grid-cols-[80px_1fr] max-sm:grid-cols-1 gap-x-[24px] py-[20px] gap-y-[10px] '>
                <div className='h-[80px] max-sm:w-[80px] relative'>
                    <div className='rounded-full h-full w-full overflow-hidden'>
                        <img src={profile} alt="" />
                    </div>
                    <div className='rounded-full absolute bottom-0 right-0 h-[32px] w-[32px] bg-[#FF92A5] flex justify-center items-center'>
                        <img src={cameraIcon} alt="Camera" />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-x-[24px] gap-y-[16px]'>
                    <TextField
                        label='Full Name'
                        placeholder='Jessica Martinez'
                    />
                    <TextField
                        label='Email'
                        placeholder='jessica.admin@gmail.com'
                        type='email'
                    />
                    <TextField
                        label='Phone'
                        placeholder='+1 (555) 123-4567'
                    />
                    <TextField
                        label='Role'
                        placeholder='Super Admin'
                    />
                </div>
            </div>
            <div className='w-full flex justify-end py-[10px]'>
               <div className='flex gap-x-[10px]'>
                 <Button 
                text="Cancel"
                 classes={"bg-white border-1 border-[#D1D5DB]"}
                 textClasses={"!text-[#374151] "}
                />
                <Button 
                text="Save Changes"
                classes={"bg-[#FF92A5]"}
                />
               </div>
            </div>
        </div>
    )
}

export default AdminProfile