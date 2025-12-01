import { useState } from "react";
import ServiceCard from "./ServiceCard";
import { FaPlus } from "react-icons/fa";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetServicesQuery } from "../../../../store/api";

export default function ServicesSection() {
  const [page, setPage] = useState(1);
  const limit = 9;
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetServicesQuery({ page, limit });
  const services = response?.data?.items || [];
  const total = response?.data?.total || 0;
  const totalPages = response?.data?.pages || 1;
  const currentPage = response?.data?.page || 1;
  const { openModal } = useDashboardModal();
  if (isLoading) {
    return (
      <div className="bg-white rounded-[12px] p-8 text-center text-gray-500">
        Loading services...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-[12px] p-8 text-center text-red-500">
        Failed to load services.
      </div>
    );
  }
  return (
    <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row items-center justify-between">
        <h3 className="text-[#581838] text-[18px] font-semibold">Services</h3>

        <button
          className="flex items-center gap-2 border border-[#E5E7EB] bg-[#FF92A5] text-white text-[16px] py-2 px-4 rounded-[8px] cursor-pointer"
          onClick={() => openModal("addService")}
        >
          <FaPlus className="text-white" />
          Add Service
        </button>
      </div>
      {services.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No services added yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isFetching}
                className="px-3 py-1 text-sm border border-[#D1D5DB] rounded-md text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isFetching}
                className="px-3 py-1 text-sm border border-[#D1D5DB] rounded-md text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
