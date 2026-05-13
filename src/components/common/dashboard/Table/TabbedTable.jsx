import React from "react";
import Table from "./Table";
import Pagination from "./Pagination";
import LoadingIndicator from "../../LoadingIndicator/LoadingIndicator";
export default function TabbedTable({
  tabs,
  tabOrder,
  defaultTab,
  cellRenderers,
  tabLabelMap = {},
  location,
  setExternalActiveTab,
  activeTab: controlledActiveTab,
  onRowClick,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  isFetching,
  showPointer,
  onSort,
  sortBy,
  sortOrder,
  sortFields,
}) {
  const urlActive = location?.state?.activeTab;
  const initial = urlActive || defaultTab || tabOrder[0];
  const [activeTab, setActiveTab] = React.useState(initial);

  const currentTab = controlledActiveTab || activeTab;

  React.useEffect(() => {
    if (setExternalActiveTab) setExternalActiveTab(currentTab);
  }, [currentTab, setExternalActiveTab]);

  const getLabel = (key) =>
    tabLabelMap[key] ?? key.replace(/([A-Z])/g, " $1").trim();

  return (
    <div className="w-full rounded-[6px] border border-[#e2d6cf] bg-[#fffdfb] p-3 md:p-[10px] shadow-[0_10px_28px_rgba(66,55,50,0.06)]">
      <div className="mb-4 flex flex-wrap gap-0 border border-[#ded3cc] bg-[#f5eee9] text-xs md:text-sm">
        {tabOrder.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`
              cursor-pointer px-4 py-2.5 text-sm sm:text-[14px] font-semibold uppercase tracking-[0.06em] transition-colors
              ${
                currentTab === key ?
                  "bg-vmb-primary text-white"
                : "text-vmb-primary hover:bg-[#efe3dc]"
              }
            `}
            style={{ fontFamily: "Libre Franklin, sans-serif", fontWeight: 600 }}
          >
            {getLabel(key)}
          </button>
        ))}
      </div>

      {isLoading ?
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      : <>
          <Table
            data={tabs[currentTab] ?? []}
            cellRenderers={cellRenderers || {}}
            onRowClick={onRowClick?.[currentTab]}
            showPointer={showPointer}
            onSort={onSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            sortFields={sortFields}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              isFetching={isFetching}
            />
          )}
        </>
      }
    </div>
  );
}
