import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

function FormButton({ submit }) {

    const { mode, nextState, formValues } = useSelector((state) => state.auth);

    useEffect(() => { console.log("username and password is: ", formValues.email + formValues.password); }, [mode, formValues.email, formValues.password])

    return (
        <button
            onClick={(e) => { submit(e) }}
            className="group cursor-pointer flex items-center w-full bg-white hover:bg-[#FF92A5] border border-[#581838] text-[#4b0d23] font-semibold rounded-full px-1 py-2 overflow-hidden">
            <span className="ml-4 text-[#581838] w-full max-lg:text-[16px] text-[18px]"
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "medium",
                }}
            >{mode === "signup"
                ? ((formValues.role !== "Salon Owner" && nextState === false) ? "Sign up" : "Next")
                : "Sign in"}


            </span>

            {/* Circle container */}
            <span className="relative flex items-center self-baseline justify-center min-w-8 h-8 rounded-full bg-[#4b0d23] overflow-hidden">
                {/* First arrow (default, slides out right) */}
                <svg
                    width="14"
                    height="10"
                    className="absolute w-4 h-4 text-pink-400 transform transition-all duration-300 group-hover:translate-x-[80px]"
                    viewBox="0 0 14 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9.93284 6.0546C8.46838 6.0546 7.00392 6.0546 5.53945 6.0546C4.23335 6.0546 2.92724 6.06524 1.62113 6.04795C0.8868 6.03864 0.432746 5.69284 0.345859 5.14221C0.243557 4.49583 0.778893 3.99708 1.62254 3.99442C4.09461 3.98511 6.56808 3.99043 9.04015 3.99043C9.291 3.99043 9.54186 3.99043 9.97629 3.99043C9.34005 3.35868 8.81733 2.8413 8.29741 2.32393C8.12083 2.14837 7.93305 1.97946 7.77048 1.79193C7.30942 1.26525 7.29681 0.699998 7.72424 0.299666C8.16848 -0.116625 8.83134 -0.109975 9.34426 0.387447C10.4696 1.47938 11.5851 2.58062 12.667 3.7098C14.0053 5.1063 13.9969 5.14753 12.66 6.51744C11.693 7.50829 10.7092 8.48318 9.72263 9.45542C9.08219 10.0872 8.45437 10.167 7.95687 9.70679C7.45937 9.24661 7.49861 8.64811 8.16428 8.02433C8.79351 7.43514 9.49281 6.91511 10.1613 6.36316C10.0856 6.26075 10.0099 6.15701 9.93425 6.0546L9.93284 6.0546Z"
                        fill="#FF92A5"
                    />
                </svg>

                {/* Second arrow (starts left, slides in) */}
                <svg
                    width="14"
                    height="10"
                    className="absolute w-4 h-4 text-pink-400 transform -translate-x-[50px] transition-all duration-300 group-hover:translate-x-0"
                    viewBox="0 0 14 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9.93284 6.0546C8.46838 6.0546 7.00392 6.0546 5.53945 6.0546C4.23335 6.0546 2.92724 6.06524 1.62113 6.04795C0.8868 6.03864 0.432746 5.69284 0.345859 5.14221C0.243557 4.49583 0.778893 3.99708 1.62254 3.99442C4.09461 3.98511 6.56808 3.99043 9.04015 3.99043C9.291 3.99043 9.54186 3.99043 9.97629 3.99043C9.34005 3.35868 8.81733 2.8413 8.29741 2.32393C8.12083 2.14837 7.93305 1.97946 7.77048 1.79193C7.30942 1.26525 7.29681 0.699998 7.72424 0.299666C8.16848 -0.116625 8.83134 -0.109975 9.34426 0.387447C10.4696 1.47938 11.5851 2.58062 12.667 3.7098C14.0053 5.1063 13.9969 5.14753 12.66 6.51744C11.693 7.50829 10.7092 8.48318 9.72263 9.45542C9.08219 10.0872 8.45437 10.167 7.95687 9.70679C7.45937 9.24661 7.49861 8.64811 8.16428 8.02433C8.79351 7.43514 9.49281 6.91511 10.1613 6.36316C10.0856 6.26075 10.0099 6.15701 9.93425 6.0546L9.93284 6.0546Z"
                        fill="#FF92A5"
                    />
                </svg>
            </span>
        </button>

    )
}

export default FormButton