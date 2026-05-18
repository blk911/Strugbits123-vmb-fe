import { readJson, LS_NORMALIZED, LS_SIGNALS, LS_PARSED } from "../lib/deep-insights/storageKeys.js";
import { mockPresentation, MOCK_IMPORT_META } from "./deepInsightsMockDataset.js";
import { getImportCapabilities } from "../lib/deep-insights/importCapabilities.js";

/**
 * @returns {{ banner: null | { label: string; importedAt: string; clients: number; appointments: number; transactions: number } }; presentation: typeof mockPresentation; useImported: boolean }}
 */
export function getAnalyticsPresentationBundle() {
  const normalized = readJson(LS_NORMALIZED, null);
  const signalsPack = readJson(LS_SIGNALS, null);
  const useImported = Boolean(
    normalized &&
      (normalized.clients?.length ||
        normalized.appointments?.length ||
        normalized.transactions?.length),
  );

  if (!useImported || !signalsPack?.signals) {
    return {
      banner: null,
      presentation: mockPresentation,
      useImported: false,
      metaVersion: MOCK_IMPORT_META.schemaVersion,
    };
  }

  const s = signalsPack.signals;
  const n = normalized.normalizationSummary ?? {};
  const rawParsed = readJson(LS_PARSED, null);
  const capabilities =
    signalsPack.capabilities ??
    getImportCapabilities(normalized, Array.isArray(rawParsed) ? rawParsed : [], signalsPack);
  const scheduleAvailable = capabilities.schedule === "available";

  const heroStats = [
    {
      id: "clients",
      label: "Total Clients",
      value: String(n.clientsCount ?? normalized.clients?.length ?? 0),
      hint: "from import",
    },
    {
      id: "revenue",
      label: "Import Revenue (sum)",
      value: `$${Math.round(
        (normalized.transactions ?? []).reduce((a, t) => a + (Number(t.total_collected) || 0), 0),
      ).toLocaleString()}`,
      hint: "transactions total",
    },
    {
      id: "appts",
      label: "Completed Appointments",
      value: String(s.completedAppointmentCount ?? 0),
      hint: "status=completed",
    },
    {
      id: "ticket",
      label: "Average Ticket",
      value: `$${Math.round(s.averageTicket || 0)}`,
      hint: "derived",
    },
    {
      id: "inactive",
      label: "Inactive 45+ days",
      value: String(s.inactiveClients45Plus ?? 0),
      hint: "imported",
    },
    {
      id: "opps",
      label: "Opportunities",
      value: String(
        (signalsPack.opportunities ?? []).filter((o) => o.id !== "opp-import-timing-limited").length,
      ),
      hint: "generated",
    },
  ];

  const revenueSignals = [
    {
      title: "Top service by revenue",
      value: s.topServiceByRevenue || "—",
      detail: `$${Math.round(s.topServiceRevenueAmount || 0).toLocaleString()} attributed`,
    },
    {
      title: "Top provider by revenue",
      value: s.topProviderByRevenue || "—",
      detail: `$${Math.round(s.topProviderRevenueAmount || 0).toLocaleString()} attributed`,
    },
    {
      title: "Weak daypart",
      value: scheduleAvailable ? s.weakDaypartLabel || "—" : "Limited",
      detail: scheduleAvailable ? "from appointment weekday spread" : "connect appointments or calendar export",
    },
    {
      title: "Color / balayage backlog",
      value: String(s.colorOverdueApprox ?? 0),
      detail: "approx overdue color rows",
    },
  ];

  const clientBehavior = [
    {
      title: "High-value clients ($500+)",
      value: String(s.highValueClients ?? 0),
      detail: "from import lifetime",
    },
    {
      title: "Clients inactive 45+ days",
      value: String(s.inactiveClients45Plus ?? 0),
      detail: "last_visit signal",
    },
    {
      title: "Missing birthday context",
      value: String(s.missingBirthday ?? 0),
      detail: "fill over time",
    },
    {
      title: "Referral tags present",
      value: String(s.referralTagClients ?? 0),
      detail: "referral_source populated",
    },
  ];

  const vmbOpportunities = (signalsPack.opportunities ?? [])
    .filter((o) => o.id !== "opp-import-timing-limited")
    .slice(0, 8)
    .map((o) => ({
      title: o.title,
      body: [o.summary, o.capabilityNote].filter(Boolean).join(" "),
      tone: "gem",
    }));

  const presentation = {
    ...mockPresentation,
    heroStats,
    revenueSignals,
    clientBehavior,
    vmbOpportunities: vmbOpportunities.length ? vmbOpportunities : mockPresentation.vmbOpportunities,
    bookingPatterns: mockPresentation.bookingPatterns,
    segments: mockPresentation.segments,
  };

  const importedAt = normalized.importedAt || signalsPack.generatedAt || "";

  return {
    banner: {
      label: "Using imported GlossGenius sample data",
      importedAt,
      clients: n.clientsCount ?? normalized.clients?.length ?? 0,
      appointments: n.appointmentsCount ?? normalized.appointments?.length ?? 0,
      transactions: n.transactionsCount ?? normalized.transactions?.length ?? 0,
    },
    presentation,
    useImported: true,
    metaVersion: "deep-insights.import.v1",
  };
}
