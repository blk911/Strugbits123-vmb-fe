import Invites from "../../../components/dashboard/saloon/SalonInvites/Invites";
import PageHeader from "../../../components/common/dashboard/PageHeader";

export default function SalonInvites() {
  return (
    <div className="bg-[#EFEFEF] p-7 font-[Poppins] gap-8 flex flex-col">
      <PageHeader
        title="Invites History"
        description="Manage your Invites efficiently"
        onSearch={(q) => console.log("Invite search:", q)}
        onSort={(opt) => console.log("Invite sort:", opt)}
      />
      <div className="w-full ">
        <Invites />
      </div>
    </div>
  );
}
