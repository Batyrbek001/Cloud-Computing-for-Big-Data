import os
import json
import requests

API_KEY = "AIzaSyB6p-X8vZIRlkKsPGrdmz5j4w7_UFrd4O0"

def run_judge_agent():
    try:
        with open('prd.txt', 'r', encoding='utf-8') as f:
            prd_content = f.read()
        with open('code_submission.py', 'r', encoding='utf-8') as f:
            code_content = f.read()
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"
    headers = {'Content-Type': 'application/json'}

    system_instruction = (
        "You are a Senior Lead Architect and Security Auditor. "
        "Your task is to evaluate code against a Product Requirements Document (PRD). "
        "STRICT COMPLIANCE RULES: "
        "1. Compare every single requirement in the PRD with the provided code. "
        "2. Audit for: Type safety (Decimal for currency), Security (SQL injection, PII masking), "
        "Business logic, Resiliency (finally blocks), and Professional standards. "
        "3. Output MUST be ONLY a valid JSON object. No prose or markdown. "
        "4. Scoring: 0-100. Critical security/financial issues MUST result in a score below 50."
    )

    user_prompt = f"""
    ### PRD REQUIREMENTS:
    {prd_content}

    ### CODE SUBMISSION:
    {code_content}

    Generate the Compliance Report:
    {{
      "compliance_score": 0-100,
      "status": "PASS/FAIL",
      "audit_log": [
        {{ "requirement": "string", "met": boolean, "comment": "string" }}
      ],
      "security_check": {{ "status": "Safe/Unsafe", "findings": [] }}
    }}
    """

    payload = {
        "contents": [
            {
                "parts": [{"text": f"{system_instruction}\n\n{user_prompt}"}]
            }
        ],
        "generationConfig": {
            "temperature": 0.1
        }
    }

    print("Running Senior Architect Compliance Audit (Model: gemini-flash-latest)...")

    try:
        response = requests.post(url, headers=headers, json=payload)
        res_json = response.json()

        if response.status_code != 200:
            print(f"API Error: {res_json.get('error', {}).get('message', 'Unknown error')}")
            return

        raw_text = res_json['candidates'][0]['content']['parts'][0]['text'].strip()
        
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()

        report_data = json.loads(raw_text)
        
        with open('compliance_report.json', 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=4, ensure_ascii=False)
        
        print("Audit Complete. Report saved to compliance_report.json")
        print(f"Final Score: {report_data.get('compliance_score')}/100")

    except Exception as e:
        print(f"Error during processing: {e}")

if __name__ == "__main__":
    run_judge_agent()