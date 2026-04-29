import { deleteTransaction } from "../services/transactionService";

export default function TransactionList({ transactions, onDelete }) {

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    onDelete(); // reload
  };

  const investmentTypesWithMaturity = ["FD", "RD", "RBI Bonds"];
  const investmentTypesWithPlatform = ["Mutual Fund", "Stocks", "Gold", "Crypto"];
  const isInvestmentWithDetails = (t) => t.type === "INVESTMENT" && investmentTypesWithMaturity.includes(t.category);
  const isInvestmentWithPlatform = (t) => t.type === "INVESTMENT" && investmentTypesWithPlatform.includes(t.category);

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
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
            <tr key={t.id}>
              <td className={t.type.toLowerCase()}>{t.type}</td>
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