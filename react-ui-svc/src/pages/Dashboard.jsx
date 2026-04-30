import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import { getTransactions } from "../services/transactionService";
import TransactionList from "../components/TransactionList";
import { getSummary } from "../services/transactionService";
import AIAdvisor from "./AIAdvisor";
import MonthlyReport from "./MonthlyReport";
import UserProfile from "./UserProfile";

export default function Dashboard() {
  // 📊 State Management - All state declarations consolidated at top
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    savings: 0
  });
  const [filter, setFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("dashboard"); // Tab navigation

  // 🔄 Helper Functions
  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };


  const loadSummary = async () => {
    try {
      const res = await getSummary();
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to load summary:", err);
    }
  };


  const filteredTransactions = transactions.filter((t) => {
    if (filter === "ALL") return true;
    return t.type === filter;
  });

  const refreshAll = () => {
    loadTransactions();
    loadSummary();
  };

  // 🔥 AUTO LOAD on component mount
  useEffect(() => {
    loadTransactions();
    loadSummary();
  }, []); // Empty dependency: runs once on mount

  return (
    <div className="dashboard-container">
      {/* Tab Navigation */}
      <div style={{
        display: "flex",
        gap: "0",
        borderBottom: "2px solid #ddd",
        background: "#f8f9fa",
        marginBottom: "20px"
      }}>
        <button
          onClick={() => setActiveTab("dashboard")}
          style={{
            flex: 1,
            padding: "12px 20px",
            border: "none",
            background: activeTab === "dashboard" ? "white" : "transparent",
            borderBottom: activeTab === "dashboard" ? "3px solid #28a745" : "none",
            cursor: "pointer",
            fontWeight: activeTab === "dashboard" ? "600" : "500",
            color: activeTab === "dashboard" ? "#28a745" : "#666",
            transition: "all 0.2s ease",
            fontSize: "15px"
          }}
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          style={{
            flex: 1,
            padding: "12px 20px",
            border: "none",
            background: activeTab === "ai" ? "white" : "transparent",
            borderBottom: activeTab === "ai" ? "3px solid #28a745" : "none",
            cursor: "pointer",
            fontWeight: activeTab === "ai" ? "600" : "500",
            color: activeTab === "ai" ? "#28a745" : "#666",
            transition: "all 0.2s ease",
            fontSize: "15px"
          }}
        >
          🧠 AI Advisor
        </button>

        <button
          onClick={() => setActiveTab("report")}
          style={{
            flex: 1,
            padding: "12px 20px",
            border: "none",
            background: activeTab === "report" ? "white" : "transparent",
            borderBottom: activeTab === "report" ? "3px solid #28a745" : "none",
            cursor: "pointer",
            fontWeight: activeTab === "report" ? "600" : "500",
            color: activeTab === "report" ? "#28a745" : "#666",
            transition: "all 0.2s ease",
            fontSize: "15px"
          }}
        >
          📈 Report
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          style={{
            flex: 1,
            padding: "12px 20px",
            border: "none",
            background: activeTab === "profile" ? "white" : "transparent",
            borderBottom: activeTab === "profile" ? "3px solid #28a745" : "none",
            cursor: "pointer",
            fontWeight: activeTab === "profile" ? "600" : "500",
            color: activeTab === "profile" ? "#28a745" : "#666",
            transition: "all 0.2s ease",
            fontSize: "15px"
          }}
        >
          👤 Profile
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px", paddingBottom: "20px" }}>
          <h2 style={{ textAlign: "center", marginTop: "0" }}>💰 Expense Advisor Dashboard</h2>

          {/* Summary Cards */}
          <div className="summary-container">
            <div className="card income">
              📈 Income<br />₹{summary.income}
            </div>

            <div className="card expense">
              💸 Expense<br />₹{summary.expense}
            </div>

            <div className="card savings">
              🏦 Savings<br />₹{summary.savings}
            </div>

            <div className="card investment">
                📊 Investment <br /> ₹{summary.investment}
              </div>
          </div>

          {/* Middle Section: Transaction Form + List */}
          <div className="middle-section">
            <div className="form-box">
              <TransactionForm onSuccess={refreshAll} />

              {/* Controls */}
              <div style={{ marginTop: 20, display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button onClick={logout} style={{ background: "#dc3545" }}>
                  Logout
                </button>

                <select onChange={(e) => setFilter(e.target.value)}>
                  <option value="ALL">All Transactions</option>
                  <option value="EXPENSE">Expenses</option>
                  <option value="INCOME">Income</option>
                  <option value="INVESTMENT">Investments</option>
                </select>
              </div>
            </div>

            {/* Transaction List */}
            <div className="table-container">
              <TransactionList
                transactions={filteredTransactions}
                onDelete={refreshAll}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Advisor Tab */}
      {activeTab === "ai" && <AIAdvisor />}

      {/* Report Tab */}
      {activeTab === "report" && <MonthlyReport />}

      {/* Profile Tab - New Addition */}
      {activeTab === "profile" && <UserProfile />}
    </div>
  );
}