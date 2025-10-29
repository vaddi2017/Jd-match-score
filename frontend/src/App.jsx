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

  // 🧠 File Upload (PDF, DOCX, TXT)
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();

    try {
      // 📄 TXT FILE
      if (extension === "txt") {
        const text = await file.text();
        if (type === "resume") setResume(text);
        else setJd(text);
      }
      // 📘 PDF FILE
      else if (extension === "pdf") {
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
      }
      // 📝 DOCX FILE
      else if (extension === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (type === "resume") setResume(result.value);
        else setJd(result.value);
      } else {
        alert("Unsupported file type. Please upload .txt, .pdf, or .docx");
      }
    } catch (error) {
      console.error("❌ Error reading file:", error);
      alert("Error reading file. Please try again with a valid document.");
    }
  };

  // 🧩 Backend API Call
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

      const response = await axios.post("http://localhost:8000/match", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setResult(response.data);
    } catch (error) {
      console.error("⚠️ Backend connection failed:", error);
      alert("Error connecting to backend. Make sure FastAPI is running at http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50 flex flex-col items-center p-6">

      {/* ✨ Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold mb-12 text-slate-800 text-center"
        style={{ textShadow: "0 0 15px rgba(100,100,100,0.1)" }}
      >
        Pavan JD Analyzer
      </motion.h1>

      {/* 🧾 Input Boxes */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-12 w-full max-w-6xl mb-20">
        {/* Resume */}
        <div className="flex flex-col w-full md:w-1/2 space-y-4">
          <h2 className="text-xl font-semibold text-slate-700">Upload or Paste Resume</h2>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileUpload(e, "resume")}
            className="border border-gray-300 rounded-md p-2 text-sm cursor-pointer bg-white hover:bg-gray-50 transition"
          />
          <textarea
            placeholder="Or paste resume text below"
            className="h-[400px] p-6 text-md rounded-2xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 shadow-inner resize-none focus:ring-2 focus:ring-cyan-300"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        {/* JD */}
        <div className="flex flex-col w-full md:w-1/2 space-y-4">
          <h2 className="text-xl font-semibold text-slate-700">Upload or Paste Job Description</h2>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileUpload(e, "jd")}
            className="border border-gray-300 rounded-md p-2 text-sm cursor-pointer bg-white hover:bg-gray-50 transition"
          />
          <textarea
            placeholder="Or paste job description below"
            className="h-[400px] p-6 text-md rounded-2xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 shadow-inner resize-none focus:ring-2 focus:ring-cyan-300"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center w-full mt-10 mb-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className={`w-[240px] h-[65px] text-xl font-semibold rounded-full 
                     transition-all duration-300 flex items-center justify-center ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Match"}
        </motion.button>
      </div>

      {/* Result Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-gray-300 rounded-2xl p-10 mt-10 shadow-lg w-full max-w-5xl text-left text-gray-700"
        >
          <h2 className="text-3xl font-bold text-cyan-600 mb-4">Match Score</h2>

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
