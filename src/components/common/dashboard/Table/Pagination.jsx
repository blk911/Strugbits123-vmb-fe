export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isFetching,
}) {
  return (
    <div className="flex justify-center items-center gap-3 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isFetching}
        className="px-3 py-1 text-sm border border-[#D1D5DB] rounded-md text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-md border ${
              currentPage === page
                ? "bg-[#FF92A5] text-white border-[#FF92A5]"
                : "border-[#E5E7EB] text-[#4B5563]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isFetching}
        className="px-3 py-1 text-sm border border-[#D1D5DB] rounded-md text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
      >
        Next
      </button>
    </div>
  );
}
