import React from "react";
import Table from "../../../common/dashboard/Table/Table";

function AppointmentTable({ data, cellRenderers, setActiveTab, activeTab }) {
  const tabOrder = ["Pending", "Reschedule", "Hold", "Confirmed", "Decline"];

  return (
    <div className="w-full rounded-[10px] bg-white p-3 md:p-[10px]">
      <div className="flex flex-wrap gap-3 md:gap-6 mb-3 text-xs md:text-sm">
        {tabOrder.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-2 text-[20px] font-medium transition-colors ${
              activeTab === tab
                ? "text-[#FF92A5] border-b-2 border-[#FF92A5]"
                : "text-gray-400 hover:text-gray-600"
            }`}
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
          >
            {tab}
          </button>
        ))}
      </div>

      <Table data={data} cellRenderers={cellRenderers} />
    </div>
  );
}

export default AppointmentTable;
