import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import { getTransactions } from "../services/transactionService";
import TransactionList from "../components/TransactionList";
import { getSummary } from "../services/transactionService";
// ...existing imports...

export default function Dashboard() {
  // 📊 State Management - All state declarations consolidated at top
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    savings: 0
  });
  const [filter, setFilter] = useState("ALL");

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
            <div style={{ marginTop: 20, display: "flex", gap: "10px", flexWrap: "wrap", alignItems: 'center' }}>
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

        {/* Debugging: Log filtered transactions to verify filter logic */}
        <div style={{ marginTop: 20, padding: "0 20px" }}>
          <p>Filtered Transactions: {filteredTransactions.length}</p>
        </div>
      </div>
    </div>
  );
}