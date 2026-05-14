/**
 * Shared provider definitions for Intelligence Lab (admin) and Deep Insights (salon).
 * @typedef {'upload' | 'api' | 'assisted'} ProviderMode
 * @typedef {{ label: string; url: string }} ProviderLink
 * @typedef {{
 *   name: string;
 *   descriptor: string;
 *   badge: string;
 *   mode: ProviderMode;
 *   summary: string;
 *   needs: string[];
 *   links: ProviderLink[];
 *   steps: string[];
 *   screenshots: string[];
 *   postStepsNote?: string;
 *   needsSectionTitle?: string;
 *   stepsSectionTitle?: string;
 *   screenshotsSectionTitle?: string;
 *   actionSectionTitle?: string;
 *   linksSectionTitle?: string;
 *   showScreenshots?: boolean;
 *   showOfficialLinks?: boolean;
 *   connectLabel?: string;
 *   apiAckMessage?: string;
 *   assistedNoticeMessage?: string;
 *   emptyLinksHint?: string;
 * }} ProviderConfig
 */

/** @type {Record<string, ProviderConfig>} */
export const LAB_PROVIDERS = {
  vagaro: {
    name: "Vagaro",
    descriptor: "Booking + POS for salons",
    badge: "UPLOAD PATH",
    mode: "upload",
    summary: "Vagaro data is best imported through exported reports.",
    needs: [
      "Client list export",
      "Sales / transaction report",
      "Appointments report if available",
    ],
    links: [
      { label: "Vagaro Login", url: "https://www.vagaro.com/Login.aspx" },
      { label: "Vagaro Support", url: "https://support.vagaro.com/" },
    ],
    steps: [
      "Log in to your Vagaro business account",
      "Look at the menu, find and open Reports",
      "Find your sales/transactions, select, then export in CSV format",
      "Find your Client List, select and export in CSV format",
      "Save to your computer and note the location",
      "Log into your VMB Dash, open Intelligence Lab, drag files into the upload area below",
    ],
    postStepsNote:
      "What we do with your files after upload — we’re still defining this in the lab.",
    screenshots: [
      "Reports menu",
      "Sales / transactions CSV",
      "Client list CSV",
      "VMB Lab upload",
    ],
  },
  glossgenius: {
    name: "GlossGenius",
    descriptor: "Indie pros & suites",
    badge: "UPLOAD PATH",
    mode: "upload",
    summary: "GlossGenius is best handled through report/client exports.",
    needs: [
      "Client export",
      "Sales / payments report",
      "Appointments or booking activity if available",
    ],
    links: [
      { label: "GlossGenius Login", url: "https://app.glossgenius.com/" },
      { label: "GlossGenius Help", url: "https://support.glossgenius.com/" },
    ],
    steps: [
      "Log into your GlossGenius account",
      "Open Clients or Reports from the left menu",
      "Export your Client List in CSV format",
      "Export available sales, payments, or booking reports",
      "Save the files to your computer",
      "Return to VMB Intelligence Lab and upload the exported files",
    ],
    postStepsNote:
      "GlossGenius export options vary slightly by account type and features enabled.",
    screenshots: [
      "Clients / Reports menu",
      "Client list CSV",
      "Sales or booking CSV",
      "VMB Lab upload",
    ],
  },
  square: {
    name: "Square Appointments",
    descriptor: "Retail + calendar",
    badge: "API READY",
    mode: "api",
    summary: "Square supports secure OAuth/API connection.",
    needs: [
      "Appointments access",
      "Customers access",
      "Payments / orders access",
      "Team member access if available",
    ],
    links: [
      { label: "Square Login", url: "https://squareup.com/login" },
      {
        label: "Square Developer Docs",
        url: "https://developer.squareup.com/docs",
      },
    ],
    steps: [
      "Click Connect Square below",
      "Sign into your Square business account",
      "Approve VMB access permissions",
      "Square securely shares appointments, customers, and sales data with VMB",
      "VMB begins processing automatically after authorization completes",
    ],
    postStepsNote:
      "VMB never stores your Square password — authorization happens directly through Square.",
    screenshots: [
      "Connect Square",
      "Square sign-in",
      "Permissions",
      "Connected / syncing",
    ],
  },
  boulevard: {
    name: "Boulevard",
    descriptor: "Premium scheduling",
    badge: "ASSISTED",
    mode: "assisted",
    summary:
      "Boulevard may require assisted setup or enterprise/API access.",
    needs: [
      "Client list",
      "Appointments",
      "Sales / transactions",
      "Services and staff",
    ],
    links: [
      { label: "Boulevard Login", url: "https://dashboard.joinblvd.com/" },
      {
        label: "Boulevard Developers",
        url: "https://developers.joinblvd.com/",
      },
    ],
    steps: [
      "Log into your Boulevard dashboard",
      "Open reporting or export tools from the admin menu",
      "Export customer, appointment, and sales reports if available",
      "Save the files locally for upload into VMB",
      "If API access is enabled for your account, continue with assisted connection setup",
      "Upload reports or complete assisted onboarding inside VMB",
    ],
    postStepsNote:
      "Some Boulevard integrations and export capabilities depend on account permissions or enterprise setup.",
    screenshots: [
      "Admin / reports",
      "CSV exports",
      "API or assisted",
      "VMB upload",
    ],
  },
  fresha: {
    name: "Fresha",
    descriptor: "Marketplace + bookings",
    badge: "UPLOAD PATH",
    mode: "upload",
    summary: "Fresha data is typically brought in via sales and client exports.",
    needs: [
      "Sales or payment export (CSV)",
      "Client list export where available",
      "Appointment report if your plan supports export",
    ],
    links: [
      { label: "Fresha Login", url: "https://www.fresha.com/partners/login" },
      { label: "Fresha Help", url: "https://www.fresha.com/help" },
    ],
    steps: [
      "Log in to Fresha",
      "Open reporting or data export area",
      "Download CSV exports",
      "Upload files to VMB",
    ],
    screenshots: ["Reports", "CSV export", "Upload to VMB"],
  },
  booksy: {
    name: "Booksy",
    descriptor: "Mobile-first bookings",
    badge: "UPLOAD PATH",
    mode: "upload",
    summary:
      "Booksy is usually connected through exported reports from your dashboard.",
    needs: [
      "Transaction or sales export",
      "Client export if available",
      "Booking activity export where offered",
    ],
    links: [
      { label: "Booksy Biz Login", url: "https://booksy.com/en-us/business" },
      { label: "Booksy Help", url: "https://support.booksy.com/" },
    ],
    steps: [
      "Log in to Booksy Biz",
      "Open reports or export tools",
      "Export CSV files",
      "Upload files to VMB",
    ],
    screenshots: ["Business dashboard", "Export", "Upload to VMB"],
  },
  mindbody: {
    name: "Mindbody",
    descriptor: "Studios & wellness",
    badge: "ASSISTED",
    mode: "assisted",
    summary:
      "Mindbody often requires partner API access or guided exports from your account.",
    needs: [
      "Client and membership data",
      "Class / appointment utilization",
      "Sales and payment detail",
      "Service and staff catalog",
    ],
    links: [
      { label: "Mindbody Login", url: "https://clients.mindbodyonline.com/" },
      {
        label: "Mindbody Developers",
        url: "https://developers.mindbodyonline.com/",
      },
    ],
    steps: [
      "Confirm your Mindbody subscription and API options",
      "Export available reports from Insights or Reporting",
      "Or request partner-assisted API access through VMB",
      "VMB maps fields and validates imports",
    ],
    screenshots: ["Reporting", "Export options", "API / assisted"],
  },
  mangomint: {
    name: "Mangomint",
    descriptor: "Lightweight POS",
    badge: "UPLOAD PATH",
    mode: "upload",
    summary: "Mangomint data is imported from CSV exports out of your account.",
    needs: [
      "Clients export",
      "Sales or payment history",
      "Appointment history if exportable",
    ],
    links: [
      { label: "Mangomint Login", url: "https://www.mangomint.com/" },
      { label: "Mangomint Support", url: "https://www.mangomint.com/support" },
    ],
    steps: [
      "Log in to Mangomint",
      "Open Reports or Data export",
      "Download CSV files",
      "Upload files to VMB",
    ],
    screenshots: ["Reports", "Export", "Upload to VMB"],
  },
  other: {
    name: "Other",
    descriptor: "Any salon platform",
    badge: "UPLOAD PATH",
    mode: "upload",
    summary:
      "Use CSV exports from your current system—VMB will align columns with you.",
    needs: [
      "Clients or contacts export",
      "Sales / transaction history",
      "Appointments or services list if available",
    ],
    links: [],
    steps: [
      "Log in to your platform",
      "Locate reporting or data export",
      "Export CSV where possible",
      "Upload files to VMB — support can help map columns",
    ],
    screenshots: ["Export area", "CSV download", "Upload to VMB"],
  },
};

/** Member-facing copy: shorter steps, no lab/ingest jargon. @type {Record<string, ProviderConfig>} */
export const MEMBER_PROVIDERS = {
  vagaro: {
    name: "Vagaro",
    descriptor: "Booking + POS for salons",
    badge: "Upload Path",
    mode: "upload",
    summary: "Vagaro data is best imported through exported reports.",
    needs: [
      "Client list export",
      "Sales / transaction report",
      "Appointment activity if available",
    ],
    links: [
      { label: "Vagaro Login", url: "https://www.vagaro.com/Login.aspx" },
      { label: "Vagaro Support", url: "https://support.vagaro.com/" },
    ],
    steps: [
      "Log into your Vagaro account",
      "Open Reports",
      "Export sales and transaction CSVs",
      "Export your client list CSV",
      "Upload the files into VMB below",
    ],
    screenshots: ["Reports menu", "Export CSV", "Upload to VMB"],
    screenshotsSectionTitle: "Screenshots",
  },
  glossgenius: {
    name: "GlossGenius",
    descriptor: "Indie pros & suites",
    badge: "Upload Path",
    mode: "upload",
    summary:
      "We’ll use exports from GlossGenius to understand your business performance.",
    needs: [
      "Client list export",
      "Sales or payments summary",
      "Booking activity if available",
    ],
    links: [
      { label: "GlossGenius Login", url: "https://app.glossgenius.com/" },
      { label: "GlossGenius Help", url: "https://support.glossgenius.com/" },
    ],
    steps: [
      "Log into GlossGenius",
      "Open Clients or Reports",
      "Export your client list as CSV",
      "Export sales, payments, or booking reports if available",
      "Upload the files below",
    ],
    postStepsNote:
      "Available exports can vary slightly by plan — use what your account offers.",
    screenshots: ["Clients / Reports", "CSV exports", "Upload to VMB"],
    screenshotsSectionTitle: "Screenshots",
  },
  square: {
    name: "Square Appointments",
    descriptor: "Retail + calendar",
    badge: "API Ready",
    mode: "api",
    summary: "Square supports secure API connection with VMB.",
    needs: [
      "Appointments",
      "Customers",
      "Sales",
      "Staff and providers",
    ],
    links: [{ label: "Square Login", url: "https://squareup.com/login" }],
    steps: [
      "Click Connect Square",
      "Sign into Square",
      "Authorize VMB access",
      "VMB begins secure sync automatically",
    ],
    needsSectionTitle: "What VMB Syncs",
    stepsSectionTitle: "Connection Path",
    actionSectionTitle: "Connect",
    screenshots: [],
    showScreenshots: false,
    postStepsNote: "VMB never stores your Square password.",
    connectLabel: "Connect Square",
    apiAckMessage:
      "Next, you’ll finish sign-in with Square in a secure window when live connections are enabled.",
  },
  boulevard: {
    name: "Boulevard",
    descriptor: "Premium scheduling",
    badge: "Assisted setup",
    mode: "assisted",
    summary:
      "Boulevard may require assisted onboarding depending on your account permissions.",
    needs: [
      "Customer list",
      "Appointments",
      "Sales history",
      "Services and team",
    ],
    links: [
      { label: "Boulevard Login", url: "https://dashboard.joinblvd.com/" },
    ],
    steps: [
      "Export reports from Boulevard if your role allows",
      "Upload what you have — we’ll help with the rest",
      "Or request assisted setup for API or enterprise accounts",
    ],
    needsSectionTitle: "What we’ll use",
    stepsSectionTitle: "Typical path",
    screenshots: ["Reports", "CSV export", "Upload to VMB"],
    screenshotsSectionTitle: "Screenshots",
    showOfficialLinks: true,
    assistedNoticeMessage:
      "We’ll reach out to help connect your account and gather the right data.",
  },
  fresha: {
    name: "Fresha",
    descriptor: "Marketplace + bookings",
    badge: "Upload Path",
    mode: "upload",
    summary: "Connect Fresha by uploading the reports your plan allows.",
    needs: [
      "Sales or payment export",
      "Client list if available",
      "Appointment report if available",
    ],
    links: [
      { label: "Fresha Login", url: "https://www.fresha.com/partners/login" },
      { label: "Fresha Help", url: "https://www.fresha.com/help" },
    ],
    steps: [
      "Log into Fresha",
      "Open reporting or exports",
      "Download CSV files",
      "Upload them below",
    ],
    screenshots: ["Reports", "CSV export", "Upload to VMB"],
  },
  booksy: {
    name: "Booksy",
    descriptor: "Mobile-first bookings",
    badge: "Upload Path",
    mode: "upload",
    summary: "Booksy connects through exports from your business dashboard.",
    needs: [
      "Sales or transaction export",
      "Client export if available",
      "Bookings export if available",
    ],
    links: [
      { label: "Booksy Biz Login", url: "https://booksy.com/en-us/business" },
      { label: "Booksy Help", url: "https://support.booksy.com/" },
    ],
    steps: [
      "Log into Booksy Biz",
      "Open reports or exports",
      "Download CSV files",
      "Upload them below",
    ],
    screenshots: ["Dashboard", "Export", "Upload to VMB"],
  },
  mindbody: {
    name: "Mindbody",
    descriptor: "Studios & wellness",
    badge: "Assisted setup",
    mode: "assisted",
    summary:
      "Mindbody often works best with a short guided setup — we’re here to help.",
    needs: [
      "Members and clients",
      "Classes and appointments",
      "Sales detail",
      "Services and staff",
    ],
    links: [
      { label: "Mindbody Login", url: "https://clients.mindbodyonline.com/" },
    ],
    steps: [
      "Export reports available in your Mindbody account",
      "Upload them below, or",
      "Request assisted setup for the cleanest path",
    ],
    needsSectionTitle: "What we’ll use",
    stepsSectionTitle: "Typical path",
    screenshots: ["Reporting", "Exports", "Upload to VMB"],
    assistedNoticeMessage:
      "We’ll contact you to coordinate the best connection option for your studio.",
  },
  mangomint: {
    name: "Mangomint",
    descriptor: "Lightweight POS",
    badge: "Upload Path",
    mode: "upload",
    summary: "Bring Mangomint data in through standard CSV exports.",
    needs: [
      "Client export",
      "Sales or payment history",
      "Appointments if exportable",
    ],
    links: [
      { label: "Mangomint Login", url: "https://www.mangomint.com/" },
      { label: "Mangomint Support", url: "https://www.mangomint.com/support" },
    ],
    steps: [
      "Log into Mangomint",
      "Open Reports or data export",
      "Download CSV files",
      "Upload them below",
    ],
    screenshots: ["Reports", "Export", "Upload to VMB"],
  },
  other: {
    name: "Other",
    descriptor: "Any salon platform",
    badge: "Upload Path",
    mode: "upload",
    summary:
      "Use CSV exports from your system — we’ll help line them up with your insights.",
    needs: [
      "Clients or contacts",
      "Sales or payment history",
      "Appointments or services if available",
    ],
    links: [],
    steps: [
      "Log into your platform",
      "Find reporting or export tools",
      "Export CSV files",
      "Upload below — we can help map columns",
    ],
    screenshots: ["Export area", "CSV download", "Upload to VMB"],
    emptyLinksHint:
      "Your login URL is usually on your software’s website — we can help if you’re unsure.",
  },
};

export const PRIMARY_ORDER = ["vagaro", "glossgenius", "square", "boulevard"];
export const SECONDARY_ORDER = ["fresha", "booksy", "mindbody", "mangomint", "other"];
