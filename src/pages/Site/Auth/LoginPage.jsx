import React from 'react'
import TextField from '../../../components/common/dashboard/TextField'
import SigninForm from '../../../components/common/site/auth/SigninForm'

function LoginPage({values, onChange}) {
    return (
        <div className='w-full flex flex-col gap-y-[12px]'>
           <SigninForm values={values} onChange={onChange}/>
        </div>
    )
}

export default LoginPage