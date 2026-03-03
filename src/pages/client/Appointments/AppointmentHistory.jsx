import Appointments from "../../../components/dashboard/client/Appointments/Appointments";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import { useState } from "react";

export default function AppointmentHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  return (
    <div className="bg-vmb-bg-soft p-7 font-poppins gap-8 flex flex-col">
      <PageHeader
        title="Appointments"
        description="Manage your bookings efficiently"
        onSearch={setSearchQuery}
        onSort={setSortOption}
        defaultSort={sortOption}
        sortOptions={["Newest", "Oldest"]}
      />
      <div className="w-full ">
        <Appointments searchQuery={searchQuery} sortOption={sortOption} />
      </div>
    </div>
  );
}
