import { DialogPanel, DialogTitle } from '@headlessui/react'
import Modal from '../../../../../common/dashboard/Modal'
import { useDashboardModal } from '../../../../../../pages/ModalProvider'
import crossIcon from '../icons/cross.svg'
import TextField from '../../../../../common/dashboard/TextField'
import TextAreaField from '../../../../../common/dashboard/TextAreaField'
import Button from '../../../../../common/dashboard/Button'
import Fileupload from '../../../../../common/dashboard/Fileupload'
import ProfileAvatar from '../../../../../common/dashboard/ProfileAvatar'

function EditProfileModal() {
    const { activeModal, closeModal } = useDashboardModal();
    const isOpen = activeModal === "editProfile";

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className="w-full flex flex-col gap-y-[32px] lg:w-[830px] transform overflow-hidden rounded-2xl bg-white p-6  text-left align-middle shadow-xl transition-all">
                <div className='w-full flex items-center justify-between'>
                    <span
                        className="max-xl:text-[24px] text-[#581838] xl:text-[26px] max-xl:leading-[20px]"
                        style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                        }}
                    >
                        Add Service
                    </span>
                    <img src={crossIcon} alt="Close" className="cursor-pointer" onClick={closeModal} />
                </div>
                <div className='w-full flex max-sm:flex-col gap-y-[23px] gap-x-[23px]'>
                    <ProfileAvatar title={"Personal Information"} name={"Sarah Johnson"} status={"Salon Owner"}>
                        <TextField
                            label='Full Name'
                            placeholder='Sarah Johnson'
                        />
                        <TextField
                            label='Email'
                            placeholder='sarah.johnson@example.com'
                        />
                        <TextField
                            label='Phone Number'
                            placeholder='+1 234 567 890'
                        />
                    </ProfileAvatar>

                    <ProfileAvatar title={"Salon Information"} name={"Glam Beauty Salon"} status={"Upload Logo"}>
                        <TextField
                            label='Salon Name'
                            placeholder='Sarah Johnson'
                        />
                        <TextField
                            label='Address'
                            placeholder='sarah.johnson@example.com'
                        />
                        <TextField
                            label='Phone Number'
                            placeholder='+1 234 567 890'
                        />
                        <TextAreaField
                            label='Description'
                            placeholder='Write something about your salon...'
                        />
                        <Fileupload />
                    </ProfileAvatar>

                </div>
                <Button
                    text="Update Profile"
                    classes={'self-end sm:w-[180px] w-full '}
                />
            </DialogPanel>
        </Modal>
    )
}

export default EditProfileModal