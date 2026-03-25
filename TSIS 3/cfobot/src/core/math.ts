export type ModelType = "baseline" | "xgboost" | "rf" | "nn" | "transformer";
export type InfraTier = "serverless" | "vps" | "azure";
export type DbTier = "sme" | "enterprise";

const MODEL_RATES: Record<ModelType, { baseRate: number; multiplier: number }> = {
  baseline: { baseRate: 1.0, multiplier: 0.5 },
  xgboost: { baseRate: 5.0, multiplier: 1.0 },
  rf: { baseRate: 6.5, multiplier: 1.2 },
  nn: { baseRate: 12.0, multiplier: 2.5 },
  transformer: { baseRate: 25.0, multiplier: 4.0 },
};

// Based on assumption derived from SSOT: 0.2 GB-sec per request
const SERVERLESS_COMPUTE_PER_REQ = 0.2; 
const SERVERLESS_COST_PER_GB_SEC = 0.000024;
const SERVERLESS_COST_PER_MILLION = 0.40;
const SERVERLESS_FREE_TIER_LIMIT = 100000;

const INFRA_FIXED_RATES: Record<Exclude<InfraTier, "serverless">, number> = {
  vps: 7.8,
  azure: 7.5,
};

const DB_RATES: Record<DbTier, number> = {
  sme: 15.0,
  enterprise: 150.0,
};

// SSOT Bandwidth Params
const FREE_BW_GB = 10.0;
const BW_PRICE_PER_GB = 0.08;
const BW_GB_PER_REQ = 10 / 1024 / 1024; // 10KB per request -> GB

export function calculateBaseComputeCost(requests: number, model: ModelType): number {
  const { baseRate, multiplier } = MODEL_RATES[model];
  return (requests / 1000000) * baseRate * multiplier;
}

export function calculateHostingCost(requests: number, infra: InfraTier): number {
  if (infra === "serverless") {
    if (requests <= SERVERLESS_FREE_TIER_LIMIT) return 0.0;
    
    const gbSeconds = requests * SERVERLESS_COMPUTE_PER_REQ;
    const gbSecCost = gbSeconds * SERVERLESS_COST_PER_GB_SEC;
    const callCost = (requests / 1000000) * SERVERLESS_COST_PER_MILLION;
    
    return gbSecCost + callCost;
  }
  return INFRA_FIXED_RATES[infra];
}

export function calculateBandwidthCost(requests: number): number {
  const gbUsed = requests * BW_GB_PER_REQ;
  if (gbUsed <= FREE_BW_GB) return 0.0;
  return (gbUsed - FREE_BW_GB) * BW_PRICE_PER_GB;
}

export function calculateDbCost(db: DbTier): number {
  return DB_RATES[db];
}

export interface CostBreakdown {
  computeCost: number;
  hostingCost: number;
  bandwidthCost: number;
  dbCost: number;
  totalMonthly: number;
}

export function calculateMonthlyTotal(
  requests: number,
  model: ModelType,
  infra: InfraTier,
  db: DbTier
): CostBreakdown {
  const computeCost = calculateBaseComputeCost(requests, model);
  const hostingCost = calculateHostingCost(requests, infra);
  const bandwidthCost = calculateBandwidthCost(requests);
  const dbCost = calculateDbCost(db);

  const totalMonthly = computeCost + hostingCost + bandwidthCost + dbCost;

  return {
    computeCost,
    hostingCost,
    bandwidthCost,
    dbCost,
    totalMonthly
  };
}

export function calculateTCO(monthlyCost: number, growthRatePct: number, months: number): number {
  let total = 0;
  let currentCost = monthlyCost;
  const multiplier = 1 + growthRatePct / 100;
  
  for (let i = 0; i < months; i++) {
    total += currentCost;
    currentCost *= multiplier;
  }
  
  return total;
}
