# CyberPilot AI 

An AI-powered SOC analyst assistant, turns raw threat data into clear, actionable reports using Gemini + RAG.

 **Live demo:** [cyberpilot-ai.vercel.app](https://cyberpilot-ai.vercel.app)
 **API docs:** [cyberpilot-ai.onrender.com/docs](https://cyberpilot-ai.onrender.com/docs)

## Features

-**IOC Investigation**: merges VirusTotal + AbuseIPDB data into one AI-generated verdict
-**CVE Explainer**: plain-English breakdowns of NVD vulnerability data
-**Log Investigation**: upload a log, get a full incident report with MITRE ATT&CK mapping
-**Threat Intel Chat**: RAG-powered Q&A grounded in ingested documents (no hallucinated answers)
-**PDF Reports**: one-click incident report export
-**Dashboard**: live stats from investigation history

## Tech Stack

-**Frontend:** React (Vite), Tailwind, React Router, Recharts
-**Backend:** FastAPI, Python
-**AI:** Gemini API, ChromaDB, Sentence Transformers
-**Database:** MongoDB Atlas
-**Deployed on:** Vercel (frontend) , Render (backend)


