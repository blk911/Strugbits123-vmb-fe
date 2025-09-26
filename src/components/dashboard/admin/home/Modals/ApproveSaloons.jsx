import { DialogPanel, DialogTitle } from '@headlessui/react'
import Modal from '../../../../common/dashboard/Modal'
import { useDashboardModal } from '../../../../../pages/ModalProvider'
import crossIcon from '../../../../common/dashboard/icons/cross.svg'
import TextField from '../../../../common/dashboard/TextField'
import TextAreaField from '../../../../common/dashboard/TextAreaField'
import Button from '../../../../common/dashboard/Button'
import Fileupload from '../../../../common/dashboard/Fileupload'
import ProfileAvatar from '../../../../common/dashboard/ProfileAvatar'
import CheckboxField from '../../../../common/dashboard/CheckboxField'
import SelectField from '../../../../common/dashboard/SelectField'

function ApproveSaloons() {
    const { activeModal, closeModal } = useDashboardModal();
    const isOpen = activeModal === "approveSaloons";

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

                    <ProfileAvatar title={"Salon Information"} name={"Glam Beauty Salon"} nameClass={"!text-[26px]"} profileClass={"!rounded-[8px]"}>
                        <TextField
                            label='Salon Name'
                            placeholder='Sarah Johnson'
                        />
                        <TextField
                            label='Address'
                            placeholder='sarah.johnson@example.com'
                        />

                        <div className='w-full flex max-lg:flex-col gap-x-[18px] gap-y-[18px]'>
                            <TextField
                                label='Phone Number'
                                placeholder='+1 234 567 890'
                            />
                            <CheckboxField />
                        </div>
                        <div className='w-full grid grid-cols-2 gap-x-[18px]'>
                            <SelectField label='Timing' classes='min-h-[50px]' mainIcon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0ZM7.25 3.75V8C7.25 8.25 7.375 8.48438 7.58437 8.625L10.5844 10.625C10.9281 10.8562 11.3938 10.7625 11.625 10.4156C11.8562 10.0687 11.7625 9.60625 11.4156 9.375L8.75 7.6V3.75C8.75 3.33437 8.41562 3 8 3C7.58437 3 7.25 3.33437 7.25 3.75Z" fill="#FF92A5" />
                            </svg>
                            } />
                            <SelectField label='Working Days' classes='min-h-[50px]' mainIcon={<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1017_10022)">
                                    <path d="M9.43112 3.70381C11.4852 3.70381 13.5398 3.70814 15.5938 3.69948C15.8847 3.69824 16.0074 3.77803 15.985 4.08545C15.8193 6.36414 15.1896 8.47645 13.7578 10.3073C13.7516 10.3154 13.7447 10.3234 13.7391 10.3321C13.3 10.9692 12.7507 11.2506 11.9161 11.2388C8.24405 11.1875 4.57071 11.2166 0.897998 11.2166C0.784024 11.2166 0.669427 11.2184 0.555452 11.2141C0.32003 11.2054 0.122599 11.1201 0.0360285 10.8906C-0.0486737 10.6667 0.0210811 10.4743 0.191731 10.3024C1.65409 8.82592 2.39586 7.01361 2.68671 4.99408C2.73217 4.67862 2.782 4.36131 2.7901 4.04338C2.79757 3.7669 2.91902 3.69886 3.17437 3.70071C4.57507 3.70876 5.97577 3.70443 7.37647 3.70443C8.06094 3.70443 8.74603 3.70443 9.4305 3.70443L9.43112 3.70381Z" fill="#FF92A5" />
                                    <path d="M15.9414 8.38184C16.0274 8.46844 15.99 8.57607 15.99 8.67194C15.9925 10.2276 15.9925 11.7832 15.9912 13.3388C15.9912 13.8231 15.8243 13.9976 15.3423 13.9976C11.3899 13.9994 7.43755 14 3.48457 13.9976C2.99504 13.9976 2.81692 13.8089 2.81318 13.3165C2.81069 13.0073 2.82377 12.698 2.80944 12.3894C2.79761 12.1308 2.90909 12.0461 3.15946 12.0504C3.7611 12.0609 4.36273 12.0535 4.96437 12.0535C7.47492 12.0535 9.98547 12.0454 12.496 12.0597C13.0335 12.0628 13.4508 11.8859 13.8257 11.5123C14.6808 10.6599 15.308 9.66284 15.8063 8.57606C15.8386 8.50617 15.8405 8.41215 15.9402 8.38123L15.9414 8.38184Z" fill="#FF92A5" />
                                    <path d="M9.39883 2.86627C7.34417 2.86627 5.2889 2.86627 3.23425 2.86627C2.82568 2.86627 2.8151 2.85451 2.81323 2.44999C2.81198 2.16113 2.81011 1.87289 2.81323 1.58403C2.81883 1.1059 2.99509 0.92591 3.47029 0.922199C4.08252 0.917869 4.69474 0.914158 5.30696 0.924054C5.53242 0.927765 5.61774 0.852922 5.62086 0.622208C5.62522 0.225724 5.81891 0.00490613 6.12097 -4.21749e-05C6.42491 -0.00499048 6.63292 0.220158 6.63417 0.607981C6.63479 0.855397 6.72884 0.929621 6.96613 0.924054C7.49489 0.911683 8.0249 0.908591 8.55367 0.925291C8.82148 0.933951 8.94106 0.854159 8.90992 0.576436C8.88376 0.339535 8.97407 0.152118 9.20326 0.0488224C9.54456 -0.104575 9.89271 0.134181 9.87963 0.547983C9.86967 0.855397 9.98302 0.937662 10.2751 0.92591C10.7727 0.906117 11.271 0.920962 11.7692 0.920343C12.1828 0.920343 12.1878 0.920343 12.2071 0.507159C12.2177 0.288197 12.3123 0.136036 12.5116 0.0457297C12.7059 -0.0421028 12.8766 0.00985445 13.0304 0.13851C13.1718 0.256033 13.2042 0.41809 13.1861 0.587569C13.1587 0.843644 13.2634 0.931477 13.5212 0.925291C14.1023 0.911065 14.6834 0.919725 15.2645 0.920962C15.8406 0.922199 15.9894 1.06756 15.9907 1.62733C15.9913 1.90567 15.9726 2.18525 15.9956 2.46174C16.0212 2.77163 15.9116 2.87554 15.5933 2.87183C14.3271 2.85699 13.061 2.86565 11.7948 2.86565C10.9957 2.86565 10.1966 2.86565 9.39758 2.86565L9.39883 2.86627Z" fill="#FF92A5" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1017_10022">
                                        <rect width="16" height="14" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            } />
                        </div>
                        <Fileupload />
                    </ProfileAvatar>

                </div>
                <div className='flex self-end gap-x-[10px]'>
                    <Button
                        icon={<svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.61807 1.86807C8.95986 1.52627 8.95986 0.971191 8.61807 0.629395C8.27627 0.287598 7.72119 0.287598 7.3794 0.629395L4.5001 3.51143L1.61807 0.632129C1.27627 0.290332 0.721191 0.290332 0.379395 0.632129C0.0375976 0.973926 0.0375976 1.529 0.379395 1.8708L3.26143 4.7501L0.382129 7.63213C0.0403321 7.97393 0.0403321 8.52901 0.382129 8.8708C0.723926 9.2126 1.279 9.2126 1.6208 8.8708L4.5001 5.98877L7.38213 8.86807C7.72393 9.20986 8.27901 9.20986 8.6208 8.86807C8.9626 8.52627 8.9626 7.97119 8.6208 7.6294L5.73877 4.7501L8.61807 1.86807Z" fill="white" />
                        </svg>
                        }
                        text="Reject"
                        textClasses={"lg:!text-[14px]"}
                    />
                    <Button

                        icon={<svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.7431 0.63208C13.0849 0.973877 13.0849 1.52895 12.7431 1.87075L5.74307 8.87075C5.40127 9.21255 4.84619 9.21255 4.50439 8.87075L1.00439 5.37075C0.662598 5.02896 0.662598 4.47388 1.00439 4.13208C1.34619 3.79028 1.90127 3.79028 2.24307 4.13208L5.1251 7.01138L11.5071 0.63208C11.8489 0.290283 12.404 0.290283 12.7458 0.63208H12.7431Z" fill="#581838" />
                        </svg>
                        }
                        text="Approve"
                        classes={' !bg-white border-1 border-[#581838]'}
                        textClasses={"!text-[#581838] lg:!text-[14px]"}
                    />
                </div>

            </DialogPanel>
        </Modal>
    )
}

export default ApproveSaloons