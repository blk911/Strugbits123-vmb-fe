/**
 * Deep Dig — normalized salon model and provider export registry (front-end only).
 * @typedef {"sample_needed" | "schema_captured" | "mapped"} SchemaCaptureStatus
 * @typedef {"official_docs" | "live_export" | "sample_mock"} SchemaSource
 * @typedef {"verified" | "assumed" | "needs_live_test"} FieldMapConfidence
 */

/**
 * VMB normalized entities used across Deep Dig mapping and preflight.
 * Each entry describes intent and core fields (not a DB schema).
 */
export const NORMALIZED_SALON_SCHEMA = {
  clients: {
    id: "clients",
    label: "Clients",
    description:
      "Unique guests with contact info, consent flags, visit history pointers.",
    primaryKey: "clientId",
    fields: [
      { name: "clientId", type: "string", required: true },
      { name: "displayName", type: "string", required: false },
      { name: "email", type: "string", required: false },
      { name: "phone", type: "string", required: false },
      { name: "firstVisitAt", type: "datetime", required: false },
      { name: "lastVisitAt", type: "datetime", required: false },
      { name: "lifetimeValue", type: "money", required: false },
    ],
  },
  appointments: {
    id: "appointments",
    label: "Appointments",
    description:
      "Booked visits with provider, service, timing, and outcome (completed, no-show).",
    primaryKey: "appointmentId",
    fields: [
      { name: "appointmentId", type: "string", required: true },
      { name: "clientId", type: "string", required: false },
      { name: "staffId", type: "string", required: false },
      { name: "serviceId", type: "string", required: false },
      { name: "startsAt", type: "datetime", required: true },
      { name: "durationMinutes", type: "number", required: false },
      { name: "status", type: "string", required: false },
    ],
  },
  services: {
    id: "services",
    label: "Services",
    description: "Menu items, categories, duration, and default pricing.",
    primaryKey: "serviceId",
    fields: [
      { name: "serviceId", type: "string", required: true },
      { name: "name", type: "string", required: true },
      { name: "category", type: "string", required: false },
      { name: "defaultDurationMinutes", type: "number", required: false },
      { name: "defaultPrice", type: "money", required: false },
    ],
  },
  staff: {
    id: "staff",
    label: "Staff",
    description:
      "Providers and front-desk roles used for utilization and payroll joins.",
    primaryKey: "staffId",
    fields: [
      { name: "staffId", type: "string", required: true },
      { name: "displayName", type: "string", required: true },
      { name: "role", type: "string", required: false },
      { name: "active", type: "boolean", required: false },
    ],
  },
  payments: {
    id: "payments",
    label: "Payments",
    description: "Tickets, tenders, tips, taxes tied to visits or retail.",
    primaryKey: "paymentId",
    fields: [
      { name: "paymentId", type: "string", required: true },
      { name: "paidAt", type: "datetime", required: true },
      { name: "clientId", type: "string", required: false },
      { name: "staffId", type: "string", required: false },
      { name: "subtotal", type: "money", required: false },
      { name: "tip", type: "money", required: false },
      { name: "tax", type: "money", required: false },
      { name: "total", type: "money", required: false },
      { name: "paymentMethod", type: "string", required: false },
    ],
  },
  retail: {
    id: "retail",
    label: "Retail",
    description: "Product lines sold at checkout, distinct from service revenue.",
    primaryKey: "retailLineId",
    fields: [
      { name: "retailLineId", type: "string", required: true },
      { name: "soldAt", type: "datetime", required: false },
      { name: "productName", type: "string", required: true },
      { name: "quantity", type: "number", required: false },
      { name: "lineTotal", type: "money", required: false },
    ],
  },
  referrals: {
    id: "referrals",
    label: "Referrals",
    description:
      "Attribution for new clients (member-get-member, partner codes).",
    primaryKey: "referralId",
    fields: [
      { name: "referralId", type: "string", required: true },
      { name: "referrerClientId", type: "string", required: false },
      { name: "referredClientId", type: "string", required: false },
      { name: "channel", type: "string", required: false },
      { name: "creditedAt", type: "datetime", required: false },
    ],
  },
  socialPosts: {
    id: "socialPosts",
    label: "Social posts",
    description: "Organic content metrics for correlation with bookings.",
    primaryKey: "postId",
    fields: [
      { name: "postId", type: "string", required: true },
      { name: "publishedAt", type: "datetime", required: true },
      { name: "platform", type: "string", required: false },
      { name: "reach", type: "number", required: false },
      { name: "impressions", type: "number", required: false },
      { name: "engagement", type: "number", required: false },
    ],
  },
  reviews: {
    id: "reviews",
    label: "Reviews",
    description: "Star ratings and text feedback by client or platform.",
    primaryKey: "reviewId",
    fields: [
      { name: "reviewId", type: "string", required: true },
      { name: "clientId", type: "string", required: false },
      { name: "rating", type: "number", required: false },
      { name: "body", type: "string", required: false },
      { name: "reviewedAt", type: "datetime", required: false },
    ],
  },
  payroll: {
    id: "payroll",
    label: "Payroll",
    description: "Labor cost periods for margin analysis vs. bookings.",
    primaryKey: "payrollLineId",
    fields: [
      { name: "payrollLineId", type: "string", required: true },
      { name: "staffId", type: "string", required: false },
      { name: "periodStart", type: "date", required: false },
      { name: "periodEnd", type: "date", required: false },
      { name: "grossPay", type: "money", required: false },
      { name: "hours", type: "number", required: false },
    ],
  },
};

/**
 * Per-report capture progress for preflight (no backend).
 * @type {Array<{
 *   providerId: string;
 *   reportName: string;
 *   status: SchemaCaptureStatus;
 *   source: SchemaSource;
 *   requiredForInsights: boolean;
 *   notes: string;
 * }>}
 */
export const PROVIDER_SCHEMA_STATUS = [
  {
    providerId: "vagaro",
    reportName: "Appointments summary",
    status: "mapped",
    source: "sample_mock",
    requiredForInsights: true,
    notes:
      "Column layout confirmed against Jenny's Nails sample export; rollups may differ by salon settings.",
  },
  {
    providerId: "vagaro",
    reportName: "Sales summary",
    status: "schema_captured",
    source: "official_docs",
    requiredForInsights: true,
    notes:
      "Daily/category aggregates documented; live CSV header order needs spot-check.",
  },
  {
    providerId: "vagaro",
    reportName: "Client list",
    status: "sample_needed",
    source: "official_docs",
    requiredForInsights: true,
    notes:
      "Export path described in help center; no stable field map until sample.",
  },
  {
    providerId: "glossgenius",
    reportName: "Clients export",
    status: "mapped",
    source: "sample_mock",
    requiredForInsights: true,
    notes: "Mapped from GlossGenius-style client CSV (GG-* ids).",
  },
  {
    providerId: "glossgenius",
    reportName: "Appointments export",
    status: "mapped",
    source: "sample_mock",
    requiredForInsights: true,
    notes: "Start time + staff columns align with appointments entity.",
  },
  {
    providerId: "glossgenius",
    reportName: "Payments export",
    status: "schema_captured",
    source: "live_export",
    requiredForInsights: true,
    notes:
      "Tip/tax columns vary by region; normalization assumes US-style lines.",
  },
  {
    providerId: "glossgenius",
    reportName: "Services catalog",
    status: "sample_needed",
    source: "official_docs",
    requiredForInsights: false,
    notes: "Needed for margin-by-service when payments lack line items.",
  },
  {
    providerId: "square-appointments",
    reportName: "Appointment history",
    status: "schema_captured",
    source: "official_docs",
    requiredForInsights: true,
    notes:
      "Square appointments CSV documented; join to Square POS for tickets.",
  },
  {
    providerId: "fresha",
    reportName: "Client export",
    status: "sample_needed",
    source: "official_docs",
    requiredForInsights: true,
    notes: "Fresha column naming varies by locale; capture live export next.",
  },
  {
    providerId: "mangomint",
    reportName: "Sales / payments",
    status: "sample_needed",
    source: "official_docs",
    requiredForInsights: true,
    notes: "Expect ticket-level rows; confirm discount columns on live file.",
  },
  {
    providerId: "instagram-meta",
    reportName: "Post and reel insights",
    status: "mapped",
    source: "sample_mock",
    requiredForInsights: false,
    notes: "Mapped to socialPosts entity for reach/engagement experiments.",
  },
];

/**
 * Field-level maps from provider columns → NORMALIZED_SALON_SCHEMA fields.
 * Extend as live exports are validated.
 * @type {Record<string, Array<{
 *   providerField: string;
 *   normalizedField: string;
 *   required: boolean;
 *   confidence: FieldMapConfidence;
 * }>>}
 */
export const PROVIDER_FIELD_MAPS = {
  vagaroAppointmentsSummary: [
    {
      providerField: "report_date",
      normalizedField: "appointments.startsAt",
      required: false,
      confidence: "assumed",
    },
    {
      providerField: "staff_member",
      normalizedField: "appointments.staffId",
      required: false,
      confidence: "assumed",
    },
    {
      providerField: "appointment_count",
      normalizedField: "appointments.aggregateCount",
      required: true,
      confidence: "needs_live_test",
    },
  ],
  vagaroSalesSummary: [
    {
      providerField: "sale_date",
      normalizedField: "payments.paidAt",
      required: true,
      confidence: "assumed",
    },
    {
      providerField: "gross_sales",
      normalizedField: "payments.subtotal",
      required: false,
      confidence: "needs_live_test",
    },
    {
      providerField: "net_sales",
      normalizedField: "payments.total",
      required: false,
      confidence: "needs_live_test",
    },
  ],
  glossgeniusClients: [
    {
      providerField: "client_id",
      normalizedField: "clients.clientId",
      required: true,
      confidence: "verified",
    },
    {
      providerField: "email",
      normalizedField: "clients.email",
      required: false,
      confidence: "verified",
    },
    {
      providerField: "last_visit",
      normalizedField: "clients.lastVisitAt",
      required: false,
      confidence: "verified",
    },
    {
      providerField: "lifetime_value",
      normalizedField: "clients.lifetimeValue",
      required: false,
      confidence: "assumed",
    },
  ],
  glossgeniusAppointments: [
    {
      providerField: "appt_id",
      normalizedField: "appointments.appointmentId",
      required: true,
      confidence: "verified",
    },
    {
      providerField: "start_datetime",
      normalizedField: "appointments.startsAt",
      required: true,
      confidence: "verified",
    },
    {
      providerField: "staff_name",
      normalizedField: "appointments.staffId",
      required: false,
      confidence: "assumed",
    },
    {
      providerField: "status",
      normalizedField: "appointments.status",
      required: false,
      confidence: "verified",
    },
  ],
  squareAppointmentHistory: [
    {
      providerField: "Appointment ID",
      normalizedField: "appointments.appointmentId",
      required: true,
      confidence: "assumed",
    },
    {
      providerField: "Start At",
      normalizedField: "appointments.startsAt",
      required: true,
      confidence: "assumed",
    },
    {
      providerField: "Team Member",
      normalizedField: "appointments.staffId",
      required: false,
      confidence: "needs_live_test",
    },
  ],
  freshaClients: [],
  mangomintSales: [
    {
      providerField: "ticket_id",
      normalizedField: "payments.paymentId",
      required: true,
      confidence: "needs_live_test",
    },
    {
      providerField: "total",
      normalizedField: "payments.total",
      required: true,
      confidence: "needs_live_test",
    },
  ],
};

/**
 * Preflight checklist columns for a single registry row.
 * @param {typeof PROVIDER_SCHEMA_STATUS[number]} row
 */
export function getSchemaPreflightColumns(row) {
  return {
    /** Vendor or internal documentation, or validated live export metadata. */
    docsFound:
      row.source === "official_docs" || row.source === "live_export",
    /** Sample / export received — not stuck in `sample_needed`. */
    sampleResolved: row.status !== "sample_needed",
    schemaCaptured:
      row.status === "schema_captured" || row.status === "mapped",
    mappedToVmb: row.status === "mapped",
  };
}

const SAMPLE_EXPORT_BASE = "/sample-exports/deep-dig";

const INSTAGRAM_INSIGHTS_HEADERS = [
  "post_id",
  "posted_at",
  "caption_snippet",
  "format",
  "reach",
  "impressions",
  "likes",
  "comments",
  "saves",
  "shares",
  "profile_visits",
  "follows_from_post",
  "approx_link_clicks",
  "salon_name",
];

const INSTAGRAM_INSIGHTS_PREVIEW_ROWS = [
  {
    post_id: "ig_jn_240501",
    posted_at: "2026-05-01T18:02:00",
    caption_snippet: "Tuesday lineup open — Jenny's Nails",
    format: "Reel",
    reach: "1842",
    impressions: "4120",
    likes: "126",
    comments: "22",
    saves: "38",
    shares: "12",
    profile_visits: "89",
    follows_from_post: "4",
    approx_link_clicks: "28",
    salon_name: "Jenny's Nails",
  },
  {
    post_id: "ig_jn_240509",
    posted_at: "2026-05-09T16:20:00",
    caption_snippet: "Walk-in Saturday tips",
    format: "Story set",
    reach: "—",
    impressions: "12400",
    likes: "—",
    comments: "—",
    saves: "—",
    shares: "—",
    profile_visits: "—",
    follows_from_post: "—",
    approx_link_clicks: "—",
    salon_name: "Jenny's Nails",
  },
  {
    post_id: "ig_jn_240516",
    posted_at: "2026-05-16T20:22:00",
    caption_snippet: "ASMR filing (sound on)",
    format: "Reel",
    reach: "5021",
    impressions: "14002",
    likes: "620",
    comments: "41",
    saves: "210",
    shares: "67",
    profile_visits: "245",
    follows_from_post: "9",
    approx_link_clicks: "54",
    salon_name: "Jenny's Nails",
  },
  {
    post_id: "ig_jn_240503",
    posted_at: "2026-05-03T12:30:00",
    caption_snippet: "Before / after chrome french 🤍",
    format: "Carousel",
    reach: "3210",
    impressions: "9050",
    likes: "412",
    comments: "55",
    saves: "120",
    shares: "41",
    profile_visits: "210",
    follows_from_post: "11",
    approx_link_clicks: "62",
    salon_name: "Jenny's Nails",
  },
  {
    post_id: "ig_jn_240521",
    posted_at: "2026-05-21T07:15:00",
    caption_snippet: "Book via link — 10% first visit",
    format: "Image",
    reach: "1320",
    impressions: "2788",
    likes: "41",
    comments: "15",
    saves: "12",
    shares: "5",
    profile_visits: "88",
    follows_from_post: "6",
    approx_link_clicks: "35",
    salon_name: "Jenny's Nails",
  },
];

/**
 * Deep Dig demo CSV registry (served from `public/sample-exports/deep-dig/`).
 * `uploadSlotHints`: longest matching hint wins against the upload queue label (case-insensitive).
 * @type {Array<{
 *   id: string;
 *   providerId: string;
 *   providerName: string;
 *   reportName: string;
 *   label: string;
 *   filename: string;
 *   path: string;
 *   schemaKey: string;
 *   uploadSlotHints: string[];
 *   expectedHeaders: string[];
 *   previewRows: Record<string, string>[];
 * }>}
 */
export const SAMPLE_EXPORTS = [
  {
    id: "vagaro-appointments-summary",
    providerId: "vagaro",
    providerName: "Vagaro",
    reportName: "Appointments Summary",
    label: "Vagaro appointments sample",
    filename: "vagaro-appointments-summary.csv",
    path: `${SAMPLE_EXPORT_BASE}/vagaro-appointments-summary.csv`,
    schemaKey: "vagaroAppointmentsSummary",
    uploadSlotHints: ["appointments report", "appointments summary"],
    expectedHeaders: [
      "Appointment Date",
      "Customer",
      "Employee",
      "Service",
      "Charge",
      "Tip",
      "Status",
    ],
    previewRows: [
      {
        "Appointment Date": "2026-05-12",
        Customer: "Amy Smith",
        Employee: "Nina K.",
        Service: "Balayage refresh",
        Charge: "240.00",
        Tip: "40.00",
        Status: "Completed",
      },
      {
        "Appointment Date": "2026-05-12",
        Customer: "Ashley Chen",
        Employee: "Maya T.",
        Service: "Spa pedicure + paraffin",
        Charge: "88.00",
        Tip: "18.00",
        Status: "Completed",
      },
      {
        "Appointment Date": "2026-05-11",
        Customer: "Skylar Wright",
        Employee: "Maya T.",
        Service: "Classic pedicure",
        Charge: "52.00",
        Tip: "10.00",
        Status: "No-show",
      },
      {
        "Appointment Date": "2026-05-11",
        Customer: "Riley Patel",
        Employee: "Guest stylist",
        Service: "Express manicure",
        Charge: "28.00",
        Tip: "5.00",
        Status: "Cancelled",
      },
      {
        "Appointment Date": "2026-05-07",
        Customer: "Amy Smith",
        Employee: "Maya T.",
        Service: "Spa pedicure",
        Charge: "64.00",
        Tip: "15.00",
        Status: "Completed",
      },
    ],
  },
  {
    id: "vagaro-sales-summary",
    providerId: "vagaro",
    providerName: "Vagaro",
    reportName: "Sales Summary",
    label: "Vagaro sales sample",
    filename: "vagaro-sales-summary.csv",
    path: `${SAMPLE_EXPORT_BASE}/vagaro-sales-summary.csv`,
    schemaKey: "vagaroSalesSummary",
    uploadSlotHints: ["sales / transactions", "sales summary", "transaction"],
    expectedHeaders: [
      "sale_date",
      "salon_name",
      "report_type",
      "category",
      "transaction_count",
      "gross_sales",
      "discounts",
      "net_sales",
      "tax_collected",
      "payment_mix_notes",
    ],
    previewRows: [
      {
        sale_date: "2026-05-12",
        salon_name: "Jenny's Nails — Downtown",
        report_type: "Daily",
        category: "Services",
        transaction_count: "47",
        gross_sales: "2840.00",
        discounts: "125.00",
        net_sales: "2715.00",
        tax_collected: "224.30",
        payment_mix_notes: "68% card",
      },
      {
        sale_date: "2026-05-10",
        salon_name: "Jenny's Nails — Downtown",
        report_type: "Daily",
        category: "Services + Retail",
        transaction_count: "38",
        gross_sales: "2288.00",
        discounts: "0.00",
        net_sales: "2288.00",
        tax_collected: "189.90",
        payment_mix_notes: "Retail 14%",
      },
      {
        sale_date: "2026-05-01",
        salon_name: "Jenny's Nails — Downtown",
        report_type: "Daily",
        category: "Services",
        transaction_count: "42",
        gross_sales: "2560.00",
        discounts: "60.00",
        net_sales: "2500.00",
        tax_collected: "206.25",
        payment_mix_notes: "May Day",
      },
      {
        sale_date: "2026-04-30",
        salon_name: "Jenny's Nails — Downtown",
        report_type: "Monthly rollup",
        category: "Services",
        transaction_count: "1124",
        gross_sales: "68420.00",
        discounts: "4200.00",
        net_sales: "64220.00",
        tax_collected: "5310.80",
        payment_mix_notes: "April close",
      },
      {
        sale_date: "2026-04-26",
        salon_name: "Jenny's Nails — Downtown",
        report_type: "Daily",
        category: "Services",
        transaction_count: "51",
        gross_sales: "3055.00",
        discounts: "175.00",
        net_sales: "2880.00",
        tax_collected: "238.05",
        payment_mix_notes: "Sunday bridal",
      },
    ],
  },
  {
    id: "glossgenius-appointments",
    providerId: "glossgenius",
    providerName: "GlossGenius",
    reportName: "Appointments export",
    label: "GlossGenius appointments sample",
    filename: "glossgenius-appointments.csv",
    path: `${SAMPLE_EXPORT_BASE}/glossgenius-appointments.csv`,
    schemaKey: "glossgeniusAppointments",
    uploadSlotHints: ["appointments"],
    expectedHeaders: [
      "appt_id",
      "client_name",
      "service_name",
      "staff_name",
      "start_datetime",
      "duration_minutes",
      "status",
      "source",
      "location",
    ],
    previewRows: [
      {
        appt_id: "GG-APT-5001",
        client_name: "Martinez / Jenny",
        service_name: "Gel Manicure",
        staff_name: "Nina K.",
        start_datetime: "2026-05-13T10:00:00",
        duration_minutes: "45",
        status: "confirmed",
        source: "app",
        location: "Jenny's Nails Studio A",
      },
      {
        appt_id: "GG-APT-5005",
        client_name: "Patel / Riley",
        service_name: "Manicure",
        staff_name: "Guest Stylist",
        start_datetime: "2026-05-14T13:15:00",
        duration_minutes: "35",
        status: "cancelled",
        source: "app",
        location: "Jenny's Nails Studio A",
      },
      {
        appt_id: "GG-APT-5006",
        client_name: "Nguyen / Casey",
        service_name: "Acrylic Fill",
        staff_name: "Maya T.",
        start_datetime: "2026-05-14T15:00:00",
        duration_minutes: "60",
        status: "no_show",
        source: "walk_in",
        location: "Jenny's Nails Studio A",
      },
      {
        appt_id: "GG-APT-5003",
        client_name: "Brooks / Taylor",
        service_name: "Dip Powder Full Set",
        staff_name: "Nina K.",
        start_datetime: "2026-05-13T14:00:00",
        duration_minutes: "75",
        status: "completed",
        source: "Instagram DM",
        location: "Jenny's Nails Studio A",
      },
      {
        appt_id: "GG-APT-5015",
        client_name: "Flores / Sage",
        service_name: "Brow wax add-on",
        staff_name: "Maya T.",
        start_datetime: "2026-05-17T15:15:00",
        duration_minutes: "15",
        status: "cancelled",
        source: "app",
        location: "Jenny's Nails Studio A",
      },
    ],
  },
  {
    id: "glossgenius-clients",
    providerId: "glossgenius",
    providerName: "GlossGenius",
    reportName: "Clients export",
    label: "GlossGenius clients sample",
    filename: "glossgenius-clients.csv",
    path: `${SAMPLE_EXPORT_BASE}/glossgenius-clients.csv`,
    schemaKey: "glossgeniusClients",
    uploadSlotHints: ["clients"],
    expectedHeaders: [
      "client_id",
      "first_name",
      "last_name",
      "email",
      "phone",
      "last_visit",
      "total_visits",
      "lifetime_value",
      "notes",
    ],
    previewRows: [
      {
        client_id: "GG-JN-1001",
        first_name: "Jenny",
        last_name: "Martinez",
        email: "jmartinez@email.com",
        phone: "555-0101",
        last_visit: "2026-05-08",
        total_visits: "48",
        lifetime_value: "3840.00",
        notes: "VIP gel regular",
      },
      {
        client_id: "GG-JN-1002",
        first_name: "Ashley",
        last_name: "Chen",
        email: "achen@email.com",
        phone: "555-0102",
        last_visit: "2026-05-10",
        total_visits: "22",
        lifetime_value: "1760.00",
        notes: "Refers sister",
      },
      {
        client_id: "GG-JN-1007",
        first_name: "Jordan",
        last_name: "Kim",
        email: "jkim@email.com",
        phone: "555-0107",
        last_visit: "2026-05-09",
        total_visits: "52",
        lifetime_value: "4680.00",
        notes: "Since 2021",
      },
      {
        client_id: "GG-JN-1015",
        first_name: "Sage",
        last_name: "Flores",
        email: "sflores@email.com",
        phone: "555-0115",
        last_visit: "2026-01-08",
        total_visits: "3",
        lifetime_value: "195.00",
        notes: "Quiet season",
      },
      {
        client_id: "GG-JN-1016",
        first_name: "Charlie",
        last_name: "Rivera",
        email: "crivera@email.com",
        phone: "555-0116",
        last_visit: "2026-05-03",
        total_visits: "41",
        lifetime_value: "3690.00",
        notes: "Marketing IG",
      },
    ],
  },
  {
    id: "glossgenius-payments",
    providerId: "glossgenius",
    providerName: "GlossGenius",
    reportName: "Payments / sales lines",
    label: "GlossGenius payments sample",
    filename: "glossgenius-payments.csv",
    path: `${SAMPLE_EXPORT_BASE}/glossgenius-payments.csv`,
    schemaKey: "glossgeniusPayments",
    uploadSlotHints: ["payments / sales", "payments"],
    expectedHeaders: [
      "payment_id",
      "transaction_date",
      "client_name",
      "service_description",
      "subtotal",
      "tip",
      "tax",
      "total",
      "payment_method",
      "staff_name",
    ],
    previewRows: [
      {
        payment_id: "GG-PAY-9001",
        transaction_date: "2026-05-12",
        client_name: "Martinez / Jenny",
        service_description: "Gel Manicure",
        subtotal: "45.00",
        tip: "9.00",
        tax: "3.78",
        total: "57.78",
        payment_method: "Card",
        staff_name: "Nina K.",
      },
      {
        payment_id: "GG-PAY-9005",
        transaction_date: "2026-05-11",
        client_name: "Patel / Riley",
        service_description: "Manicure",
        subtotal: "32.00",
        tip: "5.00",
        tax: "2.59",
        total: "39.59",
        payment_method: "Cash",
        staff_name: "Guest Stylist",
      },
      {
        payment_id: "GG-PAY-9010",
        transaction_date: "2026-05-08",
        client_name: "Murphy / Blake",
        service_description: "Gel Manicure",
        subtotal: "45.00",
        tip: "11.00",
        tax: "3.92",
        total: "59.92",
        payment_method: "Card",
        staff_name: "Maya T.",
      },
      {
        payment_id: "GG-PAY-9018",
        transaction_date: "2026-05-04",
        client_name: "Friends of Jenny",
        service_description: "Party booking deposit",
        subtotal: "150.00",
        tip: "0.00",
        tax: "10.50",
        total: "160.50",
        payment_method: "ACH",
        staff_name: "Jenny O.",
      },
      {
        payment_id: "GG-PAY-9009",
        transaction_date: "2026-05-09",
        client_name: "Singh / Harper",
        service_description: "Express Manicure",
        subtotal: "22.00",
        tip: "4.00",
        tax: "1.87",
        total: "27.87",
        payment_method: "Square Reader",
        staff_name: "Nina K.",
      },
    ],
  },
  {
    id: "square-appointment-history",
    providerId: "square-appointments",
    providerName: "Square Appointments",
    reportName: "Appointment history",
    label: "Square appointment history sample",
    filename: "square-appointment-history.csv",
    path: `${SAMPLE_EXPORT_BASE}/square-appointment-history.csv`,
    schemaKey: "squareAppointmentHistory",
    uploadSlotHints: ["appointment history", "appointment history export"],
    expectedHeaders: [
      "booking_id",
      "start_time",
      "end_time",
      "client_display",
      "service_title",
      "staff_name",
      "duration_min",
      "status",
      "location_label",
      "internal_note",
    ],
    previewRows: [
      {
        booking_id: "sq_jn_10001",
        start_time: "2026-05-13T09:00:00",
        end_time: "2026-05-13T09:50:00",
        client_display: "Martinez / Jenny",
        service_title: "Classic manicure",
        staff_name: "Nina Patel",
        duration_min: "50",
        status: "completed",
        location_label: "Jenny's Nails — Downtown",
        internal_note: "Repeat 3-week cadence",
      },
      {
        booking_id: "sq_jn_10005",
        start_time: "2026-05-14T15:15:00",
        end_time: "2026-05-14T15:45:00",
        client_display: "Patel / Riley",
        service_title: "Polish change",
        staff_name: "Maya Torres",
        duration_min: "30",
        status: "no_show",
        location_label: "Jenny's Nails — Downtown",
        internal_note: "SMS reminder sent",
      },
      {
        booking_id: "sq_jn_10003",
        start_time: "2026-05-13T14:00:00",
        end_time: "2026-05-13T15:30:00",
        client_display: "Brooks / Taylor",
        service_title: "Dip full set",
        staff_name: "Nina Patel",
        duration_min: "90",
        status: "cancelled",
        location_label: "Jenny's Nails — Downtown",
        internal_note: "Client rescheduled to Fri",
      },
      {
        booking_id: "sq_jn_10018",
        start_time: "2026-05-21T13:15:00",
        end_time: "2026-05-21T14:30:00",
        client_display: "Amy Smith",
        service_title: "Color melt + gloss",
        staff_name: "Nina Patel",
        duration_min: "75",
        status: "no_show",
        location_label: "Jenny's Nails — Downtown",
        internal_note: "Left voicemail",
      },
      {
        booking_id: "sq_jn_10020",
        start_time: "2026-05-22T15:00:00",
        end_time: "2026-05-22T16:15:00",
        client_display: "Taylor Brooks",
        service_title: "Dip maintenance",
        staff_name: "Sophia Reyes",
        duration_min: "75",
        status: "completed",
        location_label: "Jenny's Nails — Downtown",
        internal_note: "3-week fill",
      },
    ],
  },
  {
    id: "instagram-post-insights",
    providerId: "instagram-meta",
    providerName: "Instagram (Meta)",
    reportName: "Post insights",
    label: "Instagram post & reel insights sample",
    filename: "instagram-post-insights.csv",
    path: `${SAMPLE_EXPORT_BASE}/instagram-post-insights.csv`,
    schemaKey: "instagramPostInsights",
    uploadSlotHints: ["post and reel insights", "post insights", "reel"],
    expectedHeaders: INSTAGRAM_INSIGHTS_HEADERS,
    previewRows: INSTAGRAM_INSIGHTS_PREVIEW_ROWS,
  },
  {
    id: "instagram-reach-engagement",
    providerId: "instagram-meta",
    providerName: "Instagram (Meta)",
    reportName: "Reach / engagement export",
    label: "Instagram reach & engagement sample (same CSV)",
    filename: "instagram-post-insights.csv",
    path: `${SAMPLE_EXPORT_BASE}/instagram-post-insights.csv`,
    schemaKey: "instagramPostInsights",
    uploadSlotHints: ["reach / engagement export", "reach / engagement"],
    expectedHeaders: INSTAGRAM_INSIGHTS_HEADERS,
    previewRows: INSTAGRAM_INSIGHTS_PREVIEW_ROWS,
  },
  {
    id: "instagram-ad-spend-holding",
    providerId: "instagram-meta",
    providerName: "Instagram (Meta)",
    reportName: "Ad spend (demo placeholder)",
    label: "Instagram ad export sample (demo reuses organic insights CSV)",
    filename: "instagram-post-insights.csv",
    path: `${SAMPLE_EXPORT_BASE}/instagram-post-insights.csv`,
    schemaKey: "instagramPostInsights",
    uploadSlotHints: ["ad spend export if used", "ad spend"],
    expectedHeaders: INSTAGRAM_INSIGHTS_HEADERS,
    previewRows: INSTAGRAM_INSIGHTS_PREVIEW_ROWS,
  },
];

/** @param {string} providerId */
export function getSampleExportsForProvider(providerId) {
  return SAMPLE_EXPORTS.filter((s) => s.providerId === providerId);
}

/** @param {string} providerId @param {string} reportName */
export function getSampleExportForProviderReport(providerId, reportName) {
  return (
    SAMPLE_EXPORTS.find(
      (s) =>
        s.providerId === providerId && s.reportName === reportName,
    ) ?? null
  );
}

/** @param {string} sampleId */
export function findSampleExportById(sampleId) {
  return SAMPLE_EXPORTS.find((s) => s.id === sampleId) ?? null;
}

/**
 * Longest hint match wins (ties pick first in `SAMPLE_EXPORTS` order).
 * @param {string} providerId
 * @param {string} uploadLabel
 */
export function findSampleForUploadLabel(providerId, uploadLabel) {
  if (!uploadLabel) return null;
  const u = uploadLabel.toLowerCase().trim();
  const cands = SAMPLE_EXPORTS.filter((s) => s.providerId === providerId);
  let best = null;
  let bestLen = -1;
  for (const s of cands) {
    for (const h of s.uploadSlotHints ?? []) {
      const hl = h.toLowerCase();
      if (u.includes(hl) && hl.length > bestLen) {
        bestLen = hl.length;
        best = s;
      }
    }
  }
  return best;
}

/**
 * @param {string} providerId
 * @param {string} uploadLabel
 * @param {unknown} fileLike
 */
export function getLoadedSampleForUpload(providerId, uploadLabel, fileLike) {
  if (!fileLike || typeof fileLike !== "object") return null;
  const o = /** @type {{ isSample?: unknown; __sample?: unknown; sampleId?: unknown; name?: unknown }} */ (
    fileLike
  );
  if (!(o.isSample === true || o.__sample === true)) return null;
  const sid = typeof o.sampleId === "string" ? o.sampleId : null;
  const byId = sid ? findSampleExportById(sid) : null;
  if (byId && byId.providerId === providerId) return byId;
  const expected = findSampleForUploadLabel(providerId, uploadLabel);
  if (expected && sid === expected.id) return expected;
  if (expected && o.name === expected.filename) return expected;
  return null;
}

/** @param {unknown} fileLike */
export function getFileDisplayName(fileLike) {
  if (fileLike == null) return "";
  if (typeof File !== "undefined" && fileLike instanceof File) {
    return fileLike.name;
  }
  if (typeof fileLike === "object" && fileLike !== null && "name" in fileLike) {
    const n = /** @type {{ name?: unknown }} */ (fileLike).name;
    return typeof n === "string" ? n : "";
  }
  return "";
}

/**
 * Merge sample metadata for a queue slot (`loadSampleFiles` / “Try sample exports”).
 * @param {typeof SAMPLE_EXPORTS[number]} sample
 */
export function createDeepDigSampleUploadEntry(sample) {
  return {
    name: sample.filename,
    type: "text/csv",
    size: 2048,
    sampleId: sample.id,
    samplePath: sample.path,
    isSample: true,
    __sample: true,
    href: sample.path,
  };
}
