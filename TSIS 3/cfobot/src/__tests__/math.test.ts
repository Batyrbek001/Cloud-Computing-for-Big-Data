import { describe, test, expect } from "vitest";
import {
  calculateBaseComputeCost,
  calculateHostingCost,
  calculateDbCost,
  calculateBandwidthCost,
  calculateMonthlyTotal,
  calculateTCO,
} from "../core/math";

describe("1. Inference Engine Cost Calculation", () => {
  test("Baseline Small", () => {
    const cost = calculateBaseComputeCost(1000000, "baseline");
    // (1 * 1.00 * 0.5) = $0.50
    expect(cost).toBeCloseTo(0.5, 2);
  });

  test("Standard High Load", () => {
    const cost = calculateBaseComputeCost(10000000, "xgboost");
    // (10 * 5.00 * 1.0) = $50.00
    expect(cost).toBeCloseTo(50.0, 2);
  });

  test("Premium Small", () => {
    const cost = calculateBaseComputeCost(500000, "transformer");
    // (0.5 * 25.00 * 4.0) = $50.00
    expect(cost).toBeCloseTo(50.0, 2);
  });
});

describe("2. Infrastructure Hosting Cost (H)", () => {
  test("Serverless Free", () => {
    const cost = calculateHostingCost(99000, "serverless");
    expect(cost).toBeCloseTo(0.0, 2);
  });

  test("Serverless Scale", () => {
    const cost = calculateHostingCost(2000000, "serverless");
    // 2M calls = $0.80. GB-s: (0.2 * 2M) * 0.000024 = $9.60. Total: $10.40
    expect(cost).toBeCloseTo(10.4, 2);
  });

  test("VPS Fixed", () => {
    const cost = calculateHostingCost(10000000, "vps");
    expect(cost).toBeCloseTo(7.8, 2);
  });

  test("Azure Fixed", () => {
    const cost = calculateHostingCost(5000000, "azure");
    expect(cost).toBeCloseTo(7.5, 2);
  });
});

describe("3. Database Cost", () => {
  test("SME Tier", () => {
    expect(calculateDbCost("sme")).toBeCloseTo(15.0, 2);
  });

  test("Enterprise Tier", () => {
    expect(calculateDbCost("enterprise")).toBeCloseTo(150.0, 2);
  });
});

describe("4. Bandwidth Cost (BW)", () => {
  test("Under Free Tier limit", () => {
    // 100,000 requests * 10KB = ~0.95GB
    const cost = calculateBandwidthCost(100000);
    expect(cost).toBeCloseTo(0.0, 2);
  });

  test("Above Free Tier limit", () => {
    // 2,000,000 requests * 10KB = ~19.07GB
    // Expected BW cost: (19.07 - 10) * 0.08 = 9.07 * 0.08 = 0.7256 -> ~$0.73
    const cost = calculateBandwidthCost(2000000);
    expect(cost).toBeCloseTo(0.73, 2);
  });
});

describe("5. End-to-End Monthly Cost and TCO Calculation", () => {
  test("Total Monthly orchestration", () => {
    const breakdown = calculateMonthlyTotal(1000000, "xgboost", "vps", "sme");
    // compute: (1M/1M)*5.0*1.0 = 5
    // hosting: vps = 7.8
    // bandwidth: 1M * 10KB = ~9.5MB -> 0.0 GB billed (free tier) = 0
    // db: sme = 15
    // total: 5 + 7.8 + 0 + 15 = 27.8
    expect(breakdown.totalMonthly).toBeCloseTo(27.8, 2);
  });

  test("TCO calculation over 3 months with 5% growth", () => {
    // Month 1: 100
    // Month 2: 105
    // Month 3: 110.25
    // Total: 315.25
    const tco = calculateTCO(100.0, 5, 3);
    expect(tco).toBeCloseTo(315.25, 2);
  });
});
