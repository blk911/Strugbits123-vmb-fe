export default function SectionWrapper({ children, className = "" }) {
  return (
    <div
      className={"rounded-[14px] " + className}
      style={{
        background: "var(--vmb-card-warm)",
        border: "1px solid var(--vmb-border-light)",
        boxShadow: "0 2px 16px rgba(15, 61, 62, 0.06)",
      }}
    >
      {children}
    </div>
  );
}
