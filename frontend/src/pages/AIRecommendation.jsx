import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api";

const AIRecommendation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const generateRecommendations = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await API.post("/ai/recommend");
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to generate AI recommendations. Add employees first."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>AI Performance Insights</h1>
          <button
            className="btn-ai"
            onClick={generateRecommendations}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate AI Recommendations"}
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="ai-container">
          <p style={{ color: "#64748b", marginBottom: 8 }}>
            AI analyzes all employees and provides promotion suggestions, rankings,
            training plans, and improvement feedback.
          </p>

          {!result && !loading && (
            <div className="empty-state" style={{ marginTop: 20 }}>
              Click the button above to generate AI insights.
            </div>
          )}

          {loading && (
            <p className="loading">
              AI is analyzing employee data... This may take 15-30 seconds on
              free Render tier.
            </p>
          )}

          {result && (
            <>
              <div className="ai-meta">
                <span>Employees Analyzed: {result.employeeCount}</span>
                <span>Powered by OpenRouter GPT-3.5</span>
              </div>

              <h3 style={{ marginTop: 24, color: "#1e3a5f" }}>
                AI Recommendations
              </h3>
              <div className="ai-output">{result.aiRecommendations}</div>

              {result.employees && result.employees.length > 0 && (
                <>
                  <h3 style={{ marginTop: 28, color: "#1e3a5f" }}>
                    Employee Data Used
                  </h3>
                  <div className="employees-grid" style={{ marginTop: 16 }}>
                    {result.employees.map((emp) => (
                      <div key={emp.email} className="employee-card">
                        <h3>
                          #{emp.rank} {emp.name}
                        </h3>
                        <p>
                          <strong>Dept:</strong> {emp.department}
                        </p>
                        <p>
                          <strong>Score:</strong> {emp.performanceScore}/100
                        </p>
                        <p>
                          <strong>Experience:</strong> {emp.experience} yrs
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AIRecommendation;
