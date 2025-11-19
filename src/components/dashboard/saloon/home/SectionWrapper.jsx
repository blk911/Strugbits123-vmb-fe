export default function SectionWrapper({ children, className = "" }) {
  return (
    <div
      className={
        "border border-[#F3F4F6] bg-white shadow-[0_4px_6px_#0000000D] rounded-[12px] " +
        className
      }
    >
      {children}
    </div>
  );
}
