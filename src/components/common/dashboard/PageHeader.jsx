import React, { useState } from "react";
import { IoFilter } from "react-icons/io5";

export default function PageHeader({
  title,
  description,
  searchPlaceholder = "Search (salon, service)",
  onSearch,
  onSort,
  defaultSort = "Newest",
  sortOptions = ["Newest", "Oldest"],
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(defaultSort);

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setSortOpen(false);
    if (onSort) onSort(option);
  };

  return (
    <div className="bg-white border border-[#F3F4F6] rounded-[12px] shadow-[0_4px_6px_#0000000D] p-4 sm:p-5 md:p-6 w-full max-w-full relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col w-full sm:w-auto">
          <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-bold leading-[30px] sm:leading-[34px] md:leading-[36px] text-[#581838]">
            {title}
          </h1>
          <p className="text-[13px] md:text-[14px] leading-[22px] sm:leading-[23px] md:leading-[24px] mt-1 text-[#4B5563]">
            {description}
          </p>
        </div>

        <div className="flex-grow sm:flex-grow-0 w-full max-w-[660px]">
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full border border-[#9CA3AF4D] bg-[#F8F8F8] rounded-[10px] px-4 py-2 text-[#4B5563] text-[15px] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#FF92A5]/30 transition-all"
          />
        </div>

        <div className="relative">
          <div
            onClick={() => setSortOpen((prev) => !prev)}
            className="flex items-center gap-4 justify-between border border-[#9CA3AF4D] rounded-[10px] px-4 py-2 cursor-pointer hover:bg-[#F9FAFB] transition-all bg-white"
          >
            <span className="text-[16px] font-semibold text-[#6B7280]">
              {selectedSort}
            </span>
            <IoFilter className="text-[#6B7280] text-[16px] ml-2" />
          </div>

          {sortOpen && (
            <div className="absolute top-[105%] right-0 mt-1 w-full bg-white border border-[#9CA3AF4D] rounded-[10px] shadow-md z-20">
              {sortOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => handleSortSelect(option)}
                  className={`px-4 py-2 text-[14px] text-[#6B7280] cursor-pointer hover:bg-[#F9FAFB] rounded-[10px] transition ${
                    selectedSort === option ? "bg-[#FF92A54D]" : ""
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
