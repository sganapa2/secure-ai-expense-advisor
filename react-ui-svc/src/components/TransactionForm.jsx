import { useState } from "react";
import { addTransaction } from "../services/transactionService";

export default function TransactionForm({ onSuccess }) {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [description, setDescription] = useState("");

    const categoryOptions = {
      EXPENSE: ["Food", "Travel", "Rent", "Shopping"],
      INCOME: ["Salary", "Freelance", "Bonus", "Gift", "Misc-Other"],
      INVESTMENT: ["Mutual Fund", "Stocks", "FD", "RD", "Gold", "Crypto", "RBI Bonds", "Other"]
    };

const handleTypeChange = (e) => {
  setType(e.target.value);
  setCategory(""); // reset
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !type || !amount) {
      alert("All fields are required");
      return;
    }

    if (type === "INCOME" && category.toLowerCase().includes("investment")) {
      alert("Investment cannot be INCOME");
      return;
    }
    const payload = {
      amount: parseFloat(amount),
      category,
      type,
      description,
      date: new Date().toISOString().split("T")[0]
    };

    await addTransaction(payload);

    // reset form
    setAmount("");
    setCategory("");
    setDescription("");

    // refresh list if parent wants
    if (onSuccess) onSuccess();
  };

  return (
      <div className="card">
    <form onSubmit={handleSubmit} style={{ padding: "20px", border: "1px solid #ddd" }}>

      <h3>Add Transaction</h3>

      {/* Amount */}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />

      <br />


      {/* Type */}
      <select value={type} onChange={(e) => {
        setType(e.target.value);
        setCategory(""); // reset category when type changes
      }}>
        <option value="EXPENSE">Expense</option>
        <option value="INCOME">Income</option>
        <option value="INVESTMENT">Investment</option>
      </select>

      <br />

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>

        {type && categoryOptions[type]?.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <br />

      {/* Description */}
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <br />

      <button type="submit" disabled={!amount || !category}>Add Transaction</button>

    </form>
    </div>
  );
}