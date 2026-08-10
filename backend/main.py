from fastapi import FastAPI
from dotenv import load_dotenv
from google import genai
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

load_dotenv()  

VT_API_KEY = os.getenv("VT_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    abuse_data = check_abuseipdb(ip_address)

    combined_data = {
        "virustotal": vt_data,
        "abuseipdb": abuse_data
    }

    ai_summary = get_ai_summary(combined_data)
    return {"raw_data": combined_data, "ai_summary": ai_summary}

@app.get("/cve/{cve_id}")
def explain_cve(cve_id: str):
    cve_data = fetch_cve_data(cve_id)
    explanation = get_cve_explanation(cve_data)
    return {
        "raw_data": cve_data,
        "ai_explanation": explanation
    }

def get_ai_summary(vt_data):
    client = genai.Client(api_key=GEMINI_API_KEY)
    prompt= f"""You are a SOC assistant. Given this VirusTotal data, provide a verdict, a confidence score, key reasons, and recommanded action.
    VirusTotal data: {vt_data}"""
    response = client.models.generate_content(
        model= "gemini-3.5-flash",
        contents= prompt
    )
    return response.text

def check_abuseipdb(ip_address):
    ABUSEIPDB_API_KEY = os.getenv("ABUSEIPDB_API_KEY")
    headers= {
        "Key": ABUSEIPDB_API_KEY,
        "Accept": "application/json"
    }
    url = f"https://api.abuseipdb.com/api/v2/check"
    params = {
        "ipAddress": ip_address,
    }
    response = requests.get(url, headers= headers, params= params)
    return response.json()

def fetch_cve_data(cve_id):
    url = f"https://services.nvd.nist.gov/rest/json/cves/2.0"
    params = {
        "cveId": cve_id
    }
    response = requests.get(url, params=params)
    return response.json()

def get_cve_explanation(cve_data):
    prompt = f"""You are a security analyst assistant. You have given the CVE data from NVD, explain it clearly:
    1. What is it? (plain English summary)
    2. Who is affected? (products/versions)
    3. CVSS score and severity
    4. How attackers exploit it?
    5. How to mitigate it?

    CVE data: {cve_data}"""

    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )
    return response.text
