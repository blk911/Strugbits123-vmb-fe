/** Mock network lists for salon owner /network routes. */

export const trustedClientsMock = [
  { id: "tc1", name: "Morgan Ellis", visits: 18, lastVisit: "Apr 12", note: "Books Sasha · refers friends" },
  { id: "tc2", name: "Priya Shah", visits: 14, lastVisit: "Apr 3", note: "Color cadence · product attach" },
  { id: "tc3", name: "Jordan Kim", visits: 22, lastVisit: "Mar 30", note: "Nails + events" },
];

export const referralActivityMock = [
  { id: "rf1", name: "Sloane Witt", referred: 3, lastReferral: "Mar 28", channel: "VMB invite" },
  { id: "rf2", name: "Blake Turner", referred: 2, lastReferral: "Apr 2", channel: "Wedding circle" },
  { id: "rf3", name: "Avery Cole", referred: 5, lastReferral: "Apr 8", channel: "Social + VIP" },
];

export const vipClientsMock = [
  { id: "v1", name: "Morgan Ashe", ltv: "$890", tier: "VIP color", nextNudge: "May refresh" },
  { id: "v2", name: "Reese Dalton", ltv: "$940", tier: "Extensions", nextNudge: "Hold Tuesday" },
  { id: "v3", name: "Skyler Fox", ltv: "$655", tier: "Spa combo", nextNudge: "Referral prompt" },
];
