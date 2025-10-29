import os
import json
import re
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI
from app import skills

# Load environment variables
load_dotenv()
print("🔑 Loaded API Key (first 15 chars):", os.getenv("OPENAI_API_KEY")[:15])

# ✅ Initialize OpenAI client here
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize FastAPI app
app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "✅ FastAPI backend is running!"}

@app.post("/match")
def match_resume_jd(
    resume_text: str = Form(...),
    jd_text: str = Form(...)
):
    # Extract skills
    all_skills = skills.extract_skills(resume_text + " " + jd_text)
    matched = [s for s in all_skills if s in resume_text.lower() and s in jd_text.lower()]
    missing = [s for s in all_skills if s in jd_text.lower() and s not in resume_text.lower()]

    prompt = f"""
    You are an expert AI recruiter.
    Compare this Resume and Job Description and return the JSON result ONLY (no explanations):

    Resume:
    {resume_text}

    Job Description:
    {jd_text}

    Return JSON in this exact format:
    {{
      "match_score": number (0-100),
      "resume_skills": list of matched skills,
      "missing_skills": list of missing skills,
      "explanation": string (1-2 sentences about overall fit)
    }}
    """

    try:
        # ✅ Call OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        content = response.choices[0].message.content.strip()
        print("\n🧠 Raw LLM Output:\n", content)

        # Parse JSON cleanly
        match = re.search(r"\{.*\}", content, re.DOTALL)
        if match:
            data = json.loads(match.group(0))
        else:
            data = {}

        return {
            "match_score": data.get("match_score", 75),
            "resume_skills": data.get("resume_skills", matched),
            "missing_skills": data.get("missing_skills", missing),
            "explanation": data.get("explanation", "Automatic AI analysis completed."),
        }

    except Exception as e:
        print("❌ Error:", e)
        return {
            "match_score": 0,
            "resume_skills": [],
            "missing_skills": [],
            "explanation": f"Error: {str(e)}"
        }
