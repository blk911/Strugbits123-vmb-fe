import { Select } from '@headlessui/react'

function SelectField({
    label = "Service Name",
    name = "full_name",
    classes=""
}) {
    return (
        <div className='flex flex-col gap-y-[8px]'>
            <label
                htmlFor={name}
                className="text-[14px] lg:text-[16px] font-poppins font-medium text-[#404040]"
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    lineHeight: "20px",
                }}
            >
                {label}
            </label>
            <Select
                name={name}
                className={`border border-[#E5E5E5] h-12 px-[12px] focus:ring-0 focus: rounded-md text-[14px] font-poppins text-[#00000080] ${classes}`}
            >
                <option value="services">01 Hr - 02Hr</option>
            </Select>

        </div>

    )
}

export default SelectField