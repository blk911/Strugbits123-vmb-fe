import React from 'react'
import { DialogPanel, DialogTitle } from '@headlessui/react'
import Modal from '../../../dashboardComponent/Modal'
import { useDashboardModal } from '../../../../pages/Dashboard/ModalProvider'
import crossIcon from '../../../dashboardComponent/icons/cross.svg'
import qrIcon from '../icons/qr.svg';
import sendMailIcon from '../icons/sendMail.svg'
import Button from '../../../dashboardComponent/Button'


function InviteModal() {
    const { activeModal, closeModal } = useDashboardModal();

    const isOpen = activeModal === "invite";


    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className="w-full sm:w-max flex flex-col gap-y-[10px] lg:w-max transform overflow-hidden rounded-2xl bg-white p-2 text-left align-middle shadow-xl transition-all">
                <div className='w-full flex p-1'>
                    <img src={crossIcon} alt="" className='ml-auto cursor-pointer' onClick={() => closeModal("invite")} />
                </div>
                <div className='flex gap-x-[12px] justify-center pb-6 px-6 '>
                    <div className='flex flex-col gap-y-[23px]  '>
                        <div className='bg-[#FF92A51A] rounded-[8px] flex justify-center items-center border-1 border-[#FF92A5] py-[23px] h-[120px]'>
                            <img src={qrIcon} alt="" />

                        </div>
                        <Button
                            text='Download QR'
                            classes={'bg-[#FF92A5] py-[15px]'}
                            icon={<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.5 1.5C9.5 0.946875 9.05313 0.5 8.5 0.5C7.94688 0.5 7.5 0.946875 7.5 1.5V9.08438L5.20625 6.79063C4.81563 6.4 4.18125 6.4 3.79063 6.79063C3.4 7.18125 3.4 7.81563 3.79063 8.20625L7.79063 12.2063C8.18125 12.5969 8.81563 12.5969 9.20625 12.2063L13.2063 8.20625C13.5969 7.81563 13.5969 7.18125 13.2063 6.79063C12.8156 6.4 12.1812 6.4 11.7906 6.79063L9.5 9.08438V1.5ZM2.5 11.5C1.39688 11.5 0.5 12.3969 0.5 13.5V14.5C0.5 15.6031 1.39688 16.5 2.5 16.5H14.5C15.6031 16.5 16.5 15.6031 16.5 14.5V13.5C16.5 12.3969 15.6031 11.5 14.5 11.5H11.3281L9.9125 12.9156C9.13125 13.6969 7.86562 13.6969 7.08437 12.9156L5.67188 11.5H2.5ZM14 13.25C14.1989 13.25 14.3897 13.329 14.5303 13.4697C14.671 13.6103 14.75 13.8011 14.75 14C14.75 14.1989 14.671 14.3897 14.5303 14.5303C14.3897 14.671 14.1989 14.75 14 14.75C13.8011 14.75 13.6103 14.671 13.4697 14.5303C13.329 14.3897 13.25 14.1989 13.25 14C13.25 13.8011 13.329 13.6103 13.4697 13.4697C13.6103 13.329 13.8011 13.25 14 13.25Z" fill="white" />
                            </svg>
                            }
                        />
                    </div>
                    <div className='flex flex-col gap-y-[23px] '>
                        <div className='bg-[#5818381A] rounded-[8px] flex justify-center items-center border-1 border-[#581838] py-[23px] h-[120px]'>
                            <img src={sendMailIcon} alt="" />

                        </div>
                        <Button
                            text='Send Via Email'
                            classes={'!bg-[#581838] py-[15px]'}

                            icon={<svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 0C1.17188 0 0.5 0.671875 0.5 1.5C0.5 1.97187 0.721875 2.41562 1.1 2.7L7.9 7.8C8.25625 8.06563 8.74375 8.06563 9.1 7.8L15.9 2.7C16.2781 2.41562 16.5 1.97187 16.5 1.5C16.5 0.671875 15.8281 0 15 0H2ZM0.5 3.5V10C0.5 11.1031 1.39688 12 2.5 12H14.5C15.6031 12 16.5 11.1031 16.5 10V3.5L9.7 8.6C8.9875 9.13438 8.0125 9.13438 7.3 8.6L0.5 3.5Z" fill="white" />
                            </svg>

                            }
                        />
                    </div>
                </div>
            </DialogPanel>
        </Modal>
    )
}

export default InviteModal