import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  canSubmitCredentialAssistForm,
  validateCredentialAssistPayload,
} from "../../../lib/credentialAssist.js";
import {
  createDeepDigSampleUploadEntry,
  findSampleExportById,
  findSampleForUploadLabel,
  getFileDisplayName,
  getLoadedSampleForUpload,
  getSampleExportsForProvider,
  PROVIDER_SCHEMA_STATUS,
} from "./providerSchemas";
import {
  FaArrowLeft,
  FaBook,
  FaBullhorn,
  FaCalendarAlt,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaImage,
  FaShareAlt,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";

const DATE_RANGE_LABEL = "Last 12 months";

const ACCEPT_ATTR =
  ".csv,.xlsx,.xls,.pdf,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf";

/** @typedef {{ id: string; name: string; category: string; whatToExport: string[]; dataLookingFor: string[]; exportPrefix?: string }} ProviderDef */

/** @type {ProviderDef[]} */
const PROVIDER_DEFINITIONS = [
  {
    id: "vagaro",
    name: "Vagaro",
    category: "Booking / POS",
    whatToExport: [
      "Appointments report",
      "Client list",
      "Sales / transactions",
      "Service list",
      "Staff / employee report",
      "Product / retail sales if available",
    ],
    dataLookingFor: [
      "Visit cadence, no-show patterns, and service mix",
      "Per-client spend and retail attachment",
      "Provider utilization vs. booked hours",
    ],
  },
  {
    id: "glossgenius",
    name: "GlossGenius",
    category: "Booking / POS",
    whatToExport: [
      "Appointments",
      "Clients",
      "Payments / sales",
      "Services",
      "Team members",
      "Reviews / client notes if available",
    ],
    dataLookingFor: [
      "Booking lead times and cancellation reasons",
      "Payment methods and average ticket",
      "Staff columns tied to completed services",
    ],
  },
  {
    id: "boulevard",
    name: "Boulevard",
    category: "Booking / POS",
    exportPrefix: "From Reports or Analytics, export CSV where available:",
    whatToExport: [
      "Appointments / guest visits",
      "Guest profiles and visit history",
      "Closed tickets / payments",
      "Service catalog and add-ons",
      "Staff roster and assignments",
    ],
    dataLookingFor: [
      "High-value guest segments and rebooking gaps",
      "Add-on attach rate by service category",
    ],
  },
  {
    id: "mindbody",
    name: "Mindbody",
    category: "Booking / POS",
    whatToExport: [
      "Class / appointment attendance reports",
      "Client list with visit counts",
      "Sales detail / transactions",
      "Services and pricing",
      "Staff performance reports if enabled",
    ],
    dataLookingFor: [
      "Series and membership usage vs. single visits",
      "Peak demand windows by service",
    ],
  },
  {
    id: "fresha",
    name: "Fresha",
    category: "Booking / POS",
    whatToExport: [
      "Appointments / calendar export",
      "Client export",
      "Sales records",
      "Services list",
      "Team / staff export",
    ],
    dataLookingFor: [
      "New vs. returning client ratios",
      "Category-level revenue concentration",
    ],
  },
  {
    id: "booksy",
    name: "Booksy",
    category: "Booking / POS",
    whatToExport: [
      "Booking history / appointments",
      "Client database",
      "Sales or checkout history",
      "Service menu",
      "Staff list",
    ],
    dataLookingFor: [
      "No-show and late cancellation rates",
      "Services driving the most repeat visits",
    ],
  },
  {
    id: "square-appointments",
    name: "Square Appointments",
    category: "Booking / POS",
    whatToExport: [
      "Appointments export",
      "Customer directory",
      "Item sales / transactions from Square",
      "Services / items list",
      "Team members",
    ],
    dataLookingFor: [
      "Retail vs. service revenue split",
      "Card-present vs. online payment mix",
    ],
  },
  {
    id: "mangomint",
    name: "Mangomint",
    category: "Booking / POS",
    whatToExport: [
      "Appointments / schedule export",
      "Clients",
      "Sales / payments",
      "Services and products",
      "Staff / providers",
    ],
    dataLookingFor: [
      "Ticket size by provider",
      "Retail attachment on service visits",
    ],
  },
  {
    id: "gusto",
    name: "Gusto",
    category: "Payroll / Scheduling",
    whatToExport: [
      "Payroll summary by employee (last 12 months)",
      "Time-off and hours if tracked in Gusto",
    ],
    dataLookingFor: [
      "Labor cost vs. booked revenue (when combined with POS)",
      "Overtime or coverage spikes",
    ],
  },
  {
    id: "adp",
    name: "ADP",
    category: "Payroll / Scheduling",
    whatToExport: [
      "Payroll register or earnings summary exports",
      "Employee roster with roles",
    ],
    dataLookingFor: [
      "Stable cost-per-hour vs. scheduling demand",
    ],
  },
  {
    id: "paychex",
    name: "Paychex",
    category: "Payroll / Scheduling",
    whatToExport: [
      "Payroll detail / check register exports",
      "Employee list",
    ],
    dataLookingFor: [
      "Wage burden aligned to peak service days",
    ],
  },
  {
    id: "homebase",
    name: "Homebase",
    category: "Payroll / Scheduling",
    whatToExport: [
      "Schedule history / timesheets",
      "Labor summary reports",
    ],
    dataLookingFor: [
      "Scheduled vs. actual hours vs. bookings",
    ],
  },
  {
    id: "when-i-work",
    name: "When I Work",
    category: "Payroll / Scheduling",
    whatToExport: [
      "Shift and attendance export",
      "Time clock totals if used",
    ],
    dataLookingFor: [
      "Coverage gaps on high-demand days",
    ],
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "Marketing / CRM",
    whatToExport: [
      "Campaign performance (opens, clicks)",
      "Audience / list snapshot (aggregated; avoid unnecessary PII)",
    ],
    dataLookingFor: [
      "Campaigns that correlate with booking bursts",
    ],
  },
  {
    id: "klaviyo",
    name: "Klaviyo",
    category: "Marketing / CRM",
    whatToExport: [
      "Flow and campaign metrics export",
      "Profile or event summary where export is available",
    ],
    dataLookingFor: [
      "Email/SMS timing vs. appointment creation",
    ],
  },
  {
    id: "constant-contact",
    name: "Constant Contact",
    category: "Marketing / CRM",
    whatToExport: [
      "Campaign reports",
      "Contact activity summary",
    ],
    dataLookingFor: [
      "Engagement trends before busy seasons",
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Marketing / CRM",
    whatToExport: [
      "Marketing email performance",
      "Contact lifecycle or deal exports if you track B2B partnerships",
    ],
    dataLookingFor: [
      "Lead sources that mention referrals or events",
    ],
  },
  {
    id: "instagram-meta",
    name: "Instagram / Meta",
    category: "Social / Reviews",
    exportPrefix: "What to export/connect:",
    whatToExport: [
      "Post and reel insights",
      "Reach",
      "Saves",
      "Shares",
      "Comments",
      "Profile visits",
      "Ad spend if used",
    ],
    dataLookingFor: [
      "Content themes that precede profile visits or DM spikes",
      "Organic vs. paid lift when ads are active",
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    category: "Social / Reviews",
    whatToExport: [
      "Video analytics export or screenshots of metrics",
      "Follower and traffic sources if available",
    ],
    dataLookingFor: [
      "Short-form spikes vs. booking tool inquiries",
    ],
  },
  {
    id: "google-business",
    name: "Google Business Profile",
    category: "Social / Reviews",
    whatToExport: [
      "Performance report (views, searches, actions)",
      "Reviews export or summary",
    ],
    dataLookingFor: [
      "“Book” / call / direction actions vs. seasonality",
    ],
  },
  {
    id: "yelp",
    name: "Yelp",
    category: "Social / Reviews",
    whatToExport: [
      "Business analytics snapshot if available",
      "Review summary / ratings trend",
    ],
    dataLookingFor: [
      "Page views and customer leads vs. in-salon demand",
    ],
  },
];

const PROVIDER_BY_ID = Object.fromEntries(
  PROVIDER_DEFINITIONS.map((p) => [p.id, p]),
);

/**
 * @typedef {{ label: string; url: string }} ExportOfficialLink
 * @typedef {{ label: string; description: string }} ExportScreenshotSlot
 * @typedef {{ title?: string; steps: string[] }} ExportGuideStepGroup
 * @typedef {{
 *   providerName: string;
 *   confidenceChip: string;
 *   filterTier: "verified" | "research";
 *   officialLinks: ExportOfficialLink[];
 *   requiredExports: string[];
 *   expectedFileTypes: string;
 *   guideSteps: ExportGuideStepGroup[];
 *   screenshotSlots: ExportScreenshotSlot[];
 *   notes: string;
 *   supportFallback: string;
 *   whatWeNeedThisFor: string;
 * }} ProviderExportGuide
 */

/** @type {Record<string, ProviderExportGuide>} */
const PROVIDER_EXPORT_GUIDES = {
  vagaro: {
    providerName: "Vagaro",
    confidenceChip:
      "Verified — needs live account screenshot test",
    filterTier: "verified",
    officialLinks: [
      {
        label: "Appointment Summary Report",
        url: "https://support.vagaro.com/hc/en-us/articles/360000550993-Appointments-Summary-Report",
      },
      {
        label: "Sales Summary Report",
        url: "https://support.vagaro.com/hc/en-us/articles/360000348493-Sales-Summary-Report",
      },
      {
        label: "Source Report",
        url: "https://support.vagaro.com/hc/en-us/articles/360000549753-Track-Where-Bookings-are-Coming-from-with-the-Source-Report",
      },
    ],
    requiredExports: [
      "Appointments Summary",
      "Sales Summary",
      "Customer List",
      "Source / booking origin report",
      "Staff / employee report if available",
      "Product / retail sales if available",
    ],
    expectedFileTypes: "Excel (.xlsx) or PDF where the product allows export",
    guideSteps: [
      {
        title: "Export sequence",
        steps: [
          "Log in to Vagaro as owner/admin.",
          "Go to Reports.",
          "For appointments, open Appointments Summary.",
          "Select last 12 months as the date range.",
          "Run report.",
          "Use the action menu to Export Excel if available.",
          "Repeat for Sales Summary and Source Report.",
        ],
      },
    ],
    screenshotSlots: [
      {
        label: "Vagaro Reports menu",
        description: "Main Reports navigation after login.",
      },
      {
        label: "Appointments Summary filters",
        description: "Date range and filters before running the report.",
      },
      {
        label: "Export Excel menu",
        description: "Action menu showing Export PDF / Export Excel options.",
      },
    ],
    notes:
      "Vagaro docs show Export PDF / Export Excel options on appointment and sales reports.",
    supportFallback:
      "If a report cannot be exported from the UI, contact Vagaro support with the report name and request an owner-visible export path or data extract.",
    whatWeNeedThisFor:
      "We use these files to map visit cadence, revenue by service and staff, client sources, and retail attachment for Hidden Money Plays.",
  },
  glossgenius: {
    providerName: "GlossGenius",
    confidenceChip: "Verified — limited exports",
    filterTier: "verified",
    officialLinks: [
      {
        label: "Export Client List",
        url: "https://glossgenius.elevio.help/en/articles/792-how-to-export-your-client-list",
      },
      {
        label: "Exporting Data From Your GlossGenius Account",
        url: "https://glossgenius.elevio.help/en/articles/871-exporting-data-from-your-glossgenius-account",
      },
    ],
    requiredExports: [
      "Clients CSV",
      "Appointments if available",
      "Payments / sales if available",
      "Services",
      "Team members",
      "Reviews / notes if available",
    ],
    expectedFileTypes: "CSV for client list; other formats per in-app export",
    guideSteps: [
      {
        title: "Client export",
        steps: [
          "Log in to GlossGenius.",
          "Click Clients in navigation.",
          "Select Export Clients.",
          "Download CSV.",
          "For data not available in standard reports, contact GlossGenius support.",
        ],
      },
    ],
    screenshotSlots: [
      {
        label: "Clients navigation",
        description: "Clients section in main navigation.",
      },
      {
        label: "Export Clients button",
        description: "Export action before download.",
      },
      {
        label: "CSV downloaded confirmation",
        description: "Browser download bar or file in Downloads.",
      },
    ],
    notes:
      "GlossGenius confirms client list export as CSV; some other exports may require support.",
    supportFallback:
      "Ask GlossGenius support for CSV or spreadsheet exports for appointments, payments, services, and team roster if not surfaced in the UI.",
    whatWeNeedThisFor:
      "We combine clients, bookings, and payments to score cadence, ticket mix, and staff-attributed revenue.",
  },
  "square-appointments": {
    providerName: "Square Appointments",
    confidenceChip: "Verified",
    filterTier: "verified",
    officialLinks: [
      {
        label: "Export appointment history",
        url: "https://squareup.com/help/us/en/article/5351-manage-your-square-appointments-account-settings",
      },
      {
        label: "Print / export reports",
        url: "https://squareup.com/help/us/en/article/8362-print-export-or-email-your-reports",
      },
    ],
    requiredExports: [
      "Appointment history CSV",
      "Customer list CSV",
      "Sales reports CSV",
    ],
    expectedFileTypes: "CSV from Appointments History and Dashboard export flows",
    guideSteps: [
      {
        title: "Square Dashboard",
        steps: [
          "Sign in to Square Dashboard.",
          "Go to Appointments or Payments > Appointments.",
          "Click Settings > History.",
          "Click Export to download CSV.",
          "Export reports from Square Dashboard using Start Export.",
        ],
      },
    ],
    screenshotSlots: [
      {
        label: "Square Appointments settings",
        description: "Settings entry for the Appointments product.",
      },
      {
        label: "History page",
        description: "Appointment history list or date-filtered view.",
      },
      {
        label: "Export button",
        description: "Export control on history or reports.",
      },
    ],
    notes:
      "Square publishes appointment history CSV and broader report export flows in Dashboard.",
    supportFallback:
      "Use Square Help Center chat or seller support if History export or report export is missing for your account type.",
    whatWeNeedThisFor:
      "We align appointment volume, customer records, and payment reports for utilization and revenue-density plays.",
  },
  fresha: {
    providerName: "Fresha",
    confidenceChip: "Verified",
    filterTier: "verified",
    officialLinks: [
      {
        label: "Export reports",
        url: "https://www.fresha.com/help-center/knowledge-base/reports/191-export-reports",
      },
      {
        label: "Export client list",
        url: "https://www.fresha.com/help-center/knowledge-base/clients/58-export-your-client-list",
      },
      {
        label: "Data connector overview",
        url: "https://www.fresha.com/help-center/knowledge-base/reports/432-data-connector-overview",
      },
    ],
    requiredExports: [
      "Reports CSV/XLSX/PDF",
      "Client list CSV/Excel",
      "Sales / finance reports",
      "Bookings / appointments if available",
    ],
    expectedFileTypes: "CSV, XLSX, or PDF per report; client list Excel/CSV",
    guideSteps: [
      {
        title: "Reports and clients",
        steps: [
          "Go to Reports.",
          "Export available reports in CSV or XLSX.",
          "For clients, open Clients.",
          "Tap Actions / three dots.",
          "Export client list as Excel or CSV.",
          "If available, use Data Connector for deeper reporting.",
        ],
      },
    ],
    screenshotSlots: [
      {
        label: "Reports page",
        description: "Reports hub with export options.",
      },
      {
        label: "Export report button",
        description: "Format and download control for a report.",
      },
      {
        label: "Client actions menu",
        description: "Actions menu on Clients including export.",
      },
      {
        label: "Data connector page",
        description: "Data Connector overview or setup if enabled.",
      },
    ],
    notes:
      "Fresha documents multi-format report exports and a separate client-list export path.",
    supportFallback:
      "Contact Fresha support if a specific financial or booking report has no export in your plan; request spreadsheet-friendly formats.",
    whatWeNeedThisFor:
      "We join bookings, sales, and client lists to find cadence gaps, new vs. returning mix, and category concentration.",
  },
  booksy: {
    providerName: "Booksy",
    confidenceChip: "Partial — support fallback likely",
    filterTier: "research",
    officialLinks: [
      {
        label: "Booksy client list support",
        url: "https://support.booksy.com/hc/en-us/articles/16539806017938-How-do-I-obtain-a-copy-of-my-Client-List-from-Booksy",
      },
      {
        label: "Booksy data export section",
        url: "https://support.booksy.com/hc/en-us/sections/20664663544594-Data-Export",
      },
    ],
    requiredExports: [
      "Client list",
      "Appointments if available",
      "Sales / performance if available",
    ],
    expectedFileTypes: "CSV or file provided by Booksy support",
    guideSteps: [
      {
        title: "What to try first",
        steps: [
          "Try Customers section first.",
          "Look for Export CSV.",
          "If not available, contact Booksy support for a copy of the client list.",
          "Ask support whether appointments and sales history can be exported.",
        ],
      },
    ],
    screenshotSlots: [
      {
        label: "Customers page",
        description: "Customers list or detail area in Biz app.",
      },
      {
        label: "Export CSV area if visible",
        description: "Any self-serve export control you find.",
      },
      {
        label: "Support request fallback",
        description: "Support ticket or email confirming export delivery.",
      },
    ],
    notes:
      "Official Booksy support says client list export may require contacting support.",
    supportFallback:
      "Open a Booksy support ticket referencing Data Export and request client list plus any available appointment and sales exports for the last 12 months.",
    whatWeNeedThisFor:
      "We need client and visit history to model churn risk, repeat intervals, and revenue concentration.",
  },
  mangomint: {
    providerName: "Mangomint",
    confidenceChip: "Verified",
    filterTier: "verified",
    officialLinks: [
      {
        label: "Client list export",
        url: "https://www.mangomint.com/learn/navigating-the-client-list/",
      },
      {
        label: "Sales list export",
        url: "https://www.mangomint.com/learn/navigating-and-filtering-the-sales-page/",
      },
      {
        label: "Business reports",
        url: "https://www.mangomint.com/learn/business-reports/",
      },
    ],
    requiredExports: [
      "Client list CSV",
      "Sales list CSV",
      "Transactions CSV",
      "Business Intelligence appointment reports if available",
    ],
    expectedFileTypes: "CSV from Mangomint download actions",
    guideSteps: [
      {
        title: "Clients and sales",
        steps: [
          "Open Clients app.",
          "Select Options.",
          "Choose Download to export client list CSV.",
          "Open Sales app.",
          "Select Options > Download for sales list CSV.",
          "For transactions, open Sales > Options > View Transactions, then Options > Download.",
        ],
      },
    ],
    screenshotSlots: [
      {
        label: "Clients Options menu",
        description: "Options menu with Download for client list.",
      },
      {
        label: "Sales Options menu",
        description: "Sales list download path.",
      },
      {
        label: "Transactions export",
        description: "View Transactions then Download.",
      },
    ],
    notes:
      "Mangomint learn articles describe CSV downloads from Clients and Sales flows.",
    supportFallback:
      "If Business Intelligence reports are not visible on your plan, ask Mangomint which appointment analytics export replaces them.",
    whatWeNeedThisFor:
      "We use clients, sales, and transactions to compare provider economics, attach rates, and rebooking strength.",
  },
};

function buildGenericExportGuide(providerId) {
  const p = PROVIDER_BY_ID[providerId];
  return {
    providerName: p.name,
    confidenceChip: "Needs live test",
    filterTier: "research",
    officialLinks: [],
    requiredExports: [...p.whatToExport],
    expectedFileTypes: "CSV, XLSX, or PDF where the product allows",
    guideSteps: [
      {
        title: "Safe discovery path",
        steps: [
          `Log in to ${p.name} as an owner or admin.`,
          "Search the help center for keywords: export, download, reports, CSV.",
          "We do not publish exact click-by-click paths for this provider yet — locate menus on a live salon account before sharing instructions with clients.",
          "Prefer spreadsheet exports over screenshots when available.",
        ],
      },
    ],
    screenshotSlots: [
      {
        label: "Help center search results",
        description: "Relevant official articles about exports.",
      },
      {
        label: "Reports or data export screen",
        description: "Placeholder once you confirm where exports live.",
      },
      {
        label: "Downloaded file",
        description: "Filename and format for the team’s file checklist.",
      },
    ],
    notes:
      "This provider has not been verified in-product. Treat all steps as provisional until validated on a live account.",
    supportFallback: `Contact ${p.name} support and request exports (CSV or Excel) for clients, appointments, sales, and staff covering the last 12 months. Ask which reports they recommend for a full business snapshot.`,
    whatWeNeedThisFor: p.dataLookingFor.join(" "),
  };
}

/** @param {string} providerId */
function getProviderExportGuide(providerId) {
  const g = PROVIDER_EXPORT_GUIDES[providerId];
  if (g) return g;
  return buildGenericExportGuide(providerId);
}

/**
 * Flatten grouped guide steps into workflow rows; align screenshots by index;
 * append any extra screenshot slots as trailing rows.
 * @param {ProviderExportGuide} guide
 * @returns {Array<{ stepText: string; groupTitle?: string; screenshot?: { label: string; description: string }; isExtraShot?: boolean }>}
 */
function flattenExportWorkflow(guide) {
  /** @type {Array<{ stepText: string; groupTitle?: string; screenshot?: { label: string; description: string }; isExtraShot?: boolean }>} */
  const rows = [];
  for (const group of guide.guideSteps) {
    let first = true;
    for (const stepText of group.steps) {
      rows.push({
        stepText,
        groupTitle: first ? group.title ?? undefined : undefined,
      });
      first = false;
    }
  }
  const slots = guide.screenshotSlots ?? [];
  for (let i = 0; i < rows.length; i++) {
    if (slots[i]) {
      rows[i].screenshot = slots[i];
    }
  }
  for (let j = rows.length; j < slots.length; j++) {
    const slot = slots[j];
    rows.push({
      stepText: `Optional screenshot: ${slot.label}`,
      screenshot: slot,
      isExtraShot: true,
    });
  }
  return rows;
}

function captureGuideRowVisible(
  id,
  showVerifiedOnly,
  showNeedsResearch,
) {
  if (!showVerifiedOnly && !showNeedsResearch) return true;
  const g = getProviderExportGuide(id);
  if (showVerifiedOnly && showNeedsResearch) return true;
  if (showVerifiedOnly) return g.filterTier === "verified";
  return g.filterTier === "research";
}

/** Reusable confidence tokens for guide chips, schema badges, and legends. */
export const DEEP_DIG_CONFIDENCE = {
  verified: {
    chip:
      "border border-emerald-200/90 bg-emerald-50/95 text-emerald-900",
    dot: "bg-emerald-500",
    legendLabel: "Verified",
  },
  assumed: {
    chip:
      "border border-amber-200/90 bg-amber-50/95 text-amber-900",
    dot: "bg-amber-500",
    legendLabel: "Assumed",
  },
  needs_live_validation: {
    chip:
      "border border-rose-200/85 bg-rose-50/90 text-rose-800",
    dot: "bg-rose-500",
    legendLabel: "Needs live validation",
  },
};

/**
 * @param {'verified' | 'assumed' | 'needs_live_validation'} key
 * @returns {string}
 */
function deepDigConfidenceChipClass(key) {
  return DEEP_DIG_CONFIDENCE[key]?.chip ?? DEEP_DIG_CONFIDENCE.needs_live_validation.chip;
}

/**
 * @param {string} filterTier
 * @returns {'verified' | 'assumed' | 'needs_live_validation'}
 */
function guideTierToConfidenceKey(filterTier) {
  if (filterTier === "verified") return "verified";
  if (filterTier === "assumed") return "assumed";
  return "needs_live_validation";
}

function exportGuideConfidenceClass(tier) {
  return deepDigConfidenceChipClass(guideTierToConfidenceKey(tier));
}

const GENERIC_UPLOAD_LABELS = [
  "Activity export",
  "Customer/client export",
  "Sales or performance export",
];

/** Provider-specific required uploads for the Upload Queue (Step 2). */
const REQUIRED_UPLOAD_LABELS_BY_ID = {
  vagaro: [
    "Appointments report",
    "Client list",
    "Sales / transactions",
    "Service list",
    "Staff / employee report",
    "Product / retail sales",
  ],
  glossgenius: [
    "Appointments",
    "Clients",
    "Payments / sales",
    "Services",
    "Team members",
    "Reviews / client notes",
  ],
  "instagram-meta": [
    "Post and reel insights",
    "Reach / engagement export",
    "Ad spend export if used",
  ],
  "square-appointments": [
    "Appointment history export",
    "Client list or directory",
    "Services & pricing export",
  ],
};

function requiredUploadLabelsFor(providerId) {
  return (
    REQUIRED_UPLOAD_LABELS_BY_ID[providerId] ?? GENERIC_UPLOAD_LABELS
  );
}

/**
 * @typedef {{
 *   name: string;
 *   type?: string;
 *   size?: number;
 *   sampleId?: string;
 *   samplePath?: string;
 *   isSample?: boolean;
 *   __sample?: boolean;
 *   href?: string;
 * }} SampleUploadMeta
 * @typedef {File | SampleUploadMeta | null | undefined} UploadSlotValue
 */

/** @param {unknown} slot */
function isSampleFileRef(slot) {
  if (!slot || typeof slot !== "object") return false;
  const o = /** @type {{ isSample?: unknown; __sample?: unknown }} */ (slot);
  return o.isSample === true || o.__sample === true;
}

/** @param {UploadSlotValue} slot */
function getUploadSlotDisplayName(slot) {
  const n = getFileDisplayName(slot);
  return n || null;
}


/** VMB normalized objects shown in Preflight schema mapping panel. */
const PREFLIGHT_VMB_OBJECT_ROWS = [
  { bucketId: "clients", label: "Clients" },
  { bucketId: "appointments", label: "Appointments" },
  { bucketId: "services", label: "Services" },
  { bucketId: "staff", label: "Staff" },
  { bucketId: "payments", label: "Payments" },
  { bucketId: "retail", label: "Retail" },
  { bucketId: null, label: "Referrals" },
  { bucketId: "social", label: "Social Posts" },
  { bucketId: "reviews", label: "Reviews" },
  { bucketId: "payroll", label: "Payroll" },
];

/**
 * Deterministic bucket tags from an upload row label (local heuristic).
 * @param {string} label
 * @returns {string[]}
 */
function inferBucketsFromUploadLabel(label) {
  const t = label.toLowerCase();
  /** @type {Set<string>} */
  const s = new Set();
  if (/appointment|booking|schedule|visit|calendar|attendance/.test(t)) {
    s.add("appointments");
  }
  if (
    /client|customer|guest|audience|subscriber|contact/.test(t) ||
    (t.includes("list") && !t.includes("service") && !t.includes("mailing"))
  ) {
    s.add("clients");
  }
  if (/service|menu|catalog|add-on|pricing|item sale/.test(t)) {
    s.add("services");
  }
  if (
    /staff|team member|team members|provider|roster|assignment|employee/.test(t)
  ) {
    s.add("staff");
  }
  if (
    /payment|sales|sale|transaction|checkout|ticket|revenue|register|earning|spend/.test(
      t,
    )
  ) {
    s.add("payments");
  }
  if (/product|retail|inventory/.test(t)) {
    s.add("retail");
  }
  if (/review|rating|reputation|yelp|feedback/.test(t)) {
    s.add("reviews");
  }
  if (
    /instagram|meta|tiktok|reel|post|insight|reach|engagement|profile visit|profile visits|share|mailchimp|klaviyo|campaign|flow metrics|marketing|hubspot|constant contact|sms/.test(
      t,
    )
  ) {
    s.add("social");
  }
  if (
    /payroll|labor|timesheet|shift|time clock|hours|wage|gusto|adp|paychex|homebase/.test(
      t,
    )
  ) {
    s.add("payroll");
  }
  return [...s];
}

/**
 * @param {string} providerId
 * @param {string} category
 */
function inferBucketsFromProviderContext(providerId, category) {
  /** @type {Set<string>} */
  const s = new Set();
  const c = category.toLowerCase();
  if (c.includes("payroll") || c.includes("scheduling")) {
    s.add("payroll");
    s.add("staff");
  }
  if (c.includes("booking") || c.includes("pos")) {
    s.add("appointments");
    s.add("payments");
  }
  if (c.includes("marketing") || c.includes("crm")) {
    s.add("social");
    s.add("clients");
  }
  if (c.includes("social") || c.includes("reviews")) {
    s.add("reviews");
    s.add("social");
  }
  if (providerId === "instagram-meta") {
    s.add("social");
  }
  if (providerId === "yelp" || providerId === "google-business") {
    s.add("reviews");
    s.add("social");
  }
  return [...s];
}

/**
 * @param {string[]} orderedProviderIds
 * @param {Record<string, UploadSlotValue[] | undefined>} uploadFilesByProvider
 */
function computeBucketMapping(orderedProviderIds, uploadFilesByProvider) {
  /** @type {Record<string, string[]>} */
  const bucketToProviders = {};
  /** @type {Set<string>} */
  const mappedBucketIds = new Set();

  const add = (bucketId, providerName) => {
    if (!bucketToProviders[bucketId]) bucketToProviders[bucketId] = [];
    const arr = bucketToProviders[bucketId];
    if (!arr.includes(providerName)) arr.push(providerName);
    mappedBucketIds.add(bucketId);
  };

  for (const id of orderedProviderIds) {
    const p = PROVIDER_BY_ID[id];
    if (!p) continue;
    const labels = requiredUploadLabelsFor(id);
    const row = uploadFilesByProvider[id] ?? [];
    let uploadedAny = false;
    for (let i = 0; i < labels.length; i++) {
      if (!row[i]) continue;
      uploadedAny = true;
      for (const b of inferBucketsFromUploadLabel(labels[i])) {
        add(b, p.name);
      }
    }
    if (uploadedAny) {
      for (const b of inferBucketsFromProviderContext(id, p.category)) {
        add(b, p.name);
      }
    }
  }

  return { bucketToProviders, mappedBucketIds };
}

/**
 * @param {Set<string>} mapped
 * @param {string[]} orderedIds
 */
function computeDiscoveries(mapped, orderedIds) {
  const has = (b) => mapped.has(b);
  /** @type {Array<{ key: string; title: string; detail: string }>} */
  const list = [];
  if (has("appointments") && has("staff")) {
    list.push({
      key: "dead-schedule",
      title: "Dead schedule windows",
      detail: "Appointments + Staff",
    });
  }
  if (has("clients") && has("appointments")) {
    list.push({
      key: "churn",
      title: "Churn risk and rebooking cadence",
      detail: "Clients + Appointments",
    });
  }
  if (has("payments") && has("services")) {
    list.push({
      key: "margin",
      title: "High-margin service mix",
      detail: "Payments + Services",
    });
  }
  if (
    has("payments") &&
    has("social") &&
    orderedIds.includes("instagram-meta")
  ) {
    list.push({
      key: "social-rev",
      title: "Social-to-revenue correlation",
      detail: "Instagram / Meta + Payments",
    });
  }
  if (has("reviews") && has("clients")) {
    list.push({
      key: "reputation",
      title: "Reputation and retention signals",
      detail: "Reviews + Clients",
    });
  }
  if (has("payroll") && has("appointments")) {
    list.push({
      key: "labor",
      title: "Labor efficiency gaps",
      detail: "Payroll + Appointments",
    });
  }
  return list;
}

/** Hidden Money Plays report playbook (Step 4 — static copy). */
const HIDDEN_MONEY_PLAYS_REPORT = [
  {
    key: "dead-schedule",
    title: "Dead Schedule Windows",
    signal: "Appointments + Staff + Payments",
    lookFor:
      "Empty or low-value appointment blocks that can be filled with better offers, timing, or service mix.",
    likelyOutput:
      "Tuesday 1–4 PM has repeat underutilization. Promote consults, maintenance services, or targeted client callbacks.",
  },
  {
    key: "economic-nodes",
    title: "Client Economic Nodes",
    signal: "Clients + Appointments + Referrals",
    lookFor:
      "Clients who create disproportionate downstream bookings, gifts, introductions, or premium-service demand.",
    likelyOutput:
      "Your top 10 client nodes may drive more value than your next 50 passive clients.",
  },
  {
    key: "churn-risk",
    title: "Churn Risk Windows",
    signal: "Clients + Appointments + Payments",
    lookFor:
      "Clients whose booking cadence, service mix, or spending pattern is weakening.",
    likelyOutput:
      "Clients slipping from 5-week to 8-week cadence should receive personal outreach before they go quiet.",
  },
  {
    key: "social-revenue",
    title: "Social-to-Revenue Correlation",
    signal: "Instagram / Meta + Appointments + Payments",
    lookFor:
      "Which posts, reels, formats, captions, and timing patterns correlate with higher-value bookings.",
    likelyOutput:
      "Before/after posts may drive premium color requests inside a 7–14 day window.",
  },
  {
    key: "staff-mix",
    title: "Staff Utilization / Service Mix",
    signal: "Staff + Services + Payments",
    lookFor:
      "Which providers, services, and time blocks produce the highest revenue density and retention.",
    likelyOutput:
      "Some staff may look busy but produce lower repeat value, while others quietly create better long-term economics.",
  },
];

const ANALYSIS_PIPELINE_STEPS = [
  "Parse uploaded files",
  "Normalize provider fields",
  "Match clients, services, staff, and payments",
  "Detect schedule gaps",
  "Detect churn-risk patterns",
  "Detect social-to-revenue signals",
  "Generate Hidden Money Plays",
];

const ANALYSIS_DATA_OBJECTS = [
  { id: "clients", label: "Clients" },
  { id: "appointments", label: "Appointments" },
  { id: "services", label: "Services" },
  { id: "staff", label: "Staff / Providers" },
  { id: "payments", label: "Payments / Tickets" },
  { id: "social", label: "Social Posts" },
  { id: "reviews", label: "Reviews" },
  { id: "payroll", label: "Payroll / Labor" },
];

const QUERY_STARTER_LIBRARY = [
  {
    id: "q-underutil",
    text: "Which days and time blocks are underutilized?",
  },
  {
    id: "q-downstream",
    text: "Which clients create the most downstream value?",
  },
  {
    id: "q-margin",
    text: "Which services produce the best margin and retention?",
  },
  {
    id: "q-staff-rebook",
    text: "Which staff members generate the strongest rebooking behavior?",
  },
  {
    id: "q-posts-booking",
    text: "Which posts correlate with higher-value bookings?",
  },
  {
    id: "q-churn-60",
    text: "Which clients are likely to churn in the next 60–90 days?",
  },
];

const GROUP_ORDER = [
  {
    key: "booking",
    title: "Booking / POS",
    ids: [
      "vagaro",
      "glossgenius",
      "boulevard",
      "mindbody",
      "fresha",
      "booksy",
      "square-appointments",
      "mangomint",
    ],
  },
  {
    key: "payroll",
    title: "Payroll / Scheduling",
    ids: ["gusto", "adp", "paychex", "homebase", "when-i-work"],
  },
  {
    key: "marketing",
    title: "Marketing / CRM",
    ids: ["mailchimp", "klaviyo", "constant-contact", "hubspot"],
  },
  {
    key: "social",
    title: "Social / Reviews",
    ids: ["instagram-meta", "tiktok", "google-business", "yelp"],
  },
];

/** Booking, payroll, marketing in 3-col desktop grid; social is a separate full-width row. */
const CAPTURE_GRID_GROUPS = GROUP_ORDER.slice(0, 3);
const CAPTURE_SOCIAL_GROUP =
  GROUP_ORDER.find((g) => g.key === "social") ?? GROUP_ORDER[3];

const CAPTURE_GROUP_ICON = {
  booking: FaBook,
  payroll: FaCalendarAlt,
  marketing: FaBullhorn,
  social: FaShareAlt,
};

const CREDENTIAL_ASSIST_DEFAULTS = {
  loginUrl: "",
  username: "",
  password: "",
  mfaNotes: "",
  permissionNotes: "",
  accessExpiration: "24h",
  consentExportOnly: false,
  consentNoAccountChanges: false,
  statusMessage: null,
  errorMessage: null,
  isSubmitting: false,
};

/** @param {Record<string, unknown> | undefined} prev */
function mergeCredentialAssistRow(prev) {
  return { ...CREDENTIAL_ASSIST_DEFAULTS, ...prev };
}

const DEEP_DIG_PIPELINE_STEPS = [
  { id: "capture", label: "Capture" },
  { id: "upload", label: "Upload" },
  { id: "preflight", label: "Preflight" },
  { id: "report", label: "Report" },
  { id: "analysis", label: "Analysis" },
];

/** Instructional copy per pipeline stage (header, guidance, step info). */
const DEEP_DIG_STAGE_COPY = {
  capture: {
    pageTitle: "Data Capture",
    headerBlurb:
      "Choose your systems. We'll show you exactly what to pull.",
    infoTitle: "Step 1 — Capture",
    infoBody:
      "Select the systems your salon uses. Open each export guide and gather the reports we need.",
  },
  upload: {
    pageTitle: "Upload Queue",
    headerBlurb:
      "Upload the files you gathered. Data Mine organizes them by provider and report type.",
    infoTitle: "Step 2 — Upload",
    infoBody:
      "Upload the files you gathered. Data Mine organizes them by provider and report type.",
  },
  preflight: {
    pageTitle: "Preflight Check",
    headerBlurb:
      "Are the files usable before analysis? We verify file coverage, inspect headers, and map each provider export into the VMB salon schema before analysis.",
    infoTitle: "Step 3 — Preflight",
    infoBody:
      "We verify file coverage, inspect headers, and map each provider export into the VMB salon schema before analysis.",
  },
  report: {
    pageTitle: "Hidden Money Plays Report",
    headerBlurb:
      "Review the opportunity patterns we can evaluate from your uploaded data.",
    infoTitle: "Step 4 — Report",
    infoBody:
      "Review the Hidden Money Plays we can evaluate from your uploaded data.",
  },
  analysis: {
    pageTitle: "Analysis Engine",
    headerBlurb:
      "Run parsing, mapping, and the query queue to generate results previews.",
    infoTitle: "Step 5 — Analysis",
    infoBody:
      "Run the parser, mapping, and query queue to generate results previews.",
  },
};

/** @param {{ stageId: string | null; onClose: () => void }} props */
function DeepDigPipelineInfoOverlay({ stageId, onClose }) {
  if (!stageId) return null;
  const copy = DEEP_DIG_STAGE_COPY[stageId];
  if (!copy) return null;
  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`data-mine-pipeline-info-${stageId}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#2f2a28]/40"
        aria-label="Close step info"
        onClick={onClose}
      />
      <div
        className="relative z-[1] w-full max-w-md rounded-t-2xl border border-[#e2d6cf] bg-[#fffdfb] px-4 py-4 shadow-2xl sm:rounded-2xl sm:px-5 sm:py-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h3
            id={`data-mine-pipeline-info-${stageId}`}
            className="font-studio-serif text-lg font-semibold leading-snug text-[#2f2a28]"
          >
            {copy.infoTitle}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 rounded-full border border-[#efe4db] p-2 text-[#6b6262] transition hover:bg-[#faf4ee]"
            aria-label="Close"
          >
            <FaTimes className="text-sm" aria-hidden />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#5f5654]">
          {copy.infoBody}
        </p>
      </div>
    </div>
  );
}

/**
 * Compact disclosure for secondary export-card copy.
 * @param {{ label: string; children: React.ReactNode }} props
 */
function ExportCardAccordion({ label, children }) {
  return (
    <details className="group overflow-hidden rounded-lg border border-[#e8ddd4]/80 bg-white/75 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-[#faf6f2]/90">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b6262]">
          {label}
        </span>
        <FaChevronDown
          className="size-3 shrink-0 text-[#a39a97] transition group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-[#efe4db]/70 px-3 py-2.5 text-xs leading-relaxed text-[#5f5654]">
        {children}
      </div>
    </details>
  );
}

/**
 * @param {{ stage: string; onRequestStepInfo: (id: string) => void }} props
 */
function DeepDigWorkflowPipeline({ stage, onRequestStepInfo }) {
  const activeIndex = DEEP_DIG_PIPELINE_STEPS.findIndex((s) => s.id === stage);
  const idx = activeIndex >= 0 ? activeIndex : 0;
  return (
    <nav
      aria-label="Data Mine workflow"
      className="rounded-xl border border-[#e8ddd4]/90 bg-gradient-to-b from-[#fffdfb]/95 to-[#faf6f2]/90 px-2 py-2.5 shadow-[0_8px_28px_-22px_rgba(47,42,40,0.4)] sm:px-3 sm:py-3"
    >
      <div className="flex min-w-0 items-stretch gap-0 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
        {DEEP_DIG_PIPELINE_STEPS.map((step, i) => {
          const isActive = stage === step.id;
          const isDone = i < idx;
          const isMuted = i > idx;
          const stepCopy = DEEP_DIG_STAGE_COPY[step.id];
          return (
            <React.Fragment key={step.id}>
              {i > 0 ?
                <div
                  className={`mx-1 mt-[12px] hidden h-px min-w-[12px] flex-1 sm:mx-2 sm:block ${
                    isDone ? "bg-emerald-500/40"
                    : isActive ? "bg-[#c9a86a]/55"
                    : "bg-[#ded5cd]/85"
                  }`}
                  aria-hidden
                />
              : null}
              <button
                type="button"
                title={
                  stepCopy ?
                    `${stepCopy.infoTitle}: ${stepCopy.infoBody}`
                  : step.label
                }
                onClick={() => onRequestStepInfo(step.id)}
                className={`flex min-w-[4.25rem] shrink-0 flex-col items-center gap-1 text-center outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#b88f45]/35 sm:min-w-0 ${
                  i === 0 ? "pl-0.5" : ""
                } ${
                  i === DEEP_DIG_PIPELINE_STEPS.length - 1 ? "pr-0.5" : ""
                }`}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${i + 1} ${step.label}: learn about this step`}
              >
                <span
                  className={`flex size-[24px] items-center justify-center rounded-full border text-[10px] transition ${
                    isDone ?
                      "border-emerald-400/80 bg-emerald-500/15 text-emerald-800"
                    : isActive ?
                      "border-[#b88f45]/90 bg-[#faf0e4] text-[#6b4f21] shadow-[0_0_0_3px_rgba(184,143,69,0.15)]"
                    : isMuted ?
                      "border-[#e6dfd8] bg-[#f5f0eb]/80 text-[#a39a97]"
                    : "border-[#e6dfd8] bg-[#f5f0eb] text-[#8a807b]"
                  }`}
                >
                  {isDone ?
                    <FaCheck className="text-[9px]" aria-hidden />
                  : (
                    <span className="font-studio-serif text-[12px] font-semibold leading-none tabular-nums">
                      {i + 1}
                    </span>
                  )}
                </span>
                <span
                  className={`max-w-[6.5rem] text-center text-[9px] font-bold uppercase leading-snug tracking-wider sm:max-w-none sm:text-[10px] ${
                    isActive ? "text-[#2f2a28]"
                    : isMuted ? "text-[#a39a97]"
                    : "text-[#6b6262]"
                  }`}
                >
                  <span className="tabular-nums">{i + 1}</span>
                  <span className="text-[#c9bfb8]" aria-hidden>
                    {" "}
                    ·{" "}
                  </span>
                  <span>{step.label}</span>
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * @param {{ stage: string; backControl: React.ReactNode }} props
 */
function DeepDigCompactPageHeader({ stage, backControl }) {
  const copy = DEEP_DIG_STAGE_COPY[stage];
  if (!copy) return null;
  return (
    <header className="rounded-xl border border-[#e8ddd4] bg-[linear-gradient(145deg,#fffdfb_0%,#faf4ee_55%,#f5ebe3_100%)] px-3 py-3 shadow-[0_12px_40px_-36px_rgba(47,42,40,0.35)] ring-1 ring-[#efe4db]/80 sm:px-4 sm:py-3.5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:items-center">
        <div className="flex min-w-0 items-start gap-2 sm:gap-3">
          <div className="shrink-0 pt-0.5">{backControl}</div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#b8966a]">
              DATA MINE
            </p>
            <h1 className="font-studio-serif text-xl font-semibold leading-tight tracking-tight text-[#2f2a28] sm:text-2xl">
              {copy.pageTitle}
            </h1>
          </div>
        </div>
        <p className="max-w-[22rem] text-right text-xs leading-snug text-[#5f5654] sm:text-[13px]">
          {copy.headerBlurb}
        </p>
      </div>
    </header>
  );
}

/**
 * @param {{ stage: string; statusChip: React.ReactNode }} props
 */
function DeepDigCurrentStepGuidance({ stage, statusChip }) {
  const copy = DEEP_DIG_STAGE_COPY[stage];
  if (!copy) return null;
  return (
    <section
      className="max-h-[90px] rounded-lg border border-[#e2d6cf] bg-white/90 px-3 py-2.5 sm:max-h-none sm:px-4 sm:py-3"
      aria-label="Current step guidance"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a45f76]">
            {copy.infoTitle}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-[#5f5654] sm:line-clamp-none">
            {copy.infoBody}
          </p>
        </div>
        {statusChip ?
          <div className="shrink-0">{statusChip}</div>
        : null}
      </div>
    </section>
  );
}

const PROGRESS_RAIL_PRIMARY_CTA =
  "bg-[#2f2a28] text-[#fffdfb] shadow-[0_16px_40px_-20px_rgba(47,42,40,0.65)] hover:bg-[#3d3634]";
const PROGRESS_RAIL_DISABLED_CTA =
  "cursor-not-allowed bg-[#c4b8ad] text-[#fffdfb]/90 shadow-[0_16px_40px_-20px_rgba(47,42,40,0.65)]";
const PROGRESS_RAIL_ANALYSIS_MUTED_CTA =
  "bg-[#c4b8ad] text-[#fffdfb]/90 shadow-[0_16px_40px_-20px_rgba(47,42,40,0.65)] hover:bg-[#b8a99d]";

/**
 * Matches main-stage primary CTA disabled/enabled behavior (capture,
 * preflight, analysis).
 *
 * @param {string} stage
 * @param {{
 *   readyForUpload: boolean;
 *   preflightComplete: boolean;
 *   mockAnalysisComplete: boolean;
 *   analysisQueryQueueLength: number;
 * }} ctx
 */
function progressRailPrimaryCtaDisabled(stage, ctx) {
  if (stage === "capture") return !ctx.readyForUpload;
  if (stage === "preflight") return !ctx.preflightComplete;
  return false;
}

/**
 * @param {string} stage
 * @param {{
 *   readyForUpload: boolean;
 *   preflightComplete: boolean;
 *   mockAnalysisComplete: boolean;
 *   analysisQueryQueueLength: number;
 * }} ctx
 */
function progressRailPrimaryCtaClass(stage, ctx) {
  if (stage === "capture") {
    return ctx.readyForUpload ? PROGRESS_RAIL_PRIMARY_CTA : PROGRESS_RAIL_DISABLED_CTA;
  }
  if (stage === "preflight") {
    return ctx.preflightComplete ? PROGRESS_RAIL_PRIMARY_CTA : PROGRESS_RAIL_DISABLED_CTA;
  }
  if (stage === "analysis") {
    return ctx.mockAnalysisComplete && ctx.analysisQueryQueueLength > 0 ?
        PROGRESS_RAIL_PRIMARY_CTA
      : PROGRESS_RAIL_ANALYSIS_MUTED_CTA;
  }
  return PROGRESS_RAIL_PRIMARY_CTA;
}

/**
 * @param {{
 *   stage: string;
 *   systemsSelected: number;
 *   verifiedGuidesCount: number;
 *   uploadReadinessLine: string;
 *   schemaReadinessLine: string;
 *   analysisReadinessLine: string;
 *   readyForUpload: boolean;
 *   uploadStats: { readyForAnalysis: boolean };
 *   preflightComplete: boolean;
 *   mockAnalysisComplete: boolean;
 *   analysisQueryQueueLength: number;
 *   goToUpload: () => void;
 *   tryAnalyze: (ready: boolean) => void;
 *   goToReport: () => void;
 *   startAnalysisBuild: () => void;
 *   tryGenerateResultsPreview: () => void;
 *   captureSubstage?: "select" | "exports";
 * }} props
 */
function DeepDigProgressRail({
  stage,
  captureSubstage = "exports",
  systemsSelected,
  verifiedGuidesCount,
  uploadReadinessLine,
  schemaReadinessLine,
  analysisReadinessLine,
  readyForUpload,
  uploadStats,
  preflightComplete,
  mockAnalysisComplete,
  analysisQueryQueueLength,
  goToUpload,
  tryAnalyze,
  goToReport,
  startAnalysisBuild,
  tryGenerateResultsPreview,
}) {
  const activeIndex = DEEP_DIG_PIPELINE_STEPS.findIndex((s) => s.id === stage);
  const currentStepLabel =
    activeIndex >= 0 ? DEEP_DIG_PIPELINE_STEPS[activeIndex].label : stage;
  const currentProgressDetail =
    stage === "capture" ?
      captureSubstage === "select" ?
        "Capture · Select systems"
      : "Capture · Export list"
    : currentStepLabel;

  const cta =
    stage === "capture" && captureSubstage === "select" ?
      null
    : stage === "capture" ?
      {
        label: "Continue to Uploads",
        onClick: goToUpload,
      }
    : stage === "upload" ?
      {
        label: "Analyze Hidden Money Plays",
        onClick: () => tryAnalyze(uploadStats.readyForAnalysis),
      }
    : stage === "preflight" ?
      {
        label: "View Hidden Money Plays Report",
        onClick: goToReport,
      }
    : stage === "report" ?
      {
        label: "Start Analysis Build",
        onClick: startAnalysisBuild,
      }
    : stage === "analysis" ?
      {
        label: "Generate Results Preview",
        onClick: tryGenerateResultsPreview,
      }
    : null;

  const railCtaCtx = {
    readyForUpload,
    preflightComplete,
    mockAnalysisComplete,
    analysisQueryQueueLength,
  };
  const railCtaDisabled = progressRailPrimaryCtaDisabled(stage, railCtaCtx);
  const railCtaClass = progressRailPrimaryCtaClass(stage, railCtaCtx);

  return (
    <aside
      className="hidden min-w-0 lg:block"
      aria-label="Data Mine progress"
    >
      <div className="sticky top-[88px] rounded-xl border border-[#e2d6cf] bg-[#fffdfb]/95 p-3 shadow-[0_14px_40px_-30px_rgba(39,46,45,0.35)] xl:p-4">
        <h2 className="font-studio-serif text-sm font-semibold text-[#2f2a28]">
          Progress
        </h2>
        <dl className="mt-3 space-y-2.5 border-b border-[#efe4db] pb-3 text-[11px]">
          <div>
            <dt className="font-bold uppercase tracking-wider text-[#a45f76]">
              Current
            </dt>
            <dd className="mt-0.5 font-semibold text-[#333232]">
              {currentProgressDetail}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-[#a45f76]">
              Systems selected
            </dt>
            <dd className="mt-0.5 font-studio-serif text-lg text-[#2f2a28]">
              {systemsSelected}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-[#a45f76]">
              Verified guides
            </dt>
            <dd className="mt-0.5 font-studio-serif text-lg text-[#2f2a28]">
              {verifiedGuidesCount}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-[#a45f76]">
              Upload readiness
            </dt>
            <dd className="mt-0.5 font-medium text-[#5f5654]">
              {uploadReadinessLine}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-[#a45f76]">
              Schema readiness
            </dt>
            <dd className="mt-0.5 font-medium text-[#5f5654]">
              {schemaReadinessLine}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-[#a45f76]">
              Analysis readiness
            </dt>
            <dd className="mt-0.5 font-medium text-[#5f5654]">
              {analysisReadinessLine}
            </dd>
          </div>
        </dl>

        {cta ?
          <button
            type="button"
            disabled={railCtaDisabled}
            onClick={cta.onClick}
            className={`mt-3 w-full rounded-full px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wide transition xl:text-xs ${railCtaClass}`}
          >
            {cta.label}
          </button>
        : null}
      </div>
    </aside>
  );
}

function DeepDigConciergeDrawer({
  providerId,
  onClose,
  credentialAssistByProvider,
  patchCredentialAssist,
  submitCredentialAssist,
  requestGuidedCredentialSession,
}) {
  const guide = getProviderExportGuide(providerId);
  const credRow = mergeCredentialAssistRow(
    credentialAssistByProvider[providerId],
  );
  const credSafeKey = providerId.replace(/[^a-z0-9-]/gi, "");
  const credFieldId = (suffix) => `concierge-${credSafeKey}-${suffix}`;
  const canCredSubmit =
    canSubmitCredentialAssistForm(credRow) && !credRow.isSubmitting;

  return (
    <div className="fixed inset-0 z-[250]">
      <button
        type="button"
        className="absolute inset-0 bg-[#2f2a28]/45"
        aria-label="Close Concierge Assist"
        onClick={onClose}
      />
      <div
        className="absolute inset-0 flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-labelledby="data-mine-concierge-title"
      >
        <aside
          className="relative flex h-full w-full max-w-none flex-col border-[#e2d6cf] bg-[#fffdfb] shadow-[0_0_48px_-12px_rgba(39,46,45,0.35)] max-lg:border-t lg:max-w-[min(480px,100vw)] lg:rounded-l-2xl lg:border-l"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#efe4db] px-4 py-3 sm:px-5 sm:py-3.5">
            <div className="min-w-0">
              <p
                id="data-mine-concierge-title"
                className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a45f76]"
              >
                Concierge Assist
              </p>
              <p className="mt-0.5 font-studio-serif text-base font-semibold leading-snug text-[#2f2a28] sm:text-lg">
                {guide.providerName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex shrink-0 rounded-full border border-[#efe4db] p-2 text-[#6b6262] transition hover:bg-[#faf4ee]"
              aria-label="Close"
            >
              <FaTimes className="text-sm" aria-hidden />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <span
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#a45f76]/30 bg-[#fdf8f9] px-2.5 py-1.5 text-[9px] font-bold uppercase leading-snug tracking-wide text-[#7f5362]"
                role="status"
              >
                <FaExclamationTriangle
                  className="shrink-0 text-[11px] text-[#b8966a]"
                  aria-hidden
                />
                <span>
                  Production requires encrypted secret vault, access audit log,
                  auto-delete, and role-restricted admin review.
                </span>
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#5f5654]">
              If you want VMB to help gather your exports, you can request
              concierge assistance. For security, we recommend you stay in
              control through a guided session whenever possible. If temporary
              access is required, it should be time-limited and deleted after
              the export session.
            </p>
            <p className="mt-2 text-[11px] text-[#8a7f7c]">
              <span className="font-semibold text-[#6b6262]">Provider:</span>{" "}
              <span className="font-semibold text-[#333232]">
                {guide.providerName}
              </span>
            </p>

            <form
              className="mt-5 space-y-4"
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                if (canCredSubmit) {
                  void submitCredentialAssist(providerId);
                }
              }}
            >
              <div>
                <label
                  htmlFor={credFieldId("login-url")}
                  className="block text-xs font-bold uppercase tracking-wider text-[#a45f76]"
                >
                  Provider account URL / login page
                </label>
                <input
                  id={credFieldId("login-url")}
                  type="url"
                  inputMode="url"
                  value={credRow.loginUrl}
                  onChange={(e) =>
                    patchCredentialAssist(providerId, {
                      loginUrl: e.target.value,
                      errorMessage: null,
                    })
                  }
                  placeholder="https://…"
                  className="mt-2 w-full rounded-xl border border-[#e2d6cf] bg-white px-4 py-2.5 text-sm text-[#333232] placeholder:text-[#a39a97] focus:border-[#b88f45] focus:outline-none focus:ring-2 focus:ring-[#b88f45]/20"
                />
              </div>

              <div>
                <label
                  htmlFor={credFieldId("username")}
                  className="block text-xs font-bold uppercase tracking-wider text-[#a45f76]"
                >
                  Username or email
                </label>
                <input
                  id={credFieldId("username")}
                  type="text"
                  name={`concierge-user-${credSafeKey}`}
                  value={credRow.username}
                  onChange={(e) =>
                    patchCredentialAssist(providerId, {
                      username: e.target.value,
                      errorMessage: null,
                    })
                  }
                  autoComplete="off"
                  className="mt-2 w-full rounded-xl border border-[#e2d6cf] bg-white px-4 py-2.5 text-sm text-[#333232] focus:border-[#b88f45] focus:outline-none focus:ring-2 focus:ring-[#b88f45]/20"
                />
              </div>

              <div>
                <label
                  htmlFor={credFieldId("password")}
                  className="block text-xs font-bold uppercase tracking-wider text-[#a45f76]"
                >
                  Password
                </label>
                <input
                  id={credFieldId("password")}
                  type="password"
                  name={`concierge-pass-${credSafeKey}`}
                  value={credRow.password}
                  onChange={(e) =>
                    patchCredentialAssist(providerId, {
                      password: e.target.value,
                      errorMessage: null,
                    })
                  }
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-xl border border-[#e2d6cf] bg-white px-4 py-2.5 text-sm text-[#333232] focus:border-[#b88f45] focus:outline-none focus:ring-2 focus:ring-[#b88f45]/20"
                />
              </div>

              <div>
                <label
                  htmlFor={credFieldId("mfa")}
                  className="block text-xs font-bold uppercase tracking-wider text-[#a45f76]"
                >
                  MFA notes / backup contact method
                </label>
                <textarea
                  id={credFieldId("mfa")}
                  value={credRow.mfaNotes}
                  onChange={(e) =>
                    patchCredentialAssist(providerId, {
                      mfaNotes: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="How we can reach you for codes, or where backup codes live…"
                  className="mt-2 w-full resize-y rounded-xl border border-[#e2d6cf] bg-white px-4 py-3 text-sm text-[#333232] placeholder:text-[#a39a97] focus:border-[#b88f45] focus:outline-none focus:ring-2 focus:ring-[#b88f45]/20"
                />
              </div>

              <div>
                <label
                  htmlFor={credFieldId("perms")}
                  className="block text-xs font-bold uppercase tracking-wider text-[#a45f76]"
                >
                  Permission notes
                </label>
                <textarea
                  id={credFieldId("perms")}
                  value={credRow.permissionNotes}
                  onChange={(e) =>
                    patchCredentialAssist(providerId, {
                      permissionNotes: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Roles to use, pages off-limits, export-only scope…"
                  className="mt-2 w-full resize-y rounded-xl border border-[#e2d6cf] bg-white px-4 py-3 text-sm text-[#333232] placeholder:text-[#a39a97] focus:border-[#b88f45] focus:outline-none focus:ring-2 focus:ring-[#b88f45]/20"
                />
              </div>

              <fieldset className="rounded-xl border border-[#efe4db] bg-white/80 p-4">
                <legend className="px-1 text-xs font-bold uppercase tracking-wider text-[#a45f76]">
                  Requested access expiration
                </legend>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {[
                    { value: "2h", label: "2 hours" },
                    { value: "24h", label: "24 hours" },
                    { value: "72h", label: "72 hours" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm text-[#333232] transition hover:bg-[#faf4ee]"
                    >
                      <input
                        type="radio"
                        name={`concierge-expiry-${credSafeKey}`}
                        value={opt.value}
                        checked={credRow.accessExpiration === opt.value}
                        onChange={() =>
                          patchCredentialAssist(providerId, {
                            accessExpiration: opt.value,
                          })
                        }
                        className="h-4 w-4 border-[#c9a869]/60 text-[#b88f45] focus:ring-[#b88f45]/35"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-3 rounded-xl border border-[#efe4db] bg-white/80 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={credRow.consentExportOnly}
                    onChange={(e) =>
                      patchCredentialAssist(providerId, {
                        consentExportOnly: e.target.checked,
                        errorMessage: null,
                      })
                    }
                    className="mt-1 h-4 w-4 shrink-0 rounded border-[#c9a869]/60 text-[#b88f45] focus:ring-[#b88f45]/35"
                  />
                  <span className="text-sm leading-relaxed text-[#5f5654]">
                    I authorize VMB to access this provider account only to
                    gather the requested export files for my Data Mine
                    analysis.
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={credRow.consentNoAccountChanges}
                    onChange={(e) =>
                      patchCredentialAssist(providerId, {
                        consentNoAccountChanges: e.target.checked,
                        errorMessage: null,
                      })
                    }
                    className="mt-1 h-4 w-4 shrink-0 rounded border-[#c9a869]/60 text-[#b88f45] focus:ring-[#b88f45]/35"
                  />
                  <span className="text-sm leading-relaxed text-[#5f5654]">
                    I understand VMB will not use this access for booking
                    changes, customer messages, payments, or account changes.
                  </span>
                </label>
              </div>

              {credRow.statusMessage ?
                <p
                  role="status"
                  className="rounded-lg border border-[#ded3cc] bg-[#faf8f5] px-4 py-3 text-sm font-medium text-[#5f5654]"
                >
                  {credRow.statusMessage}
                </p>
              : null}
              {credRow.errorMessage ?
                <p
                  role="alert"
                  className="rounded-lg border border-[#a45f76]/25 bg-[#fdf8f9] px-4 py-3 text-sm font-medium text-[#7f5362]"
                >
                  {credRow.errorMessage}
                </p>
              : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => requestGuidedCredentialSession(providerId)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border-2 border-[#2f2a28]/18 bg-[#fffdfb] px-5 text-sm font-bold text-[#333232] transition hover:border-[#b88f45]/50 hover:bg-[#faf4ee] sm:flex-none"
                >
                  Request Guided Session
                </button>
                <button
                  type="submit"
                  disabled={!canCredSubmit}
                  className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-5 text-sm font-bold tracking-wide shadow-[0_12px_32px_-18px_rgba(47,42,40,0.5)] transition sm:flex-none ${
                    canCredSubmit ?
                      "bg-[#2f2a28] text-[#fffdfb] hover:bg-[#3d3634]"
                    : "cursor-not-allowed bg-[#c4b8ad] text-[#fffdfb]/90"
                  }`}
                >
                  Submit Temporary Access
                </button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function DeepDig() {
  const [stage, setStage] = useState("capture");
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [selectionOrder, setSelectionOrder] = useState(() => []);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [conciergeDrawerProviderId, setConciergeDrawerProviderId] =
    useState(null);
  const [gatheredIds, setGatheredIds] = useState(() => new Set());
  const [notesById, setNotesById] = useState(() => ({}));
  const [credentialAssistByProvider, setCredentialAssistByProvider] =
    useState(() => ({}));
  const [uploadFilesByProvider, setUploadFilesByProvider] = useState(
    () => ({}),
  );
  const [analysisMessage, setAnalysisMessage] = useState(null);
  const [preflightComplete, setPreflightComplete] = useState(false);
  const [preflightBanner, setPreflightBanner] = useState(null);
  const [mockAnalysisComplete, setMockAnalysisComplete] = useState(false);
  const [mockAnalysisBanner, setMockAnalysisBanner] = useState(null);
  const [analysisQueryQueue, setAnalysisQueryQueue] = useState(() => []);
  const [resultsPreviewMessage, setResultsPreviewMessage] = useState(null);
  const [captureShowVerifiedOnly, setCaptureShowVerifiedOnly] =
    useState(false);
  const [captureShowNeedsResearch, setCaptureShowNeedsResearch] =
    useState(false);
  const [uploadSamplePreviewId, setUploadSamplePreviewId] = useState(
    /** @type {string | null} */ (null),
  );
  const [captureSubstage, setCaptureSubstage] = useState(
    /** @type {"select" | "exports"} */ ("select"),
  );
  const [captureConfirmHint, setCaptureConfirmHint] = useState(null);
  const [selectedPipelineInfo, setSelectedPipelineInfo] = useState(
    /** @type {string | null} */ (null),
  );

  useEffect(() => {
    setSelectedPipelineInfo(null);
  }, [stage]);

  const openPipelineStepInfo = useCallback((id) => {
    setSelectedPipelineInfo((prev) => (prev === id ? null : id));
  }, []);

  const clearUploadsFor = useCallback((id) => {
    setUploadFilesByProvider((prev) => {
      if (!(id in prev)) return prev;
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearCredentialAssistFor = useCallback((providerId) => {
    setCredentialAssistByProvider((prev) => {
      if (!(providerId in prev)) return prev;
      const { [providerId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const patchCredentialAssist = useCallback((providerId, patch) => {
    setCredentialAssistByProvider((prev) => ({
      ...prev,
      [providerId]: {
        ...mergeCredentialAssistRow(prev[providerId]),
        ...patch,
      },
    }));
  }, []);

  const requestGuidedCredentialSession = useCallback((providerId) => {
    setCredentialAssistByProvider((prev) => ({
      ...prev,
      [providerId]: {
        ...mergeCredentialAssistRow(prev[providerId]),
        statusMessage:
          "Guided session request noted — we'll reach out to schedule. No credentials were sent.",
        errorMessage: null,
      },
    }));
  }, []);

  const submitCredentialAssist = useCallback(async (providerId) => {
    let rowSnapshot;
    setCredentialAssistByProvider((prev) => {
      rowSnapshot = mergeCredentialAssistRow(prev[providerId]);
      return {
        ...prev,
        [providerId]: {
          ...rowSnapshot,
          isSubmitting: true,
          errorMessage: null,
        },
      };
    });

    const providerName = PROVIDER_BY_ID[providerId]?.name ?? "";
    const payload = {
      providerId,
      providerName,
      loginUrl: rowSnapshot.loginUrl.trim(),
      username: rowSnapshot.username.trim(),
      password: rowSnapshot.password,
      mfaNotes: (rowSnapshot.mfaNotes ?? "").trim(),
      permissionNotes: (rowSnapshot.permissionNotes ?? "").trim(),
      accessExpiration: rowSnapshot.accessExpiration,
      consentExportOnly: rowSnapshot.consentExportOnly,
      consentNoAccountChanges: rowSnapshot.consentNoAccountChanges,
      requestedAt: new Date().toISOString(),
    };

    const v = validateCredentialAssistPayload(payload);
    if (!v.ok) {
      setCredentialAssistByProvider((prev) => ({
        ...prev,
        [providerId]: {
          ...mergeCredentialAssistRow(prev[providerId]),
          isSubmitting: false,
          errorMessage: v.error,
        },
      }));
      return;
    }

    try {
      const res = await fetch("/api/deep-dig/credential-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCredentialAssistByProvider((prev) => ({
          ...prev,
          [providerId]: {
            ...mergeCredentialAssistRow(prev[providerId]),
            isSubmitting: false,
            errorMessage:
              typeof data.error === "string" ?
                data.error
              : `Request failed (${res.status})`,
          },
        }));
        return;
      }
      if (!data?.ok) {
        setCredentialAssistByProvider((prev) => ({
          ...prev,
          [providerId]: {
            ...mergeCredentialAssistRow(prev[providerId]),
            isSubmitting: false,
            errorMessage: "Unexpected response from server.",
          },
        }));
        return;
      }
      setCredentialAssistByProvider((prev) => ({
        ...prev,
        [providerId]: {
          ...mergeCredentialAssistRow(prev[providerId]),
          isSubmitting: false,
          password: "",
          statusMessage:
            "Temporary access submitted. We'll use it only for the requested export session.",
          errorMessage: null,
        },
      }));
    } catch {
      setCredentialAssistByProvider((prev) => ({
        ...prev,
        [providerId]: {
          ...mergeCredentialAssistRow(prev[providerId]),
          isSubmitting: false,
          errorMessage: "Network error. Try again.",
        },
      }));
    }
  }, []);

  const toggleSelected = useCallback((id) => {
    let turningOff = false;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        turningOff = true;
      } else {
        next.add(id);
      }
      return next;
    });
    setSelectionOrder((order) => {
      if (order.includes(id)) {
        return order.filter((x) => x !== id);
      }
      return [...order, id];
    });
    setGatheredIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (turningOff) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setNotesById((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      clearUploadsFor(id);
      clearCredentialAssistFor(id);
    }
  }, [clearCredentialAssistFor, clearUploadsFor]);

  const removeProvider = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setSelectionOrder((order) => order.filter((x) => x !== id));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setGatheredIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setNotesById((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    setConciergeDrawerProviderId((openId) => (openId === id ? null : openId));
    clearUploadsFor(id);
    clearCredentialAssistFor(id);
  }, [clearCredentialAssistFor, clearUploadsFor]);

  const toggleExpanded = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleGathered = useCallback((id) => {
    setGatheredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const markExportWorkflowComplete = useCallback((providerId) => {
    setGatheredIds((prev) => {
      const next = new Set(prev);
      next.add(providerId);
      return next;
    });
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(providerId);
      return next;
    });
  }, []);

  const setNote = useCallback((id, value) => {
    setNotesById((prev) => ({ ...prev, [id]: value }));
  }, []);

  const setUploadSlot = useCallback((providerId, index, value) => {
    const len = requiredUploadLabelsFor(providerId).length;
    setUploadFilesByProvider((prev) => {
      const prevRow = prev[providerId] ?? Array(len).fill(null);
      const row = [...prevRow];
      while (row.length < len) row.push(null);
      row[index] = value;
      return { ...prev, [providerId]: row };
    });
  }, []);

  const loadSampleSet = useCallback((providerId) => {
    const labels = requiredUploadLabelsFor(providerId);
    const samples = getSampleExportsForProvider(providerId);
    if (samples.length === 0) return;
    setUploadFilesByProvider((prev) => {
      const prevRow = prev[providerId] ?? Array(labels.length).fill(null);
      const row = [...prevRow];
      while (row.length < labels.length) row.push(null);
      for (const sample of samples) {
        const idx = labels.findIndex(
          (lbl) =>
            findSampleForUploadLabel(providerId, lbl)?.id === sample.id,
        );
        if (idx >= 0) {
          row[idx] = createDeepDigSampleUploadEntry(sample);
        }
      }
      return { ...prev, [providerId]: row };
    });
  }, []);

  const resetDeepDigAnalysis = useCallback(() => {
    setMockAnalysisComplete(false);
    setMockAnalysisBanner(null);
    setResultsPreviewMessage(null);
    setAnalysisQueryQueue([]);
  }, []);

  const goToUpload = useCallback(() => {
    setAnalysisMessage(null);
    resetDeepDigAnalysis();
    setPreflightComplete(false);
    setPreflightBanner(null);
    setStage("upload");
  }, [resetDeepDigAnalysis]);

  const goToCapture = useCallback(() => {
    setAnalysisMessage(null);
    resetDeepDigAnalysis();
    setPreflightComplete(false);
    setPreflightBanner(null);
    setStage("capture");
    setCaptureSubstage("exports");
  }, [resetDeepDigAnalysis]);

  const goBackToUpload = useCallback(() => {
    resetDeepDigAnalysis();
    setPreflightComplete(false);
    setPreflightBanner(null);
    setStage("upload");
  }, [resetDeepDigAnalysis]);

  const tryAnalyze = useCallback((readyForAnalysis) => {
    if (!readyForAnalysis) {
      setAnalysisMessage("Upload the missing files before analysis.");
      return;
    }
    setAnalysisMessage(null);
    resetDeepDigAnalysis();
    setPreflightComplete(false);
    setPreflightBanner(null);
    setStage("preflight");
  }, [resetDeepDigAnalysis]);

  const goToReport = useCallback(() => {
    resetDeepDigAnalysis();
    setStage("report");
  }, [resetDeepDigAnalysis]);

  const goBackToPreflight = useCallback(() => {
    resetDeepDigAnalysis();
    setStage("preflight");
  }, [resetDeepDigAnalysis]);

  const goToAnalysis = useCallback(() => {
    resetDeepDigAnalysis();
    setStage("analysis");
  }, [resetDeepDigAnalysis]);

  const goBackToReport = useCallback(() => {
    setResultsPreviewMessage(null);
    setMockAnalysisBanner(null);
    setStage("report");
  }, []);

  const runPreflightCheck = useCallback(() => {
    setPreflightComplete(true);
    setPreflightBanner(
      "Files verified for analysis. You can open the Hidden Money Plays report.",
    );
  }, []);

  const startAnalysisBuild = useCallback(() => {
    goToAnalysis();
  }, [goToAnalysis]);

  const runMockAnalysis = useCallback(() => {
    setMockAnalysisComplete(true);
    setMockAnalysisBanner(
      "Mock analysis complete. All pipeline steps are marked complete.",
    );
    setResultsPreviewMessage(null);
  }, []);

  const addQueryToQueue = useCallback((queryId) => {
    setAnalysisQueryQueue((prev) =>
      prev.includes(queryId) ? prev : [...prev, queryId],
    );
    setResultsPreviewMessage(null);
  }, []);

  const removeQueryFromQueue = useCallback((queryId) => {
    setAnalysisQueryQueue((prev) => prev.filter((id) => id !== queryId));
    setResultsPreviewMessage(null);
  }, []);

  const tryGenerateResultsPreview = useCallback(() => {
    if (!mockAnalysisComplete) {
      setResultsPreviewMessage(
        "Run the mock analysis first, then add at least one query to your queue.",
      );
      return;
    }
    if (analysisQueryQueue.length === 0) {
      setResultsPreviewMessage(
        "Add at least one query from the starter library before generating a preview.",
      );
      return;
    }
    setResultsPreviewMessage("Results preview comes next.");
  }, [mockAnalysisComplete, analysisQueryQueue.length]);

  const systemsSelected = selectionOrder.length;
  const cardsCompleted = useMemo(
    () => selectionOrder.filter((id) => gatheredIds.has(id)).length,
    [selectionOrder, gatheredIds],
  );
  const readyForUpload =
    systemsSelected > 0 && cardsCompleted === systemsSelected;

  const orderedCards = useMemo(
    () => selectionOrder.filter((id) => PROVIDER_BY_ID[id]),
    [selectionOrder],
  );

  const uploadStats = useMemo(() => {
    let totalSlots = 0;
    let filesUploaded = 0;
    let providersReady = 0;
    const providerCount = orderedCards.length;

    for (const id of orderedCards) {
      const labels = requiredUploadLabelsFor(id);
      totalSlots += labels.length;
      const row = uploadFilesByProvider[id];
      let filled = 0;
      for (let i = 0; i < labels.length; i++) {
        if (row?.[i]) {
          filled++;
          filesUploaded++;
        }
      }
      if (labels.length > 0 && filled === labels.length) {
        providersReady++;
      }
    }

    const missing = Math.max(0, totalSlots - filesUploaded);
    const readyForAnalysis =
      providerCount > 0 && providersReady === providerCount;

    return {
      totalSlots,
      filesUploaded,
      missing,
      providersReady,
      providerCount,
      readyForAnalysis,
    };
  }, [orderedCards, uploadFilesByProvider]);

  const preflightMapping = useMemo(
    () => computeBucketMapping(orderedCards, uploadFilesByProvider),
    [orderedCards, uploadFilesByProvider],
  );

  const preflightDiscoveries = useMemo(
    () =>
      computeDiscoveries(
        preflightMapping.mappedBucketIds,
        orderedCards,
      ),
    [preflightMapping.mappedBucketIds, orderedCards],
  );

  const uploadSourceSummary = useMemo(() => {
    const names = orderedCards
      .map((id) => PROVIDER_BY_ID[id]?.name)
      .filter(Boolean);
    if (names.length === 0) return null;
    return names.join(" · ");
  }, [orderedCards]);

  const verifiedGuidesCount = useMemo(
    () =>
      orderedCards.filter(
        (id) => getProviderExportGuide(id).filterTier === "verified",
      ).length,
    [orderedCards],
  );

  const uploadReadinessLine =
    orderedCards.length === 0 ? "—"
    : uploadStats.readyForAnalysis ? "Ready"
    : "Incomplete";

  const schemaReadinessLine = preflightComplete ? "Ready" : "Pending";

  const analysisReadinessLine = mockAnalysisComplete ?
      "Ready"
    : "Not started";

  const captureSocialSelectedCount = useMemo(() => {
    if (!CAPTURE_SOCIAL_GROUP) return 0;
    return CAPTURE_SOCIAL_GROUP.ids.filter((id) =>
      selectedIds.has(id),
    ).length;
  }, [selectedIds]);

  useEffect(() => {
    if (stage !== "capture") return;
    if (systemsSelected === 0) {
      setCaptureSubstage("select");
    }
  }, [stage, systemsSelected]);

  const exportCardIdsKey = orderedCards.join("|");

  useEffect(() => {
    if (stage !== "capture" || captureSubstage !== "exports") return;
    if (orderedCards.length === 0) return;
    setExpandedIds((prev) => {
      if (prev.size > 0) return prev;
      const next = new Set(prev);
      next.add(orderedCards[0]);
      return next;
    });
  }, [stage, captureSubstage, exportCardIdsKey]);

  const confirmSelectedSystems = useCallback(() => {
    if (systemsSelected === 0) {
      setCaptureConfirmHint("Select at least one system to continue.");
      return;
    }
    setCaptureConfirmHint(null);
    const firstCard = selectionOrder.find((id) => PROVIDER_BY_ID[id]);
    setExpandedIds((prev) => {
      if (prev.size > 0 || !firstCard) return prev;
      return new Set([firstCard]);
    });
    setCaptureSubstage("exports");
  }, [systemsSelected, selectionOrder]);

  const editSelectedSystems = useCallback(() => {
    setCaptureSubstage("select");
  }, []);

  useEffect(() => {
    if (systemsSelected > 0) setCaptureConfirmHint(null);
  }, [systemsSelected]);

  const preflightFileCoverageRows = useMemo(() => {
    return orderedCards.map((id) => {
      const p = PROVIDER_BY_ID[id];
      const labels = requiredUploadLabelsFor(id);
      const row = uploadFilesByProvider[id] ?? [];
      let uploaded = 0;
      for (let i = 0; i < labels.length; i++) {
        if (row[i]) uploaded++;
      }
      const required = labels.length;
      const missing = Math.max(0, required - uploaded);
      const complete = required > 0 && missing === 0;
      return {
        id,
        name: p?.name ?? id,
        required,
        uploaded,
        missing,
        complete,
      };
    });
  }, [orderedCards, uploadFilesByProvider]);

  const preflightHeaderDetectionRows = useMemo(() => {
    const rows = [];
    for (const id of orderedCards) {
      const labels = requiredUploadLabelsFor(id);
      const row = uploadFilesByProvider[id] ?? [];
      const pName = PROVIDER_BY_ID[id]?.name ?? id;
      for (let i = 0; i < labels.length; i++) {
        const file = row[i];
        if (!file) continue;
        const slotLabel = labels[i];
        const loaded = getLoadedSampleForUpload(id, slotLabel, file);
        const nCols = loaded?.expectedHeaders?.length;
        rows.push({
          key: `${id}-${slotLabel}-${i}`,
          provider: pName,
          report: slotLabel,
          detected:
            typeof nCols === "number" ? `${nCols} columns` : "Pending (local)",
          matched:
            preflightComplete && typeof nCols === "number" ?
              String(Math.min(nCols, Math.max(4, nCols - 1)))
            : preflightComplete ?
              "4"
            : "—",
          missingRequired: preflightComplete ? "0" : "—",
          confidence: preflightComplete ? "High" : "Pending",
        });
      }
    }
    return rows;
  }, [orderedCards, uploadFilesByProvider, preflightComplete]);

  const preflightMappedBucketSet = useMemo(
    () => new Set(preflightMapping.mappedBucketIds),
    [preflightMapping.mappedBucketIds],
  );

  const deepDigBackControl =
    stage === "capture" ?
      <Link
        to="/salon-owner"
        className="inline-flex items-center justify-center rounded-full border border-[#e2d6cf] bg-[#fffdfb] p-2 text-[#6b6262] transition hover:border-[#b88f45]/45 hover:text-[#b88f45]"
        aria-label="Back to dashboard"
      >
        <FaArrowLeft className="text-sm" aria-hidden />
      </Link>
    : stage === "upload" ?
      <button
        type="button"
        onClick={goToCapture}
        className="inline-flex items-center justify-center rounded-full border border-[#e2d6cf] bg-[#fffdfb] p-2 text-[#6b6262] transition hover:border-[#b88f45]/45 hover:text-[#b88f45]"
        aria-label="Back to Data Capture"
      >
        <FaArrowLeft className="text-sm" aria-hidden />
      </button>
    : stage === "preflight" ?
      <button
        type="button"
        onClick={goBackToUpload}
        className="inline-flex items-center justify-center rounded-full border border-[#e2d6cf] bg-[#fffdfb] p-2 text-[#6b6262] transition hover:border-[#b88f45]/45 hover:text-[#b88f45]"
        aria-label="Back to Upload Queue"
      >
        <FaArrowLeft className="text-sm" aria-hidden />
      </button>
    : stage === "report" ?
      <button
        type="button"
        onClick={goBackToPreflight}
        className="inline-flex items-center justify-center rounded-full border border-[#e2d6cf] bg-[#fffdfb] p-2 text-[#6b6262] transition hover:border-[#b88f45]/45 hover:text-[#b88f45]"
        aria-label="Back to Preflight"
      >
        <FaArrowLeft className="text-sm" aria-hidden />
      </button>
    : stage === "analysis" ?
      <button
        type="button"
        onClick={goBackToReport}
        className="inline-flex items-center justify-center rounded-full border border-[#e2d6cf] bg-[#fffdfb] p-2 text-[#6b6262] transition hover:border-[#b88f45]/45 hover:text-[#b88f45]"
        aria-label="Back to Report"
      >
        <FaArrowLeft className="text-sm" aria-hidden />
      </button>
    : null;

  const deepDigGuidanceStatusChip =
    stage === "capture" ?
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          captureSubstage === "select" ? "bg-[#f5eee9] text-[#6b6262]"
          : readyForUpload ? "bg-[#e8f0e6] text-[#3d5c3a]"
          : "bg-[#f4ead8] text-[#6b5420]"
        }`}
      >
        {captureSubstage === "select" ? "Select systems"
        : readyForUpload ? "Ready for upload"
        : "Gather exports"}
      </span>
    : stage === "upload" ?
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          uploadStats.readyForAnalysis ?
            "bg-[#e8f0e6] text-[#3d5c3a]"
          : "bg-[#f4ead8] text-[#6b5420]"
        }`}
      >
        {uploadStats.readyForAnalysis ? "Queue ready" : "Files pending"}
      </span>
    : stage === "preflight" ?
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          preflightComplete ?
            "bg-[#e8f0e6] text-[#3d5c3a]"
          : "bg-[#f5eee9] text-[#6b6262]"
        }`}
      >
        {preflightComplete ? "Preflight ready" : "Run check"}
      </span>
    : stage === "report" ?
      <span className="inline-flex rounded-full bg-[#e8f0e6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3d5c3a]">
        Plays listed
      </span>
    : stage === "analysis" ?
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          mockAnalysisComplete ?
            "bg-[#e8f0e6] text-[#3d5c3a]"
          : "bg-[#f5eee9] text-[#6b6262]"
        }`}
      >
        {mockAnalysisComplete ? "Mock complete" : "Run analysis"}
      </span>
    : null;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#f5eee9] font-poppins text-[#333232]">
      <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_min(15.5rem,26%)] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_16.25rem] xl:gap-8">
          <div className="min-w-0 flex flex-col gap-3 sm:gap-4">
            <DeepDigCompactPageHeader
              stage={stage}
              backControl={deepDigBackControl}
            />
            <DeepDigWorkflowPipeline
              stage={stage}
              onRequestStepInfo={openPipelineStepInfo}
            />
            {stage !== "capture" ?
              <DeepDigCurrentStepGuidance
                stage={stage}
                statusChip={deepDigGuidanceStatusChip}
              />
            : null}
            {selectedPipelineInfo ?
              <DeepDigPipelineInfoOverlay
                stageId={selectedPipelineInfo}
                onClose={() => setSelectedPipelineInfo(null)}
              />
            : null}
        {stage === "capture" ?
          <>
            {captureSubstage === "select" ?
              <>
        {/* Provider selector */}
        <section className="rounded-2xl border border-[#e2d6cf] bg-white/95 p-4 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.3)] sm:p-5">
          <h2 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
            1 — Select your systems
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-[#6b6262]">
            Choose every platform your salon actively uses. We&apos;ll build
            the export checklist from your selections.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4">
            <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-[#e8ddd4] bg-[#faf6f2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a45f76]">
              Provider export guides
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
              <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#333232] sm:text-[13px]">
                <input
                  type="checkbox"
                  checked={captureShowVerifiedOnly}
                  onChange={(e) =>
                    setCaptureShowVerifiedOnly(e.target.checked)
                  }
                  className="h-3.5 w-3.5 shrink-0 rounded border-[#c9a86a]/50 text-[#b88f45] focus:ring-[#b88f45]/30"
                />
                Show verified only
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#333232] sm:text-[13px]">
                <input
                  type="checkbox"
                  checked={captureShowNeedsResearch}
                  onChange={(e) =>
                    setCaptureShowNeedsResearch(e.target.checked)
                  }
                  className="h-3.5 w-3.5 shrink-0 rounded border-[#c9a86a]/50 text-[#b88f45] focus:ring-[#b88f45]/30"
                />
                Show needs research
              </label>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {CAPTURE_GRID_GROUPS.map((group) => {
              const Icon = CAPTURE_GROUP_ICON[group.key] ?? FaBook;
              const selectedInGroup = group.ids.filter((id) =>
                selectedIds.has(id),
              ).length;
              return (
                <div
                  key={group.key}
                  className="min-w-0 rounded-lg border border-[#efe4db] bg-[#fffdfb] p-2.5 sm:p-3"
                >
                  <h3 className="mb-2 flex items-center justify-between gap-2 border-b border-[#efe4db]/80 pb-1.5">
                    <span className="flex min-w-0 flex-1 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a45f76]">
                      <Icon
                        className="size-3.5 shrink-0 text-[#b88f45]"
                        aria-hidden
                      />
                      <span className="min-w-0 leading-tight">
                        {group.title}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-[#f0eae3] px-2 py-0.5 text-[9px] font-semibold tabular-nums tracking-wide text-[#8a807c]">
                      {selectedInGroup} selected
                    </span>
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {group.ids
                      .filter((id) =>
                        captureGuideRowVisible(
                          id,
                          captureShowVerifiedOnly,
                          captureShowNeedsResearch,
                        ),
                      )
                      .map((id) => {
                        const p = PROVIDER_BY_ID[id];
                        if (!p) return null;
                        const checked = selectedIds.has(id);
                        const confKey = guideTierToConfidenceKey(
                          getProviderExportGuide(id).filterTier,
                        );
                        const dotClass = DEEP_DIG_CONFIDENCE[confKey].dot;
                        return (
                          <li key={id} className="w-fit max-w-full">
                            <label
                              className={`inline-flex h-[40px] max-w-full cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 leading-none transition ${
                                checked ?
                                  "border-2 border-[#b88f45] bg-[#f0d9b8]/98 text-[#2f2a28] shadow-[inset_0_1px_0_rgba(255,253,251,0.65),0_1px_2px_rgba(47,42,40,0.05)]"
                                : "border border-[#efe4db] bg-white/95 hover:border-[#d9c4b8]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleSelected(id)}
                                className="h-4 w-4 shrink-0 rounded border-[#c9a86a]/50 text-[#b88f45] focus:ring-[#b88f45]/30"
                              />
                              <span className="min-w-0 truncate text-[13px] font-semibold text-[#333232]">
                                {p.name}
                              </span>
                              <span
                                className={`ml-0.5 size-1.5 shrink-0 rounded-full ring-2 ring-[#fffdfb]/90 ${dotClass}`}
                                title={`Confidence: ${DEEP_DIG_CONFIDENCE[confKey].legendLabel}`}
                                aria-hidden
                              />
                            </label>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              );
            })}
          </div>

          {CAPTURE_SOCIAL_GROUP ?
            <div className="mt-3 min-w-0 rounded-lg border border-[#efe4db] bg-[#fffdfb] p-2.5 sm:p-3">
              <h3 className="mb-2 flex items-center justify-between gap-2 border-b border-[#efe4db]/80 pb-1.5">
                <span className="flex min-w-0 flex-1 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a45f76]">
                  <FaShareAlt
                    className="size-3.5 shrink-0 text-[#b88f45]"
                    aria-hidden
                  />
                  <span className="min-w-0 leading-tight">
                    {CAPTURE_SOCIAL_GROUP.title}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-[#f0eae3] px-2 py-0.5 text-[9px] font-semibold tabular-nums tracking-wide text-[#8a807c]">
                  {captureSocialSelectedCount} selected
                </span>
              </h3>
              <ul className="flex flex-wrap content-start gap-2">
                {CAPTURE_SOCIAL_GROUP.ids
                  .filter((id) =>
                    captureGuideRowVisible(
                      id,
                      captureShowVerifiedOnly,
                      captureShowNeedsResearch,
                    ),
                  )
                  .map((id) => {
                    const p = PROVIDER_BY_ID[id];
                    if (!p) return null;
                    const checked = selectedIds.has(id);
                    const confKey = guideTierToConfidenceKey(
                      getProviderExportGuide(id).filterTier,
                    );
                    const dotClass = DEEP_DIG_CONFIDENCE[confKey].dot;
                    return (
                      <li key={id} className="w-fit max-w-full">
                        <label
                          className={`inline-flex h-[40px] max-w-full cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 leading-none transition ${
                            checked ?
                              "border-2 border-[#b88f45] bg-[#f0d9b8]/98 text-[#2f2a28] shadow-[inset_0_1px_0_rgba(255,253,251,0.65),0_1px_2px_rgba(47,42,40,0.05)]"
                            : "border border-[#efe4db] bg-white/95 hover:border-[#d9c4b8]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSelected(id)}
                            className="h-4 w-4 shrink-0 rounded border-[#c9a86a]/50 text-[#b88f45] focus:ring-[#b88f45]/30"
                          />
                          <span className="max-w-[140px] truncate text-[13px] font-semibold text-[#333232] sm:max-w-none">
                            {p.name}
                          </span>
                          <span
                            className={`ml-0.5 size-1.5 shrink-0 rounded-full ring-2 ring-[#fffdfb]/90 ${dotClass}`}
                            title={`Confidence: ${DEEP_DIG_CONFIDENCE[confKey].legendLabel}`}
                            aria-hidden
                          />
                        </label>
                      </li>
                    );
                  })}
              </ul>
            </div>
          : null}

          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[#efe4db]/80 pt-3 text-[10px] text-[#6b6262]">
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`size-1.5 shrink-0 rounded-full ${DEEP_DIG_CONFIDENCE.verified.dot}`}
                aria-hidden
              />
              Verified
            </span>
            <span className="text-[#c9bfb8]" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`size-1.5 shrink-0 rounded-full ${DEEP_DIG_CONFIDENCE.assumed.dot}`}
                aria-hidden
              />
              Assumed
            </span>
            <span className="text-[#c9bfb8]" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`size-1.5 shrink-0 rounded-full ${DEEP_DIG_CONFIDENCE.needs_live_validation.dot}`}
                aria-hidden
              />
              Needs live validation
            </span>
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#efe4db]/80 pt-4">
            <p className="text-sm font-semibold text-[#333232]">
              Selected systems:{" "}
              <span className="font-studio-serif tabular-nums text-[#2f2a28]">
                {systemsSelected}
              </span>
            </p>
            <button
              type="button"
              disabled={systemsSelected === 0}
              onClick={confirmSelectedSystems}
              className={`inline-flex min-h-10 items-center justify-center rounded-full px-5 text-xs font-bold tracking-wide transition sm:text-sm ${
                systemsSelected === 0 ?
                  "cursor-not-allowed bg-[#c4b8ad] text-[#fffdfb]/90"
                : "bg-[#2f2a28] text-[#fffdfb] hover:bg-[#3d3634]"
              }`}
            >
              Confirm selected systems
            </button>
          </div>
          {captureConfirmHint ?
            <p
              role="status"
              className="mt-2 text-sm font-medium text-[#7f5362]"
            >
              {captureConfirmHint}
            </p>
          : null}
        </section>
              </>
            : null}
            {captureSubstage === "exports" ?
              <>
                <section className="rounded-xl border border-[#e2d6cf] bg-white/95 p-3 shadow-sm sm:p-4">
                  <h2 className="font-studio-serif text-lg font-semibold text-[#2f2a28] sm:text-xl">
                    2 — Export List
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-sm text-[#6b6262]">
                    Open each provider card, follow the export guide, and mark
                    it gathered when the files are ready.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {orderedCards.map((id) => {
                      const pSel = PROVIDER_BY_ID[id];
                      if (!pSel) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex rounded-full border border-[#e8ddd4] bg-[#faf6f2] px-2.5 py-1 text-[11px] font-semibold text-[#333232]"
                        >
                          {pSel.name}
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex rounded-full bg-[#f5eee9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#333232]">
                      Systems: {systemsSelected}
                    </span>
                    <span className="inline-flex rounded-full bg-[#f5eee9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#333232]">
                      Gathered: {cardsCompleted}/{systemsSelected || 0}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        readyForUpload ?
                          "bg-[#e8f0e6] text-[#3d5c3a]"
                        : "bg-[#f4ead8] text-[#6b5420]"
                      }`}
                    >
                      Ready for upload: {readyForUpload ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#efe4db]/80 pt-3">
                    <button
                      type="button"
                      onClick={editSelectedSystems}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#2f2a28]/18 bg-[#fffdfb] px-4 text-xs font-bold text-[#333232] transition hover:border-[#b88f45]/45 hover:bg-[#faf4ee]"
                    >
                      Edit systems
                    </button>
                    <button
                      type="button"
                      disabled={!readyForUpload}
                      onClick={goToUpload}
                      className={`inline-flex min-h-10 items-center justify-center rounded-full px-5 text-xs font-bold tracking-wide transition sm:text-sm ${
                        readyForUpload ?
                          "bg-[#2f2a28] text-[#fffdfb] hover:bg-[#3d3634]"
                        : "cursor-not-allowed bg-[#c4b8ad] text-[#fffdfb]/90"
                      }`}
                    >
                      Continue to Uploads
                    </button>
                  </div>
                </section>

        {/* Selected cards */}
        <section className="space-y-4">
          <div>
            <h2 className="font-studio-serif text-base font-semibold text-[#6b6262] sm:text-lg">
              Your export checklist
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8a7f7c] sm:text-sm">
              Each provider below includes instructions, sample files, support
              fallback, and concierge assist.
            </p>
          </div>
          {orderedCards.length > 0 ?
            orderedCards.map((id) => {
              const p = PROVIDER_BY_ID[id];
              if (!p) return null;
              const guide = getProviderExportGuide(id);
              const expanded = expandedIds.has(id);
              const gathered = gatheredIds.has(id);
              const guideConfidenceKey =
                guideTierToConfidenceKey(guide.filterTier);
              const sampleExportsForCard = getSampleExportsForProvider(id);
              const uploadLabelsForCard = requiredUploadLabelsFor(id);
              const uploadRowForCard = uploadFilesByProvider[id] ?? [];
              let uploadFilledForCard = 0;
              for (let i = 0; i < uploadLabelsForCard.length; i++) {
                if (uploadRowForCard[i]) uploadFilledForCard++;
              }
              const uploadSlotsTotal = uploadLabelsForCard.length;
              const schemaRowsForCard = PROVIDER_SCHEMA_STATUS.filter(
                (r) => r.providerId === id,
              );
              const schemaMappedCount = schemaRowsForCard.filter(
                (r) => r.status === "mapped",
              ).length;
              const schemaSampleNeededCount = schemaRowsForCard.filter(
                (r) => r.status === "sample_needed",
              ).length;
              const verifiedDocsLabel =
                guide.filterTier === "verified" ? "Verified" : "Review";
              const uploadSummaryLabel =
                uploadSlotsTotal === 0 ?
                  "—"
                : uploadFilledForCard >= uploadSlotsTotal ?
                  "Complete"
                : uploadFilledForCard === 0 ?
                  "Empty"
                : `${uploadFilledForCard}/${uploadSlotsTotal}`;
              const schemaSummaryLabel =
                schemaRowsForCard.length === 0 ?
                  "No registry rows"
                : `${schemaMappedCount} mapped · ${schemaSampleNeededCount} need sample`;
              const workflowRows = flattenExportWorkflow(guide);
              return (
                <article
                  key={id}
                  className="overflow-hidden rounded-xl border border-[#e8ddd4] bg-white shadow-[0_8px_32px_-28px_rgba(39,46,45,0.22)]"
                >
                  <div
                    className={`flex flex-col gap-2 px-3 py-2.5 sm:px-4 lg:flex-row lg:items-center lg:justify-between lg:gap-3 ${
                      expanded ? "border-b border-[#efe4db]/90 bg-[#fffcf9]" : ""
                    }`}
                  >
                    <div className="min-w-0 flex flex-1 flex-wrap items-center gap-x-3 gap-y-1.5">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#b8966a]">
                          {p.category}
                        </p>
                        <h3 className="font-studio-serif text-base font-semibold leading-tight text-[#2f2a28] sm:text-lg">
                          {guide.providerName}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <span
                          className={`inline-flex max-w-full items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase leading-snug tracking-wide ${exportGuideConfidenceClass(guide.filterTier)}`}
                        >
                          {guide.confidenceChip}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            gathered ?
                              "bg-[#e8f0e6] text-[#3d5c3a]"
                            : "bg-[#f5eee9] text-[#6b6262]"
                          }`}
                        >
                          {gathered ?
                            <>
                              <FaCheck className="text-[9px]" aria-hidden />
                              Gathered
                            </>
                          : "Not started"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(id)}
                        className="inline-flex min-h-8 items-center justify-center gap-1 rounded-full border border-[#2f2a28]/14 bg-[#fffdfb] px-2.5 text-[11px] font-bold text-[#333232] transition hover:border-[#b88f45]/45 hover:bg-[#faf4ee] sm:px-3 sm:text-xs"
                      >
                        Open instructions
                        {expanded ?
                          <FaChevronUp className="text-[10px]" aria-hidden />
                        : <FaChevronDown className="text-[10px]" aria-hidden />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConciergeDrawerProviderId(id)}
                        className="inline-flex min-h-8 items-center justify-center rounded-full border border-[#e2d6cf] bg-[#fffdfb] px-2.5 text-[11px] font-semibold text-[#6b6262] transition hover:border-[#b88f45]/35 hover:bg-[#faf4ee] hover:text-[#333232] sm:px-3 sm:text-xs"
                      >
                        Need help exporting?
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleGathered(id)}
                        className="inline-flex min-h-8 items-center justify-center rounded-full border border-[#e2d6cf] bg-white px-2.5 text-[11px] font-bold text-[#333232] transition hover:border-[#b88f45]/40 hover:bg-[#faf4ee] sm:px-3 sm:text-xs"
                      >
                        {gathered ? "Mark not gathered" : "Mark gathered"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProvider(id)}
                        className="inline-flex min-h-8 items-center justify-center gap-1 rounded-full border border-[#a45f76]/25 px-2.5 text-[11px] font-bold text-[#7f5362] transition hover:bg-[#faf0f2] sm:px-3 sm:text-xs"
                      >
                        <FaTrashAlt className="text-[11px]" aria-hidden />
                        Remove
                      </button>
                    </div>
                  </div>

                  {expanded ?
                    <div className="border-t border-[#efe4db]/80 bg-[#faf8f5]/25 px-3 py-4 sm:px-4 sm:py-5">
                      <div className="mx-auto max-w-3xl space-y-5">
                        <div className="flex flex-wrap items-center gap-2 border-b border-[#efe4db]/50 pb-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a45f76]">
                            Export mode
                          </span>
                          <span className="rounded-full bg-[#faf0e4] px-2.5 py-1 text-[10px] font-bold text-[#6b4f21]">
                            Guided export
                          </span>
                          <span
                            className="rounded-full border border-dashed border-[#ded5cd] px-2.5 py-1 text-[10px] font-semibold text-[#a39a97]"
                            title="Coming later"
                          >
                            Connect account
                          </span>
                          <span
                            className="rounded-full border border-dashed border-[#ded5cd] px-2.5 py-1 text-[10px] font-semibold text-[#a39a97]"
                            title="Use Need help exporting?"
                          >
                            Concierge assist
                          </span>
                        </div>

                        <section className="rounded-xl border border-[#e8ddd4] bg-[#fffdfb] p-4 sm:p-5">
                          <h4 className="font-studio-serif text-lg font-semibold text-[#2f2a28]">
                            Export workflow
                          </h4>
                          <p className="mt-1 text-sm leading-snug text-[#6b6262]">
                            Follow these steps inside {guide.providerName} to
                            generate your export files.
                          </p>
                          <p className="mt-2 text-[11px] text-[#8a7f7c]">
                            <span className="font-semibold text-[#5f5654]">
                              Suggested date range:
                            </span>{" "}
                            {DATE_RANGE_LABEL}
                          </p>
                          <ul className="mt-4 space-y-4">
                            {workflowRows.map((row, wi) => (
                              <li key={wi} className="flex gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c9a86a]/45 bg-[#faf0e4] font-studio-serif text-sm font-semibold tabular-nums text-[#6b4f21]">
                                  {wi + 1}
                                </span>
                                <div className="min-w-0 flex-1 pt-0.5">
                                  {row.groupTitle ?
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#a45f76]">
                                      {row.groupTitle}
                                    </p>
                                  : null}
                                  <p className="text-sm leading-relaxed text-[#333232]">
                                    {row.stepText}
                                  </p>
                                  {row.screenshot ?
                                    <div className="mt-2 flex gap-2 rounded-lg border border-dashed border-[#cfc4bc] bg-[#f5eee9]/35 px-2.5 py-2">
                                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#fffdfb] text-[#b88f45] ring-1 ring-[#e8ddd4]">
                                        <FaImage
                                          className="text-xs opacity-90"
                                          aria-hidden
                                        />
                                      </span>
                                      <div className="min-w-0">
                                        <p className="text-[9px] font-bold uppercase tracking-wide text-[#6b6262]">
                                          Screenshot placeholder
                                        </p>
                                        <p className="text-xs font-semibold text-[#333232]">
                                          {row.screenshot.label}
                                        </p>
                                        <p className="text-[10px] leading-snug text-[#7a716e]">
                                          {row.screenshot.description}
                                        </p>
                                      </div>
                                    </div>
                                  : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                          {!gathered ?
                            <button
                              type="button"
                              onClick={() => markExportWorkflowComplete(id)}
                              className="mt-5 w-full rounded-full bg-[#2f2a28] px-4 py-2.5 text-sm font-bold text-[#fffdfb] transition hover:bg-[#3d3634] sm:w-auto sm:px-6"
                            >
                              Mark export workflow complete
                            </button>
                          : <div className="mt-5 flex flex-wrap items-center gap-3">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f0e6] px-3 py-1.5 text-xs font-semibold text-[#3d5c3a]">
                                <FaCheck className="text-[10px]" aria-hidden />
                                Export workflow complete
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleGathered(id)}
                                className="text-xs font-semibold text-[#7f5362] underline underline-offset-2"
                              >
                                Undo complete
                              </button>
                            </div>
                          }
                        </section>

                        <section>
                          <h5 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a45f76]">
                            Required exports
                          </h5>
                          <p className="mt-1 text-xs text-[#8a7f7c]">
                            Download each export below, then add the files in{" "}
                            <strong className="font-semibold text-[#5f5654]">
                              Upload
                            </strong>{" "}
                            (next pipeline step).
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {guide.requiredExports.map((line) => (
                              <span
                                key={line}
                                className="inline-flex rounded-full border border-[#e2d6cf] bg-[#faf6f2] px-2.5 py-1 text-[11px] font-semibold text-[#333232]"
                              >
                                {line}
                              </span>
                            ))}
                          </div>
                          <p className="mt-2 text-[11px] leading-snug text-[#8a7f7c]">
                            Expected files: {guide.expectedFileTypes}
                          </p>
                        </section>

                        {guide.officialLinks.length > 0 ?
                          <div className="flex flex-wrap gap-1.5">
                            {guide.officialLinks.map((link) => (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#e8ddd4] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#333232] transition hover:border-[#b88f45]/45"
                              >
                                <FaExternalLinkAlt
                                  className="size-2.5 shrink-0 text-[#b88f45]"
                                  aria-hidden
                                />
                                <span className="min-w-0 truncate">
                                  {link.label}
                                </span>
                              </a>
                            ))}
                          </div>
                        : null}

                        <div className="space-y-2">
                          <ExportCardAccordion label="Why this data matters">
                            <p>{guide.whatWeNeedThisFor}</p>
                          </ExportCardAccordion>
                          <ExportCardAccordion label="Trust + validation notes">
                            <p className="mb-3">{guide.notes}</p>
                            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#efe4db]/70 pt-2 text-[10px] font-medium text-[#6b6262]">
                              <span
                                className={`inline-flex items-center gap-1.5 ${
                                  guideConfidenceKey === "verified" ?
                                    "font-semibold text-[#333232]"
                                  : ""
                                }`}
                              >
                                <span
                                  className={`size-2 shrink-0 rounded-full ${DEEP_DIG_CONFIDENCE.verified.dot}`}
                                  aria-hidden
                                />
                                {
                                  DEEP_DIG_CONFIDENCE.verified.legendLabel
                                }
                              </span>
                              <span className="text-[#c9bfb8]" aria-hidden>
                                ·
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 ${
                                  guideConfidenceKey === "assumed" ?
                                    "font-semibold text-[#333232]"
                                  : ""
                                }`}
                              >
                                <span
                                  className={`size-2 shrink-0 rounded-full ${DEEP_DIG_CONFIDENCE.assumed.dot}`}
                                  aria-hidden
                                />
                                {DEEP_DIG_CONFIDENCE.assumed.legendLabel}
                              </span>
                              <span className="text-[#c9bfb8]" aria-hidden>
                                ·
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 ${
                                  guideConfidenceKey ===
                                  "needs_live_validation" ?
                                    "font-semibold text-[#333232]"
                                  : ""
                                }`}
                              >
                                <span
                                  className={`size-2 shrink-0 rounded-full ${DEEP_DIG_CONFIDENCE.needs_live_validation.dot}`}
                                  aria-hidden
                                />
                                {
                                  DEEP_DIG_CONFIDENCE.needs_live_validation
                                    .legendLabel
                                }
                              </span>
                            </p>
                          </ExportCardAccordion>
                          <ExportCardAccordion label="Support fallback">
                            <p>{guide.supportFallback}</p>
                          </ExportCardAccordion>
                          <ExportCardAccordion label="Export readiness">
                            <dl className="space-y-2 text-xs">
                              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#efe4db]/70 pb-2">
                                <dt className="font-semibold text-[#6b6262]">
                                  Required exports
                                </dt>
                                <dd>
                                  <span className="inline-flex rounded-full bg-[#f5eee9] px-2 py-0.5 text-[10px] font-bold tabular-nums text-[#333232]">
                                    {guide.requiredExports.length} items
                                  </span>
                                </dd>
                              </div>
                              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#efe4db]/70 pb-2">
                                <dt className="font-semibold text-[#6b6262]">
                                  Sample exports
                                </dt>
                                <dd>
                                  <span className="inline-flex rounded-full bg-[#f0eae3] px-2 py-0.5 text-[10px] font-bold tabular-nums text-[#333232]">
                                    {sampleExportsForCard.length} available
                                  </span>
                                </dd>
                              </div>
                              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#efe4db]/70 pb-2">
                                <dt className="font-semibold text-[#6b6262]">
                                  Verified docs
                                </dt>
                                <dd>
                                  <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                      verifiedDocsLabel === "Verified" ?
                                        "bg-[#e8f0e6] text-[#3d5c3a]"
                                      : "bg-[#f4ead8] text-[#6b5420]"
                                    }`}
                                  >
                                    {verifiedDocsLabel}
                                  </span>
                                </dd>
                              </div>
                              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#efe4db]/70 pb-2">
                                <dt className="font-semibold text-[#6b6262]">
                                  Upload status
                                </dt>
                                <dd>
                                  <span className="inline-flex rounded-full bg-[#fffdfb] px-2 py-0.5 text-[10px] font-bold text-[#333232] ring-1 ring-[#e8ddd4]">
                                    {uploadSummaryLabel}
                                  </span>
                                </dd>
                              </div>
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <dt className="font-semibold text-[#6b6262]">
                                  Schema status
                                </dt>
                                <dd className="max-w-[min(100%,14rem)] text-right text-[11px] font-medium leading-snug text-[#333232]">
                                  {schemaSummaryLabel}
                                </dd>
                              </div>
                            </dl>
                          </ExportCardAccordion>
                          <ExportCardAccordion label="Sample exports">
                            {sampleExportsForCard.length > 0 ?
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {sampleExportsForCard.map((sample) => (
                                  <div
                                    key={sample.id}
                                    className="rounded-md border border-[#e8ddd4] bg-[#fffdfb] p-2.5"
                                  >
                                    <p className="text-xs font-semibold text-[#333232]">
                                      {sample.label}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      <a
                                        href={sample.path}
                                        download={sample.filename}
                                        className="inline-flex items-center text-[11px] font-semibold text-[#b88f45] underline decoration-[#e8ddd4] underline-offset-2 transition hover:text-[#a67c32]"
                                      >
                                        Download sample CSV
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setUploadSamplePreviewId(sample.id)
                                        }
                                        className="inline-flex rounded-full border border-[#2f2a28]/14 bg-white px-2.5 py-1 text-[10px] font-bold text-[#333232] transition hover:border-[#b88f45]/45 hover:bg-[#faf4ee]"
                                      >
                                        View example
                                      </button>
                                    </div>
                                    <div className="mt-1.5 flex max-h-14 flex-wrap gap-1 overflow-hidden">
                                      {sample.expectedHeaders
                                        .slice(0, 8)
                                        .map((h) => (
                                          <span
                                            key={h}
                                            className="rounded-full border border-[#e2d6cf] bg-[#faf6f2] px-1.5 py-0 text-[9px] font-semibold text-[#4a4340]"
                                          >
                                            {h}
                                          </span>
                                        ))}
                                      {sample.expectedHeaders.length > 8 ?
                                        <span className="self-center text-[9px] text-[#a39a97]">
                                          +{sample.expectedHeaders.length - 8}{" "}
                                          headers
                                        </span>
                                      : null}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            : <p className="text-[11px] italic leading-snug text-[#8a7f7c]">
                                No packaged samples for this provider yet.
                              </p>}
                          </ExportCardAccordion>
                        </div>

                        <label className="block rounded-lg border border-[#efe4db]/70 bg-white/80 p-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a45f76]">
                            Notes for your team
                          </span>
                          <textarea
                            value={notesById[id] ?? ""}
                            onChange={(e) => setNote(id, e.target.value)}
                            rows={3}
                            placeholder='Add login/export notes for your team…'
                            className="mt-2 w-full resize-y rounded-lg border border-[#e2d6cf] bg-white px-3 py-2 text-sm text-[#333232] placeholder:text-[#a39a97] focus:border-[#b88f45] focus:outline-none focus:ring-2 focus:ring-[#b88f45]/20"
                          />
                        </label>
                      </div>
                    </div>
                  : null}

                </article>
              );
            })
          : <div className="rounded-lg border border-dashed border-[#d9c4b8] bg-[#fffcf9]/85 px-4 py-3 text-sm leading-snug text-[#6b6262]">
              Use{" "}
              <button
                type="button"
                onClick={editSelectedSystems}
                className="font-semibold text-[#b88f45] underline-offset-2 hover:underline"
              >
                Edit systems
              </button>{" "}
              to add providers to your checklist.
            </div>}
        </section>

        {conciergeDrawerProviderId ?
          <DeepDigConciergeDrawer
            providerId={conciergeDrawerProviderId}
            onClose={() => setConciergeDrawerProviderId(null)}
            credentialAssistByProvider={credentialAssistByProvider}
            patchCredentialAssist={patchCredentialAssist}
            submitCredentialAssist={submitCredentialAssist}
            requestGuidedCredentialSession={requestGuidedCredentialSession}
          />
        : null}

        <p className="mt-2 text-center text-[10px] leading-snug text-[#a39a97]">
          Provider paths change. Verify live-account instructions before
          promising one-click guidance.
        </p>
              </>
            : null}
          </>
        : null}
        {stage === "upload" ?
          <>
            {orderedCards.length > 0 ?
              <div className="rounded-xl border border-[#e2d6cf] bg-white/90 p-4 shadow-sm sm:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a45f76]">
                  Try sample exports
                </p>
                <p className="mt-1 text-xs text-[#6b6262]">
                  Load Jenny&apos;s Nails demo CSVs into the queue (local files
                  only — no upload to a server).
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => loadSampleSet("glossgenius")}
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#ded3cc] bg-[#fffdfb] px-4 text-xs font-bold text-[#333232] transition hover:border-[#b88f45] hover:text-[#b88f45]"
                  >
                    Load GlossGenius sample set
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleSet("vagaro")}
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#ded3cc] bg-[#fffdfb] px-4 text-xs font-bold text-[#333232] transition hover:border-[#b88f45] hover:text-[#b88f45]"
                  >
                    Load Vagaro sample set
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleSet("instagram-meta")}
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#ded3cc] bg-[#fffdfb] px-4 text-xs font-bold text-[#333232] transition hover:border-[#b88f45] hover:text-[#b88f45]"
                  >
                    Load Instagram sample set
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleSet("square-appointments")}
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#ded3cc] bg-[#fffdfb] px-4 text-xs font-bold text-[#333232] transition hover:border-[#b88f45] hover:text-[#b88f45]"
                  >
                    Load Square sample set
                  </button>
                </div>
              </div>
            : null}

            {orderedCards.length === 0 ?
              <p className="rounded-xl border border-dashed border-[#d9c4b8] bg-white/60 px-5 py-10 text-center text-sm text-[#6b6262]">
                No providers in your queue. Go back to Data Capture to select
                systems.
              </p>
            : <section className="flex flex-col gap-5">
                {orderedCards.map((id) => {
                  const p = PROVIDER_BY_ID[id];
                  if (!p) return null;
                  const labels = requiredUploadLabelsFor(id);
                  const row = uploadFilesByProvider[id] ?? [];
                  let filled = 0;
                  for (let i = 0; i < labels.length; i++) {
                    if (row[i]) filled++;
                  }
                  const total = labels.length;
                  const waiting = filled === 0;
                  const partial = filled > 0 && filled < total;
                  const chipClass = waiting ?
                      "bg-[#f5eee9] text-[#6b6262]"
                    : partial ?
                      "bg-[#f4ead8] text-[#6b5420]"
                    : "bg-[#e8f0e6] text-[#3d5c3a]";
                  const chipText = waiting ?
                      "Waiting for files"
                    : partial ?
                      "Files added"
                    : "Ready";

                  return (
                    <article
                      key={id}
                      className="rounded-xl border border-[#e2d6cf] bg-white p-5 shadow-[0_14px_40px_-34px_rgba(39,46,45,0.28)] sm:p-6"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b8966a]">
                            {p.category}
                          </p>
                          <h2 className="mt-1 font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
                            {p.name}
                          </h2>
                          <span
                            className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${chipClass}`}
                          >
                            {chipText}
                          </span>
                        </div>
                        {getSampleExportsForProvider(id).length > 0 ?
                          <button
                            type="button"
                            onClick={() => loadSampleSet(id)}
                            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border-2 border-[#b88f45] bg-[#fffdfb] px-4 text-xs font-bold tracking-wide text-[#2f2a28] transition hover:bg-[#faf0e4] sm:text-sm"
                          >
                            Load sample files
                          </button>
                        : null}
                      </div>

                      <h3 className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a45f76]">
                        Required uploads
                      </h3>
                      <ul className="mt-3 flex flex-col gap-4">
                        {labels.map((label, idx) => {
                          const inputId = `data-mine-file-${id}-${idx}`;
                          const file = row[idx] ?? null;
                          const displayName = getUploadSlotDisplayName(file);
                          const slotSample = findSampleForUploadLabel(id, label);
                          const loadedSample = getLoadedSampleForUpload(
                            id,
                            label,
                            file,
                          );
                          return (
                            <li
                              key={`${id}-${label}-${idx}`}
                              className="rounded-xl border border-[#efe4db] bg-[#fffdfb] p-4 sm:p-5"
                            >
                              <label
                                htmlFor={inputId}
                                className="text-sm font-semibold text-[#333232]"
                              >
                                {label}
                              </label>
                              <input
                                id={inputId}
                                type="file"
                                accept={ACCEPT_ATTR}
                                onChange={(e) => {
                                  const f = e.target.files?.[0] ?? null;
                                  setUploadSlot(id, idx, f);
                                }}
                                className="mt-3 block w-full cursor-pointer text-sm text-[#5f5654] file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#b88f45] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#c0a05a]"
                              />
                              <p className="mt-2 text-xs leading-relaxed text-[#8a7f7c]">
                                CSV, XLSX, or PDF accepted for now
                              </p>
                              {slotSample ?
                                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                                  <a
                                    href={slotSample.path}
                                    download={slotSample.filename}
                                    className="inline-flex w-fit text-xs font-semibold text-[#b88f45] underline decoration-[#e8ddd4] underline-offset-2 transition hover:text-[#a67c32]"
                                  >
                                    Download sample CSV
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setUploadSamplePreviewId(slotSample.id)
                                    }
                                    className="inline-flex w-fit rounded-full border border-[#2f2a28]/14 bg-[#fffdfb] px-3 py-1.5 text-xs font-bold text-[#333232] transition hover:border-[#b88f45]/45 hover:bg-[#faf4ee]"
                                  >
                                    View example
                                  </button>
                                </div>
                              : null}
                              {displayName ?
                                <div className="mt-3 rounded-lg border border-[#e8f0e6] bg-[#f9fdf9] px-3 py-2.5">
                                  <p className="flex flex-wrap items-center gap-2 break-all text-xs font-semibold text-[#333232]">
                                    {isSampleFileRef(file) ?
                                      <span className="shrink-0 rounded-full bg-[#e8f0e6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#3d5c3a]">
                                        Sample
                                      </span>
                                    : null}
                                    <span className="text-[#6b6262]">
                                      {isSampleFileRef(file) ?
                                        "Loaded: "
                                      : "Selected: "}
                                    </span>
                                    <span>{displayName}</span>
                                  </p>
                                  {loadedSample ?
                                    <div className="mt-2 border-t border-[#efe4db]/80 pt-2 text-[11px] text-[#5f5654]">
                                      <p>
                                        <span className="font-bold text-[#333232]">
                                          Detected headers:{" "}
                                        </span>
                                        {loadedSample.expectedHeaders.length}{" "}
                                        columns
                                      </p>
                                      <p className="mt-1">
                                        <span className="font-bold text-[#333232]">
                                          Sample schema key:{" "}
                                        </span>
                                        <code className="rounded bg-[#f5eee9] px-1.5 py-0.5 text-[10px] text-[#2f2a28]">
                                          {loadedSample.schemaKey}
                                        </code>
                                      </p>
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {loadedSample.expectedHeaders
                                          .slice(0, 10)
                                          .map((h) => (
                                            <span
                                              key={h}
                                              className="rounded-full border border-[#e2d6cf] bg-white px-2 py-0.5 text-[9px] font-semibold text-[#4a4340]"
                                            >
                                              {h}
                                            </span>
                                          ))}
                                        {loadedSample.expectedHeaders.length >
                                        10 ?
                                          <span className="text-[#a39a97]">
                                            …
                                          </span>
                                        : null}
                                      </div>
                                    </div>
                                  : !isSampleFileRef(file) ?
                                    <p className="mt-2 text-[11px] text-[#6b6262]">
                                      File attached. Column detection runs in
                                      the next pipeline step.
                                    </p>
                                  : null}
                                </div>
                              : null}
                            </li>
                          );
                        })}
                      </ul>
                    </article>
                  );
                })}
              </section>}

            <section className="rounded-2xl border border-[#e2d6cf] bg-[linear-gradient(120deg,#fffdfb_0%,#f3e6e2_100%)] p-6 sm:p-7">
              <h2 className="font-studio-serif text-xl text-[#2f2a28]">
                Progress
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-[#efe4db] bg-white/80 px-4 py-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                    Providers ready
                  </dt>
                  <dd className="mt-1 font-studio-serif text-2xl text-[#2f2a28]">
                    {uploadStats.providersReady}
                  </dd>
                </div>
                <div className="rounded-xl border border-[#efe4db] bg-white/80 px-4 py-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                    Files uploaded
                  </dt>
                  <dd className="mt-1 font-studio-serif text-2xl text-[#2f2a28]">
                    {uploadStats.filesUploaded}
                  </dd>
                </div>
                <div className="rounded-xl border border-[#efe4db] bg-white/80 px-4 py-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                    Missing uploads
                  </dt>
                  <dd className="mt-1 font-studio-serif text-2xl text-[#2f2a28]">
                    {uploadStats.missing}
                  </dd>
                </div>
                <div className="rounded-xl border border-[#efe4db] bg-white/80 px-4 py-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                    Ready for analysis
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-[#333232]">
                    {uploadStats.providerCount === 0 ?
                      <span className="text-[#6b6262]">—</span>
                    : uploadStats.readyForAnalysis ?
                      <span className="text-[#3d5c3a]">Yes</span>
                    : <span className="text-[#7f5362]">No</span>}
                  </dd>
                </div>
              </dl>
            </section>

            {uploadSamplePreviewId ?
              (() => {
                const sample = findSampleExportById(uploadSamplePreviewId);
                if (!sample) return null;
                const previewRows = sample.previewRows.slice(0, 5);
                return (
                  <div
                    className="fixed inset-0 z-[200] flex items-end justify-center bg-[#2f2a28]/45 p-4 sm:items-center"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="sample-preview-title"
                  >
                    <div
                      className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#e2d6cf] bg-[#fffdfb] shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="sticky top-0 z-[1] flex items-start justify-between gap-3 border-b border-[#efe4db] bg-[#fffdfb] px-5 py-4">
                        <div className="min-w-0">
                          <p
                            id="sample-preview-title"
                            className="font-studio-serif text-lg text-[#2f2a28]"
                          >
                            {sample.label}
                          </p>
                          <p className="mt-1 text-xs text-[#6b6262]">
                            {sample.providerName} · {sample.reportName}
                          </p>
                          <p className="mt-1 break-all text-[11px] font-medium text-[#5f5654]">
                            {sample.filename}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadSamplePreviewId(null)}
                          className="inline-flex shrink-0 rounded-full border border-[#efe4db] p-2 text-[#6b6262] transition hover:bg-[#faf4ee]"
                          aria-label="Close preview"
                        >
                          <FaTimes className="text-sm" aria-hidden />
                        </button>
                      </div>
                      <div className="space-y-4 px-5 py-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                            Expected headers
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {sample.expectedHeaders.map((h) => (
                              <span
                                key={h}
                                className="rounded-full border border-[#e8ddd4] bg-[#faf6f2] px-2 py-0.5 text-[10px] font-semibold text-[#4a4340]"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-[#efe4db]">
                          <table className="w-full min-w-[520px] text-left text-xs">
                            <thead className="bg-[#faf4ee] text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                              <tr>
                                {sample.expectedHeaders.map((h) => (
                                  <th
                                    key={h}
                                    className="whitespace-nowrap px-2 py-2"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#efe4db] bg-white">
                              {previewRows.map((pr, ri) => (
                                <tr key={ri}>
                                  {sample.expectedHeaders.map((h) => (
                                    <td
                                      key={h}
                                      className="max-w-[180px] truncate px-2 py-2 text-[#333232]"
                                      title={
                                        pr[h] != null ?
                                          String(pr[h])
                                        : undefined
                                      }
                                    >
                                      {pr[h] != null ? String(pr[h]) : "—"}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[10px] text-[#8a7f7c]">
                          Showing first {previewRows.length} preview rows from
                          the demo registry (not streamed from disk).
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()
            : null}

            <div className="flex flex-col items-center gap-4 pb-8">
              <button
                type="button"
                onClick={() =>
                  tryAnalyze(uploadStats.readyForAnalysis)
                }
                className="inline-flex min-h-12 w-full max-w-md items-center justify-center rounded-full bg-[#2f2a28] px-8 text-sm font-bold tracking-wide text-[#fffdfb] shadow-[0_16px_40px_-20px_rgba(47,42,40,0.65)] transition hover:bg-[#3d3634] sm:text-[15px]"
              >
                Analyze Hidden Money Plays
              </button>
              {analysisMessage ?
                <p
                  role="status"
                  className="max-w-md text-center text-sm font-medium text-[#5f5654]"
                >
                  {analysisMessage}
                </p>
              : null}
            </div>
          </>
        : null}
        {stage === "preflight" ?
          <>
            <section className="rounded-2xl border border-[#e2d6cf] bg-white/95 p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.3)] sm:p-7">
              <h2 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
                A. File Coverage
              </h2>
              <p className="mt-1 text-sm text-[#6b6262]">
                Provider coverage for required exports versus what is uploaded.
              </p>
              {preflightFileCoverageRows.length === 0 ?
                <p className="mt-5 rounded-xl border border-dashed border-[#d9c4b8] bg-[#fffdfb] px-4 py-6 text-center text-sm text-[#6b6262]">
                  Select providers and upload files in earlier steps to review
                  coverage here.
                </p>
              : <div className="mt-5 overflow-x-auto rounded-xl border border-[#efe4db]">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-[#faf4ee] text-[11px] font-bold uppercase tracking-wider text-[#a45f76]">
                      <tr>
                        <th className="px-4 py-3">Provider</th>
                        <th className="px-4 py-3 text-center">Required files</th>
                        <th className="px-4 py-3 text-center">Uploaded files</th>
                        <th className="px-4 py-3 text-center">Missing files</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#efe4db] bg-white">
                      {preflightFileCoverageRows.map((r) => {
                        const status =
                          r.required === 0 ? "—"
                          : r.complete ? "Complete"
                          : "Incomplete";
                        const statusClass =
                          r.required === 0 ?
                            "bg-[#f5eee9] text-[#6b6262]"
                          : r.complete ?
                            "bg-[#e8f0e6] text-[#3d5c3a]"
                          : "bg-[#f4ead8] text-[#6b5420]";
                        return (
                          <tr key={r.id}>
                            <td className="px-4 py-3 font-semibold text-[#333232]">
                              {r.name}
                            </td>
                            <td className="px-4 py-3 text-center tabular-nums text-[#333232]">
                              {r.required}
                            </td>
                            <td className="px-4 py-3 text-center tabular-nums text-[#333232]">
                              {r.uploaded}
                            </td>
                            <td className="px-4 py-3 text-center tabular-nums text-[#333232]">
                              {r.missing}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass}`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>}
            </section>

            <section className="rounded-2xl border border-[#e2d6cf] bg-white/95 p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.3)] sm:p-7">
              <h2 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
                B. Header Detection
              </h2>
              <p className="mt-1 text-sm text-[#6b6262]">
                For each uploaded file: inferred headers, field matches, and
                confidence (local demo heuristics).
              </p>
              {preflightHeaderDetectionRows.length === 0 ?
                <p className="mt-5 rounded-xl border border-dashed border-[#d9c4b8] bg-[#fffdfb] px-4 py-6 text-center text-sm text-[#6b6262]">
                  Upload at least one export to inspect header detection rows.
                </p>
              : <div className="mt-5 overflow-x-auto rounded-xl border border-[#efe4db]">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-[#faf4ee] text-[11px] font-bold uppercase tracking-wider text-[#a45f76]">
                      <tr>
                        <th className="px-4 py-3">File / report</th>
                        <th className="px-4 py-3">Detected headers</th>
                        <th className="px-4 py-3 text-center">Matched fields</th>
                        <th className="px-4 py-3 text-center">
                          Missing required fields
                        </th>
                        <th className="px-4 py-3">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#efe4db] bg-white">
                      {preflightHeaderDetectionRows.map((r) => (
                        <tr key={r.key}>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#333232]">
                              {r.report}
                            </p>
                            <p className="mt-0.5 text-xs text-[#8a7f7c]">
                              {r.provider}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-[#5f5654]">
                            {r.detected}
                          </td>
                          <td className="px-4 py-3 text-center text-[#333232]">
                            {r.matched}
                          </td>
                          <td className="px-4 py-3 text-center text-[#333232]">
                            {r.missingRequired}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                r.confidence === "High" ?
                                  "bg-[#e8f0e6] text-[#3d5c3a]"
                                : "bg-[#f5eee9] text-[#6b6262]"
                              }`}
                            >
                              {r.confidence}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>}
            </section>

            <section className="rounded-2xl border border-[#e2d6cf] bg-white/95 p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.3)] sm:p-7">
              <h2 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
                C. Schema Mapping
              </h2>
              <p className="mt-1 text-sm text-[#6b6262]">
                Normalized VMB objects: pending until preflight confirms
                mapping from your uploads.
              </p>
              <div className="mt-5 overflow-x-auto rounded-xl border border-[#efe4db]">
                <table className="w-full min-w-[360px] text-left text-sm">
                  <thead className="bg-[#faf4ee] text-[11px] font-bold uppercase tracking-wider text-[#a45f76]">
                    <tr>
                      <th className="px-4 py-3">Normalized VMB object</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#efe4db] bg-white">
                    {PREFLIGHT_VMB_OBJECT_ROWS.map((obj) => {
                      const mapped =
                        obj.bucketId ?
                          preflightMappedBucketSet.has(obj.bucketId)
                        : false;
                      const status =
                        !preflightComplete ? "Pending"
                        : obj.bucketId && mapped ? "Ready"
                        : "Pending";
                      const statusClass =
                        status === "Ready" ?
                          "bg-[#e8f0e6] text-[#3d5c3a]"
                        : "bg-[#f5eee9] text-[#6b6262]";
                      return (
                        <tr key={obj.label}>
                          <td className="px-4 py-3 font-medium text-[#333232]">
                            {obj.label}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusClass}`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e2d6cf] bg-white/95 p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.3)] sm:p-7">
              <h2 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
                D. Available Money Plays
              </h2>
              <p className="mt-2 text-sm text-[#6b6262]">
                Cross-bucket plays supported by your uploaded and mapped data
                only (deterministic preview).
              </p>
              {preflightDiscoveries.length === 0 ?
                <p className="mt-5 rounded-xl border border-dashed border-[#d9c4b8] bg-[#fffdfb] px-4 py-6 text-center text-sm text-[#6b6262]">
                  Upload exports that cover more schema areas to unlock
                  additional money-play previews.
                </p>
              : <ul className="mt-5 flex flex-col gap-3">
                  {preflightDiscoveries.map((d) => (
                    <li
                      key={d.key}
                      className="rounded-xl border border-[#e2d6cf] bg-[#fffcf9] px-4 py-4"
                    >
                      <p className="font-semibold text-[#2f2a28]">{d.title}</p>
                      <p className="mt-1 text-xs font-medium text-[#a45f76]">
                        {d.detail}
                      </p>
                    </li>
                  ))}
                </ul>}
            </section>

            <div className="flex flex-col items-center gap-4 pb-10">
              <button
                type="button"
                onClick={runPreflightCheck}
                className="inline-flex min-h-12 w-full max-w-md items-center justify-center rounded-full bg-[#2f2a28] px-8 text-sm font-bold tracking-wide text-[#fffdfb] shadow-[0_16px_40px_-20px_rgba(47,42,40,0.65)] transition hover:bg-[#3d3634] sm:text-[15px]"
              >
                Run Preflight Check
              </button>
              <button
                type="button"
                disabled={!preflightComplete}
                onClick={goToReport}
                className={`inline-flex min-h-12 w-full max-w-md items-center justify-center rounded-full border-2 border-[#b88f45] px-8 text-sm font-bold tracking-wide shadow-[0_12px_32px_-18px_rgba(184,143,69,0.45)] transition sm:text-[15px] ${
                  preflightComplete ?
                    "bg-[#fffdfb] text-[#2f2a28] hover:bg-[#faf4ee]"
                  : "cursor-not-allowed border-[#d9c4b8] bg-[#f5eee9]/80 text-[#a39a97]"
                }`}
              >
                View Hidden Money Plays Report
              </button>
              {preflightBanner ?
                <p
                  role="status"
                  className="max-w-md text-center text-sm font-medium text-[#5f5654]"
                >
                  {preflightBanner}
                </p>
              : null}
            </div>
          </>
        : null}
        {stage === "report" ?
          <>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                {HIDDEN_MONEY_PLAYS_REPORT.map((play) => (
                  <article
                    key={play.key}
                    className="rounded-xl border border-[#e2d6cf] bg-white p-5 shadow-[0_14px_40px_-34px_rgba(39,46,45,0.28)] sm:p-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <h2 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
                        {play.title}
                      </h2>
                      <span className="inline-flex w-fit shrink-0 rounded-full bg-[#e8f0e6] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3d5c3a]">
                        Ready to evaluate
                      </span>
                    </div>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#a45f76]">
                      Signal
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#333232]">
                      {play.signal}
                    </p>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#a45f76]">
                      What we look for
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#5f5654]">
                      {play.lookFor}
                    </p>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#a45f76]">
                      Likely output
                    </p>
                    <p className="mt-2 rounded-lg border border-[#efe4db] bg-[#fffcf9] px-4 py-3 font-studio-serif text-sm italic leading-relaxed text-[#4a4340]">
                      &ldquo;{play.likelyOutput}&rdquo;
                    </p>
                  </article>
                ))}
              </div>

              <aside className="w-full shrink-0 rounded-2xl border border-[#e2d6cf] bg-[linear-gradient(165deg,#fffdfb_0%,#f3e8df_100%)] p-5 shadow-[0_14px_40px_-34px_rgba(39,46,45,0.22)] sm:p-6 lg:sticky lg:top-24 lg:w-[300px] xl:w-[320px]">
                <h2 className="font-studio-serif text-lg text-[#2f2a28]">
                  Report Readiness
                </h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                      Providers selected
                    </dt>
                    <dd className="mt-1 font-studio-serif text-2xl text-[#2f2a28]">
                      {orderedCards.length}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                      Files uploaded
                    </dt>
                    <dd className="mt-1 font-studio-serif text-2xl text-[#2f2a28]">
                      {uploadStats.filesUploaded}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                      Schema status
                    </dt>
                    <dd className="mt-1 font-semibold text-[#333232]">
                      {preflightComplete ?
                        <span className="text-[#3d5c3a]">
                          Preflight complete · Ready
                        </span>
                      : <span className="text-[#7f5362]">
                          Pending preflight
                        </span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                      Money plays available
                    </dt>
                    <dd className="mt-1 font-studio-serif text-2xl text-[#2f2a28]">
                      5
                    </dd>
                  </div>
                  <div className="border-t border-[#e2d6cf] pt-4">
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                      Next step
                    </dt>
                    <dd className="mt-2 leading-snug text-[#5f5654]">
                      Parse files + run analysis
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>

            <div className="flex flex-col items-center gap-4 pb-10">
              <button
                type="button"
                onClick={startAnalysisBuild}
                className="inline-flex min-h-12 w-full max-w-md items-center justify-center rounded-full bg-[#2f2a28] px-8 text-sm font-bold tracking-wide text-[#fffdfb] shadow-[0_16px_40px_-20px_rgba(47,42,40,0.65)] transition hover:bg-[#3d3634] sm:text-[15px]"
              >
                Start Analysis Build
              </button>
            </div>
          </>
        : null}
        {stage === "analysis" ?
          <>
            <section className="rounded-2xl border border-[#e2d6cf] bg-white/95 p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.3)] sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
                  Analysis Pipeline
                </h2>
                <button
                  type="button"
                  onClick={runMockAnalysis}
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#b88f45] px-6 text-xs font-bold text-white shadow-[0_10px_28px_-14px_rgba(184,143,69,0.55)] transition hover:bg-[#c0a05a] sm:text-sm"
                >
                  Run Mock Analysis
                </button>
              </div>
              {mockAnalysisBanner ?
                <p
                  role="status"
                  className="mt-4 rounded-xl border border-[#e8f0e6] bg-[#f4faf4] px-4 py-3 text-sm font-medium text-[#3d5c3a]"
                >
                  {mockAnalysisBanner}
                </p>
              : null}
              <ul className="mt-5 flex flex-col gap-3">
                {ANALYSIS_PIPELINE_STEPS.map((step, idx) => (
                  <li
                    key={step}
                    className="flex flex-col gap-2 rounded-xl border border-[#efe4db] bg-[#fffdfb] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm font-medium text-[#333232]">
                      <span className="mr-2 font-studio-serif text-[#b8966a]">
                        {idx + 1}.
                      </span>
                      {step}
                    </span>
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        mockAnalysisComplete ?
                          "bg-[#e8f0e6] text-[#3d5c3a]"
                        : "bg-[#f5eee9] text-[#6b6262]"
                      }`}
                    >
                      {mockAnalysisComplete ? "Complete" : "Not started"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-[#e2d6cf] bg-[linear-gradient(120deg,#fffdfb_0%,#f3e6e2_100%)] p-6 sm:p-7">
              <h2 className="font-studio-serif text-xl text-[#2f2a28]">
                Data Mapping Targets
              </h2>
              <p className="mt-2 text-sm text-[#6b6262]">
                Objects we normalize from your selected provider uploads.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {ANALYSIS_DATA_OBJECTS.map((obj) => (
                  <article
                    key={obj.id}
                    className="rounded-xl border border-[#efe4db] bg-white/90 p-4 shadow-sm"
                  >
                    <h3 className="font-studio-serif text-base text-[#2f2a28]">
                      {obj.label}
                    </h3>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                      Source
                    </p>
                    <p className="mt-1 text-xs leading-snug text-[#5f5654]">
                      Selected provider uploads
                      {uploadSourceSummary ?
                        <span className="mt-1 block font-medium text-[#333232]">
                          {uploadSourceSummary}
                        </span>
                      : null}
                    </p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#a45f76]">
                      Status
                    </p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        mockAnalysisComplete ?
                          "bg-[#e8f0e6] text-[#3d5c3a]"
                        : "bg-[#f5eee9] text-[#6b6262]"
                      }`}
                    >
                      {mockAnalysisComplete ? "Ready" : "Waiting"}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e2d6cf] bg-white/95 p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.3)] sm:p-7">
              <h2 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
                Query Starter Library
              </h2>
              <p className="mt-2 text-sm text-[#6b6262]">
                Queue questions for the eventual analysis run.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {QUERY_STARTER_LIBRARY.map((q) => {
                  const inQueue = analysisQueryQueue.includes(q.id);
                  return (
                    <li
                      key={q.id}
                      className="flex flex-col gap-3 rounded-xl border border-[#efe4db] bg-[#fffdfb] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <p className="min-w-0 flex-1 text-sm font-medium text-[#333232]">
                        {q.text}
                      </p>
                      <button
                        type="button"
                        disabled={inQueue}
                        onClick={() => addQueryToQueue(q.id)}
                        className={`inline-flex shrink-0 items-center justify-center rounded-full border px-4 py-2 text-xs font-bold transition ${
                          inQueue ?
                            "cursor-default border-[#d9c4b8] bg-[#f5eee9] text-[#a39a97]"
                          : "border-[#b88f45] bg-white text-[#2f2a28] hover:bg-[#faf4ee]"
                        }`}
                      >
                        {inQueue ? "In queue" : "Add to Analysis Queue"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="rounded-2xl border border-[#e2d6cf] bg-white/95 p-5 shadow-[0_14px_44px_-34px_rgba(39,46,45,0.3)] sm:p-7">
              <h2 className="font-studio-serif text-xl text-[#2f2a28] sm:text-2xl">
                Analysis Queue
              </h2>
              {analysisQueryQueue.length === 0 ?
                <p className="mt-4 rounded-xl border border-dashed border-[#d9c4b8] bg-[#fffdfb] px-4 py-8 text-center text-sm text-[#6b6262]">
                  No queries selected yet.
                </p>
              : <ul className="mt-4 flex flex-col gap-2">
                  {analysisQueryQueue.map((id) => (
                    <li
                      key={id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#e2d6cf] bg-[#fffcf9] px-4 py-3"
                    >
                      <span className="min-w-0 text-sm text-[#333232]">
                        {QUERY_STARTER_LIBRARY.find((q) => q.id === id)?.text ??
                          id}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQueryFromQueue(id)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#a45f76]/25 px-3 py-1.5 text-xs font-bold text-[#7f5362] transition hover:bg-[#faf0f2]"
                        aria-label="Remove from queue"
                      >
                        <FaTrashAlt className="text-[10px]" aria-hidden />
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>}
            </section>

            <div className="flex flex-col items-center gap-4 pb-10">
              <button
                type="button"
                onClick={tryGenerateResultsPreview}
                className={`inline-flex min-h-12 w-full max-w-md items-center justify-center rounded-full px-8 text-sm font-bold tracking-wide shadow-[0_16px_40px_-20px_rgba(47,42,40,0.65)] transition sm:text-[15px] ${
                  mockAnalysisComplete && analysisQueryQueue.length > 0 ?
                    "bg-[#2f2a28] text-[#fffdfb] hover:bg-[#3d3634]"
                  : "bg-[#c4b8ad] text-[#fffdfb]/90 hover:bg-[#b8a99d]"
                }`}
              >
                Generate Results Preview
              </button>
              {resultsPreviewMessage ?
                <p
                  role="status"
                  className="max-w-md text-center text-sm font-medium text-[#5f5654]"
                >
                  {resultsPreviewMessage}
                </p>
              : null}
            </div>
          </>
        : null}
          </div>
          <DeepDigProgressRail
            stage={stage}
            captureSubstage={captureSubstage}
            systemsSelected={systemsSelected}
            verifiedGuidesCount={verifiedGuidesCount}
            uploadReadinessLine={uploadReadinessLine}
            schemaReadinessLine={schemaReadinessLine}
            analysisReadinessLine={analysisReadinessLine}
            readyForUpload={readyForUpload}
            uploadStats={uploadStats}
            preflightComplete={preflightComplete}
            mockAnalysisComplete={mockAnalysisComplete}
            analysisQueryQueueLength={analysisQueryQueue.length}
            goToUpload={goToUpload}
            tryAnalyze={tryAnalyze}
            goToReport={goToReport}
            startAnalysisBuild={startAnalysisBuild}
            tryGenerateResultsPreview={tryGenerateResultsPreview}
          />
        </div>
      </div>
    </div>
  );
}
