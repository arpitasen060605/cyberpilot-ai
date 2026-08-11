import chromadb
import os

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="threat_intel")

documents_folder = "documents"

for filename in os.listdir(documents_folder):
    if filename.endswith(".txt"):
        filepath = os.path.join(documents_folder, filename)

        with open(filepath, "r", encoding="utf-8") as f :
            content = f.read()

        doc_id = filename.replace(".txt", "")

        collection.add(
            documents= [content],
            ids= [doc_id]
        )
        print(f"Ingested: {filename}")

print("Ingestion Complete.")