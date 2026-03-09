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

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong while analyzing the resume."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 65) return "Good Match";
    if (score >= 50) return "Moderate Match";
    return "Needs Improvement";
  };

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <div className="hero-pill">NLP • ATS Scoring • Skill Gap Analysis</div>
          <h1>AI Resume Screening System</h1>
          <p className="subtitle">
            Evaluate resume-job alignment using semantic similarity, skill
            extraction, and ATS-style scoring.
          </p>
        </header>

        <section className="top-layout">
          <form className="card form-card" onSubmit={handleAnalyze}>
            <div className="section-head">
              <h2>Resume Analysis</h2>
              <p>Upload a PDF resume and paste the target job description.</p>
            </div>

            <label className="label">Resume PDF</label>
            <div className="upload-area">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="input-file"
              />
              <div className="file-note">
                {resume ? `Selected: ${resume.name}` : "No file selected"}
              </div>
            </div>

            <label className="label">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here..."
              className="textarea"
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>

            {loading && (
              <p className="loading-text">
                Processing resume and generating results...
              </p>
            )}
          </form>

          <div className="card feature-card">
            <div className="section-head">
              <h2>What it evaluates</h2>
              <p>Core signals used in the screening process.</p>
            </div>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Semantic match between resume and role</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Skill overlap and missing requirements</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>ATS-style scoring and completeness signals</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Actionable resume improvement suggestions</span>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="card error-card">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <section className="results">
            <div className="metrics-grid">
              <div className="card metric-card highlight-card">
                <p className="metric-title">ATS Score</p>
                <div className="metric-value">{result.ats_score}%</div>
                <span className="metric-badge">
                  {getScoreLabel(result.ats_score)}
                </span>
              </div>

              <div className="card metric-card">
                <p className="metric-title">Semantic Match</p>
                <div className="metric-value small">{result.semantic_score}%</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${result.semantic_score}%` }}
                  ></div>
                </div>
              </div>

              <div className="card metric-card mini">
                <p className="mini-title">Matched Skills</p>
                <div className="mini-value">{result.matched_skills.length}</div>
              </div>

              <div className="card metric-card mini">
                <p className="mini-title">Missing Skills</p>
                <div className="mini-value">{result.missing_skills.length}</div>
              </div>
            </div>

            <div className="content-grid">
              <div className="card">
                <h3>Matched Skills</h3>
                {result.matched_skills.length > 0 ? (
                  <div className="tag-wrap">
                    {result.matched_skills.map((skill, index) => (
                      <span key={index} className="tag tag-success">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No strong skill overlap detected.</p>
                )}
              </div>

              <div className="card">
                <h3>Missing Skills</h3>
                {result.missing_skills.length > 0 ? (
                  <div className="tag-wrap">
                    {result.missing_skills.map((skill, index) => (
                      <span key={index} className="tag tag-danger">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No major missing skills detected.</p>
                )}
              </div>

              <div className="card">
                <h3>Resume Skills Extracted</h3>
                {result.resume_skills.length > 0 ? (
                  <div className="tag-wrap">
                    {result.resume_skills.map((skill, index) => (
                      <span key={index} className="tag tag-neutral">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">No skills detected from resume.</p>
                )}
              </div>

              <div className="card">
                <h3>Job Description Skills</h3>
                {result.job_skills.length > 0 ? (
                  <div className="tag-wrap">
                    {result.job_skills.map((skill, index) => (
                      <span key={index} className="tag tag-accent">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">
                    No skills detected from job description.
                  </p>
                )}
              </div>
            </div>

            <div className="card">
              <h3>Improvement Suggestions</h3>
              <div className="suggestion-list">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <span className="suggestion-index">{index + 1}</span>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="footer">
          <p>
            AI Resume Screening System • Built with React, FastAPI, NLP, and
            Sentence-BERT
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;