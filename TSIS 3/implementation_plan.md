# CFO Bot (Almaty RE Price Predictor) Implementation Plan

## Goal Description
Build a "CFO Bot", a deterministically accurate web-based calculator that estimates monthly cloud costs (and long term TCO) of an ML-driven API. It will use the exact parameters set in the SSOT, calculate $C_{mo}$, and provide a jsPDF-based pricing strategy report.

> **Mathematical & Logic Assumptions:**
> 1. **Serverless Costs:** For Google Cloud Run / Firebase "Pay-as-you-go" ($0.000024/GB-s + $0.40/1M calls), we need to estimate compute time per request. We will assume an average execution of **0.2 GB-seconds per request**. If requests $\leq 100,000$, both cost components are $0.
> 2. **Bandwidth:** The SSOT charges for BW > 10GB ($0.08/GB). To link BW to requests, we will assume each request consumes **10KB of bandwidth**. Therefore, $BW (in\_GB) = Req \times 10 / 1024 / 1024$.
> 


## Proposed Changes

### Configuration & Base Setup
Initialize Vite React Project with TailwindCSS.
####  `package.json`
Dependencies: `react`, `react-dom`, `jspdf`, `tailwindcss`, `vitest`

### Core Math Logic
Isolated mathematical models.
####  `src/core/math.ts`
Exports pure functions:
- `calculateBaseComputeCost(requests, model)`: Computes base token cost with multiplier
- `calculateHostingCost(requests, infrastructure)`: Resolves fixed or serverless tier costs
- `calculateBandwidthCost(requests)`: Resolves 10GB free tier and $0.08 overflow
- `calculateMonthlyTotal(opts)`: Orchestrates the calculation of $C_{mo}$
- `calculateTCO(monthlyCost, growthRate, months)`: Calculates geometrically growing total cost over 12, 24, 36 months

### UI Components
Pure functional UI components following the "Almaty Tech Aesthetic".
####  `src/App.tsx`
Main Layout (Monochrome + Accent Blue `#007AFF`). Follows structure: Top (Selects), Center (Sliders), Bottom (Results).
####  `src/components/StrategyExportButton.tsx`
Uses `jspdf` to capture the current state and generate "Strategy Report".

## Verification Plan

### Automated Tests
- Run unit tests via Vitest against `src/core/math.ts` utilizing the **Test Specifications** to ensure mathematical correctness mapping to the SSOT.

### Manual Verification
- Verify slider latency (must be zero latency).
- Export a sample PDF and verify structure.
- Deploy to Firebase Hosting and ensure public access.
