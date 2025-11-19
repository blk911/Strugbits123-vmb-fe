import { useState } from "react";
import ServiceCard from "./ServiceCard";

export default function ServicesSection({ services = [], salon }) {
  const perPage = 9;
  const [page, setPage] = useState(1);
  const total = Math.ceil(services.length / perPage);
  const start = (page - 1) * perPage;
  const current = services.slice(start, start + perPage);

  return (
    <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[#581838] text-[18px] font-semibold">Services</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {current.map((svc) => (
          <ServiceCard key={svc.id} {...svc} salon={salon} />
        ))}
      </div>

      <div className="flex  justify-center items-center gap-3 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 text-sm border border-[#D1D5DB] rounded-md text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          Prev
        </button>

        <div className="flex  items-center gap-1">
          {Array.from({ length: total }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                page === idx + 1
                  ? "bg-[#FF92A5] text-white border-[#FF92A5]"
                  : "border-[#E5E7EB] text-[#4B5563]"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          disabled={page === total}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 text-sm border border-[#D1D5DB] rounded-md text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
