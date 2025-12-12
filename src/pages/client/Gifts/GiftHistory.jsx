import Requests from "../../../components/dashboard/client/Gifts/Requests";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import { useState } from "react";

export default function GiftHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  return (
    <div className=" bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <PageHeader
        title="Gifts History"
        description="Manage your gifts efficiently."
        onSearch={setSearchQuery}
        onSort={setSortOption}
        defaultSort={sortOption}
        sortOptions={["Newest", "Oldest"]}
      />
      <div className="w-full">
        <Requests searchQuery={searchQuery} sortOption={sortOption} />
      </div>
    </div>
  );
}
