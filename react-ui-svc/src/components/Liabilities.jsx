import { useState, useEffect } from "react";
import {
  getLiabilities,
  createLiability,
  payLiability,
  getLiabilityReport,
  deleteLiability
} from "../services/liabilityService";
import "../css/liabilities.css";

function Liabilities() {
  const [liabilities, setLiabilities] = useState([]);
  const [report, setReport] = useState(null);
  const [form, setForm] = useState({
    liabilityName: "",
    totalAmount: "",
    borrowedFrom: "",
    repaymentSource: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getLiabilities();
      setLiabilities(response.data);

      const reportResponse = await getLiabilityReport();
      setReport(reportResponse.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this liability?");
    if (!ok) return;

    await deleteLiability(id);
    loadData();
  };
const handleCreate = async () => {
  // 1. Trim and validate inputs
  const name = form.liabilityName.trim();
  const amount = Number(form.totalAmount);
  const borrowed = form.borrowedFrom.trim();
  const source = form.repaymentSource.trim();

  // 2. Strict validation check
  if (!name || !borrowed || !source) {
    alert("❌ Please fill out all fields.");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("❌ Please enter a valid liability-amount greater than 0.");
    return;
  }

  // 3. Construct clean payload
  const payload = {
    liabilityName: name,
    totalAmount: amount,
    borrowedFrom: borrowed,
    repaymentSource: source
  };

  try {
    await createLiability(payload);

    // Clear the form fields upon success
    setForm({
      liabilityName: "",
      totalAmount: "",
      borrowedFrom: "",
      repaymentSource: ""
    });

    loadData();
  } catch (error) {
    console.error("Failed to append liability data record:", error);
  }
};

  const handlePay = async (id) => {
    const amount = prompt("Enter payment amount");
    if (!amount || isNaN(amount)) return;

    try {
      await payLiability(id, amount);
      loadData();
    } catch (error) {
      console.error("Payment execution exception:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div className="liability-page">
        <h2>📌 Liabilities Dashboard</h2>

        {/* REPORT PANELS */}
        {report && (
          <div className="report-cards">
            <div className="mini-card">💰 Total Liability<br />₹{report.totalLiability}</div>
            <div className="mini-card">🏦 Remaining Due<br />₹{report.remainingDue}</div>
            <div className="mini-card">🔓 Open<br />{report.openLiabilities}</div>
            <div className="mini-card">✅ Closed<br />{report.closedLiabilities}</div>
          </div>
        )}

        {/* RECONFIGURED INPUT HOOKFORMS */}
        <div className="create-form">
          <input
            placeholder="Liability Name"
            value={form.liabilityName}
            onChange={(e) => setForm({ ...form, liabilityName: e.target.value })}
          />
          <input
            placeholder="Amount"
            type="number"
            value={form.totalAmount}
            onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
          />
          <input
            placeholder="Borrowed From"
            value={form.borrowedFrom}
            onChange={(e) => setForm({ ...form, borrowedFrom: e.target.value })}
          />
          <input
            placeholder="Repayment Source"
            value={form.repaymentSource}
            onChange={(e) => setForm({ ...form, repaymentSource: e.target.value })}
          />
          <button onClick={handleCreate}>Add Liability</button>
        </div>

        {/* GRID LAYOUT CARDS */}
        <div className="liability-grid">
          {liabilities.map((item) => {
            const progress = ((item.paidAmount / item.totalAmount) * 100).toFixed(0);

            return (
              <div key={item.id} className={item.status === "OPEN" ? "liability-card open" : "liability-card closed"}>
                <h3>{item.liabilityName}</h3>
                <p>💰 Total: ₹{item.totalAmount}</p>
                <p>📌 Remaining: ₹{item.remainingAmount}</p>
                <p>🏦 Paid: ₹{item.paidAmount}</p>
                <p>👤 Borrowed: {item.borrowedFrom}</p>
                <p>💼 Repayment: {item.repaymentSource}</p>
                <p>📅 Start: {item.startDate || "-"}</p>
                <p>⏳ Due: {item.dueDate || "-"}</p>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <p>{progress}% Paid</p>

                {item.status === "OPEN" && (
                  <button onClick={() => handlePay(item.id)}>Pay</button>
                )}
                 <button
                                  className="delete-btn"
                                  onClick={() =>
                                    handleDelete(item.id)
                                  }
                                >
                                  Delete
                                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Liabilities;