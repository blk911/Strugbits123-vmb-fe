import React from 'react'
import { DialogPanel, DialogTitle } from '@headlessui/react'
import { useDashboardModal } from '../../../../../pages/ModalProvider';
import Modal from '../../../../common/dashboard/Modal';
import Button from '../../../../common/dashboard/Button';
import crossIcon from '../../../../common/dashboard/icons/cross.svg';
import ProfileAvatar from '../../../../common/dashboard/ProfileAvatar';
import TextField from '../../../../common/dashboard/TextField';

function EditAdminProfile() {
    const { activeModal, closeModal } = useDashboardModal();
    const isOpen = activeModal === "editAdminProfile";

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className="w-full flex flex-col gap-y-[32px] lg:w-[400px] transform overflow-hidden rounded-2xl bg-white p-6  text-left align-middle shadow-xl transition-all">
                <div className='w-full flex items-center justify-between'>
                    <span
                        className="max-xl:text-[24px] text-[#581838] xl:text-[26px] max-xl:leading-[20px]"
                        style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                        }}
                    >
                        Profile Settings
                    </span>
                    <img src={crossIcon} alt="Close" className="cursor-pointer" onClick={closeModal} />
                </div>

                <ProfileAvatar title="Personal Information" name={"Sarah Johnson"} status={"Salon Owner"}>
                    <TextField
                        label='Full Name'
                        placeholder='Sarah Johnson'
                    />
                    <TextField
                        label='Email'
                        placeholder='sarah@glamsalon.com'
                        type='email'
                    />
                    <TextField
                        label='Phone'
                        placeholder='+1 (555) 123-4567'
                    />

                </ProfileAvatar>
                <Button
                    text="Update Profile"
                    classes={'self-end sm:w-[180px] w-full '}
                />
            </DialogPanel>
        </Modal>
    )
}

export default EditAdminProfile