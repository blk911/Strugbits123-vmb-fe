import React from 'react'
import TextField from '../../../../dashboard/TextField'
import SelectField from '../../../../dashboard/SelectField'
import signupFieldsConfig from './SignupFieldsConfig'
import TextAreaField from '../../../../dashboard/TextAreaField'
import CheckboxField from '../../../../dashboard/CheckboxField'
import Fileupload from '../../../../dashboard/Fileupload'
import FileUploadButton from '../../../../dashboard/FileUploadButton'
import { useSelector } from 'react-redux'

function SaloonFields({ values, onChange }) {

    const { nextState } = useSelector((state) => state.auth);
    // filter only visible fields once
    const visibleFields = signupFieldsConfig.filter(
        (field) => !field.showIf || (nextState && field.showIf(values))
    );

    return (
        <>
            {/* Text fields */}
            {visibleFields.map((field, i) => {
                switch (field.name) {
                    case "salonName":
                    case "salonAddress":
                    case "phone":
                        return (
                            <TextField
                                key={i}
                                label={field.label}
                                placeholder={field.placeholder}
                                classInput='border-1 border-[#FF92A5] !w-full !rounded-[50px] !text-[16px] !pl-[40px]'
                                type={field.type}
                                icon={field?.icon}
                                onChange={(e) => onChange(field.name, e.target.value)}
                            />
                        );
                    default:
                        return null;
                }
            })}

            {/* Grid select fields */}
            <div className='grid grid-cols-3 gap-x-[10px]'>
                {visibleFields.map((field, i) => {
                    switch (field.name) {
                        case "startTime":
                        case "endTime":
                        case "workingDays":
                            return (
                                <SelectField
                                    key={i}
                                    label={field.label}
                                    option={field.options}
                                    mainIcon={field?.icon}
                                    value={values[field.name]}
                                    onChange={(val) => onChange(field.name, val)}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </div>

            {/* About field */}
            {visibleFields.map((field, i) => {
                switch (field.name) {

                    case "salonType":
                        return (
                            <CheckboxField
                                key={i}
                                label={field.label}
                                divClass="!flex-row"
                                options={field.options}
                                tickIcon={field.icon}
                                value={values[field.name]}                    // controlled value
                                onChange={(val) => onChange(field.name, val)} // update parent/global
                            />
                        )
                    case "description":
                        return (
                            <TextAreaField
                                key={i}
                                label={field.label}
                                placeholder={field.placeholder}
                                onChange={(e) => onChange(field.name, e.target.value)}
                            />
                        );
                    default:
                        return null;
                }
            })}

            {visibleFields.map((field, i) => {
                switch (field.name) {

                    case "profile":
                        return (
                            <div key={i} className='flex items-center justify-between'>
                                <span
                                    className="max-xl:text-[16px] text-[#374151] xl:text-[18px] max-xl:leading-[30px]"
                                    style={{
                                        fontFamily: "Poppins, sans-serif",
                                        fontWeight: 600,
                                    }}
                                >
                                    {field?.label}
                                </span>

                                <FileUploadButton
                                    classes={"!bg-[#FF92A54D]"}
                                    textClasses={"!text-[#FF92A5]"}
                                    text={field?.btnText}
                                    icon={field?.btnIcon}
                                />

                            </div>
                        )
                    case "salonPhotos":
                        return (
                            <Fileupload />
                        )

                    default:
                        return null;
                }
            })}
        </>
    );
}

export default SaloonFields
