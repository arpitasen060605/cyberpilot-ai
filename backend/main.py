from fastapi import FastAPI
from dotenv import load_dotenv
from google import genai
import requests
import os

load_dotenv()  

VT_API_KEY = os.getenv("VT_API_KEY")
app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/investigate/ip/{ip_address}")
def investigate_ip(ip_address: str):
    headers = {
        "x-apikey": VT_API_KEY
    }
    url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip_address}"
    vt_response = requests.get(url, headers=headers)
    vt_data = vt_response.json()

    ai_summary = get_ai_summary(vt_data)
    return {"raw_data": vt_data, "ai_summary": ai_summary}


def get_ai_summary(vt_data):
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=GEMINI_API_KEY)
    prompt= f"""You are a SOC assistant. Given this VirusTotal data, provide a verdict, a confidence score, key reasons, and recommanded action.
    VirusTotal data: {vt_data}"""
    response = client.models.generate_content(
        model= "gemini-3.5-flash",
        contents= prompt
    )
    return response.text
