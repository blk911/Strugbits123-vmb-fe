import React from "react";
import Table from "./Table";

function RequestsTable({ data, cellRenderers, setActiveTab, activeTab }) {
  return (
    <div className="w-full rounded-[10px] bg-white p-[10px]">
      <div className="flex gap-6 mb-4">
        {["myRequests", "receivedRequests"].map((tab) => (
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
            {tab === "myRequests" ? "My Requests" : "Received Requests"}
          </button>
        ))}
      </div>
      <Table data={data} cellRenderers={cellRenderers} />
    </div>
  );
}

export default RequestsTable;
