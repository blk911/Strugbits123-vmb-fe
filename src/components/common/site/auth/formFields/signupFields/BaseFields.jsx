import React from "react";
import CheckboxField from "../../../../dashboard/CheckboxField";
import signupFieldsConfig from "./SignupFieldsConfig";
import TextField from "../../../../dashboard/TextField";
import RadioField from "../../../../dashboard/RadioField";

function BaseFields({ values, onChange }) {
    return (
        <>
            {signupFieldsConfig.map((field, i) => {
                switch (field.name) {
                    case "role":
                        return (
                            <>
                                <RadioField
                                    label={field.label}
                                    options={field.options}
                                    divClass="!flex-row"
                                    classes="!rounded-full !bg-white"
                                    value={values[field.name] || "Customer"}
                                    onChange={(val) => onChange(field.name, val)}
                                />

                            </>
                        );
                    case "fullName":
                    case "email":
                    case "password":
                    case "confirmPassword":
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
        </>
    );
}

export default BaseFields;
