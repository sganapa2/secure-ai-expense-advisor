import { useState } from "react";
import { deleteTransaction } from "../services/transactionService";

export default function TransactionList({ transactions, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!id) {
      alert("Cannot delete: missing transaction id");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this transaction?");
    if (!ok) return;

    try {
      setDeletingId(id);
      await deleteTransaction(id);
      onDelete(); // reload
    } catch (err) {
      console.error("Delete failed:", err);
      // show a helpful message from server if available
      const msg = err?.response?.data || err.message || "Failed to delete transaction";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const investmentTypesWithMaturity = ["FD", "RD", "RBI Bonds"];
  const investmentTypesWithPlatform = ["Mutual Fund", "Stocks", "Gold", "Crypto"];
  const isInvestmentWithDetails = (t) => t.type === "INVESTMENT" && investmentTypesWithMaturity.includes(t.category);
  const isInvestmentWithPlatform = (t) => t.type === "INVESTMENT" && investmentTypesWithPlatform.includes(t.category);

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            {transactions.some(isInvestmentWithDetails) && (
              <>
                <th>Institute</th>
                <th>Maturity Date</th>
              </>
            )}
            {transactions.some(isInvestmentWithPlatform) && (
              <th>Platform</th>
            )}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className={`row-${t.type.toLowerCase()}`}>
              <td>{t.category}</td>
              <td>₹{t.amount}</td>
              <td>{t.date}</td>
              {transactions.some(isInvestmentWithDetails) && (
                <>
                  <td style={{ color: isInvestmentWithDetails(t) ? "#0066cc" : "#999" }}>
                    {isInvestmentWithDetails(t) ? t.investmentInstitute : "-"}
                  </td>
                  <td style={{ color: isInvestmentWithDetails(t) ? "#0066cc" : "#999" }}>
                    {isInvestmentWithDetails(t) ? (
                      <>
                        📅 {t.maturityDate}
                        {t.maturityDate && new Date(t.maturityDate) < new Date() && (
                          <span style={{ color: "#999", marginLeft: "5px" }}>(Matured)</span>
                        )}
                      </>
                    ) : "-"}
                  </td>
                </>
              )}
              {transactions.some(isInvestmentWithPlatform) && (
                <td style={{ color: isInvestmentWithPlatform(t) ? "#0066cc" : "#999" }}>
                  {isInvestmentWithPlatform(t) ? t.investmentPlatform : "-"}
                </td>
              )}
              <td>
                <button onClick={() => handleDelete(t.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}