import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Error: GOOGLE_API_KEY not found in .env")
    exit()

# Configuration with explicit stable v1 version
genai.configure(api_key=api_key, transport='rest')

class HalykDiscoverySmart:
    def __init__(self):
        self.model_name = None
        self.model = None
        self.chat_history = []
        self.find_working_model()

    def find_working_model(self):
        """Automated search for available models for your API key"""
        print("Searching for available models...")
        try:
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            
            # Priority selection
            priorities = ['models/gemini-1.5-flash', 'models/gemini-1.5-pro', 'models/gemini-pro']
            
            for p in priorities:
                if p in available_models:
                    self.model_name = p
                    break
            
            if not self.model_name and available_models:
                self.model_name = available_models[0]
            
            if self.model_name:
                print(f"Using model: {self.model_name}")
                self.model = genai.GenerativeModel(self.model_name)
            else:
                raise Exception("No available models found.")
        except Exception as e:
            print(f"Error finding models: {e}")
            exit()

    def start_session(self):
        print(f"\n{'='*50}")
        print(f" Halyk Bank Discovery (Smart Mode)")
        print(f"{'='*50}\n")

        print("PM: What internal process or problem at Halyk Bank are we auditing today?")
        user_input = input("You: ")
        self.chat_history.append(f"User: {user_input}")

        for i in range(1, 6):
            # Instructing the AI to stay in English
            prompt = (
                f"Identify as a Senior Product Manager at Halyk Bank. User problem: '{user_input}'. "
                f"Ask one short, professional 'Why' question in English to uncover the root cause. "
                f"This is step {i} of 5 in a '5 Whys' deep dive."
            )
            
            try:
                response = self.model.generate_content(prompt)
                question = response.text.strip()
                
                print(f"\nPM (Why {i}): {question}")
                user_input = input("You: ")
                self.chat_history.append(f"PM: {question}\nUser: {user_input}")
            except Exception as e:
                print(f"Error during interview: {e}")
                break

    def save_prd(self):
        if not self.chat_history: 
            print("No data collected to generate PRD.")
            return

        print("\n--- Generating PRD ---")
        transcript = "\n".join(self.chat_history)
        
        # Explicitly asking for English Markdown output
        prd_prompt = (
            f"Based on the following interview transcript:\n{transcript}\n\n"
            "Write a comprehensive professional Product Requirements Document (PRD) for Halyk Bank. "
            "The output must be strictly in English and formatted in Markdown. "
            "Include these sections: 1. Executive Summary, 2. Problem Statement, "
            "3. Root Cause Analysis (5 Whys Results), 4. User Personas, 5. Success Metrics (KPIs)."
        )
        
        try:
            response = self.model.generate_content(prd_prompt)
            with open("Halyk_Discovery_PRD.md", "w", encoding="utf-8") as f:
                f.write(response.text)
            print("Success! File 'Halyk_Discovery_PRD.md' has been created.")
        except Exception as e:
            print(f"Error saving PRD: {e}")

if __name__ == "__main__":
    bot = HalykDiscoverySmart()
    bot.start_session()
    bot.save_prd()