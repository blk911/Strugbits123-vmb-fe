import Appointments from "../../../components/dashboard/saloon/Appointments/Appointments";
import PageHeader from "../../../components/common/dashboard/PageHeader";

export default function AppointmentHistory() {
  return (
    <div className="bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <PageHeader
        title="Appointments"
        description="Manage your bookings efficiently"
        onSearch={(q) => console.log("Appt search:", q)}
        onSort={(opt) => console.log("Appt sort:", opt)}
      />
      <div className="w-full ">
        <Appointments />
      </div>
    </div>
  );
}
