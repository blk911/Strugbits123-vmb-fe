import Invites from "../../../components/dashboard/saloon/SalonInvites/Invites";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import { useState } from "react";

export default function SalonInvites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  return (
    <div className="bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <PageHeader
        title="Invites History"
        description="Manage your Invites efficiently"
        onSearch={setSearchQuery}
        onSort={setSortOption}
        defaultSort={sortOption}
        sortOptions={["Newest", "Oldest"]}
      />
      <div className="w-full ">
        <Invites searchQuery={searchQuery} sortOption={sortOption} />
      </div>
    </div>
  );
}
