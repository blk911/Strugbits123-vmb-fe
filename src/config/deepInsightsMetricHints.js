/** Tooltip copy: what it means + why it matters — one sentence each. */

export const heroMetricHints = {
  clients: "Unique clients active in the imported data period.",
  revenue:
    "Total completed service revenue collected during the selected period.",
  appts: "Appointments marked completed and successfully serviced.",
  ticket: "Average collected revenue per completed appointment.",
  rebook: "Percent of clients who scheduled another appointment.",
  referral:
    "Clients connected through referrals, invitations, or repeat network behavior.",
};

export const revenueSignalHints = {
  "Highest Revenue Service":
    "Service category generating the most total revenue.",
  "Highest Revenue Provider":
    "Provider producing the highest collected revenue.",
  "Most Profitable Days":
    "Days with strongest revenue and booking concentration.",
  "Slowest Revenue Window":
    "Lowest-performing schedule window based on bookings and revenue.",
};

export const clientBehaviorHints = {
  "Repeat Client Rate": "Clients returning for multiple appointments.",
  "Clients inactive 90+ days":
    "Clients who may require reactivation outreach.",
  "High-value clients ($500+ lifetime)":
    "Clients with elevated lifetime spend or premium booking behavior.",
  "Birthday month opportunities":
    "Clients with upcoming birthdays suitable for gift or invite campaigns.",
  "Referral-source clusters":
    "Groups of clients connected through referrals or shared booking behavior.",
};

/** Order matches mockPresentation.vmbOpportunities */
export const vmbOpportunityHints = [
  "Clients likely to respond positively to private-network invitations.",
  "Clients already demonstrating referral or influence behavior.",
  "Time periods where promotions or gifting may increase bookings.",
  "Clients associated with group or event-driven booking behavior.",
  "Clients showing prior engagement but declining visit frequency.",
];

export const bookingPatternCardHints = {
  busiestDays: "Days with highest appointment concentration.",
  busiestProviders: "Providers carrying the largest booking volume.",
  cancellationRate: "Percent of appointments cancelled before service.",
  noShowRate: "Appointments missed without completed service.",
  bookingLeadTime:
    "Average time between booking creation and appointment date.",
  operationsSnapshot:
    "Cancellation, no-show, and lead-time signals in one reliability view.",
};

export const segmentHints = {
  vip: "High-spend or high-frequency clients.",
  referral: "Clients connected to referral activity.",
  reactivation: "Clients with declining or inactive booking behavior.",
  color: "Clients frequently booking color-related services.",
  nails: "Clients consistently booking nail services.",
  gift: "Clients showing gifting or prepaid booking activity.",
};
