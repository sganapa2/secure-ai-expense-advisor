import { useState } from "react";
import { getInsights } from "../services/transactionService";

export default function AIAdvisor() {
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const loadInsights = async () => {
    try {
      setLoadingInsight(true);
      const res = await getInsights();
      setInsight(res.data.advice || res.data);
    } catch (err) {
      console.error("Failed to load insights:", err);
      setInsight("Failed to load AI advice");
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🧠 AI Financial Advisor</h2>

      <div style={{
        background: "#f8f9fa",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>
        <p style={{ color: "#666", lineHeight: "1.6" }}>
          Get personalized financial advice based on your income, expenses, and investment patterns.
          Click the button below to analyze your financial situation.
        </p>
      </div>

      <button
        onClick={loadInsights}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "600",
          marginBottom: "20px"
        }}
      >
        {loadingInsight ? "Analyzing Your Finances..." : "Get AI Financial Advice"}
      </button>

      {insight && (
        <div style={{
          background: "#e8f5e9",
          border: "2px solid #4caf50",
          borderRadius: "10px",
          padding: "20px",
          marginTop: "20px",
          lineHeight: "1.8"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>💡 AI Advice:</h3>
          <p style={{ margin: "0", color: "#1b5e20" }}>{insight}</p>
        </div>
      )}
    </div>
  );
}

