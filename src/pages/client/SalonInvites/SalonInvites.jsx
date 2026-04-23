import Invites from "../../../components/dashboard/client/SalonInvites/Invites";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function SalonInvites() {
  const location = useLocation();
  const initialTab = location.state?.tab || "All";
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  return (
    <div className="p-7 font-poppins gap-8 flex flex-col">
      <PageHeader
        title="Manage Salon Invites"
        description="Manage your Invites efficiently"
        onSearch={setSearchQuery}
        onSort={setSortOption}
        defaultSort={sortOption}
        sortOptions={["Newest", "Oldest"]}
        searchPlaceholder="Search by Salon Name, Service Name and Email"
      />
      <div className="w-full ">
        <Invites
          searchQuery={searchQuery}
          sortOption={sortOption}
          initialTab={initialTab}
        />
      </div>
    </div>
  );
}
