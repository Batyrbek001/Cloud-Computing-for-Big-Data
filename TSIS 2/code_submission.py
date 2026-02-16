from decimal import Decimal
import logging

# Global list to simulate Database for idempotency check
PROCESSED_IDS = ["uuid-001", "uuid-002"]

class PaymentProcessor:
    """
    Handles payment settlements. 
    """

    def execute_settlement(self, payload: dict):
        # BUG 1: Missing Idempotency check (transaction_id in PROCESSED_IDS)
        # BUG 2: Using float instead of Decimal for financial data (precision loss)
        
        tx_id = payload.get('transaction_id')
        amount = float(payload.get('amount', 0)) 
        currency = payload.get('currency')
        src = payload.get('source_account')
        dst = payload.get('destination_account')

        # BUG 3: SQL Injection vulnerability (direct interpolation)
        query = f"INSERT INTO logs (tx, acc) VALUES ('{tx_id}', '{src}')"
        
        # BUG 4: Missing Business Logic (no 0.50 USD fee applied)
        # BUG 5: Missing PII Masking (accounts are exposed in plain text)
        
        try:
            print(f"Executing query: {query}")
            result = {
                "tx_id": tx_id,
                "final_amount": amount,
                "status": "PROCESSED",
                "vault_data": f"SRC:{src}|DST:{dst}" 
            }
            return result
        except Exception as e:
            # BUG 6: Generic logging without [ERR-XXX] codes
            logging.error(f"Something went wrong: {e}")
            return {"error": str(e)}
        # BUG 7: Missing 'finally' block for resource cleanup