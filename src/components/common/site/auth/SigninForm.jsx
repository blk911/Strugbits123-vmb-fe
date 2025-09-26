import React from 'react'
import signinFieldsConfig from './formFields/signinField/SigningFieldsConfig';
import TextField from '../../dashboard/TextField';

function SigninForm({onChange}) {
  return (
    <>
            {signinFieldsConfig.map((field, i) => {
                switch (field.name) {

                    case "email":
                    case "password":
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
  )
}

export default SigninForm