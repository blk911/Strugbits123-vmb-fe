/**
 * Mock client-facing salon profiles for /salon/:salonSlug.
 * Replace with API + slug index when backend exists.
 */

/** @typedef {{ id: string; name: string; note?: string }} MockFavoritePlaceholder */

/**
 * @typedef {{
 *   slug: string;
 *   pageTitle: string;
 *   salonName: string;
 *   ownerFirstName: string;
 *   recipientFirstName: string;
 *   heroMessage: string;
 *   heroImageLabel: string;
 *   featuredOffer: {
 *     headline: string;
 *     subline: string;
 *     detail: string;
 *     expiresLabel: string;
 *   };
 *   appointmentTeaser: string;
 *   services: Array<{ id: string; label: string; blurb: string }>;
 *   giftTeaser: string;
 *   inviteTeaser: string;
 *   trustedFavoritesPlaceholder: string;
 *   favorites: MockFavoritePlaceholder[];
 * }} MockSalonLanding
 */

/** @type {Record<string, MockSalonLanding>} */
const BY_SLUG = {
  "jennys-salon": {
    slug: "jennys-salon",
    pageTitle: "Jenny's Private Client Network",
    salonName: "Jenny's Studio",
    ownerFirstName: "Jenny",
    recipientFirstName: "Maya",
    heroImageLabel: "Salon portrait",
    heroMessage:
      "You're invited into a quieter, relationship-first circle — reserved time, honest recommendations, and zero pressure. We'd love to have you close to the schedule.",
    featuredOffer: {
      headline: "Tuesday glow session — member window",
      subline: "Manicure or express refresh",
      detail:
        "Hold a Tuesday afternoon spot before the week opens to the public. One calm reminder only if you need it.",
      expiresLabel: "Offer window · through May 2026",
    },
    appointmentTeaser:
      "Need a specific time? Request a hold or share your ideal day — we’ll confirm personally, never autopilot.",
    services: [
      { id: "s1", label: "Manicure & gel", blurb: "Shape, care, long-wear finish." },
      { id: "s2", label: "Color & gloss", blurb: "Refresh tone with low-drama upkeep." },
      { id: "s3", label: "Brow + lash tidy", blurb: "Polish without overdoing it." },
      { id: "s4", label: "Styling cut", blurb: "Cut and finish tailored to your day." },
      { id: "s5", label: "Event prep", blurb: "Quiet block for special dates." },
    ],
    giftTeaser:
      "Send a gift request for someone you love — we'll package it gently and let them choose timing.",
    inviteTeaser:
      "Know someone who’d fit this circle? Invite them privately — no broadcast, no blast messages.",
    trustedFavoritesPlaceholder:
      "When you tell us what you love elsewhere — books, coffee, small brands — we’ll keep a tasteful shortlist here. (Concept only for now.)",
    favorites: [
      { id: "f1", name: "Quiet Hour coffee", note: "Neighborhood roast · low noise" },
      { id: "f2", name: "Lineage oils", note: "Scent you mentioned last visit" },
    ],
  },
  "preview-salon": {
    slug: "preview-salon",
    pageTitle: "Salon Invitation · Private Client Network",
    salonName: "Jenny's Studio",
    ownerFirstName: "Jenny",
    recipientFirstName: "Ava",
    heroImageLabel: "Welcome",
    heroMessage:
      "A soft invitation to join our private client path — your offers, holds, and gifts stay human-reviewed.",
    featuredOffer: {
      headline: "Spring refresh window",
      subline: "Color & gloss touch-up",
      detail: "Members-first booking block with a single follow-up if helpful.",
      expiresLabel: "Offer window · this season",
    },
    appointmentTeaser: "Request a hold — we reply on your terms.",
    services: [
      { id: "s1", label: "Nails", blurb: "Care-forward manicures." },
      { id: "s2", label: "Color", blurb: "Tone you can live in." },
    ],
    giftTeaser: "Gift a treatment — gentle handoff.",
    inviteTeaser: "Invite a trusted friend to the network.",
    trustedFavoritesPlaceholder: "Your favorites will appear here after you share them.",
    favorites: [],
  },
};

/**
 * @param {string | undefined} slug
 * @returns {MockSalonLanding | null}
 */
export function getSalonLandingBySlug(slug) {
  if (!slug || typeof slug !== "string") return null;
  return BY_SLUG[slug] ?? null;
}

/** @type {MockSalonLanding[]} */
export const mockSalonLandingList = Object.values(BY_SLUG);
