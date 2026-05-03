export default function ServiceCard({ title, desc, price }) {
  return (
    <div className="flex items-baseline gap-3 py-3.5 border-b border-vmb-border-light last:border-0">
      <div className="flex flex-col min-w-0">
        <span className="font-poppins font-medium text-[15px] text-vmb-text-dark leading-tight">
          {title}
        </span>
        {desc && (
          <span className="text-[12px] text-vmb-text-muted font-inter leading-tight mt-0.5 truncate max-w-[220px]">
            {desc}
          </span>
        )}
      </div>
      <span
        className="flex-1 self-center"
        style={{
          borderBottom: "1px dotted var(--vmb-gold)",
          opacity: 0.4,
          minWidth: 16,
        }}
      />
      <span
        className="font-playfair text-[18px] whitespace-nowrap"
        style={{ color: "var(--vmb-primary)" }}
      >
        ${price}
      </span>
    </div>
  );
}
