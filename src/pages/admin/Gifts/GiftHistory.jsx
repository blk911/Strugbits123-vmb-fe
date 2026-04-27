import Requests from "../../../components/dashboard/admin/Gifts/Requests";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import { useState } from "react";

export default function GiftHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  return (
    <div className="  p-7 font-poppins gap-8 flex flex-col">
      <PageHeader
        title="Gifts Requests"
        description="Manage your salon efficiently."
        onSearch={setSearchQuery}
        onSort={setSortOption}
        defaultSort={sortOption}
        sortOptions={["Newest", "Oldest"]}
        searchPlaceholder="Search by Salon Name, Service Name and Email"
      />
      <div className="w-full">
        <Requests searchQuery={searchQuery} sortOption={sortOption} />
      </div>
    </div>
  );
}
