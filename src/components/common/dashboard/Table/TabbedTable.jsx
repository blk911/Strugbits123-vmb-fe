// import React from "react";
// import Table from "./Table";

// export default function TabbedTable({
//   tabs,
//   tabOrder,
//   defaultTab,
//   cellRenderers,
//   tabLabelMap = {},
//   location,
//   setExternalActiveTab,
// }) {
//   const urlActive = location?.state?.activeTab;
//   const initial = urlActive || defaultTab || tabOrder[0];
//   const [activeTab, setActiveTab] = React.useState(initial);

//   React.useEffect(() => {
//     if (setExternalActiveTab) setExternalActiveTab(activeTab);
//   }, [activeTab, setExternalActiveTab]);

//   const getLabel = (key) =>
//     tabLabelMap[key] ?? key.replace(/([A-Z])/g, " $1").trim();

//   return (
//     <div className="w-full rounded-[10px] bg-white p-3 md:p-[10px]">
//       <div className="flex flex-wrap gap-3 md:gap-6 mb-3 text-xs md:text-sm">
//         {tabOrder.map((key) => (
//           <button
//             key={key}
//             onClick={() => setActiveTab(key)}
//             className={`
//               cursor-pointer pb-2 text-[20px] font-medium transition-colors
//               ${
//                 activeTab === key
//                   ? "text-[#FF92A5] border-b-2 border-[#FF92A5]"
//                   : "text-gray-400 hover:text-gray-600"
//               }
//             `}
//             style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
//           >
//             {getLabel(key)}
//           </button>
//         ))}
//       </div>

//       <Table data={tabs[activeTab] ?? []} cellRenderers={cellRenderers} />
//     </div>
//   );
// }
// TabbedTable.jsx
import React from "react";
import Table from "./Table";

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
    <div className="w-full rounded-[10px] bg-white p-3 md:p-[10px]">
      <div className="flex flex-wrap gap-3 md:gap-6 mb-3 text-xs md:text-sm">
        {tabOrder.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`
              cursor-pointer pb-2 text-[20px] font-medium transition-colors
              ${
                currentTab === key
                  ? "text-[#FF92A5] border-b-2 border-[#FF92A5]"
                  : "text-gray-400 hover:text-gray-600"
              }
            `}
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
          >
            {getLabel(key)}
          </button>
        ))}
      </div>

      <Table
        data={tabs[currentTab] ?? []}
        cellRenderers={cellRenderers}
        onRowClick={onRowClick?.[currentTab]}
      />
    </div>
  );
}
