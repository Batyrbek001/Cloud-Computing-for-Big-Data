# Test Specifications (Math Engine)

This document serves as the verifiable blueprint to ensure the calculator's math is flawlessly accurate according to the SSOT. We will map these specifications to `vitest` test suites.

## 1. Inference Engine Cost Calculation
**Formula:** `Cost = (Req / 1,000,000) * Rate * Multiplier`

| Scenario | Model | Requests | Expected Base Cost |
|----------|-------|----------|--------------------|
| Baseline Small | Linear Baseline | 1,000,000 | (1 * 1.00 * 0.5) = $0.50 |
| Standard High Load | XGBoost | 10,000,000 | (10 * 5.00 * 1.0) = $50.00 |
| Premium Small | Custom Transformer | 500,000 | (0.5 * 25.00 * 4.0) = $50.00 |

## 2. Infrastructure Hosting Cost (H)
**Assumptions tested:** Serverless assumed 0.2 GB-sec per request.

| Scenario | Tier | Requests | Expected Cost (H) |
|----------|------|----------|-------------------|
| Serverless Free | Serverless | 99,000 | $0.00 (under 100k) |
| Serverless Scale | Serverless | 2,000,000 | 2M calls = $0.80. GB-s: (0.2 * 2M) * 0.000024 = $9.60. Total: $10.40 |
| VPS Fixed | Local VPS | 10,000,000 | $7.80 |
| Azure Fixed | Azure B1s | 5,000,00 | $7.50 |

## 3. Database Cost
Tested via straight mapping.
| Tier | Expected Cost |
|------|---------------|
| SME Tier | $15.00 |
| Enterprise Tier | $150.00 |

## 4. Bandwidth Cost (BW)
**Assumption:** 10KB per request. Free 10GB. $0.08 per extra GB.

| Requests | Bandwidth Used | Billed Amount | Expected Bandwidth Cost |
|----------|----------------|---------------|-------------------------|
| 100,000 | ~0.95 GB | 0 GB (Under 10GB) | $0.00 |
| 2,000,000| ~19.07 GB | 9.07 GB ($0.08 * 9.07)| $0.73 |

## 5. End-to-End TCO Calculation
Given $C_{mo} = \$100$ and $g = 5\%$ (0.05).
- Month 1: $100
- Month 2: $100 * 1.05 = $105
- Month 3: $105 * 1.05 = $110.25
- **TCO (3 months):** $315.25
