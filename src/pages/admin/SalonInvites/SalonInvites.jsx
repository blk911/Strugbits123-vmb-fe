import Invites from "../../../components/dashboard/admin/SalonInvites/Invites";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import { useState } from "react";

export default function SalonInvites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  return (
    <div className="bg-vmb-bg-soft p-7 font-poppins gap-8 flex flex-col">
      <PageHeader
        title="Invites"
        description="Manage your salon efficiently."
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
