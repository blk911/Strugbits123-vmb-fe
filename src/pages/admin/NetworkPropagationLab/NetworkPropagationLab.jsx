import React, { useMemo, useState } from "react";
import { Settings } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calculateNetworkPropagation } from "../../../lib/networkPropagation";

const CURRENCY = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const NUM = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const NUM1 = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });

/** Whole-units in tables (salons, clients); partials always round up */
const fmtCountUp = (value) =>
  Math.ceil(Number(value) || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

/** Table: whole-number display for salon add columns */
function fmtSalonIntCell(value) {
  return Math.round(Number(value) || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

/** Whole USD in output tables; partial dollars always round up */
const fmtMoney0Up = (value) =>
  Math.ceil(Number(value) || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const DEFAULT_INPUTS = {
  startingSalons: 1,
  techsPerSalon: 4,
  avgTicket: 85,
  weeksPerMonth: 4.33,
  launchGrowthPct: 65,
  normalizeGrowthPct: 18,
  matureGrowthPct: 8,
  newClientsPerSalonPerMonth: 25,
  clientGrowthPctPerMonth: 5,
  repeatVisitRate: 35,
  clientToSalonConversionRate: 10,
  activeClientsPerSalonInvite: 200,
  clientSalonInviteCapPerMonth: 5,
  vmbRetainedRate: 2,
  coMarketingPoolRate: 3,
  level1Pct: 25,
  level2Pct: 15,
  level3Pct: 5,
  level4Pct: 10,
  level5Pct: 15,
  level6Pct: 25,
  bonusPoolPct: 10,
  projectionMonths: 18,
};

const salonProductionHelp = [
  {
    label: "Projection months",
    description: "Number of months the model runs.",
  },
  {
    label: "Start salons",
    description: "Initial active salon units at month one.",
  },
  {
    label: "Techs per salon",
    description: "Service providers producing client volume.",
  },
  {
    label: "Average ticket",
    description: "Average paid service transaction.",
  },
  {
    label: "Weeks / month",
    description: "Monthly conversion factor, usually 4.33.",
  },
];

const clientNetworkHelp = [
  {
    label: "New Clients / Salon / Mo",
    description:
      "Average new VMB clients per month per active salon before organic growth.",
  },
  {
    label: "Client Growth % / Mo",
    description: "Organic expansion as a percent of the prior month’s active clients.",
  },
  {
    label: "Repeat Visit %",
    description:
      "Share of active clients counted toward repeat monthly paid volume.",
  },
  {
    label: "Client → Salon Conv. %",
    description:
      "Percent of referral-signals (see Active Clients / Salon Signal) that become new salons.",
  },
  {
    label: "Active Clients / Salon Signal",
    description:
      "How many active clients generate one possible salon referral signal (floor division).",
  },
  {
    label: "Client Salon Add Cap / Mo",
    description: "Hard cap on client-driven new salons per month.",
  },
];

const salonGrowthRatesHelp = [
  {
    label: "Growth % Months 1–6",
    description:
      "Monthly salon growth rate during launch phase.",
  },
  {
    label: "Growth % Months 7–12",
    description:
      "Monthly salon growth rate during normalized phase.",
  },
  {
    label: "Growth % Month 13+",
    description:
      "Monthly mature salon growth rate.",
  },
];

const coMarketingPayoutHelp = [
  {
    label: "VMB Retained %",
    description:
      "VMB’s retained platform share of gross network commerce.",
  },
  {
    label: "Co-Marketing Pool %",
    description:
      "Share of gross commerce placed into the monthly co-marketing payout pool.",
  },
  {
    label: "Total Platform Fee %",
    description:
      "Displayed sum of VMB retained percentage plus co-marketing pool percentage.",
  },
  {
    label: "L1 % through L6 %",
    description:
      "Tier weights for client ladder depth and for splitting the distributable co-marketing pool across qualified levels. Engine baseline split is 25 / 15 / 5 / 10 / 15 / 25.",
  },
  {
    label: "Bonus Pool %",
    description:
      "Percent of the co-marketing pool reserved for discretionary rewards, contests, incentives, and promotional campaigns.",
  },
];

const PRESET_SLOTS = [1, 2, 3, 4];
const presetStorageKey = (slot) =>
  `vmb-network-propagation-lab-preset-${slot}`;

/** Ensure slot 1 exists with canonical VMB defaults (named “Preset 1”). */
function seedVmbDefaultPreset1() {
  if (typeof window === "undefined") return;
  const k = presetStorageKey(1);
  if (window.localStorage.getItem(k) != null) return;
  try {
    window.localStorage.setItem(k, JSON.stringify(DEFAULT_INPUTS));
  } catch {
    /* ignore */
  }
}

function readPresetFilledFlags() {
  if (typeof window === "undefined") {
    return [false, false, false, false];
  }
  seedVmbDefaultPreset1();
  return PRESET_SLOTS.map(
    (n) => window.localStorage.getItem(presetStorageKey(n)) != null,
  );
}

/** Merge saved JSON with current defaults; only known keys */
function normalizePresetPayload(data) {
  const base = { ...DEFAULT_INPUTS };
  if (!data || typeof data !== "object") return base;
  for (const key of Object.keys(base)) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const v = data[key];
    if (typeof base[key] === "boolean") {
      base[key] =
        v === true || v === 1 || v === "1" || v === "true" ?
          true
        : v === false || v === 0 || v === "0" || v === "false" ?
          false
        : DEFAULT_INPUTS[key];
      continue;
    }
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n)) {
      base[key] = DEFAULT_INPUTS[key];
      continue;
    }
    if (
      key === "launchGrowthPct" ||
      key === "normalizeGrowthPct" ||
      key === "matureGrowthPct" ||
      key === "clientGrowthPctPerMonth" ||
      key === "repeatVisitRate" ||
      key === "clientToSalonConversionRate"
    ) {
      base[key] = Math.min(100, Math.max(0, n));
      continue;
    }
    if (
      key === "activeClientsPerSalonInvite" ||
      key === "clientSalonInviteCapPerMonth"
    ) {
      base[key] = Math.max(0, Math.round(n));
      continue;
    }
    if (key === "newClientsPerSalonPerMonth") {
      base[key] = Math.max(0, n);
      continue;
    }
    if (key === "bonusPoolPct") {
      base[key] = Math.min(100, Math.max(0, n));
      continue;
    }
    base[key] = n;
  }
  if (
    data &&
    typeof data === "object" &&
    data.bonusPct != null &&
    !Object.prototype.hasOwnProperty.call(data, "bonusPoolPct")
  ) {
    const bn = typeof data.bonusPct === "number" ? data.bonusPct : Number(data.bonusPct);
    if (Number.isFinite(bn)) {
      base.bonusPoolPct = Math.min(100, Math.max(0, bn));
    }
  }
  if (data && typeof data === "object") {
    const legacy7 = Number(data.growthPctMonths7to12);
    if (
      Number.isFinite(legacy7) &&
      !Object.prototype.hasOwnProperty.call(data, "normalizeGrowthPct")
    ) {
      base.normalizeGrowthPct = Math.min(100, Math.max(0, legacy7));
    }
    const legacy13 = Number(data.growthPctMonths13Plus);
    if (
      Number.isFinite(legacy13) &&
      !Object.prototype.hasOwnProperty.call(data, "matureGrowthPct")
    ) {
      base.matureGrowthPct = Math.min(100, Math.max(0, legacy13));
    }
  }
  return base;
}

function InputHelpPopover({ title, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative inline-flex shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="rounded-md border border-slate-200 bg-white p-1 text-slate-500 outline-none hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-amber-500/80"
        aria-label={`${title} help`}
        aria-expanded={open}
      >
        <Settings className="h-4 w-4" aria-hidden />
      </button>
      {open ?
        <div
          className="absolute top-7 right-0 z-50 w-[min(100vw-1rem,380px)] min-w-0 max-w-[min(calc(100vw-1rem),380px)] rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-xl max-sm:left-0 max-sm:right-auto"
        >
          <div className="mb-2 font-semibold text-slate-900">{title}</div>
          <ul className="max-h-[min(70vh,420px)] space-y-1.5 overflow-y-auto pr-0.5">
            {items.map((item) => (
              <li key={item.label} className="leading-snug text-slate-600">
                <span className="font-semibold text-slate-800">
                  {item.label}:
                </span>{" "}
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      : null}
    </div>
  );
}

function CompactNumberInput({
  label,
  helper,
  value,
  onChange,
  suffix,
  step = "any",
  disabled = false,
  /** Input width in `ch` units (Card 4 uses default 6). */
  inputWidthCh = 6,
  /** Short %-style values: centered */
  narrowInput = false,
  /** If true, coerce to non-negative integer on change */
  wholeNumber = false,
  /** Smaller label (10px), hides helper line — use with tooltips for definitions */
  dense = false,
}) {
  const baseInput =
    "h-8 min-w-0 max-w-full shrink-0 rounded-md border border-slate-200 bg-white text-xs tabular-nums outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
  const inputClass = narrowInput ?
      `${baseInput} px-1.5 text-center`
    : `${baseInput} px-2`;
  return (
    <label
      className={`block w-fit max-w-full min-w-0 space-y-0.5 ${disabled ? "opacity-60" : ""}`}
    >
      <div className="flex min-w-0 max-w-full items-center justify-between gap-1">
        <span
          className={`min-w-0 font-medium leading-tight text-slate-700 ${dense ? "text-[10px]" : "text-[11px]"}`}
        >
          {label}
        </span>
        {suffix ?
          <span className="shrink-0 text-[10px] text-slate-400">{suffix}</span>
        : null}
      </div>
      {helper && !dense ?
        <div className="line-clamp-2 text-[10px] leading-tight text-slate-400">
          {helper}
        </div>
      : null}
      <input
        type="number"
        step={step}
        value={value}
        disabled={disabled}
        style={{ width: `${inputWidthCh}ch` }}
        onChange={(e) => {
          const raw = parseFloat(e.target.value);
          if (wholeNumber) {
            onChange(
              Math.max(0, Math.round(Number.isFinite(raw) ? raw : 0)),
            );
          } else {
            onChange(Number.isFinite(raw) ? raw : 0);
          }
        }}
        className={inputClass}
      />
    </label>
  );
}

function SummaryCard({ label, value, sub, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-vmb-border-light bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-1">
        <p className="min-w-0 flex-1 text-xs font-medium uppercase tracking-wide text-vmb-text-muted">
          {label}
        </p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="h-6 shrink-0 rounded border border-slate-200 bg-white px-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 hover:bg-slate-50"
        >
          {open ? "Cls" : "Op"}
        </button>
      </div>
      {open ?
        <>
          <p className="mt-1 font-studio-serif text-xl font-semibold text-vmb-text-dark">
            {value}
          </p>
          {sub ?
            <p className="mt-0.5 text-xs text-vmb-text-muted">{sub}</p>
          : null}
        </>
      : null}
    </div>
  );
}

function CollapsibleCard({
  title,
  defaultOpen = true,
  className = "",
  bodyClassName = "p-4",
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={`rounded-lg border border-vmb-border-light bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-vmb-border-light px-3 py-2 md:px-4">
        <h3 className="min-w-0 flex-1 text-sm font-semibold text-vmb-text-main">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="h-6 shrink-0 rounded border border-slate-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-600 hover:bg-slate-50"
        >
          {open ? "Cls" : "Op"}
        </button>
      </div>
      {open ? <div className={bodyClassName}>{children}</div> : null}
    </div>
  );
}

function numOr0(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function NetworkPropagationLab() {
  const [inputs, setInputs] = useState(() => ({ ...DEFAULT_INPUTS }));
  const [presetFilled, setPresetFilled] = useState(readPresetFilledFlags);
  const [activePresetSlot, setActivePresetSlot] = useState(null);

  const set = (key) => (v) => {
    setActivePresetSlot(null);
    setInputs((s) => ({ ...s, [key]: v }));
  };

  const savePreset = (slot) => {
    try {
      window.localStorage.setItem(
        presetStorageKey(slot),
        JSON.stringify(inputs),
      );
      setPresetFilled((prev) => {
        const next = [...prev];
        next[slot - 1] = true;
        return next;
      });
      setActivePresetSlot(slot);
    } catch {
      /* storage full or disabled */
    }
  };

  const loadPreset = (slot) => {
    const raw = window.localStorage.getItem(presetStorageKey(slot));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setInputs(normalizePresetPayload(parsed));
      setActivePresetSlot(slot);
    } catch {
      /* ignore corrupt preset */
    }
  };

  const resetToVmbDefault = () => {
    const next = { ...DEFAULT_INPUTS };
    setInputs(next);
    setActivePresetSlot(null);
    try {
      for (const n of PRESET_SLOTS) {
        window.localStorage.removeItem(presetStorageKey(n));
      }
      window.localStorage.setItem(presetStorageKey(1), JSON.stringify(next));
      setPresetFilled(
        PRESET_SLOTS.map(
          (n) => window.localStorage.getItem(presetStorageKey(n)) != null,
        ),
      );
    } catch {
      /* storage full or disabled */
    }
  };

  const totalPlatformFeePct =
    numOr0(inputs.vmbRetainedRate) + numOr0(inputs.coMarketingPoolRate);

  const { monthlyRows, summary } = useMemo(
    () => calculateNetworkPropagation(inputs),
    [inputs],
  );

  const chartRevenue = useMemo(
    () =>
      monthlyRows.map((r) => ({
        month: r.month,
        revenue: Math.round(r.totalGrossRevenue),
      })),
    [monthlyRows],
  );

  const chartSalons = useMemo(
    () =>
      monthlyRows.map((r) => ({
        month: r.month,
        salons: r.activeSalons,
        newSalons: r.newSalons,
      })),
    [monthlyRows],
  );

  const chartLevels = useMemo(
    () =>
      monthlyRows.map((r) => ({
        month: r.month,
        L1: r.activeClientsByLevel.level1,
        L2: r.activeClientsByLevel.level2,
        L3: r.activeClientsByLevel.level3,
        L4: r.activeClientsByLevel.level4,
        L5: r.activeClientsByLevel.level5,
        L6: r.activeClientsByLevel.level6,
      })),
    [monthlyRows],
  );

  const chartPayouts = useMemo(
    () =>
      monthlyRows.map((r) => ({
        month: r.month,
        distributedCoMarketing: Math.round(r.distributedCoMarketing),
        level0VmbSalons: Math.round(r.level0VmbSalonsPayout),
      })),
    [monthlyRows],
  );

  return (
    <div className="min-h-full w-full min-w-0 overflow-x-clip bg-vmb-dashboard-bg px-2 py-3 sm:px-3 sm:py-3 md:p-4 lg:p-5">
      <header className="mb-2 min-w-0 max-w-full">
        <h1 className="font-studio-serif text-lg font-semibold text-vmb-text-dark sm:text-xl md:text-2xl">
          VMB Network Propagation Lab
        </h1>
        <p className="mt-0.5 max-w-3xl text-[11px] leading-snug text-vmb-text-muted break-words">
          Internal simulator: phase-based salon growth, salon-linked clients, and
          month-maturing level weights for co-marketing. Gross revenue uses monthly
          new + repeat paid volume × ticket.
        </p>
        <p className="mt-1.5 max-w-3xl rounded border border-amber-200/80 bg-amber-50/90 px-2 py-1 text-[10px] leading-tight text-amber-950 break-words">
          <strong className="font-semibold">Note:</strong> Total platform fees =
          gross × (VMB retained % + co-marketing pool %), typically 5% total (e.g.
          2% + 3%). Co-marketing reserves an optional{" "}
          <strong className="font-semibold">Bonus Pool</strong> (discretionary).
          The <strong className="font-semibold">distributable pool</strong>{" "}
          (remainder) splits across qualified levels only, by tier weights
          (25/15/5/10/15/25). L1–L6 never include the bonus reserve in weight
          normalization.{" "}
          <strong className="font-semibold">Level 0 / VMB Salons</strong> receives
          the pool only when no level qualifies; it is separate from VMB retained
          revenue.
        </p>
      </header>

      <div className="flex w-full min-w-0 flex-col gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-wrap gap-2 sm:gap-3">
          <div className="w-fit max-w-full min-w-0 overflow-visible rounded-lg border border-slate-200/90 bg-white/90 p-2 sm:p-2.5 shadow-sm">
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-tight text-slate-900">
                  Card 1 — Salon Production
                </h3>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                  Capacity, ticket, and horizon.
                </p>
              </div>
              <InputHelpPopover
                title="Salon Production Inputs"
                items={salonProductionHelp}
              />
            </div>
            <div className="inline-grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Projection months"
                value={inputs.projectionMonths}
                onChange={set("projectionMonths")}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Start salons"
                value={inputs.startingSalons}
                onChange={set("startingSalons")}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Techs per salon"
                value={inputs.techsPerSalon}
                onChange={set("techsPerSalon")}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Average ticket ($)"
                value={inputs.avgTicket}
                onChange={set("avgTicket")}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Weeks / month"
                value={inputs.weeksPerMonth}
                onChange={set("weeksPerMonth")}
                step={0.01}
              />
            </div>
          </div>

          <div className="w-fit max-w-full min-w-0 overflow-visible rounded-lg border border-slate-200/90 bg-white/90 p-2 sm:p-2.5 shadow-sm">
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-tight text-slate-900">
                  Card 2 — Client Network
                </h3>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                  Acquisition, repeat volume, and client-driven salon adds.
                </p>
              </div>
              <InputHelpPopover
                title="Client Network Inputs"
                items={clientNetworkHelp}
              />
            </div>
            <div className="inline-grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="New Clients / Salon / Mo"
                value={inputs.newClientsPerSalonPerMonth}
                onChange={set("newClientsPerSalonPerMonth")}
                step={1}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Client Growth % / Mo"
                value={inputs.clientGrowthPctPerMonth}
                onChange={set("clientGrowthPctPerMonth")}
                step={1}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Repeat Visit %"
                value={inputs.repeatVisitRate}
                onChange={set("repeatVisitRate")}
                step={1}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Client → Salon Conv. %"
                value={inputs.clientToSalonConversionRate}
                onChange={set("clientToSalonConversionRate")}
                step={1}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                wholeNumber
                label="Active Clients / Salon Signal"
                value={inputs.activeClientsPerSalonInvite}
                onChange={set("activeClientsPerSalonInvite")}
                step={1}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                wholeNumber
                label="Client Salon Add Cap / Mo"
                value={inputs.clientSalonInviteCapPerMonth}
                onChange={set("clientSalonInviteCapPerMonth")}
                step={1}
              />
            </div>
          </div>

          <div className="w-fit max-w-full min-w-0 overflow-visible rounded-lg border border-slate-200/90 bg-white/90 p-2 sm:p-2.5 shadow-sm">
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-tight text-slate-900">
                  Card 3 — Growth Rates
                </h3>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                  Phase monthly salon growth (months 1–6, 7–12, 13+).
                </p>
              </div>
              <InputHelpPopover
                title="Growth Rates"
                items={salonGrowthRatesHelp}
              />
            </div>
            <div className="inline-grid grid-cols-1 gap-2 sm:grid-cols-3">
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Growth % Months 1–6"
                value={inputs.launchGrowthPct}
                onChange={set("launchGrowthPct")}
                step={1}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Growth % Months 7–12"
                value={inputs.normalizeGrowthPct}
                onChange={set("normalizeGrowthPct")}
                step={1}
              />
              <CompactNumberInput
                dense
                inputWidthCh={9}
                label="Growth % Month 13+"
                value={inputs.matureGrowthPct}
                onChange={set("matureGrowthPct")}
                step={1}
              />
            </div>
          </div>

          <div className="w-fit max-w-full min-w-0 overflow-visible rounded-lg border border-slate-200/90 bg-white/90 p-2 sm:p-2.5 shadow-sm">
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-tight text-slate-900">
                  Card 4 — Co-Marketing + Payout Weights
                </h3>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                  Platform fee split and tier weights for the co-marketing pool.
                </p>
              </div>
              <InputHelpPopover
                title="Platform, Pool & Level Weights"
                items={coMarketingPayoutHelp}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              <div className="w-fit max-w-full min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Platform + Pool
                </div>
                <div className="mt-1 flex flex-wrap items-end gap-2">
                  <CompactNumberInput
                    dense
                    label="VMB Retained %"
                    value={inputs.vmbRetainedRate}
                    onChange={set("vmbRetainedRate")}
                    step={0.1}
                  />
                  <CompactNumberInput
                    dense
                    label="Co-Marketing Pool %"
                    value={inputs.coMarketingPoolRate}
                    onChange={set("coMarketingPoolRate")}
                    step={0.1}
                  />
                  <div className="w-fit max-w-full min-w-0">
                    <div className="text-[10px] font-medium leading-tight text-slate-700">
                      Total Platform Fee %
                    </div>
                    <div
                      className="mt-0.5 flex h-8 w-[6ch] min-w-0 max-w-full items-center rounded-md border border-dashed border-slate-200 bg-slate-50 px-2 text-xs font-semibold tabular-nums text-slate-800"
                      aria-readonly
                    >
                      {NUM1.format(totalPlatformFeePct)}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-fit max-w-full min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Level Weights
                </div>
                <div className="mt-1 flex flex-wrap items-end gap-2">
                  <CompactNumberInput
                    dense
                    label="L1 %"
                    value={inputs.level1Pct}
                    onChange={set("level1Pct")}
                    step={1}
                  />
                  <CompactNumberInput
                    dense
                    label="L2 %"
                    value={inputs.level2Pct}
                    onChange={set("level2Pct")}
                    step={1}
                  />
                  <CompactNumberInput
                    dense
                    label="L3 %"
                    value={inputs.level3Pct}
                    onChange={set("level3Pct")}
                    step={1}
                  />
                  <CompactNumberInput
                    dense
                    label="L4 %"
                    value={inputs.level4Pct}
                    onChange={set("level4Pct")}
                    step={1}
                  />
                  <CompactNumberInput
                    dense
                    label="L5 %"
                    value={inputs.level5Pct}
                    onChange={set("level5Pct")}
                    step={1}
                  />
                  <CompactNumberInput
                    dense
                    label="L6 %"
                    value={inputs.level6Pct}
                    onChange={set("level6Pct")}
                    step={1}
                  />
                  <CompactNumberInput
                    dense
                    label="Bonus Pool %"
                    value={inputs.bonusPoolPct}
                    onChange={set("bonusPoolPct")}
                    step={1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 sm:mr-auto">
            <span className="text-[10px] font-medium whitespace-nowrap text-slate-500">
              Presets
            </span>
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] text-slate-400">Load</span>
              <div className="flex overflow-visible rounded border border-slate-200">
                {PRESET_SLOTS.map((n) => (
                  <button
                    key={`preset-load-${n}`}
                    type="button"
                    disabled={!presetFilled[n - 1]}
                    aria-label={
                      presetFilled[n - 1] ?
                        n === 1 ?
                          `Load preset ${n} (VMB default)`
                        : `Load preset ${n}`
                      : `Preset ${n} is empty`
                    }
                    onClick={() => loadPreset(n)}
                    className={`h-7 min-w-[1.75rem] px-1.5 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                      activePresetSlot === n ?
                        "bg-amber-100 text-amber-950"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                    } ${n < 4 ? "border-r border-slate-200" : ""}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-0.5">
              <span className="text-[9px] text-slate-400">Save</span>
              {PRESET_SLOTS.map((n) => (
                <button
                  key={`preset-save-${n}`}
                  type="button"
                  aria-label={`Save current inputs to preset ${n}`}
                  onClick={() => savePreset(n)}
                  className="h-7 rounded border border-slate-200 bg-white px-1.5 text-[9px] font-medium text-slate-700 hover:bg-slate-50"
                >
                  Save {n}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setInputs({ ...DEFAULT_INPUTS });
              setActivePresetSlot(null);
            }}
            className="h-7 shrink-0 rounded border border-slate-200 bg-white px-2.5 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset defaults
          </button>
          <button
            type="button"
            onClick={resetToVmbDefault}
            className="h-7 shrink-0 rounded border border-amber-300 bg-amber-50 px-2.5 text-[10px] font-medium text-amber-950 hover:bg-amber-100/90"
            title="Clears all presets, writes VMB defaults to Preset 1, resets the form"
          >
            Reset to VMB Default
          </button>
        </div>

        <div className="w-full min-w-0 space-y-3">
          <CollapsibleCard
            title="Table 1 — Monthly Network Output"
            bodyClassName="overflow-x-auto"
          >
            <table className="w-full min-w-[1420px] text-left text-xs">
              <thead className="bg-vmb-table-header text-vmb-text-muted">
                <tr>
                  <th className="px-2 py-2 font-medium">Month</th>
                  <th className="px-2 py-2 font-medium">Active salons</th>
                  <th className="px-2 py-2 font-medium">New salon adds</th>
                  <th className="px-2 py-2 font-medium">
                    Client-driven salon adds
                  </th>
                  <th className="px-2 py-2 font-medium">Total new salons</th>
                  <th className="px-2 py-2 font-medium">New clients</th>
                  <th className="px-2 py-2 font-medium">Repeat clients</th>
                  <th className="px-2 py-2 font-medium">Active clients</th>
                  <th className="px-2 py-2 font-medium">L1 clients</th>
                  <th className="px-2 py-2 font-medium">L2 clients</th>
                  <th className="px-2 py-2 font-medium">L3 clients</th>
                  <th className="px-2 py-2 font-medium">L4 clients</th>
                  <th className="px-2 py-2 font-medium">L5 clients</th>
                  <th className="px-2 py-2 font-medium">L6 clients</th>
                  <th className="px-2 py-2 font-medium">Gross revenue</th>
                  <th className="px-2 py-2 font-medium">VMB retained</th>
                  <th className="px-2 py-2 font-medium">Co-marketing pool</th>
                  <th className="px-2 py-2 font-medium">Bonus Pool $</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRows.map((r) => (
                  <tr
                    key={r.month}
                    className="border-t border-vmb-border-light odd:bg-vmb-bg-soft/50"
                  >
                    <td className="px-2 py-1.5 font-medium">{r.month}</td>
                    <td className="px-2 py-1.5">{fmtCountUp(r.activeSalons)}</td>
                    <td className="px-2 py-1.5">
                      {fmtSalonIntCell(r.newSalonsSalonDriven)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtSalonIntCell(r.newSalonsClientDriven)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtSalonIntCell(r.newSalons)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtSalonIntCell(r.newClients)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtSalonIntCell(r.repeatClients)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtSalonIntCell(r.activeClients)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtCountUp(r.activeClientsByLevel.level1)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtCountUp(r.activeClientsByLevel.level2)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtCountUp(r.activeClientsByLevel.level3)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtCountUp(r.activeClientsByLevel.level4)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtCountUp(r.activeClientsByLevel.level5)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtCountUp(r.activeClientsByLevel.level6)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.totalGrossRevenue)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.vmbRetainedRevenue)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.coMarketingPool)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.bonusPoolDollars)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CollapsibleCard>

          <CollapsibleCard
            title="Table 2 — Co-Marketing Output"
            bodyClassName="overflow-x-auto"
          >
            <table className="w-full min-w-[980px] text-left text-xs">
              <thead className="bg-vmb-table-header text-vmb-text-muted">
                <tr>
                  <th className="px-2 py-2 font-medium">Month</th>
                  <th className="px-2 py-2 font-medium">Co-marketing pool</th>
                  <th className="px-2 py-2 font-medium">L1</th>
                  <th className="px-2 py-2 font-medium">L2</th>
                  <th className="px-2 py-2 font-medium">L3</th>
                  <th className="px-2 py-2 font-medium">L4</th>
                  <th className="px-2 py-2 font-medium">L5</th>
                  <th className="px-2 py-2 font-medium">L6</th>
                  <th className="px-2 py-2 font-medium">Bonus Pool $</th>
                  <th className="px-2 py-2 font-medium">
                    Distributed co-marketing
                  </th>
                  <th className="px-2 py-2 font-medium">
                    Level 0 / VMB Salons
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyRows.map((r) => (
                  <tr
                    key={r.month}
                    className="border-t border-vmb-border-light odd:bg-vmb-bg-soft/50"
                  >
                    <td className="px-2 py-1.5 font-medium">{r.month}</td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.coMarketingPool)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.qualifiedPayoutsByLevel.level1)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.qualifiedPayoutsByLevel.level2)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.qualifiedPayoutsByLevel.level3)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.qualifiedPayoutsByLevel.level4)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.qualifiedPayoutsByLevel.level5)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.qualifiedPayoutsByLevel.level6)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.bonusPoolDollars)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.distributedCoMarketing)}
                    </td>
                    <td className="px-2 py-1.5">
                      {fmtMoney0Up(r.level0VmbSalonsPayout)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CollapsibleCard>
      </div>

      <div className="flex min-w-0 w-full flex-col gap-3 sm:gap-4">
          <h2 className="text-xs font-semibold text-vmb-text-main">Outputs</h2>

          <div className="grid min-w-0 gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <SummaryCard
              label="Gross network revenue"
              value={CURRENCY.format(summary.cumulativeRevenue)}
            />
            <SummaryCard
              label="VMB retained revenue"
              value={CURRENCY.format(summary.cumulativeVmbRetainedRevenue)}
              sub={`${numOr0(inputs.vmbRetainedRate)}% of gross`}
            />
            <SummaryCard
              label="Co-marketing pool"
              value={CURRENCY.format(summary.cumulativeCoMarketingPool)}
              sub={`${numOr0(inputs.coMarketingPoolRate)}% of gross`}
            />
            <SummaryCard
              label="Distributed co-marketing"
              value={CURRENCY.format(summary.cumulativeDistributedCoMarketing)}
            />
            <SummaryCard
              label="Level 0 / VMB Salons"
              value={CURRENCY.format(summary.cumulativeLevel0VmbSalons)}
              sub="Only when no qualified levels"
            />
            <SummaryCard
              label="Ending active salons"
              value={NUM.format(summary.endingSalons)}
            />
            <SummaryCard
              label="Ending active clients"
              value={NUM.format(summary.endingActiveClients)}
            />
            <SummaryCard
              label="Cumulative new clients"
              value={NUM.format(summary.cumulativeClients)}
            />
          </div>

          <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-2">
            <CollapsibleCard title="Gross revenue by month">
              <div className="h-52 w-full min-w-0 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee4dd" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `$${NUM.format(v)}`}
                    />
                    <Tooltip
                      formatter={(v) => [CURRENCY.format(v), "Gross revenue"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#a45f76"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CollapsibleCard>

            <CollapsibleCard title="Active salons by month">
              <div className="h-52 w-full min-w-0 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartSalons}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee4dd" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="salons"
                      name="Active salons"
                      stroke="#333232"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="newSalons"
                      name="New salons (producing this month)"
                      stroke="#b88f45"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Level fill by month (active clients)"
              className="lg:col-span-2"
            >
              <div className="h-60 w-full min-w-0 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartLevels}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee4dd" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => NUM1.format(v)} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="L1"
                      stackId="a"
                      fill="#333232"
                      stroke="#23272c"
                    />
                    <Area
                      type="monotone"
                      dataKey="L2"
                      stackId="a"
                      fill="#5a5858"
                      stroke="#333"
                    />
                    <Area
                      type="monotone"
                      dataKey="L3"
                      stackId="a"
                      fill="#7a8497"
                      stroke="#555"
                    />
                    <Area
                      type="monotone"
                      dataKey="L4"
                      stackId="a"
                      fill="#b88f45"
                      stroke="#8a6d35"
                    />
                    <Area
                      type="monotone"
                      dataKey="L5"
                      stackId="a"
                      fill="#d9cec3"
                      stroke="#a09890"
                    />
                    <Area
                      type="monotone"
                      dataKey="L6"
                      stackId="a"
                      fill="#d8bcc1"
                      stroke="#a45f76"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Distributed co-marketing vs Level 0 / VMB Salons"
              className="lg:col-span-2"
            >
              <div className="h-52 w-full min-w-0 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartPayouts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee4dd" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `$${NUM.format(v)}`}
                    />
                    <Tooltip
                      formatter={(v) => [CURRENCY.format(v), ""]}
                    />
                    <Legend />
                    <Bar
                      dataKey="distributedCoMarketing"
                      name="Distributed co-marketing"
                      fill="#7f946e"
                      stackId="p"
                    />
                    <Bar
                      dataKey="level0VmbSalons"
                      name="Level 0 / VMB Salons"
                      fill="#c9bfb8"
                      stackId="p"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CollapsibleCard>
          </div>
      </div>
      </div>
    </div>
  );
}
