import React from 'react'
import logo from "../../../assets/logo.png";
import Button from '../../../components/common/dashboard/Button';
import { useDispatch } from 'react-redux';
import { setAuthMode } from '../../../store/features/authSlice';


function FormHeader({mode}) {

    const dispatch = useDispatch();

    return (
        <div className='flex flex-col  items-center gap-4 py-2'>
            <div className="w-[162px] h-[104px]">
                <img src={logo} alt="logo" className="h-full w-full" />
            </div>

            <div className="w-max bg-[#FF92A566] rounded-xl flex gap-x-[10px] p-[7px]">
                <Button
                    text="Sign In"
                    textClasses={"!text-[#581838]"}
                    onClick={() => {
                        dispatch(setAuthMode("login"));
                    }}
                    icon={<svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="28" height="29" rx="14" fill="#581838" />
                        <path d="M16.6395 15.4491C15.3215 15.4491 14.0035 15.4491 12.6855 15.4491C11.51 15.4491 10.3345 15.4587 9.15898 15.4432C8.49808 15.4348 8.08943 15.1236 8.01124 14.628C7.91916 14.0462 8.40097 13.5974 9.16025 13.595C11.3851 13.5866 13.6112 13.5914 15.8361 13.5914C16.0619 13.5914 16.2876 13.5914 16.6786 13.5914C16.106 13.0228 15.6356 12.5572 15.1676 12.0915C15.0087 11.9335 14.8397 11.7815 14.6934 11.6127C14.2784 11.1387 14.2671 10.63 14.6518 10.2697C15.0516 9.89504 15.6482 9.90103 16.1098 10.3487C17.1226 11.3314 18.1265 12.3226 19.1002 13.3388C20.3047 14.5957 20.2972 14.6328 19.0939 15.8657C18.2237 16.7575 17.3383 17.6349 16.4503 18.5099C15.8739 19.0785 15.3089 19.1503 14.8611 18.7361C14.4134 18.3219 14.4487 17.7833 15.0478 17.2219C15.6141 16.6916 16.2435 16.2236 16.8451 15.7268C16.777 15.6347 16.7089 15.5413 16.6408 15.4491L16.6395 15.4491Z" fill="#FF92A5" />
                    </svg>}
                    classes={`!rounded-xl ${mode === "login" ? "!bg-white border-1 border-[#581838]" : "!bg-transparent"}`}
                />
                <Button
                    text="Sign Up"
                    textClasses={"!text-[#581838]"}
                    icon={<svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="28" height="29" rx="14" fill="#581838" />
                        <path d="M16.6395 15.4491C15.3215 15.4491 14.0035 15.4491 12.6855 15.4491C11.51 15.4491 10.3345 15.4587 9.15898 15.4432C8.49808 15.4348 8.08943 15.1236 8.01124 14.628C7.91916 14.0462 8.40097 13.5974 9.16025 13.595C11.3851 13.5866 13.6112 13.5914 15.8361 13.5914C16.0619 13.5914 16.2876 13.5914 16.6786 13.5914C16.106 13.0228 15.6356 12.5572 15.1676 12.0915C15.0087 11.9335 14.8397 11.7815 14.6934 11.6127C14.2784 11.1387 14.2671 10.63 14.6518 10.2697C15.0516 9.89504 15.6482 9.90103 16.1098 10.3487C17.1226 11.3314 18.1265 12.3226 19.1002 13.3388C20.3047 14.5957 20.2972 14.6328 19.0939 15.8657C18.2237 16.7575 17.3383 17.6349 16.4503 18.5099C15.8739 19.0785 15.3089 19.1503 14.8611 18.7361C14.4134 18.3219 14.4487 17.7833 15.0478 17.2219C15.6141 16.6916 16.2435 16.2236 16.8451 15.7268C16.777 15.6347 16.7089 15.5413 16.6408 15.4491L16.6395 15.4491Z" fill="#FF92A5" />
                    </svg>}
                    onClick={() => {
                        dispatch(setAuthMode("signup")); 
                    }}
                    classes={`!rounded-xl ${mode === "signup" ? "!bg-white border-1 border-[#581838]" : "!bg-transparent"}`}
                />
            </div>

        </div>
    )
}

export default FormHeader