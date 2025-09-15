import React from 'react'
import crossIcon from '../../dashboardComponent/icons/cross.svg';
import TextField from '../../dashboardComponent/TextField';
import Button from '../../dashboardComponent/Button';
import mailIcon from '../../dashboardComponent/icons/mail.svg'
import { useDashboardModal } from '../../../pages/Dashboard/ModalProvider';

function QuickInvitesSection() {

    const {openModal} = useDashboardModal();
    
    return (
        <div className='w-full flex flex-col rounded-[12px] bg-white p-[26px] gap-y-[32px]'>
            <div className='w-full flex items-center justify-between border-b border-[#E5E7EB] pb-4'>
                <span
                    className="text-[18px] leading-[28px] font-poppins font-semibold text-[#581838]"
                    style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                    }}
                >
                    Quick Invites
                </span>

            </div>
            <TextField label='Send Email Invite' placeholder='client@example.com' classInput='!text-[18px] !rounded-[10px] ' />
            <Button text={"Send Invite"} onClick={() => openModal("invite")} icon={<svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.42188 0C1.59375 0 0.921875 0.671875 0.921875 1.5C0.921875 1.97187 1.14375 2.41562 1.52188 2.7L8.32188 7.8C8.67812 8.06563 9.16563 8.06563 9.52188 7.8L16.3219 2.7C16.7 2.41562 16.9219 1.97187 16.9219 1.5C16.9219 0.671875 16.25 0 15.4219 0H2.42188ZM0.921875 3.5V10C0.921875 11.1031 1.81875 12 2.92188 12H14.9219C16.025 12 16.9219 11.1031 16.9219 10V3.5L10.1219 8.6C9.40938 9.13438 8.43438 9.13438 7.72188 8.6L0.921875 3.5Z" fill="white" />
            </svg>
            } classes={'bg-[#FF92A5] gap-x-[12px]'} />
        </div>
    )
}

export default QuickInvitesSection
