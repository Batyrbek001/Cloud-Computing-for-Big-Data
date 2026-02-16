# **AI Compliance Judge Agent (TSIS 2)** #


## **Project Overview** ##
This project implements an intelligent "Judge Agent" powered by Gemini AI. It is designed to perform automated audits of source code against a Product Requirements Document (PRD). The agent assumes the persona of a Senior Lead Architect, evaluating not just syntax, but also security, architectural integrity, and business logic.


## **Key Features** ##
* Deep Compliance Audit: Line-by-line comparison of code_submission.py against prd.txt requirements.
* Security Scanning: Detects critical vulnerabilities such as SQL Injection, PII leakage (lack of account masking), and financial precision errors (use of float instead of Decimal).
* Architectural Analysis: Evaluates idempotency checks, custom exception handling, and resource cleanup (finally blocks).
* Structured Output: Generates a standardized compliance_report.json with a final score (0-100) and detailed audit logs.


## **Technical Implementation** ##
The judge.py script utilizes the following stack:
* LLM Model: gemini-flash-latest (via Google Generative AI REST API).
* Logic: A strict system prompt (Persona) is used to enforce critical evaluation and prevent "AI hallucinations" or overly lenient scoring.
* Data Flow:
    1. Reads local source files.
    2. Transmits data via authenticated HTTP POST requests to the Gemini v1beta endpoint.
    3. Sanitizes and parses the raw AI response into a structured JSON format.


## **Installation & Usage** ##
1. Install dependencies:
    - pip install requests
2. Prepare files: Place prd.txt and code_submission.py in the same directory as the script.
3. Run the audit:
    - python judge.py

## **Compliance Report Structure** ##
The output compliance_report.json contains:
* compliance_score: A critical assessment (0-100).
* status: PASS/FAIL status based on architectural requirements.
* audit_log: Specific comments for every requirement met or missed.
* security_check: High-level status and a list of specific critical findings.