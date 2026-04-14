import { useState } from "react";
import PageHeader from "../../../common/dashboard/PageHeader";
import CustomerTable from "./CustomerTable";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const [advancedSort, setAdvancedSort] = useState({
    field: "createdAt",
    order: -1,
  });

  // Sync the legacy dropdown with the advanced sort state
  const handleDropdownSort = (option) => {
    setSortOption(option);
    if (option === "Newest") {
      setAdvancedSort({ field: "createdAt", order: -1 });
    } else if (option === "Oldest") {
      setAdvancedSort({ field: "createdAt", order: 1 });
    }
  };

  const handleTableSort = (field, order) => {
    setAdvancedSort({ field, order });

    // Sync dropdown label if sorting by date, otherwise set to Custom
    if (field === "createdAt") {
      setSortOption(order === -1 ? "Newest" : "Oldest");
    } else {
      setSortOption("Custom");
    }
  };

  return (
    <div className=" p-7 font-poppins gap-8 flex flex-col">
      <PageHeader
        title="Customers"
        description="Manage your salon efficiently"
        onSearch={setSearchQuery}
        onSort={handleDropdownSort}
        defaultSort={sortOption}
        sortOptions={["Newest", "Oldest"]}
      />
      <CustomerTable
        searchQuery={searchQuery}
        sortBy={advancedSort.field}
        sortOrder={advancedSort.order}
        onSortChange={handleTableSort}
        // Explicitly pass current dropdown sort for backend priority check
        sort={sortOption.toLowerCase()}
      />
    </div>
  );
}
