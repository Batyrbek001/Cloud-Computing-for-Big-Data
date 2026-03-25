# CFO Bot - Cloud Pricing Strategy Document

## 1. Executive Summary
This strategy document outlines the cloud cost dynamics and deterministic unit economics for the **Almaty Real Estate Price Predictor** (CFO Bot application). Based on our SDD implementation, we have defined a flexible infrastructure architecture that balances computing requirements against variable market demands.

## 2. Infrastructure Analysis & Unit Economics
Our analysis maps cloud pricing models to expected ML workloads using the following verified metrics:

### ML Inference Engine Selection
The required computing power directly impacts the pricing multiplier. For the initial rollout, we recommend either:
- **XGBoost Regressor (Standard, 1.0x):** A cost-effective balance of accuracy and price ($5.00 per 1M tokens), ideal for standard real estate predictions.
- **Neural Network v2 (2.5x):** Requires a higher baseline budget ($30 per 1M tokens) but may be necessary for advanced market anomaly detection.

### Serverless vs. Fixed Hosting ($H$)
**Google Cloud Run (Serverless):** 
Provides an excellent entry point due to the generous free tier (0 cost up to 100,000 monthly evaluation requests). Cost scales deterministically at `$0.40 per 1M calls` plus `$0.000024 per GB-second`. Assuming an optimized 0.2 GB-sec execution per request, Serverless limits financial risk during the Minimum Viable Product (MVP) stage.

**Local VPS / Azure B1s (Fixed):**
At ~$7.50 to $7.80 per month, fixed hosting is strategic if monthly requests predictably exceed 2M evaluations, ensuring predictable burn rates over serverless volatility.

## 3. Recommended Architecture Strategy
Based on the unit economics simulated by the CFO Bot:
1. **MVP Stage (Months 1-3):** 
   * **Compute:** Serverless
   * **Database:** SME Tier ($15/mo)
   * **Rationale:** Maximizes free tier usage during low initial traffic. Bandwidth (>$10$GB) costs will be negligible ($0).
2. **Growth Stage (Months 4-12):** 
   * Transition to Fixed VPS ($7.80) to cap infrastructure costs as requests grow organically at assumed 5% to 15% monthly compounding rates.
   * Shift Database to Enterprise Tier ($150/mo) only when data volume surpasses the 50,000 historic Almaty property listings threshold.

## 4. Cost Projection (TCO)
Assuming a launch phase of 1,000,000 monthly requests on XGBoost + VPS + SME DB, the initial operating expenditure is **$27.80/month**. 
Modeling a 5% monthly data/request growth over a 12-month period produces a Total Cost of Ownership (TCO) of **$442.50**. This verifies the financial feasibility of the tech stack for scalable SaaS deployment in the local PropTech market.
