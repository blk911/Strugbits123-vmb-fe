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
        className="px-3 py-1 text-sm border border-vmb-primary/10 rounded-md text-vmb-text-muted disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vmb-bg-soft transition"
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-md border ${
              currentPage === page ?
                "bg-vmb-secondary text-white border-vmb-secondary"
              : "border-vmb-primary/10 text-vmb-text-muted"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isFetching}
        className="px-3 py-1 text-sm border border-vmb-primary/10 rounded-md text-vmb-text-muted disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vmb-bg-soft transition"
      >
        Next
      </button>
    </div>
  );
}
