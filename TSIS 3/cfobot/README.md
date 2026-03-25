# CFO Bot: Almaty RE Price Predictor

A highly reactive, deterministic **Cloud Cost Calculator** engineered for precise estimation of infrastructure burn rates. Designed specifically for an ML-driven Real Estate Pricing API, it allows technical founders and CFOs to model their monthly expenditure and long-term Total Cost of Ownership (TCO) across varying user-demand thresholds.

---

## Production URL
* https://cfo-bot-re-price-predictor.web.app/

---

## What It Gives (Features)
* **Deterministic Pricing Logic:** Connects abstract cloud requirements directly to raw, verifiable mathematics encompassing Compute, Hosting, Database, and Bandwidth.
* **ML Inference Multipliers:** Instantly toggles cost models based on the algorithmic complexity (e.g., Linear Baselines vs. Deep Neural Networks vs. Custom Transformers).
* **Zero-Latency Reactive UI:** Hand-crafted using premium Tailwind CSS v4 featuring deep-space glassmorphism, responsive sliders, and real-time numeric rendering.
* **Strategy PDF Synthesis:** Ships with an embedded export mechanism utilizing `jsPDF` to instantly convert financial projections into a downloadable "Cloud Strategy Pricing Report".
* **Compounded TCO Generation:** Projects a 12-month financial trajectory incorporating an interactive compounding data-volume growth rate ($g$).

## What It Takes (Architecture & Stack)
This application was rapidly developed under a strict **Spec-Driven Development (SDD)** paradigm.
* **Frontend:** React 19 + TypeScript (Scaffolded with Vite)
* **Styling:** Tailwind CSS v4 (Native PostCSS integration)
* **Testing:** `vitest` (100% strict adherence to the project SSOT and mathematical unit logic)
* **Icons:** `lucide-react`
* **Infrastructure Target:** Google Firebase Hosting

---

## Running the CFO Bot Locally

### Setup
Clone the repository, then install dependencies:
```bash
npm install
```

### Development Server
Run the local dev server with HMR:
```bash
npm run dev
```

### Mathematical Verification
Verify the deterministic math models against the Test Specifications (designed via SDD):
```bash
npx vitest run
```

### Production Build & Deployment
For a finalized asset bundle ready to serve on Firebase:
```bash
npm run build
npx firebase-tools deploy --only hosting
```

---
*Built via Google Antigravity Spec-Driven Development (SDD).*