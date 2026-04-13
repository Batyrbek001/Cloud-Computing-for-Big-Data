import re
import json
from fpdf import FPDF
import datetime

class AuditorEngine:
    """
    Main Logic Engine for AuraAudit SME.
    Handles data extraction (simulated/AI) and compliance validation.
    """

    @staticmethod
    def validate_bin(bin_code):
        """
        Validates the Kazakhstani BIN/IIN (12 digits).
        """
        if not bin_code:
            return False, "Missing BIN"
        
        # Clean the BIN (remove spaces/dashes)
        clean_bin = re.sub(r'[^0-9]', '', str(bin_code))
        
        if len(clean_bin) != 12:
            return False, f"Invalid length: {len(clean_bin)} (Expected 12)"
        
        # In a real scenario, we would check the checksum or query a local DB
        # For this prototype, we check formatting and length.
        return True, "Valid Format"

    @staticmethod
    def validate_vat(subtotal, vat_amount, total):
        """
        Checks if the VAT is correctly calculated (12% in KZ).
        """
        expected_vat = round(subtotal * 0.12, 2)
        expected_total = round(subtotal + vat_amount, 2)

        discrepancies = []
        
        if abs(expected_vat - vat_amount) > 1.0:
            discrepancies.append(f"VAT Mismatch: Found {vat_amount}, Expected ~{expected_vat} (12%)")
        
        if abs(expected_total - total) > 1.0:
            discrepancies.append(f"Total Mismatch: Found {total}, Expected {expected_total}")

        if not discrepancies:
            return True, "Calculation Correct"
        return False, "; ".join(discrepancies)

    def process_invoice_extraction(self, file_content, is_demo=True):
        """
        Simulates AI-powered extraction from an invoice image/PDF.
        In production, this would use a vision-capable LLM.
        """
        if is_demo:
            # Mocked successful extraction
            return {
                "invoice_number": "ЭСФ-2024-00123",
                "date": "2024-04-12",
                "seller_name": "LLP 'Almaty Tech Solutions'",
                "seller_bin": "123456789012",
                "buyer_name": "SME 'Global Trade'",
                "buyer_bin": "987654321098",
                "subtotal": 100000.00,
                "vat_amount": 12000.00,
                "total_amount": 112000.00,
                "currency": "KZT"
            }
        
        # Real AI extraction logic would go here
        # return call_llm_vision_api(file_content)
        return None

    def audit_invoice(self, data):
        """
        Performs the full audit on the extracted data.
        Returns a dictionary with status and details.
        """
        results = {
            "seller_bin_status": self.validate_bin(data.get("seller_bin")),
            "buyer_bin_status": self.validate_bin(data.get("buyer_bin")),
            "calculation_status": self.validate_vat(
                data.get("subtotal", 0), 
                data.get("vat_amount", 0), 
                data.get("total_amount", 0)
            ),
            "compliance_score": 0
        }
        
        # Calculate scores
        passed = [results["seller_bin_status"][0], results["buyer_bin_status"][0], results["calculation_status"][0]]
        results["compliance_score"] = int((sum(passed) / len(passed)) * 100)
        
        return results

    def generate_pdf_report(self, data, results):
        """
        Generates a professional PDF audit report with Cyrillic support.
        """
        pdf = FPDF()
        pdf.add_page()
        
        # Load System Font for Cyrillic support (Windows specific)
        # We set the font AFTER adding the page to ensure it's active for the cells.
        try:
            font_path = "C:\\Windows\\Fonts\\arial.ttf"
            pdf.add_font("ArialUni", "", font_path)
            pdf.set_font("ArialUni", size=12)
        except:
            # Fallback to standard font if system font is inaccessible
            pdf.set_font("Arial", size=12)

        # Sanitization helper to prevent crashes if font glyphs are missing
        def clean_text(text):
            return str(text).encode('utf-8', 'ignore').decode('utf-8')
        
        # Header
        pdf.cell(0, 10, "AuraAudit SME - Official Audit Report", 0, 1, 'C')
        pdf.set_font("ArialUni", '', 10)
        pdf.cell(0, 10, f"Date of Report: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 1, 'C')
        pdf.ln(10)
        
        # General Info
        pdf.set_font("ArialUni", '', 12)
        pdf.cell(0, 10, "1. Extraction Summary", 0, 1)
        pdf.set_font("ArialUni", '', 10)
        pdf.cell(0, 8, clean_text(f"Invoice Number: {data.get('invoice_number')}"), 0, 1)
        pdf.cell(0, 8, clean_text(f"Seller: {data.get('seller_name')} (BIN: {data.get('seller_bin')})"), 0, 1)
        pdf.cell(0, 8, clean_text(f"Buyer: {data.get('buyer_name')} (BIN: {data.get('buyer_bin')})"), 0, 1)
        pdf.ln(5)
        
        # Audit Results
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(0, 10, "2. Audit Findings", 0, 1)
        pdf.set_font("Arial", '', 10)
        
        s_bin, s_msg = results['seller_bin_status']
        pdf.cell(0, 8, f"Seller BIN Check: [{'PASS' if s_bin else 'FAIL'}] - {s_msg}", 0, 1)
        
        b_bin, b_msg = results['buyer_bin_status']
        pdf.cell(0, 8, f"Buyer BIN Check: [{'PASS' if b_bin else 'FAIL'}] - {b_msg}", 0, 1)
        
        c_val, c_msg = results['calculation_status']
        pdf.cell(0, 8, f"Financial Integrity: [{'PASS' if c_val else 'FAIL'}] - {c_msg}", 0, 1)
        
        pdf.ln(10)
        pdf.set_font("ArialUni", '', 14)
        pdf.cell(0, 10, f"TOTAL COMPLIANCE SCORE: {results['compliance_score']}%", 0, 1)
        
        return bytes(pdf.output())
