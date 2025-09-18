import React from 'react'
import SaloonFilter from '../../../components/dashboard/admin/saloons/SaloonFilter'
import Table from '../../../components/common/dashboard/Table/Table'
import { CellRenderers } from '../../../components/dashboard/admin/saloons/CellRenderers';

function Saloons() {

  const tableData = [
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

  const handleActionClick = (id) => {
    console.log(`Action clicked for row ${id}`);
  };

  return (
    <div className='w-full flex flex-col gap-y-[31px] p-6 bg-[#EFEFEF] h-screen'>
      <SaloonFilter classes='w-full grid grid-cols-1 lg:grid-cols-[1fr_80%] gap-x-[30px] gap-y-[20px] items-center '>
        <div className="flex flex-col gap-y-[10px] ">
          <span
            className="max-xl:text-[30px] text-[#581838] xl:text-[30px] max-xl:leading-[30px]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
            }}
          >
            Listed Salons
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

      </SaloonFilter>
      <Table data={tableData} onActionClick={handleActionClick} cellRenderers={CellRenderers}/>
    </div>
  )
}

export default Saloons