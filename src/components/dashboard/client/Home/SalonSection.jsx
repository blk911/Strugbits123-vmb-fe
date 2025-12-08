import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SalonCard from "./SalonCard";
import { useGetAllSalonsQuery } from "../../../../store/api";
import { useUser } from "../../../../hooks/useUser";

const LIMIT = 10;

export default function SalonSection({
  searchQuery = "",
  sortOption = "Nearest",
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMiles, setSelectedMiles] = useState(10);
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isSalonPage = location.pathname === "/salons";
  const shouldApplyDistance = !isSalonPage;
  const sortMap = {
    Nearest: "nearest",
    Farthest: "farthest",
  };
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllSalonsQuery(
    {
      page: currentPage,
      limit: LIMIT,
      sort: sortMap[sortOption] || "nearest",
      search: searchQuery,
      ...(shouldApplyDistance && {
        distance: selectedMiles,
      }),
      userLng: user?.location?.coordinates[0],
      userLat: user?.location?.coordinates[1],
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, selectedMiles]);
  useEffect(() => {
    refetch();
  }, [refetch]);
  const salons = response?.data?.items || [];
  const totalPages = response?.data?.pages || 1;
  const totalItems = response?.data?.total || 0;

  const milesOptions = [1, 5, 10];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
                {selectedMiles ? `${selectedMiles} Miles` : "Filter by miles"}
              </button>

              <span
                onClick={() => navigate("/salons")}
                className="text-[#FF92A5] text-[14px] font-medium underline cursor-pointer hover:opacity-80"
              >
                View All
              </span>
            </div>

            {filterOpen && (
              <div className="w-[150px] absolute top-[110%] left-0 md:right-20 rounded-[12px] border border-[#F3F4F6] bg-white p-[12px] flex flex-col gap-2 z-20 shadow-lg">
                {milesOptions.map((mile) => (
                  <div
                    key={mile}
                    onClick={() => {
                      setSelectedMiles(mile);
                      setFilterOpen(false);
                    }}
                    className={`w-[120px] cursor-pointer text-center text-[#581838] text-[14px] p-2 rounded-full transition ${
                      selectedMiles === mile
                        ? "bg-[#FF92A5] text-white"
                        : "bg-[#FF92A54D] hover:bg-[#FF92A566]"
                    }`}
                  >
                    {mile} Miles
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {salons.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          Currently within this distance there are no salons.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-2 sm:px-4 md:px-6">
          {salons.map((salon) => (
            <SalonCard key={salon._id} salon={salon} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">
            Showing {(currentPage - 1) * LIMIT + 1} to{" "}
            {Math.min(currentPage * LIMIT, totalItems)} of {totalItems} salons
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 text-sm border border-[#D1D5DB] rounded-lg text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg border transition ${
                      currentPage === page
                        ? "bg-[#FF92A5] text-white border-[#FF92A5]"
                        : "border-[#E5E7EB] text-[#4B5563] hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 text-sm border border-[#D1D5DB] rounded-lg text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isFetching && currentPage > 1 && (
        <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50">
          <div className="text-lg">Loading salons...</div>
        </div>
      )}
    </div>
  );
}
