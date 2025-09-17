import React from 'react'
import profile from '../../../assets/dashboard/profile.jpg'
import Button from '../../../components/dashboardComponent/Button'

function ButtonsList() {
    return (
        <>
            <div className='flex gap-x-[12px]'>
                <Button
                    text={"View"}
                    classes={"bg-white"}
                    textClasses={"!text-[#581838]"}
                    icon={<svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_663_4146)">
                            <path d="M10.8033 0.500055C13.0454 0.522514 15.1203 1.45213 17.0454 2.77723C18.4435 3.75816 19.701 4.91085 20.7856 6.20568C21.2085 6.69978 21.2452 7.26029 20.8467 7.72705C19.1204 9.74936 17.1351 11.4709 14.6383 12.5968C11.8173 13.8662 9.0331 13.7803 6.26415 12.4386C3.93546 11.3088 2.05519 9.66245 0.417458 7.74365C0.228336 7.53929 0.123901 7.27563 0.123901 7.0025C0.123901 6.72937 0.228336 6.4657 0.417458 6.26134C2.21621 4.16287 4.29011 2.38761 6.91231 1.28125C8.13762 0.761787 9.46344 0.495605 10.8033 0.500055ZM15.4291 7.01128C15.4257 5.79411 14.9215 4.62734 14.0259 3.76411C13.1303 2.90088 11.9156 2.41084 10.6454 2.4003C8.02112 2.3837 5.85548 4.43921 5.82083 6.97222C5.78618 9.50524 7.98239 11.6115 10.6301 11.6115C11.901 11.6046 13.1177 11.1176 14.0162 10.2564C14.9147 9.39511 15.4224 8.22903 15.4291 7.01128Z" fill="#581838" />
                            <path d="M10.6454 3.72046C11.3226 3.72393 11.9837 3.9196 12.545 4.28277C13.1063 4.64593 13.5427 5.16031 13.7991 5.76095C14.0556 6.36159 14.1205 7.02157 13.9858 7.65756C13.8511 8.29355 13.5227 8.87703 13.0422 9.33435C12.5616 9.79166 11.9505 10.1023 11.2858 10.227C10.6211 10.3518 9.9328 10.285 9.30771 10.0352C8.68261 9.78542 8.14877 9.36375 7.77359 8.82345C7.39841 8.28316 7.19871 7.64847 7.19971 6.99951C7.20696 6.12811 7.57306 5.29471 8.21834 4.68063C8.86362 4.06654 9.73589 3.72146 10.6454 3.72046ZM9.0433 6.72316C9.21757 6.70949 9.44178 6.78566 9.55286 6.59817C9.70377 6.34763 9.92149 6.14004 10.1837 5.99665C10.4619 5.82968 10.3814 5.48107 10.2785 5.2389C10.1827 5.01235 9.91567 5.10707 9.73528 5.1764C9.4807 5.26798 9.25194 5.41524 9.06722 5.60647C8.88251 5.79769 8.74695 6.0276 8.67132 6.27788C8.55514 6.6177 8.64075 6.78273 9.04126 6.72316H9.0433Z" fill="#581838" />
                        </g>
                        <defs>
                            <clipPath id="clip0_663_4146">
                                <rect width="21" height="13" fill="white" transform="translate(0.125 0.5)" />
                            </clipPath>
                        </defs>
                    </svg>
                    }
                />
                <Button
                    text={"Approve"}
                    classes={"bg-white"}
                    textClasses={"!text-[#581838]"}
                    icon={<svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.1179 0.63208C12.4597 0.973877 12.4597 1.52895 12.1179 1.87075L5.11794 8.87075C4.77615 9.21255 4.22107 9.21255 3.87927 8.87075L0.379272 5.37075C0.0374756 5.02896 0.0374756 4.47388 0.379272 4.13208C0.721069 3.79028 1.27615 3.79028 1.61794 4.13208L4.49998 7.01138L10.882 0.63208C11.2238 0.290283 11.7789 0.290283 12.1207 0.63208H12.1179Z" fill="#581838" />
                    </svg>
                    }
                />
                <Button
                    text={"Reject"}
                    classes={"bg-[#FF92A5]"}
                    icon={<svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.74295 1.86807C9.08474 1.52627 9.08474 0.971191 8.74295 0.629395C8.40115 0.287598 7.84607 0.287598 7.50427 0.629395L4.62498 3.51143L1.74294 0.632129C1.40115 0.290332 0.846069 0.290332 0.504272 0.632129C0.162476 0.973926 0.162476 1.529 0.504272 1.8708L3.3863 4.7501L0.507007 7.63213C0.16521 7.97393 0.16521 8.52901 0.507007 8.8708C0.848804 9.2126 1.40388 9.2126 1.74568 8.8708L4.62498 5.98877L7.50701 8.86807C7.8488 9.20986 8.40388 9.20986 8.74568 8.86807C9.08748 8.52627 9.08748 7.97119 8.74568 7.6294L5.86365 4.7501L8.74295 1.86807Z" fill="white" />
                    </svg>
                    }
                />
            </div>
        </>
    )
}

function Lists() {
    return (
        <>
            <div className='w-full flex max-lg:flex-col max-lg:gap-y-[20px] p-[20px] gap-x-[10px] justify-between items-center rounded-[10px] bg-[#FF92A533]'>

                <div className='flex items-center gap-x-[16px] max-lg:self-start'>
                    <div
                        className="h-[50px] w-[50px] rounded-full overflow-hidden cursor-pointer"
                        style={{
                            backdropFilter: "blur(10px)",
                            borderBottom: "1px solid #E5E7EB",
                        }}
                    // onClick={toggle}
                    >
                        <img src={profile} alt="profile" className="h-full w-full" />
                    </div>

                    <div className='flex flex-col'>
                        <span
                            className="max-xl:text-[16px] text-[#581838] xl:text-[18px] max-xl:leading-[20px]"
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                            }}
                        >
                            Marcus Johnson
                        </span>
                        <span
                            className="max-xl:text-[14px] text-[#4B5563] xl:text-[16px] max-xl:leading-[20px]"
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 400,
                            }}
                        >
                            Elite Hair Studio • New York
                        </span>
                        <span
                            className="max-xl:text-[12px] text-[#6B7280] xl:text-[14px] max-xl:leading-[20px]"
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 400,
                            }}
                        >
                            Applied 2 days ago
                        </span>
                    </div>

                </div>


                <div>
                    <ButtonsList />
                </div>
            </div>
        </>
    )
}

function SaloonRequests() {

    return (
        <div className='w-full bg-white rounded-[12px]'>
            <div className='w-full border-b p-[24px] border-[#E5E7EB]'>
                <span
                    className="max-xl:text-[18px] text-[#581838] xl:text-[21px] max-xl:leading-[20px]"
                    style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                    }}
                >
                    Pending Salon Owner Requests
                </span>
            </div>

            <div className='flex flex-col gap-y-[10px] px-[39px] py-[20px]'>
                <Lists />
                <Lists />
                <Lists />
                <Lists />
                <Lists />
                <Lists />
                <Lists />
            </div>
        </div>
    )
}

export default SaloonRequests