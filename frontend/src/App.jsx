import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

      const response = await axios.post("http://127.0.0.1:8000/match", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-grid min-h-screen flex flex-col justify-center items-center text-white px-10 relative overflow-hidden">
      
      

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-7xl md:text-8xl font-bold mt-24 mb-16 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]"
        style={{ fontFamily: '"Times New Roman", serif' }}
      >
        Pavan JD Analyzer
      </motion.h1>

      {/* Boxes Row */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-16 w-full max-w-6xl mb-24">
        {/* Resume */}
        <div className="flex flex-col w-full md:w-1/2 space-y-4">
          <label className="text-3xl font-semibold text-gray-300">
            <h2>Resume</h2>
          </label>
          <textarea
            placeholder="Paste your Resume text here..."
            className="h-[500px] p-8 text-2xl rounded-2xl bg-[#111827]/90 border border-gray-700 
                       text-white placeholder-gray-400 outline-none focus:ring-4 focus:ring-blue-500 
                       resize-none shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        {/* JD */}
        <div className="flex flex-col w-full md:w-1/2 space-y-4 mb-40">
          <label className="text-3xl font-semibold text-gray-300">
            <h2>Job Description</h2>
          </label>
          <textarea
            placeholder="Paste the Job Description here..."
            className="h-[500px] p-8 text-2xl rounded-2xl bg-[#111827]/90 border border-gray-700 
                       text-white placeholder-gray-400 outline-none focus:ring-4 focus:ring-cyan-400 
                       resize-none shadow-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center w-full mt-[80px] mb-24">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className={`w-[250px] h-[80px] text-6xl font-extrabold leading-none tracking-wide rounded-full 
                     transition-all duration-300 flex items-center justify-center ${
            loading
              ? "bg-gray-600 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 text-white hover:text-glow-pulse"
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
          className="bg-[#111827]/90 border border-gray-700 rounded-3xl p-10 mt-14 shadow-2xl 
                     w-full max-w-5xl text-left text-2xl"
        >
          <h2 className="text-4xl font-bold text-cyan-300 mb-5">Match Score</h2>
          <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.match_score}%` }}
              transition={{ duration: 1 }}
              className={`h-6 rounded-full ${
                result.match_score >= 75
                  ? "bg-green-500"
                  : result.match_score >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            ></motion.div>
          </div>
          <p className="text-lg mt-2 text-gray-300">
            {result.match_score.toFixed(1)}% overall alignment
          </p>

          <div className="space-y-4 mt-5">
            <p>
              <strong className="text-blue-400">✅ Resume Skills:</strong>{" "}
              <span className="text-gray-300">{result.resume_skills.join(", ")}</span>
            </p>
            <p>
              <strong className="text-yellow-400">⚠️ Missing Skills:</strong>{" "}
              <span className="text-gray-300">
                {result.missing_skills.length ? result.missing_skills.join(", ") : "None 🎉"}
              </span>
            </p>
            <p className="text-gray-400 italic mt-3">💡 {result.explanation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
