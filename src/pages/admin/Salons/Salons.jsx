import PageHeader from "../../../components/common/dashboard/PageHeader";
import AllSalons from "../../../components/dashboard/admin/Salons/Salons";
export default function Salons() {
  return (
    <div className=" bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <PageHeader
        title="Manage Salons"
        description="Manage your bookings efficiently"
        onSearch={(value) => console.log("Search:", value)}
        onSort={(option) => console.log("Sort:", option)}
      />
      <AllSalons />
    </div>
  );
}
