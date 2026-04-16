import Appointments from "../../../components/dashboard/saloon/Appointments/Appointments";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import { useState } from "react";

export default function AppointmentHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  return (
    <div className=" p-7 font-poppins gap-8 flex flex-col">
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
