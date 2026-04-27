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
        searchPlaceholder="Search by Customer Name and Email"
      />
      <CustomerTable
        searchQuery={searchQuery}
        sortBy={advancedSort.field}
        sortOrder={advancedSort.order}
        onSortChange={handleTableSort}
        sort={sortOption.toLowerCase()}
      />
    </div>
  );
}
