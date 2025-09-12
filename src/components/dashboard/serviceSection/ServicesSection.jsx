import React from 'react'
import Button from '../../dashboardComponent/Button'
import ServiceList from './ServiceList'
import { useDashboardModal } from '../../../pages/Dashboard/ModalProvider';


function ServicesSection() {
    const { openModal } = useDashboardModal();

    return (
        <div className='w-full flex flex-col px-[35px] py-[35px] bg-white rounded-[12px] gap-y-[40px]'>
            <div className='w-full flex justify-between items-center'>
                <span
                className="max-xl:text-[18px] text-[#581838] xl:text-[21px] max-xl:leading-[20px]"
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                }}
            >
                Services
            </span>
            <Button onClick={() => openModal("addService")} text="Add Services" icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.58252 0.9375C6.58252 0.453516 6.1915 0.0625 5.70752 0.0625C5.22354 0.0625 4.83252 0.453516 4.83252 0.9375V4.875H0.89502C0.411035 4.875 0.0200195 5.26602 0.0200195 5.75C0.0200195 6.23398 0.411035 6.625 0.89502 6.625H4.83252V10.5625C4.83252 11.0465 5.22354 11.4375 5.70752 11.4375C6.1915 11.4375 6.58252 11.0465 6.58252 10.5625V6.625H10.52C11.004 6.625 11.395 6.23398 11.395 5.75C11.395 5.26602 11.004 4.875 10.52 4.875H6.58252V0.9375Z" fill="white" />
            </svg>
            } />
            </div>
            <ServiceList />
            <ServiceList />
            <ServiceList />
            <ServiceList />
            <ServiceList />
            <ServiceList />

        </div>
    )
}

export default ServicesSection