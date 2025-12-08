import SalonSection from "../../../components/dashboard/client/Home/SalonSection";

import PageHeader from "../../../components/common/dashboard/PageHeader";
import { useState } from "react";

export default function Salons() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Nearest");
  return (
    <div className=" bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <PageHeader
        title="Salons"
        description="Find your favorite salon."
        onSearch={setSearchQuery}
        onSort={setSortOption}
        defaultSort="Nearest"
        sortOptions={["Nearest", "Farthest"]}
      />
      <SalonSection searchQuery={searchQuery} sortOption={sortOption} />
    </div>
  );
}
