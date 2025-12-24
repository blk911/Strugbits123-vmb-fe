import { useState } from "react";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import AllPayouts from "../../../components/dashboard/admin/Payouts/AllPayouts";

export default function Payouts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");

  return (
    <div className="bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <PageHeader
        title="Manage Payouts"
        description="Track and manage salon earnings"
        onSearch={setSearchQuery}
        onSort={setSortOption}
        defaultSort={sortOption}
        sortOptions={["Newest", "Oldest"]}
      />
      <AllPayouts searchQuery={searchQuery} sortOption={sortOption} />
    </div>
  );
}
