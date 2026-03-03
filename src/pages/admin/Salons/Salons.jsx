import { useState } from "react";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import AllSalons from "../../../components/dashboard/admin/Salons/Salons";
export default function Salons() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  return (
    <div className=" bg-vmb-bg-soft p-7 font-poppins gap-8 flex flex-col">
      <PageHeader
        title="Manage Salons"
        description="Manage your bookings efficiently"
        onSearch={setSearchQuery}
        onSort={setSortOption}
        defaultSort={sortOption}
        sortOptions={["Newest", "Oldest"]}
      />
      <AllSalons searchQuery={searchQuery} sortOption={sortOption} />
    </div>
  );
}
