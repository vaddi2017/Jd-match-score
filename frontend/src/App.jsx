import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📄 Handle file upload (PDF, DOCX, TXT)
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const extension = file.name.split(".").pop().toLowerCase();

    try {
      if (extension === "txt") {
        const text = await file.text();
        if (type === "resume") setResume(text);
        else setJd(text);
      } else if (extension === "pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((s) => s.str).join(" ") + "\n";
        }
        if (type === "resume") setResume(text);
        else setJd(text);
      } else if (extension === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (type === "resume") setResume(result.value);
        else setJd(result.value);
      } else {
        alert("Unsupported file type. Please upload .txt, .pdf, or .docx");
      }
    } catch (error) {
      console.error("❌ File read error:", error);
      alert("Error reading file. Try again with a valid document.");
    }
  };

  // 🧠 Backend connection
  const handleSubmit = async () => {
    if (!resume || !jd) {
      alert("Please enter both Resume and Job Description");
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("resume_text", resume);
      formData.append("jd_text", jd);

      // ⚙️ Change to your Render backend URL in production
      const response = await axios.post("http://localhost:8000/match", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setResult(response.data);
    } catch (error) {
      console.error("⚠️ Backend connection failed:", error);
      alert("Error connecting to backend. Ensure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-animated flex flex-col items-center p-8 relative overflow-hidden">
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-blue-50 to-slate-100 animate-gradient opacity-90"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-bold text-slate-800 drop-shadow-md"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Pavan JD Analyzer
        </motion.h1>
        <p className="text-slate-600 mt-4 text-lg md:text-xl font-medium">
          Upload your Resume & Job Description — Get instant AI-powered match insights.
        </p>
      </div>

      {/* Input Boxes */}
      <div className="relative z-10 flex flex-col md:flex-row justify-center items-start gap-12 w-full max-w-6xl">
        {/* Resume Box */}
        <div className="flex flex-col w-full md:w-1/2 space-y-4 glass-box">
          <h2 className="text-xl font-semibold text-slate-700">Upload or Paste Resume</h2>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileUpload(e, "resume")}
            className="border border-gray-300 rounded-md p-2 text-sm cursor-pointer bg-white/70 hover:bg-white transition"
          />
          <textarea
            placeholder="Or paste resume text below..."
            className="h-[400px] p-6 text-md rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 text-gray-800 placeholder-gray-500 shadow-inner resize-none focus:ring-2 focus:ring-cyan-300"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        {/* JD Box */}
        <div className="flex flex-col w-full md:w-1/2 space-y-4 glass-box">
          <h2 className="text-xl font-semibold text-slate-700">Upload or Paste Job Description</h2>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileUpload(e, "jd")}
            className="border border-gray-300 rounded-md p-2 text-sm cursor-pointer bg-white/70 hover:bg-white transition"
          />
          <textarea
            placeholder="Or paste job description below..."
            className="h-[400px] p-6 text-md rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 text-gray-800 placeholder-gray-500 shadow-inner resize-none focus:ring-2 focus:ring-cyan-300"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </div>
      </div>

      {/* Analyze Button */}
      <div className="relative z-10 flex justify-center w-full mt-16">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className={`w-[240px] h-[65px] text-xl font-semibold rounded-full transition-all duration-300 flex items-center justify-center ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Match"}
        </motion.button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 glass-box mt-16 w-full max-w-5xl p-10 text-gray-700"
        >
          <h2 className="text-3xl font-bold text-cyan-700 mb-4">Match Score</h2>

          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.match_score}%` }}
              transition={{ duration: 1 }}
              className={`h-6 rounded-full ${
                result.match_score >= 75
                  ? "bg-green-500"
                  : result.match_score >= 50
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            ></motion.div>
          </div>

          <p className="text-gray-600 mb-4">
            {result.match_score
              ? `${result.match_score.toFixed(1)}% overall alignment`
              : "No match score available"}
          </p>

          <p>
            <strong className="text-blue-500">✅ Resume Skills:</strong>{" "}
            {result.resume_skills.length ? result.resume_skills.join(", ") : "No skills detected"}
          </p>
          <p className="mt-2">
            <strong className="text-yellow-500">⚠️ Missing Skills:</strong>{" "}
            {result.missing_skills.length ? result.missing_skills.join(", ") : "None 🎉"}
          </p>
          <p className="italic text-gray-500 mt-4">
            💡 {result.explanation || "Analysis completed successfully."}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default App;
