import React, { useState } from "react";
import { IoFilter } from "react-icons/io5";

export default function PageHeader({
  title,
  description,
  searchPlaceholder = "Search ",
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
    <div className="bg-white border border-vmb-primary/10 rounded-[12px] shadow-sm p-4 sm:p-5 md:p-6 w-full max-w-full relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col w-full sm:w-auto">
          <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-bold leading-[30px] sm:leading-[34px] md:leading-[36px] text-vmb-primary">
            {title}
          </h1>
          <p className="text-[13px] md:text-[14px] leading-[22px] sm:leading-[23px] md:leading-[24px] mt-1 text-vmb-text-muted">
            {description}
          </p>
        </div>

        <div className="flex-grow sm:flex-grow-0 w-full max-w-[660px]">
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => {
              const value = e.target.value.trimStart();
              e.target.value = value;
              onSearch && onSearch(value);
            }}
            className="w-full border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] px-4 py-2 text-vmb-text-muted text-[15px] placeholder-vmb-text-muted/50 outline-none focus:ring-2 focus:ring-vmb-secondary/30 transition-all"
          />
        </div>

        <div className="relative">
          <div
            onClick={() => setSortOpen((prev) => !prev)}
            className="flex items-center gap-4 justify-between border border-vmb-primary/10 rounded-[10px] px-4 py-2 cursor-pointer hover:bg-vmb-bg-soft transition-all bg-white/50"
          >
            <span className="text-[16px] font-semibold text-vmb-text-muted">
              {selectedSort}
            </span>
            <IoFilter className="text-vmb-text-muted text-[16px] ml-2" />
          </div>

          {sortOpen && (
            <div className="absolute top-[105%] right-0 mt-1 w-full bg-vmb-bg-soft border border-vmb-primary/10 rounded-[10px] shadow-md z-20">
              {sortOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => handleSortSelect(option)}
                  className={`px-4 py-2 text-[14px] text-vmb-text-muted cursor-pointer hover:bg-vmb-secondary/10 rounded-[10px] transition ${
                    selectedSort === option ? "bg-vmb-secondary/30" : ""
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
