import React, { useEffect, useMemo, useReducer } from "react";
import { calendarPulse } from "../../../../config/salonCalendarPulseMock";
import {
  readJson,
  LS_NORMALIZED,
  LS_PARSED,
  LS_SIGNALS,
  hasImportedDataset,
  DEEP_INSIGHTS_DATASET_EVENT,
} from "../../../../lib/deep-insights/storageKeys.js";
import { getImportCapabilities } from "../../../../lib/deep-insights/importCapabilities.js";

// Future: Google Calendar + VMB booking sync replaces mock bands below.

const labelAccent =
  "text-[8px] font-bold uppercase tracking-[0.14em] text-[#a45f76]";
const openWindowLine = "font-bold uppercase text-[#b91c1c]";
const subDivider = "mt-2 border-t border-[#e8ddd4]/85 pt-2";
const bodyText = "text-[11px] leading-snug text-[#333232]";

/** Shared serif strip headings (DAILY PULSE, date, THIS WEEK). */
const stripHeading =
  "font-studio-serif text-[0.8125rem] font-semibold tracking-[0.06em] text-[#2f2a28] sm:text-sm";

const headerCell =
  "flex min-h-[2.625rem] items-center justify-center px-1 text-center sm:min-h-[2.75rem]";

const colGrid =
  "grid grid-cols-1 gap-x-6 gap-y-3 sm:gap-y-3.5 lg:grid-cols-3 lg:items-start lg:gap-y-0";

export default function CalendarPulseWidget() {
  const [, bump] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const onDs = () => bump();
    window.addEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDs);
    return () => window.removeEventListener(DEEP_INSIGHTS_DATASET_EVENT, onDs);
  }, []);

  const scheduleImportNote = useMemo(() => {
    if (typeof window === "undefined" || !hasImportedDataset()) return null;
    const normalized = readJson(LS_NORMALIZED, null);
    if (!normalized) return null;
    const pack = readJson(LS_SIGNALS, null);
    const parsed = readJson(LS_PARSED, null);
    const caps = pack?.capabilities ?? getImportCapabilities(normalized, Array.isArray(parsed) ? parsed : [], pack);
    if (caps.schedule === "available") return null;
    return "Calendar not connected — sample openings shown; import does not drive live availability.";
  }, [bump]);

  const { command, today, week, todayScheduleBands, weekNotes } = calendarPulse;
  const projectedShort = command.projectedThisWeek.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const dateLine = useMemo(() => {
    const d = new Date();
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const month = d.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
    const dayNum = d.getDate();
    const year = d.getFullYear();
    return `${weekday}, ${month} ${dayNum} ${year}`;
  }, []);

  return (
    <section className="rounded-lg border border-[#e2d6cf] bg-white px-2.5 py-2.5 shadow-[0_8px_28px_-22px_rgba(39,46,45,0.55)] sm:px-3 sm:py-3">
      {/* Title row — one element per column, centered, shared vertical band */}
      <div className={colGrid}>
        <div className={`min-w-0 ${headerCell}`}>
          <h2 className={stripHeading}>DAILY PULSE</h2>
          {scheduleImportNote ?
            <p className="mx-auto mt-1 max-w-[220px] text-center text-[8px] leading-tight text-[#8a7f7c]">
              {scheduleImportNote}
            </p>
          : null}
        </div>
        <div className={`min-w-0 ${headerCell}`}>
          <p className={`${stripHeading} leading-tight`}>
            <span className="sr-only">Today: </span>
            {dateLine}
          </p>
        </div>
        <div className={`min-w-0 ${headerCell}`}>
          <h2 className={stripHeading}>THIS WEEK</h2>
        </div>
      </div>
      <div
        className="my-2 border-t border-[#d9d0c6] sm:my-2.5"
        role="presentation"
        aria-hidden
      />

      {/* Body row */}
      <div className={colGrid}>
        {/* Column 1 */}
        <div className="min-w-0">
          <ul className={`space-y-0.5 ${bodyText}`}>
            <li>• {today.booked} booked</li>
            <li>• {today.openWindows} open windows</li>
            <li>• {command.opportunitiesReady} opportunities ready</li>
            <li>
              • <span className="tabular-nums font-semibold text-[#2f2a28]">{projectedShort}</span>{" "}
              projected
            </li>
          </ul>
          <div className={subDivider}>
            <p className={labelAccent}>NEEDS ATTENTION</p>
            <ul className={`mt-1 space-y-0.5 ${bodyText}`}>
              <li>• {command.campaignsAwaitingApproval} campaigns awaiting approval</li>
              <li>• {command.clientResponsesPending} client response pending</li>
            </ul>
          </div>
        </div>

        {/* Column 2 */}
        <div className="min-w-0">
          <div className="space-y-1.5">
            {todayScheduleBands.map((band) => (
              <div key={band.label}>
                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a45f76]/95">
                  {band.label}
                </p>
                <ul className="mt-0.5 space-y-0.5">
                  {band.rows.map((row, idx) => {
                    const isOpen =
                      Boolean(row.isOpen) || /^open window$/i.test(String(row.line).trim());
                    return (
                      <li
                        key={`${band.label}-${idx}-${row.time}`}
                        className={`flex gap-2 ${bodyText}`}
                      >
                        <span className="w-[3rem] shrink-0 tabular-nums text-[#6b6262]">
                          {row.time}
                        </span>
                        <span className={isOpen ? openWindowLine : "text-[#333232]"}>
                          {isOpen ? "OPEN WINDOW" : row.line}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 */}
        <div className="min-w-0">
          <ul className={`space-y-0.5 ${bodyText}`}>
            <li>
              <span className="tabular-nums font-semibold text-[#2f2a28]">{week.appointments}</span>{" "}
              appointments
            </li>
            <li>
              <span className="tabular-nums font-semibold text-[#2f2a28]">
                ${week.projectedRevenue.toLocaleString()}
              </span>{" "}
              projected
            </li>
            <li>
              <span className="tabular-nums font-semibold text-[#2f2a28]">{week.openSlots}</span>{" "}
              open slots
            </li>
          </ul>
          <div className={subDivider}>
            <p className={labelAccent}>OPPORTUNITY NOTES</p>
            <ul className={`mt-1 space-y-0.5 ${bodyText}`}>
              {weekNotes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
