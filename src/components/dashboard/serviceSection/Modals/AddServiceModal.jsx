import { DialogPanel, DialogTitle } from '@headlessui/react'
import Modal from '../../../dashboardComponent/Modal'
import { useDashboardModal } from '../../../../pages/Dashboard/ModalProvider'
import crossIcon from '../icons/cross.svg'
import TextField from '../../../dashboardComponent/TextField'
import SelectField from '../../../dashboardComponent/SelectField'
import TextAreaField from '../../../dashboardComponent/TextAreaField'
import Button from '../../../dashboardComponent/Button'

function AddServiceModal() {
    const { activeModal, closeModal } = useDashboardModal();

    const isOpen = activeModal === "addService";

    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className="w-full flex flex-col gap-y-[20px] sm:gap-y-[32px] lg:w-max transform overflow-hidden rounded-2xl bg-white p-6  text-left align-middle shadow-xl transition-all">
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
                <SelectField label='Service Name' option={["Select Service"]} classes={"!text-[#00000033] !appearance-none text-[#00000080]"} />
                {/* <div className='w-full flex flex-wrap gap-x-[36px] items-center'>
                     <TextField label='Service Price' name='price'/>
                    <SelectField label='Service Duration' name='serviceduration' />
                    <SelectField label='Service Category' name='servicecategory' />
                </div> */}
                 <div className='w-full grid grid-col-2 sm:grid-cols-3 gap-y-[10px] items-center gap-x-[36px]'>
                     <TextField label='Service Price' name='price' placeholder='Price' classInput='placeholder:text-[#00000080] !text-sm'/>
                    <SelectField label='Service Duration' option={["01 Hr - 02Hr"]} classes='h-[48px] text-[#00000080]' />
                    <SelectField label='Service Category' name='servicecategory' option={["Hair Cutting"]} classes='h-[48px] text-[#00000080]'/>
                </div>
                <TextAreaField classes={"!text-[16px]"}/>
                <Button 
                text="Add Service"
                classes={"w-[160px] self-end"}
                />
            </DialogPanel>
        </Modal>
    );
}

export default AddServiceModal