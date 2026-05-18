import { readJson, LS_NORMALIZED, LS_SIGNALS } from "../lib/deep-insights/storageKeys.js";
import { shouldSuppressImportedCampaigns } from "../lib/deep-insights/importQuality.js";
import { prepareImportOpportunitiesForUi } from "../lib/deep-insights/getRecommendedCampaignsFromDeepInsights.js";

/**
 * @returns {Array<{
 *   id: string;
 *   typeLabel: string;
 *   title: string;
 *   reason: string;
 *   valueBadge: string;
 *   status: string;
 *   summary: string;
 *   matched: number;
 *   approved: number;
 *   projected: string;
 *   suggested: string;
 *   nextSteps: string[];
 *   workflowCampaignId: string;
 * }> | null}
 */
export function getImportedDashboardActions() {
  if (shouldSuppressImportedCampaigns()) return null;
  const pack = readJson(LS_SIGNALS, null);
  const opps = pack?.opportunities;
  if (!Array.isArray(opps) || !opps.length) return null;

  const normalized = readJson(LS_NORMALIZED, null);
  const { list } = prepareImportOpportunitiesForUi(normalized, pack);

  return list.slice(0, 6).map((o, i) => {
    const workflowCampaignId = `di-${o.id}`;
    const proj =
      o.projectedValue != null && Number.isFinite(o.projectedValue) ?
        `$${Math.round(o.projectedValue)}`
      : "—";
    const nClients = Array.isArray(o.clients) ? o.clients.length : 0;
    const suggested = [o.recommendedAction, o.capabilityNote].filter(Boolean).join(" · ");
    return {
      id: `imp-${o.id}-${i}`,
      typeLabel: (o.type || "SIG").slice(0, 4).toUpperCase(),
      title: o.title,
      reason: o.evidence?.slice(0, 40) || "import signal",
      valueBadge: String(nClients || o.opportunity?.length || i + 1),
      status: "READY",
      summary: o.summary,
      matched: nClients || 8,
      approved: 0,
      projected: proj,
      suggested,
      nextSteps: ["Review in Data Capture", "Open workflow"],
      workflowCampaignId,
    };
  });
}