import { DialogPanel, DialogTitle } from '@headlessui/react'
import Modal from '../../../dashboardComponent/Modal'
import { useDashboardModal } from '../../../../pages/Dashboard/ModalProvider'
import profile from '../images/profile.png'
import cameraIcon from '../icons/camera.svg'
import crossIcon from '../icons/cross.svg'
import TextField from '../../../dashboardComponent/TextField'
import SelectField from '../../../dashboardComponent/SelectField'
import TextAreaField from '../../../dashboardComponent/TextAreaField'
import Button from '../../../dashboardComponent/Button'
import Fileupload from '../../../dashboardComponent/Fileupload'

function ProfileAndSaloonInfo({ children, title, name, status }) {
    return (

        <div className='w-full flex flex-col gap-y-[20px]'>
            <span
                className="max-xl:text-[18px] text-[#581838] xl:text-[20px] max-xl:leading-[20px]"
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                }}
            >
                {title}
            </span>
            <div className='w-full flex gap-x-[20px] items-center'>
                <div className='h-[80px] w-[80px] relative'>
                    <div className='rounded-full h-full w-full overflow-hidden'>
                        <img src={profile} alt="" />
                    </div>
                    <div className='rounded-full absolute bottom-0 right-0 h-[32px] w-[32px] bg-[#FF92A5] flex justify-center items-center'>
                        <img src={cameraIcon} alt="Camera" />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <span
                        className="max-xl:text-[16px] text-[#581838] xl:text-[18px] max-xl:leading-[20px]"
                        style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                        }}
                    >
                        {name}
                    </span>
                    <span
                        className="max-xl:text-[16px] text-[#737373] xl:text-[18px] max-xl:leading-[20px]"
                        style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                        }}
                    >
                        {status}
                    </span>
                </div>
            </div>
            {children}
        </div>

    )
}

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
                    <ProfileAndSaloonInfo title={"Personal Information"} name={"Sarah Johnson"} status={"Salon Owner"}>
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
                    </ProfileAndSaloonInfo>

                    <ProfileAndSaloonInfo title={"Salon Information"} name={"Glam Beauty Salon"} status={"Upload Logo"}>
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
                    </ProfileAndSaloonInfo>

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