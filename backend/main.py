from fastapi import FastAPI
from dotenv import load_dotenv
from google import genai
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
from fastapi.responses import FileResponse
from pymongo import MongoClient
from datetime import datetime
from fpdf import FPDF
import requests
import chromadb
import json
import os

load_dotenv()  

VT_API_KEY = os.getenv("VT_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")
mongo_client = MongoClient(MONGO_URI)
db= mongo_client["cyberpilot"]
investigations_collection = db["investigations"]
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name= "threat_intel")

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

    verdict= extract_verdict(ai_summary)

    investigations_collection.insert_one({
        "ip_address": ip_address,
        "ai_summary": ai_summary,
        "verdict": verdict,
        "timestamp": datetime.now().isoformat()
    })

    return {"raw_data": combined_data, "ai_summary": ai_summary}

@app.get("/cve/{cve_id}")
def explain_cve(cve_id: str):
    cve_data = fetch_cve_data(cve_id)
    explanation = get_cve_explanation(cve_data)
    return {
        "raw_data": cve_data,
        "ai_explanation": explanation
    }

@app.post("/investigate/log")
async def investigate_log(file:UploadFile = File(...)):
    contents = await file.read()   
    log_text = contents.decode("utf-8")
    analysis = get_log_analysis(log_text) 
    mitre_mapping = map_to_mitre(analysis)
    return {"log_analysis": analysis, "mitre_mapping": mitre_mapping}

@app.post("/chat")
def chat(question: str):
    results = collection.query(
        query_texts = [question],
        n_results = 2
    )
    retrieved_chunks = results["documents"][0]
    context = "\n\n".join(retrieved_chunks)

    prompt = f"""You are a threat intelligence assistant. Answer the user's question using ONLY the given context. If the context doesn't contain enough information to answer, say so honestly rather than guessing.
    Context: {context}
    Question: {question}"""

    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents= prompt
    )
    return {"answer": response.text, "source_used": results["ids"][0]}

@app.post("/chat/investigation")
def chat_investigation(investigation_context: str, question: str):
    prompt = f"""You are a SOC analyst assistant helping investigate this data:

    {investigation_context}

    Based on this investigation, answer the analyst's question: {question}"""

    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )
    return {"answer": response.text}

@app.post("/report/generate")
def generate_report(summary: str, mitre_mapping: str, recommendations: str):
    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, text="CyberPilot AI - Incident Report", ln=True)
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 10, text="Executive Summary", ln=True)
    pdf.set_font("Helvetica", size=11)
    pdf.multi_cell(0, 8, text=summary)
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 10, text="MITRE ATT&CK Mapping", ln=True)
    pdf.set_font("Helvetica", size=11)
    pdf.multi_cell(0, 8, text=mitre_mapping)
    pdf.ln(5)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 10, text="Recommended Actions", ln=True)
    pdf.set_font("Helvetica", size=11)
    pdf.multi_cell(0, 8, text=recommendations)

    pdf.output("report.pdf")

    return FileResponse("report.pdf", filename="incident_report.pdf")

@app.get("/investigations")
def get_investigations():
    results = list(investigations_collection.find({}, {"_id": 0}).sort("timestamp", -1))
    return {"investigations": results}

def get_log_analysis(log_text):
    client = genai.Client(api_key=GEMINI_API_KEY)
    prompt = f"""You are a SOC analyst. Provide a detailed analysis of the given log data, including suspicious events, timeline, attack type, severity, affected systems and recommended actions.
    Log data: {log_text}"""
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )
    return response.text


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

def map_to_mitre(investigation_text):
    with open("mitre_techniques.json", "r") as f:
        mitre_data = json.load(f)

    prompt = f"""You are a SOC analyst. Given this list of MITRE ATT&CK techniques and this investigation summary, identify which techniques (if any) apply. Only use technique IDs from the provided list — do not invent new ones.

    MITRE techniques: {mitre_data}

    Investigation summary: {investigation_text}"""

    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )
    return response.text

def extract_verdict(ai_summary):
    text = ai_summary.lower()
    if "malicious" in text and "benign" not in text[:200]:
        return "malicious"
    elif "suspicious" in text:
        return "suspicious"
    else:
        return "benign"    

@app.get("/stats")
def get_stats():
    total = investigations_collection.count_documents({})
    malicious = investigations_collection.count_documents({"verdict": "malicious"})
    suspicious = investigations_collection.count_documents({"verdict": "suspicious"})
    benign = investigations_collection.count_documents({"verdict": "benign"})

    return {
        "total_investigations": total,
        "malicious": malicious,
        "suspicious": suspicious,
        "benign": benign
    }




