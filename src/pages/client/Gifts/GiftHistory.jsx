import Requests from "../../../components/dashboard/client/Gifts/Requests";
import PageHeader from "../../../components/common/dashboard/PageHeader";

export default function GiftHistory() {
  return (
    <div className=" bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <PageHeader
        title="Gifts History"
        description="Manage your gifts efficiently."
        onSearch={(q) => console.log("Gift search:", q)}
        onSort={(opt) => console.log("Gift sort:", opt)}
      />
      <div className="w-full">
        <Requests />
      </div>
    </div>
  );
}
