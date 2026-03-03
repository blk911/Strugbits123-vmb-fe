export default function SectionWrapper({ children, className = "" }) {
  return (
    <div
      className={
        "border border-vmb-bg-soft bg-white shadow-md rounded-[12px] " +
        className
      }
    >
      {children}
    </div>
  );
}
