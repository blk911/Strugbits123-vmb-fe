import salonImg from "../../../../assets/salon-4.png";
export default function ServiceCard({ icon, title, desc, price }) {
  return (
    <div className="border border-[#0000001A] p-4 rounded-[10px] flex gap-4 items-start hover:bg-[#FF92A51A] transition">
      <div className="w-[50px] h-[50px] border border-[#E5E7EB] rounded-[8px] flex items-center justify-center">
        <img src={salonImg} alt="User" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col flex-grow">
        <p className="text-[18px] font-medium text-[#581838]">{title}</p>
        <p className="text-[12px] text-[#4B5563] font-medium">{desc}</p>
      </div>

      <p className="text-[20px] font-bold text-[#581838]">{price}</p>
    </div>
  );
}
