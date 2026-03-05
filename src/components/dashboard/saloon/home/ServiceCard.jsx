export default function ServiceCard({ img, title, desc, price }) {
  return (
    <div className="border border-vmb-primary/10 p-4 rounded-[10px] flex flex-col sm:flex-row  gap-4 items-start bg-vmb-secondary/10 hover:bg-white transition cursor-pointer">
          <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 border border-vmb-bg-soft rounded-[8px] flex  items-center justify-center overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col flex-grow">
        <p className="text-[18px] font-medium text-vmb-primary">{title}</p>
        <p className="text-[12px] text-vmb-text-muted font-medium">{desc}</p>
      </div>

      <p className="text-[20px] font-bold text-vmb-primary whitespace-nowrap">
        $ {price}
      </p>
    </div>
  );
}
