export default function ServiceCard({ img, title, desc, price }) {
  return (
    <div className="border border-[#0000001A] p-4 rounded-[10px] flex flex-col sm:flex-row  gap-4 items-start hover:bg-[#FF92A51A] transition cursor-pointer">
      <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 border border-[#E5E7EB] rounded-[8px] flex  items-center justify-center overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col flex-grow">
        <p className="text-[18px] font-medium text-[#581838]">{title}</p>
        <p className="text-[12px] text-[#4B5563] font-medium">{desc}</p>
      </div>

      <p className="text-[20px] font-bold text-[#581838] whitespace-nowrap">
        {price}
      </p>
    </div>
  );
}
