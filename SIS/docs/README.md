# AuraAudit SME - AI Integrated Financial Auditor

AuraAudit SME is a functional AI tool designed for SMEs and B2B clients in Almaty, Kazakhstan. It automates the extraction and auditing of financial invoices (ЭСФ) for tax compliance.

## ✨ Features
- **Agentic Vision Extraction**: Uses AI to parse diverse invoice layouts without templates.
- **Kazakhstani Compliance Engine**:
    - Validates 12-digit BIN/IIN formats.
    - Recalculates VAT (12%) and Total integrity.
- **Premium FinTech UI**: Modern Streamlit interface with dark mode and real-time monitoring.
- **IT4IT Lifecycle Integrated**: Built specifically to meet Strategy-to-Portfolio and Detect-to-Correct goals.

## 🚀 How to Run

1. **Clone the repository** (or navigate to the project folder).
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Launch the Application**:
   ```bash
   streamlit run app.py
   ```
4. **Use the Tool**:
   - Upload an invoice image/PDF or use the **"Demo Simulation"** checkbox to see the AI in action.
   - Click **"Run AI Audit"**.
   - Review the results and download the Audit PDF.

## 🛠️ Tech Stack
- **Frontend**: Streamlit
- **Logic**: Python 3.x
- **OCR/Extraction**: Gemini/GPT-4o Vision Prompting (Simulated in local demo mode)
- **Styling**: Vanilla CSS

---

