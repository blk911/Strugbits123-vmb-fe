/**
 * Synthetic “canonical” snapshot for Deep Insights preview analytics.
 * Future: replace with normalized entities from import pipeline (clients, appointments, revenue lines).
 */

/** @typedef {{ id: string; displayName: string; lifetimeValueCents: number; segmentTags: string[] }} MockClient */

export const MOCK_IMPORT_META = {
  schemaVersion: "deep-insights.canonical.v0.preview",
  generatedAt: "2026-05-01T12:00:00.000Z",
  rowCounts: {
    clients: 1247,
    appointments: 4682,
    transactions: 3921,
  },
};

/** High-level KPIs derived from synthetic normalization (mock). */
export const mockPresentation = {
  heroStats: [
    { id: "clients", label: "Total Clients", value: "1,247", hint: "active + lapsed 24mo" },
    { id: "revenue", label: "Monthly Revenue", value: "$84,320", hint: "rolling 30-day" },
    { id: "appts", label: "Completed Appointments", value: "892", hint: "same period" },
    { id: "ticket", label: "Average Ticket", value: "$94", hint: "service + add-ons" },
    { id: "rebook", label: "Rebooking Rate", value: "68%", hint: "within 8 weeks" },
    { id: "referral", label: "Referral Activity", value: "24%", hint: "new guests attributed" },
  ],
  revenueSignals: [
    { title: "Highest Revenue Service", value: "Balayage", detail: "32% of color revenue" },
    {
      title: "Highest Revenue Provider",
      value: "Sasha Reed",
      detail: "$18.4k attributed this month",
    },
    {
      title: "Most Profitable Days",
      value: "Thursday + Friday",
      detail: "Peaks 11am–2pm & 4pm–7pm",
    },
    {
      title: "Slowest Revenue Window",
      value: "Tuesday 1PM–4PM",
      detail: "Fill rate 41% under weekly avg",
    },
  ],
  clientBehavior: [
    {
      title: "Repeat Client Rate",
      value: "64%",
      detail: "Returned within 90 days of last visit",
    },
    {
      title: "Clients inactive 90+ days",
      value: "187",
      detail: "High historical spend — reactivation pool",
    },
    {
      title: "High-value clients ($500+ lifetime)",
      value: "214",
      detail: "Top decile by LTV (synthetic cohort)",
    },
    {
      title: "Birthday month opportunities",
      value: "38",
      detail: "Celebration events in next 45 days",
    },
    {
      title: "Referral-source clusters",
      value: "6",
      detail: "Distinct social + stylist introduction paths",
    },
  ],
  vmbOpportunities: [
    {
      title: "VMB invite activation",
      body: "17 clients appear ideal for VMB invite activation based on repeat cadence and product attachment.",
      tone: "gem",
    },
    {
      title: "Referrer value unlock",
      body: "12 high-spend clients have referred others previously — prime for gifting-led follow-up.",
      tone: "gem",
    },
    {
      title: "Schedule demand shaping",
      body: "Tuesday afternoons may benefit from gift-request campaigns paired with lighter-touch bookings.",
      tone: "gem",
    },
    {
      title: "Event-driven repeats",
      body: "8 wedding-party clients generated repeat bookings within 60 days — replicate with seasonal prompts.",
      tone: "gem",
    },
    {
      title: "Reactivation runway",
      body: "23 clients match a high-LTV reactivation profile (lapsed 60–120 days, strong color history).",
      tone: "gem",
    },
  ],
  bookingPatterns: {
    busiestDays: [
      { label: "Fri", pct: 100 },
      { label: "Thu", pct: 92 },
      { label: "Sat", pct: 88 },
      { label: "Wed", pct: 71 },
      { label: "Tue", pct: 62 },
      { label: "Mon", pct: 54 },
      { label: "Sun", pct: 38 },
    ],
    busiestProviders: [
      { label: "Sasha R.", pct: 100 },
      { label: "Jordan K.", pct: 86 },
      { label: "Mia L.", pct: 79 },
      { label: "Alex T.", pct: 71 },
      { label: "Riley P.", pct: 64 },
    ],
    cancellationRate: "8.2%",
    noShowRate: "3.1%",
    avgBookingLeadTimeDays: "11",
  },
  segments: [
    { id: "vip", name: "VIP Clients", count: 86, spendSummary: "$412k lifetime (cohort)" },
    { id: "referral", name: "Referral Sources", count: 142, spendSummary: "$198k referred-booking value" },
    {
      id: "reactivation",
      name: "Reactivation Targets",
      count: 187,
      spendSummary: "Est. $63k recoverable window",
    },
    { id: "color", name: "Color Clients", count: 534, spendSummary: "$28 avg uplift vs cut-only" },
    { id: "nails", name: "Nail Regulars", count: 211, spendSummary: "Highest visit frequency quartile" },
    { id: "gift", name: "Gift Buyers", count: 96, spendSummary: "Cross-sell index 1.4× salon avg" },
  ],
};

export const futureInsightPlaceholders = [
  "Referral graph",
  "Network overlap maps",
  "VMB gifting pattern deltas",
  "Client social influence scoring",
  "Schedule optimization",
  "Staff performance trends",
  "Conversion funnels",
  "Client retention decay curves",
  "Revenue forecasting",
  "Seasonal booking patterns",
];
