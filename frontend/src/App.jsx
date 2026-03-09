import { useState } from "react";
import axios from "axios";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!resume) {
      setError("Please upload a resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_description", jobDescription);

      const response = await axios.post("http://127.0.0.1:8000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Something went wrong while analyzing the resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1>AI Resume Screening System</h1>
        <p className="subtitle">
          Upload a resume PDF and paste a job description to get an ATS-style score,
          matched skills, missing skills, and improvement suggestions.
        </p>

        <form className="card form-card" onSubmit={handleAnalyze}>
          <label className="label">Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="input-file"
          />

          <label className="label">Paste Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="textarea"
          />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        {error && (
          <div className="card error-card">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="results">
            <div className="card score-card">
              <h2>ATS Score</h2>
              <div className="big-score">{result.ats_score}%</div>
              <p>Semantic Match: {result.semantic_score}%</p>
            </div>

            <div className="grid">
              <div className="card">
                <h3>Matched Skills</h3>
                {result.matched_skills.length ? (
                  <ul>
                    {result.matched_skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No matched skills found.</p>
                )}
              </div>

              <div className="card">
                <h3>Missing Skills</h3>
                {result.missing_skills.length ? (
                  <ul>
                    {result.missing_skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No major missing skills detected.</p>
                )}
              </div>
            </div>

            <div className="grid">
              <div className="card">
                <h3>Resume Skills</h3>
                {result.resume_skills.length ? (
                  <ul>
                    {result.resume_skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No skills detected from resume.</p>
                )}
              </div>

              <div className="card">
                <h3>Job Description Skills</h3>
                {result.job_skills.length ? (
                  <ul>
                    {result.job_skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No skills detected from job description.</p>
                )}
              </div>
            </div>

            <div className="card">
              <h3>Improvement Suggestions</h3>
              <ul>
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;