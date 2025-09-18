import React, { useState } from 'react'
import Table from '../../../components/common/dashboard/Table/Table';
import GiftsTable from '../../../components/dashboard/admin/gifts/GiftsTable';
import Button from '../../../components/common/dashboard/Button';
import { CellRenderers } from '../../../components/dashboard/admin/gifts/CellRenderers';


const invitesData = [
    {
        id: 1,
        ownerName: "Juan Elite",
        salonName: "Glam Studio",
        phone: "+123-456-78900",
        email: "elitejuan@gmail.com",
        address: "New York",
        status: "Active",
        actions: true,
    },
    {
        id: 2,
        ownerName: "Maria Style",
        salonName: "Beauty Hub",
        phone: "+321-456-78900",
        email: "maria@gmail.com",
        address: "Los Angeles",
        status: "Suspended",
        actions: true,
    },
];

const giftsData = [
    {
        id: 1,
        customerName: "Awais",
        giftedServices: ["Hair ","Body Massage","Nail Painting","Facial","Spa"],
        email: "elitejuan@gmail.com",
        dateGifted: "02-08-2025",
        price: "$120",
        status: "Suspended",
        actions: true,
    },
    {
        id: 2,
        customerName: "Anas",
        giftedServices: ["Hair Color","Body Massage","Nail Painting"],
        email: "elitejuan@gmail.com",
        dateGifted: "02-08-2025",
        price: "$120",
        status: "Suspended",
        actions: true,
    },
    {
        id: 2,
        customerName: "Anas",
        giftedServices: ["Hair Color","Body Massage","Nail Painting"],
        email: "elitejuan@gmail.com",
        dateGifted: "02-08-2025",
        price: "$120",
        status: "Suspended",
        actions: true,
    },
];

const tabs = {
    invites: invitesData,
    gifts: giftsData,
};

function Gifts() {

    const [activeTab, setActiveTab] = useState("invites");

    const handleActionClick = (id) => {
        console.log(`Action clicked for row ${id}`);
    }

    return (
        <div className='w-full flex flex-col gap-y-[31px] p-6 bg-[#EFEFEF] h-screen'>
            <div className='w-full'>
                <div className="flex flex-col gap-y-[10px] ">
                    <span
                        className="max-xl:text-[30px] text-[#581838] xl:text-[30px] max-xl:leading-[30px]"
                        style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 700,
                        }}
                    >
                        Invites & Gits
                    </span>
                    <span
                        className="max-xl:text-[14px] text-[#4B5563] xl:text-[16px] max-xl:leading-[20px]"
                        style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                        }}
                    >
                        Manage your salon efficiently
                    </span>
                </div>
            </div>

            <div className='w-full'>
                <GiftsTable data={tabs[activeTab]}
                    onActionClick={(id) => console.log("Action on", id)}
                    cellRenderers={CellRenderers}
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                />

            </div>
        </div>
    )
}

export default Gifts