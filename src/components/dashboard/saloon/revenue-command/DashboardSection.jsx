import React from "react";

export default function DashboardSection({
  label,
  title,
  description,
  children,
  className = "",
  action,
}) {
  return (
    <section className={`${className}`}>
      {(label || title || description || action) && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {label ?
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F7E7CE]/40">
                {label}
              </p>
            : null}
            {title ?
              <h2 className="font-studio-serif mt-1 text-xl font-medium tracking-tight text-[#F7E7CE] sm:text-2xl">
                {title}
              </h2>
            : null}
            {description ?
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
