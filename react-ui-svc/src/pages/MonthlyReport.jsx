import { useState, useEffect } from "react";
import { getMonthlyReport } from "../services/transactionService";

export default function MonthlyReport() {
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchReport = async () => {
    try {
      setLoadingReport(true);
      setReportError(null);
      const data = await getMonthlyReport(
        selectedYear,
        selectedMonth,
        localStorage.getItem("token")
      );
      setReport(data);
    } catch (err) {
      console.error("Failed to load report:", err);
      setReportError("Failed to load monthly report. Please try again.");
    } finally {
      setLoadingReport(false);
    }
  };

  // Load report when month/year changes
  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>📊 Monthly Financial Report</h2>

      {/* Report Controls */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <label style={{ fontWeight: "600" }}>
          Month:
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{
              marginLeft: "8px",
              padding: "8px 12px",
              borderRadius: "5px",
              border: "1px solid #ddd"
            }}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontWeight: "600" }}>
          Year:
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              marginLeft: "8px",
              padding: "8px 12px",
              borderRadius: "5px",
              border: "1px solid #ddd"
            }}
          >
            {[2026, 2025, 2024, 2023, 2022].map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </label>

        <button
          onClick={fetchReport}
          disabled={loadingReport}
          style={{
            padding: "8px 16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loadingReport ? "not-allowed" : "pointer",
            fontWeight: "600",
            opacity: loadingReport ? 0.6 : 1
          }}
        >
          {loadingReport ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Error Display */}
      {reportError && (
        <div style={{
          background: "#fff5f5",
          border: "2px solid #dc3545",
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "20px",
          color: "#721c24"
        }}>
          <p>❌ {reportError}</p>
        </div>
      )}

      {/* Report Display */}
      {report ? (
        <div style={{
          background: "#f8f9fa",
          borderRadius: "10px",
          padding: "20px",
          border: "1px solid #dee2e6"
        }}>
          <h3 style={{ marginTop: "0", color: "#333" }}>
            {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", {
              month: "long",
              year: "numeric"
            })}
          </h3>

          {/* Report Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginBottom: "20px"
          }}>
            <div style={{
              background: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #eee",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                📈 Income
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#155724" }}>
                ₹{report.totalIncome}
              </div>
            </div>

            <div style={{
              background: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #eee",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                💸 Expense
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#721c24" }}>
                ₹{report.totalExpense}
              </div>
            </div>

            <div style={{
              background: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #eee",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                💼 Investment
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#004085" }}>
                ₹{report.totalInvestment}
              </div>
            </div>

            <div style={{
              background: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #eee",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                🏦 Savings
              </div>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "#0c5460" }}>
                ₹{report.savings}
              </div>
            </div>
          </div>

          {/* Report Metrics */}
          <div style={{
            display: "flex",
            gap: "20px",
            marginBottom: "15px",
            flexWrap: "wrap"
          }}>
            <div>
              <span style={{ color: "#666" }}>📉 Expense Ratio: </span>
              <strong style={{ fontSize: "18px", color: "#dc3545" }}>
                {report.expenseRatio.toFixed(1)}%
              </strong>
            </div>
            <div>
              <span style={{ color: "#666" }}>📈 Savings Rate: </span>
              <strong style={{ fontSize: "18px", color: "#28a745" }}>
                {report.savingsRate.toFixed(1)}%
              </strong>
            </div>
          </div>

          {/* Report Message */}
          <div style={{
            background: "#f0f9f5",
            border: "2px solid #28a745",
            borderRadius: "8px",
            padding: "15px",
            color: "#155724",
            fontWeight: "500"
          }}>
            ✅ {report.message}
          </div>
        </div>
      ) : !reportError && !loadingReport ? (
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "#666"
        }}>
          <p>📊 Select a month and click "Refresh" to view your report</p>
        </div>
      ) : null}
    </div>
  );
}

