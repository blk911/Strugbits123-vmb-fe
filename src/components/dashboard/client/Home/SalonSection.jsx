
import { useState } from "react";
import SalonCard from "./SalonCard";
import { salons as salonData } from "./mockData";
import { useLocation } from "react-router-dom";
export default function SalonSection() {
  const salons = salonData;
  const cardsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(salons.length / cardsPerPage);

  const idxLast = currentPage * cardsPerPage;
  const idxFirst = idxLast - cardsPerPage;
  const currentCards = salons.slice(idxFirst, idxLast);
  const location = useLocation();
  const isSalonPage = location.pathname === "/salons";
  return (
    <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full">
      {!isSalonPage && (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-[#581838] text-[18px] font-semibold">Nearby Salons</h2>

        <div className="flex items-center gap-4">
          <button className="border border-[#0000001A] text-[#9CA3AF] text-[14px] rounded-full px-4 py-1 hover:bg-[#f9fafb] transition">
            Filter by miles
          </button>
          <span className="text-[#FF92A5] text-[14px] font-medium underline cursor-pointer">
            View All
          </span>
        </div>
      </div>
 )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-2 sm:px-4 md:px-6">
        {currentCards.map((salon) => (
          <SalonCard key={salon.id} {...salon} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 text-sm border border-[#D1D5DB] rounded-md text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          Prev
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                currentPage === idx + 1
                  ? "bg-[#FF92A5] text-white border-[#FF92A5]"
                  : "border-[#E5E7EB] text-[#4B5563]"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 text-sm border border-[#D1D5DB] rounded-md text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
