import React from "react";
import AdvancedTable from "./AdvancedTable";

export default function AdvancedTabbedTable({
  tabs,
  tabOrder,
  defaultTab = tabOrder[0],
  columns,
  tabLabelMap = {},
  activeTab: controlledActiveTab,
  setExternalActiveTab,
  onRowClick,
  onActionClick,
}) {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const currentTab = controlledActiveTab || activeTab;

  React.useEffect(() => {
    if (setExternalActiveTab) setExternalActiveTab(currentTab);
  }, [currentTab, setExternalActiveTab]);

  const getLabel = (key) =>
    tabLabelMap[key] ?? key.replace(/([A-Z])/g, " $1").trim();

  return (
    <div className="w-full rounded-[10px] bg-white p-3 md:p-6 shadow-sm">
      <div className="flex flex-wrap gap-6 mb-6 border-b border-gray-200">
        {tabOrder.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`pb-3 text-sm sm:text-lg font-semibold transition-colors border-b-2 ${
              currentTab === key
                ? "text-[#FF92A5] border-[#FF92A5]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {getLabel(key)}
          </button>
        ))}
      </div>

      <AdvancedTable
        data={tabs[currentTab] || []}
        columns={columns}
        onRowClick={onRowClick}
        onActionClick={onActionClick}
      />
    </div>
  );
}
