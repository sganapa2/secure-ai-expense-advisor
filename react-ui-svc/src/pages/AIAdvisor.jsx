import { useState } from "react";
import { getInsights } from "../services/transactionService";

export default function AIAdvisor() {
  // insight will hold either a string or an object { advice, stats }
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const loadInsights = async () => {
    try {
      setLoadingInsight(true);
      const res = await getInsights();

      // backend returns { advice: String, warning: { income, expense, investment, savings } }
      const data = res?.data;
      if (!data) {
        setInsight({ advice: "No data received from server." });
        return;
      }

      if (typeof data === "string") {
        setInsight({ advice: data });
      } else if (data.advice || data.warning) {
        setInsight({ advice: data.advice || "", stats: data.warning || null });
      } else {
        // fallback: attempt to stringify
        setInsight({ advice: data.toString() });
      }
    } catch (err) {
      console.error("Failed to load insights:", err);
      setInsight({ advice: "Failed to load AI advice" });
    } finally {
      setLoadingInsight(false);
    }
  };

  const formatCurrency = (value) => {
    try {
      if (value == null) return "-";
      // value may be a number or string representing a BigDecimal
      const num = Number(value);
      if (Number.isNaN(num)) return String(value);
      return num.toLocaleString(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 2 });
    } catch (e) {
      return String(value);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
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
        disabled={loadingInsight}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          background: loadingInsight ? "#6c757d" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loadingInsight ? "not-allowed" : "pointer",
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
          <p style={{ margin: "0 0 10px 0", color: "#1b5e20" }}>{insight.advice || "No advice provided."}</p>

          {insight.stats && (
            <div style={{ marginTop: "12px", color: "#0b4a2a" }}>
              <h4 style={{ margin: "0 0 8px 0" }}>📊 Financial Breakdown</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li><strong>Income:</strong> {formatCurrency(insight.stats.income)}</li>
                <li><strong>Expense:</strong> {formatCurrency(insight.stats.expense)}</li>
                <li><strong>Investment:</strong> {formatCurrency(insight.stats.investment)}</li>
                <li><strong>Savings:</strong> {formatCurrency(insight.stats.savings)}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

