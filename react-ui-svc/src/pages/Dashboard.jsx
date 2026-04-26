import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import { getTransactions } from "../services/transactionService";
import TransactionList from "../components/TransactionList";
import { getSummary } from "../services/transactionService";
import { getInsights } from "../services/transactionService";

export default function Dashboard() {

    const [insight, setInsight] = useState("");
    const [loadingInsight, setLoadingInsight] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

const [summary, setSummary] = useState({
  income: 0,
  expense: 0,
  savings: 0
});

const loadSummary = async () => {
  const res = await getSummary();
  setSummary(res.data);
};

const loadInsights = async () => {
  try {
    setLoadingInsight(true);
    const res = await getInsights();
    setInsight(res.data.advice || res.data);

  } catch (err) {
    console.error(err);
    setInsight("Failed to load AI advice");
  } finally {
    setLoadingInsight(false);
  }
};

  const [filter, setFilter] = useState("ALL");

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "ALL") return true;
    return t.type === filter;
  });

const refreshAll = () => {
  loadTransactions();
  loadSummary();
};
  // 🔥 AUTO LOAD
    useEffect(() => {
      loadTransactions();
       loadSummary();
       loadInsights(); // 🔥 auto load AI insights on dashboard load
    }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>

      <h2 style={{ textAlign: "center" }}>Expense Advisor Dashboard</h2>

      {/* Summary (next step) */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>

        <div className="card" style={{ background: "#e6ffe6" }}>
          Income ₹{summary.income}
        </div>

        <div className="card" style={{ background: "#ffe6e6" }}>
          Expense ₹{summary.expense}
        </div>

        <div className="card" style={{ background: "#e6f0ff" }}>
          Savings ₹{summary.savings}
        </div>

      </div>
      <div><div className="card">
             <h3>🧠 AI Advisor</h3>

             <button onClick={loadInsights}>
               {loadingInsight ? "Analyzing..." : "Get AI Advice"}
             </button>

             <div style={{ marginTop: 10 }}>
               {insight && <p>{insight}</p>}
             </div>
           </div></div>

      {/* Form */}
      <TransactionForm onSuccess={refreshAll} />

      {/* Controls */}
      <div style={{ marginTop: 20 }}>
        <button onClick={logout}>Logout</button>

        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
          <option value="INVESTMENT">Investment</option>
        </select>
      </div>

      {/* List */}
      <TransactionList
        transactions={filteredTransactions}
        onDelete={refreshAll}
      />

    </div>
  );
}