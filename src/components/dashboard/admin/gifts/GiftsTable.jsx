import React from 'react'
import Table from '../../../common/dashboard/Table/Table'

function GiftsTable({ data, onActionClick, cellRenderers, setActiveTab, activeTab }) {
  return (
    <>
      <div className='w-full rounded-[10px] bg-white p-[10px]'>
        <div className="flex gap-6 ">
          {["invites", "gifts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer pb-2 text-[20px] font-medium transition-colors ${activeTab === tab
                ? "text-[#FF92A5] border-b-2 border-[#FF92A5]"
                : "text-gray-400 hover:text-gray-600"
                }`}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <Table data={data} onActionClick={onActionClick} cellRenderers={cellRenderers} />
      </div>
    </>
  )
}

export default GiftsTable