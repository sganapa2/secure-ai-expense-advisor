import { deleteTransaction } from "../services/transactionService";

export default function TransactionList({ transactions, onDelete }) {

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    onDelete(); // reload
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Date</th>
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
            <td>
              <button onClick={() => handleDelete(t.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}