from fastapi import FastAPI
from dotenv import load_dotenv
import requests
import os

load_dotenv()  # reads .env and loads variables into environment

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
    response = requests.get(url, headers=headers)
    return response.json()