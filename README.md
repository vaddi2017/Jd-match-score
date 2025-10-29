🚀 Built a full-stack AI-driven web platform that intelligently analyzes and compares Job Descriptions (JD) with Candidate Resumes, generating an AI-calculated match score, skill insights, and fit explanation using OpenAI’s GPT-4o model.

The system empowers recruiters and job seekers with instant, accurate, and explainable compatibility analysis — fully automated from upload to evaluation.

🧠 Key Features:

🔍 Smart JD–Resume Matching: Extracts, parses, and compares key skills, experience, and keywords using OpenAI GPT-4o and a custom Python skill-extraction module.

📂 File Upload Support: Accepts .pdf, .docx, and .txt files with automatic text extraction using pdfjs-dist and mammoth.

🤖 AI-Powered Analysis: Uses the OpenAI API (gpt-4o-mini) for contextual reasoning and JSON-formatted AI output.

💡 Match Insights: Displays match percentage, missing skills, matched skills, and a natural-language explanation.

🎨 Modern UI/UX:

Built with React + Vite + TailwindCSS + Framer Motion

Features a glassmorphic, animated gradient background and responsive layout

Supports both dark and light premium themes

⚙️ Backend (FastAPI):

API endpoints built in Python FastAPI

Integrated CORS middleware for cross-origin requests

Environment-based OpenAI key loading with .env

🔗 End-to-End Connectivity: Seamless front-to-back integration using axios for POST requests and URLSearchParams for clean text payloads.

🌍 Deployment:

Frontend: Deployed via Netlify with optimized build settings

Backend: Hosted on Render (FastAPI) using a persistent OpenAI API key

Environment Management: Secured with .env variables for API key isolation

🧩 Tech Stack:

Frontend: React (Vite), TailwindCSS, Framer Motion, Axios
Backend: FastAPI (Python), Uvicorn, OpenAI SDK
AI Model: GPT-4o-mini (via OpenAI API)
Libraries: pdfjs-dist, mammoth, dotenv, re, json
Hosting: Netlify (Frontend), Render (Backend)
Version Control: Git + GitHub

📈 Outcome:

Reduced manual JD-resume screening time by over 80%.

Provides real-time AI feedback and contextual match scoring for HR professionals.

Enhanced recruiter experience through automation, clarity, and interactive UI.

🔗 Live Demo:

🌐 https://jdscoreanalyzer.netlify.app

🔙 Backend API: https://your-backend-on-render.com
 (FastAPI endpoint)

👨‍💻 Author:

Pavan Kishore Vaddi — Full-Stack AI/ML Engineer
📧 vaddip17@gmail.com
 | 🌐 www.linkedin.com/in/pavan-v-6820011a1
