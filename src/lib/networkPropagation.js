/**
 * VMB Network Propagation Lab — phase-based salon growth + salon-linked client engine.
 * Gross revenue = (monthly new clients + repeat clients) × avg ticket.
 * Client ladder: L1–L6 only (months 1–6 open successive depths; month 6+ all six).
 * Co-marketing pool = gross × rate; bonus pool % carves discretionary dollars from that
 * pool; L1–L6 split the remainder only by tier weights (25/15/5/10/15/25).
 */

const LEVEL_KEYS = [
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
  "level6",
];

/** L1–L6 only — bonus is not a network tier */
const CO_MARKETING_TIER_WEIGHTS = [25, 15, 5, 10, 15, 25];

/** Month m (1-based): 1→L1 only … 6→L1–L6 */
function activeLevelCountForMonth(m) {
  return Math.min(6, m);
}

function splitIntegerByWeights(total, weightsSlice) {
  const n = weightsSlice.length;
  if (n === 0) return [];
  if (total <= 0) return Array(n).fill(0);
  const sumW = weightsSlice.reduce((a, b) => a + b, 0);
  if (sumW <= 0) return Array(n).fill(0);
  const exact = weightsSlice.map((w) => (total * w) / sumW);
  const parts = exact.map((x) => Math.floor(x));
  let remainder = total - parts.reduce((a, b) => a + b, 0);
  const fr = exact.map((x, i) => ({ i, f: x - parts[i] }));
  fr.sort((a, b) => b.f - a.f);
  for (let k = 0; k < remainder; k++) parts[fr[k].i] += 1;
  return parts;
}

function emptyLevelRecord() {
  return {
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    level6: 0,
  };
}

/**
 * @param {Record<string, number>} rawInputs - numeric fields from UI
 * @returns {object} { monthlyRows, summary }
 */
export function calculateNetworkPropagation(rawInputs) {
  const startingSalons = Math.max(0, Number(rawInputs.startingSalons) || 0);
  const avgTicket = Math.max(0, Number(rawInputs.avgTicket) || 0);

  const growthPctInput = (v, fallback) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(100, Math.max(0, n));
  };

  const launchGrowthPct = growthPctInput(rawInputs.launchGrowthPct, 65);
  const normalizeGrowthPct = growthPctInput(
    rawInputs.normalizeGrowthPct ?? rawInputs.growthPctMonths7to12,
    18,
  );
  const matureGrowthPct = growthPctInput(
    rawInputs.matureGrowthPct ?? rawInputs.growthPctMonths13Plus,
    8,
  );

  const newClientsPerSalonPerMonth = Math.max(
    0,
    Number(rawInputs.newClientsPerSalonPerMonth) || 25,
  );
  const clientGrowthPctPerMonth = growthPctInput(
    rawInputs.clientGrowthPctPerMonth,
    5,
  );
  const repeatVisitRatePct = growthPctInput(rawInputs.repeatVisitRate, 35);

  const clientToSalonConversionRate = growthPctInput(
    rawInputs.clientToSalonConversionRate,
    10,
  );
  const activeClientsPerSalonInvite = Math.max(
    1,
    Math.round(Number(rawInputs.activeClientsPerSalonInvite) || 200),
  );
  const clientSalonInviteCapPerMonth = Math.max(
    0,
    Math.round(Number(rawInputs.clientSalonInviteCapPerMonth) || 5),
  );

  const vmbRetainedRate = pctToFraction(rawInputs.vmbRetainedRate, 2);
  const coMarketingPoolRate = pctToFraction(rawInputs.coMarketingPoolRate, 3);
  const bonusPoolPct = growthPctInput(
    rawInputs.bonusPoolPct ?? rawInputs.bonusPct,
    10,
  );

  const projectionMonths = Math.max(
    1,
    Math.min(120, Math.round(Number(rawInputs.projectionMonths) || 12)),
  );

  const activeByLevel = Array.from({ length: 6 }, () => []);

  const monthlyRows = [];

  const recruitsByMonth = [];
  const salonRecruitsByMonth = [];
  const clientRecruitsByMonth = [];
  let cumulativeVmbRetainedRevenue = 0;
  let cumulativeCoMarketingPool = 0;
  let cumulativeDistributedCoMarketing = 0;
  let cumulativeLevel0VmbSalons = 0;

  let priorActiveClients = 0;
  /** Active salon count at end of month m-1 (reconciled; month 1 prep = startingSalons). */
  let previousReconciledActiveSalons = startingSalons;

  for (let m = 1; m <= projectionMonths; m += 1) {
    const mi = m - 1;

    const producingSalons = previousReconciledActiveSalons;

    const nAllocLevels = activeLevelCountForMonth(m);
    const weightsActive = CO_MARKETING_TIER_WEIGHTS.slice(0, nAllocLevels);

    const baseNewClients = producingSalons * newClientsPerSalonPerMonth;
    const organicClientGrowth =
      priorActiveClients * (clientGrowthPctPerMonth / 100);
    const newClients = Math.round(baseNewClients + organicClientGrowth);
    const repeatClientsTotal = Math.round(
      priorActiveClients * (repeatVisitRatePct / 100),
    );
    const activeClients = priorActiveClients + newClients;
    const grossClientVolume = newClients + repeatClientsTotal;
    const totalGrossRevenue = grossClientVolume * avgTicket;

    const clientDrivenSalonSignals = Math.floor(
      priorActiveClients / activeClientsPerSalonInvite,
    );
    const clientRecruits = Math.min(
      Math.round(
        clientDrivenSalonSignals * (clientToSalonConversionRate / 100),
      ),
      clientSalonInviteCapPerMonth,
    );

    let activeSalons;
    let totalNewSalons;
    let salonRounded;
    let clientRounded;

    if (m === 1) {
      activeSalons = startingSalons;
      totalNewSalons = 0;
      salonRounded = 0;
      clientRounded = 0;
    } else {
      const salonGrowthPct =
        m <= 6 ? launchGrowthPct
        : m <= 12 ? normalizeGrowthPct
        : matureGrowthPct;
      salonRounded = Math.round(
        previousReconciledActiveSalons * (salonGrowthPct / 100),
      );
      clientRounded = clientRecruits;
      totalNewSalons = Math.max(0, salonRounded + clientRounded);
      activeSalons = previousReconciledActiveSalons + totalNewSalons;
    }

    recruitsByMonth[mi] = totalNewSalons;
    salonRecruitsByMonth[mi] = salonRounded;
    clientRecruitsByMonth[mi] = clientRounded;

    const allocation = splitIntegerByWeights(newClients, weightsActive);
    const newClientsByLevel = emptyLevelRecord();
    for (let li = 0; li < 6; li += 1) {
      const key = LEVEL_KEYS[li];
      const add = li < allocation.length ? allocation[li] : 0;
      newClientsByLevel[key] = add;
      const prev = mi === 0 ? 0 : (activeByLevel[li][mi - 1] ?? 0);
      activeByLevel[li][mi] = prev + add;
    }

    const activeClientsByLevel = emptyLevelRecord();
    for (let li = 0; li < 6; li += 1) {
      activeClientsByLevel[LEVEL_KEYS[li]] = activeByLevel[li][mi];
    }

    const sumW = weightsActive.reduce((a, b) => a + b, 0);
    const grossRevenueByLevel = emptyLevelRecord();
    for (let li = 0; li < 6; li += 1) {
      const key = LEVEL_KEYS[li];
      grossRevenueByLevel[key] =
        li < nAllocLevels && sumW > 0 ?
          totalGrossRevenue * (CO_MARKETING_TIER_WEIGHTS[li] / sumW)
        : 0;
    }

    const repeatClientsByLevel = emptyLevelRecord();
    const invitedClientsByLevel = { ...newClientsByLevel };

    const vmbRetainedRevenue = totalGrossRevenue * vmbRetainedRate;
    const coMarketingPool = totalGrossRevenue * coMarketingPoolRate;
    const bonusPoolDollars = coMarketingPool * (bonusPoolPct / 100);
    const distributableCoMarketingPool = coMarketingPool - bonusPoolDollars;

    cumulativeVmbRetainedRevenue += vmbRetainedRevenue;
    cumulativeCoMarketingPool += coMarketingPool;

    let activeWeight = 0;
    const qualifiesLevel = [];
    for (let li = 0; li < 6; li += 1) {
      const key = LEVEL_KEYS[li];
      const eligible = li < nAllocLevels;
      const vol = grossRevenueByLevel[key];
      const qualifies = eligible && vol > 1e-9;
      qualifiesLevel[li] = qualifies;
      if (qualifies) activeWeight += CO_MARKETING_TIER_WEIGHTS[li];
    }

    const qualifiedPayoutsByLevel = emptyLevelRecord();
    let distributedCoMarketing = 0;
    if (activeWeight > 0) {
      for (let li = 0; li < 6; li += 1) {
        const key = LEVEL_KEYS[li];
        const claim = qualifiesLevel[li]
          ? distributableCoMarketingPool *
            (CO_MARKETING_TIER_WEIGHTS[li] / activeWeight)
          : 0;
        qualifiedPayoutsByLevel[key] = claim;
        distributedCoMarketing += claim;
      }
    }

    const level0VmbSalonsPayout =
      activeWeight > 0 ? 0 : distributableCoMarketingPool;

    cumulativeDistributedCoMarketing += distributedCoMarketing;
    cumulativeLevel0VmbSalons += level0VmbSalonsPayout;

    const cumulativeClientsPrev =
      monthlyRows.length ?
        monthlyRows[monthlyRows.length - 1].cumulativeClients
      : 0;
    const cumulativeClients = cumulativeClientsPrev + newClients;

    const cumulativeRevenuePrev =
      monthlyRows.length ?
        monthlyRows[monthlyRows.length - 1].cumulativeRevenue
      : 0;
    const cumulativeRevenue = cumulativeRevenuePrev + totalGrossRevenue;

    monthlyRows.push({
      month: m,
      activeSalons,
      newSalons: totalNewSalons,
      newSalonsSalonDriven: salonRounded,
      newSalonsClientDriven: clientRounded,
      newClients,
      repeatClients: repeatClientsTotal,
      grossClientVolume,
      activeClients,
      directClients: newClientsByLevel.level1,
      invitedClientsByLevel,
      newClientsByLevel,
      repeatClientsByLevel,
      activeClientsByLevel,
      grossRevenueByLevel,
      totalGrossRevenue,
      vmbRetainedRevenue,
      coMarketingPool,
      bonusPoolDollars,
      distributableCoMarketingPool,
      qualifiedPayoutsByLevel,
      distributedCoMarketing,
      level0VmbSalonsPayout,
      cumulativeClients,
      cumulativeRevenue,
      cumulativeVmbRetainedRevenue,
      cumulativeCoMarketingPool,
      cumulativeDistributedCoMarketing,
    });

    previousReconciledActiveSalons = activeSalons;
    priorActiveClients = activeClients;
  }

  const last = monthlyRows[monthlyRows.length - 1];
  const summary = {
    endingSalons: last?.activeSalons ?? startingSalons,
    endingActiveClients: last?.activeClients ?? 0,
    cumulativeClients: last?.cumulativeClients ?? 0,
    cumulativeRevenue: last?.cumulativeRevenue ?? 0,
    cumulativeVmbRetainedRevenue,
    cumulativeCoMarketingPool,
    cumulativeDistributedCoMarketing,
    cumulativeLevel0VmbSalons,
  };

  return { monthlyRows, summary };
}

function clamp01(x) {
  if (Number.isNaN(x)) return 0;
  return Math.min(1, Math.max(0, x));
}

/** Percent input (e.g. 2 for 2%) → fraction; `fallback` if missing */
function pctToFraction(v, fallback) {
  const n = Number(v);
  if (Number.isNaN(n)) return clamp01(fallback / 100);
  const frac = n > 1 ? n / 100 : n;
  return clamp01(frac);
}
