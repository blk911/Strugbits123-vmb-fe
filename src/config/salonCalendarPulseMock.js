/**
 * Mock calendar snapshot for Calendar Pulse (salon dashboard).
 * Replace with live schedule when Google Calendar + VMB booking sync exists.
 */

export const calendarPulse = {
  /** Consolidated command summary (no duplicate dashboard cards). */
  command: {
    opportunitiesReady: 5,
    projectedThisWeek: 3240,
    campaignsAwaitingApproval: 2,
    clientResponsesPending: 1,
  },
  today: {
    booked: 3,
    openWindows: 2,
    projectedRevenue: 640,
    vmbRequestsPending: 1,
    blocks: [
      {
        label: "AM",
        time: "9–12",
        booked: 2,
        open: 1,
        opportunity: "Fill candidate",
      },
      {
        label: "PM",
        time: "12–5",
        booked: 1,
        open: 1,
        opportunity: "Gift request window",
      },
      {
        label: "Evening",
        time: "5–8",
        booked: 0,
        open: 1,
        opportunity: "Reactivation window",
      },
    ],
  },
  week: {
    appointments: 18,
    projectedRevenue: 3850,
    openSlots: 6,
    highValueFillOps: 3,
    campaignReadyWindows: 2,
  },
  /** Live-style day board for DAILY PULSE column 2 (replace with API). */
  todayScheduleBands: [
    {
      label: "AM",
      rows: [
        { time: "9:00", line: "Hair Color — Amanda" },
        { time: "10:30", line: "Balayage — Kristin" },
      ],
    },
    {
      label: "NOON",
      rows: [{ time: "12:00", line: "Cut + Style — Jess" }],
    },
    {
      label: "PM",
      rows: [
        { time: "2:00", line: "Extensions — Tara" },
        { time: "4:00", line: "Open Window", isOpen: true },
      ],
    },
    {
      label: "EVENING",
      rows: [{ time: "6:00", line: "Open Window", isOpen: true }],
    },
  ],
  /** Weekly capacity intelligence — column 3 notes. */
  weekNotes: [
    "Thursday weak afternoon",
    "Saturday nearly full",
    "3 VIPs due for rebook",
  ],
};

/** Mock rows for “View Day” modal */
export const calendarPulseTodayScheduleMock = [
  {
    id: "a1",
    start: "9:30 AM",
    end: "10:30 AM",
    client: "Maya Chen",
    service: "Gel manicure",
    provider: "Jordan K.",
    source: "Vagaro",
  },
  {
    id: "a2",
    start: "11:00 AM",
    end: "12:45 PM",
    client: "Priya Shah",
    service: "Balayage refresh",
    provider: "Sasha R.",
    source: "VMB request",
  },
  {
    id: "a3",
    start: "2:15 PM",
    end: "3:00 PM",
    client: "Samira Noor",
    service: "Brow + lash",
    provider: "Mia L.",
    source: "Square",
  },
];

/** Mock fill opportunities for “Fill Openings” modal */
export const calendarPulseFillOpportunitiesMock = [
  {
    id: "f1",
    window: "AM · 11:45–12:00",
    opportunity: "Fill candidate",
    suggestedAction: "Tuesday Glow-Up nudge to nail regulars",
    estValue: "$85–120",
  },
  {
    id: "f2",
    window: "PM · 3:30–4:15",
    opportunity: "Gift request window",
    suggestedAction: "Lightweight gift-occasion prompt (no discount)",
    estValue: "$60–95",
  },
];
