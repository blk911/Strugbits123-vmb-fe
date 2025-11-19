import SalonSection from "../../../components/dashboard/client/Home/SalonSection";

import PageHeader from "../../../components/common/dashboard/PageHeader";

export default function Salons() {
  return (
    <div className=" bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <PageHeader
        title="Salons"
        description="Find your favorite salon."
        onSearch={(value) => console.log("Search:", value)}
        onSort={(option) => console.log("Sort:", option)}
      />
      <SalonSection />
    </div>
  );
}
