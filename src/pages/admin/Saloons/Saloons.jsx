import React from 'react'
import SaloonFilter from '../../../components/dashboard/admin/saloons/SaloonFilter'
import Table from '../../../components/common/dashboard/Table/Table'
import { CellRenderers } from '../../../components/dashboard/admin/saloons/CellRenderers';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../../../store/features/admin/listsSaloonSlice';

function Saloons() {

  const dispatch = useDispatch();

  const {data, filteredData, searchQuery} = useSelector((state)=> state.adminSaloons)

  const tableData = searchQuery ? filteredData : data;

  const handleActionClick = (id) => {
    console.log(`Action clicked for row ${id}`);
  };

  return (
    <div className='w-full flex flex-col gap-y-[31px] p-6 bg-[#EFEFEF] h-screen'>
      <SaloonFilter classes='w-full grid grid-cols-1 lg:grid-cols-[1fr_80%] gap-x-[30px] gap-y-[20px] items-center' searchQuery={searchQuery}>
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