import React from "react";
import BaseFields from "./formFields/signupFields/BaseFields";
import SaloonFields from "./formFields/signupFields/SaloonFields";

function SignupForm({ values, onChange }) {
    return (
        <div className="w-full flex flex-col gap-y-[16px]">
            {/* {signupFields.map((field, i) => {
                if (field.showIf && !field.showIf(values)) return null; // conditional rendering

                switch (field.type) {
                    case "checkbox":
                        return (
                            <CheckboxField
                                key={i}
                                label={field.label}
                                divClass="!flex-row"
                                classes="!rounded-full !bg-white"
                                options={field.options}
                                tickIcon={field.icon}
                                value={values[field.name]}                    // 👈 controlled value
                                onChange={(val) => onChange(field.name, val)} // 👈 update parent/global
                            />
                        );
                    case "text":
                    case "email":
                    case "password":
                    case "tel":
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
                    case "select":
                        return (
                            <div key={i} className={""}>
                                <SelectField
                                    label={field.label}
                                    option={field.options}
                                    mainIcon={field?.icon}
                                    value={values[field.name]}
                                    onChange={(val) => onChange(field.name, val)}
                                />
                            </div>
                        );
                    case "textarea":
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
            })} */}

            <BaseFields values={values} onChange={onChange} />
            <SaloonFields values={values} onChange={onChange} />

        </div>
    );
}



export default SignupForm;
