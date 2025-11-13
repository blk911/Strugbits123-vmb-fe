import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SalonCard from "./SalonCard";
import { salons as salonData } from "./mockData";

export default function SalonSection() {
  const salons = salonData;
  const cardsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMiles, setSelectedMiles] = useState(null);

  const totalPages = Math.ceil(salons.length / cardsPerPage);
  const idxLast = currentPage * cardsPerPage;
  const idxFirst = idxLast - cardsPerPage;
  const currentCards = salons.slice(idxFirst, idxLast);

  const location = useLocation();
  const navigate = useNavigate();
  const isSalonPage = location.pathname === "/salons";

  const milesOptions = [1, 5, 10];

  return (
    <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full">
      {!isSalonPage && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative">
          <h2 className="text-[#581838] text-[18px] font-semibold">
            Nearby Salons
          </h2>

          <div className="flex flex-col gap-2 w-full sm:w-auto relative">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFilterOpen((prev) => !prev)}
                className="cursor-pointer border border-[#0000001A] text-[#9CA3AF] text-[14px] rounded-full px-4 py-1 hover:bg-[#FF92A54D] hover:text-[#581838] transition"
              >
                Filter by miles
              </button>

              <span
                onClick={() => navigate("/salons")}
                className="text-[#FF92A5] text-[14px] font-medium underline cursor-pointer"
              >
                View All
              </span>
            </div>

            {filterOpen && (
              <div className="absolute top-[110%] left-0 md:right-20 rounded-[12px] border border-[#F3F4F6] bg-white p-[12px] flex flex-col gap-2 z-10 shadow-md">
                {milesOptions.map((mile) => (
                  <div
                    key={mile}
                    onClick={() => {
                      setSelectedMiles(mile);
                      setFilterOpen(false);
                    }}
                    className={`cursor-pointer text-center text-[#581838] text-[14px] p-2 rounded-full ${
                      selectedMiles === mile
                        ? "bg-[#FF92A5] text-white"
                        : "bg-[#FF92A54D] hover:bg-[#FF92A566]"
                    } transition`}
                  >
                    {mile} Miles
                  </div>
                ))}
              </div>
            )}
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
