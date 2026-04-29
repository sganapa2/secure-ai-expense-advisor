import { useState } from "react";
import { addTransaction } from "../services/transactionService";

export default function TransactionForm({ onSuccess }) {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [description, setDescription] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [investmentInstitute, setInvestmentInstitute] = useState("");
  const [investmentPlatform, setInvestmentPlatform] = useState("");

  const categoryOptions = {
    EXPENSE: ["Food", "Travel", "Rent", "Shopping"],
    INCOME: ["Salary", "Freelance", "Bonus", "Gift", "Misc-Other"],
    INVESTMENT: ["Mutual Fund", "Stocks", "FD", "RD", "Gold", "Crypto", "RBI Bonds", "Other"]
  };

  // Categories that require maturity date and institute info
  const investmentTypesWithMaturity = ["FD", "RD", "RBI Bonds"];

  // Categories that require platform/app info
  const investmentTypesWithPlatform = ["Mutual Fund", "Stocks", "Gold", "Crypto"];

  // Suggested platforms for each category
  const platformSuggestions = {
    "Mutual Fund": ["COIN", "Groww", "Zerodha", "Angel One", "Upstox", "Direct Distributor", "Other"],
    "Stocks": ["KITE", "GROWW", "Zerodha", "Upstox", "Angel One", "FYERS", "ICICI Direct", "Other"],
    "Gold": ["Groww", "Zerodha", "Physical Gold", "Gold ETF", "Other"],
    "Crypto": ["Binance", "Coinbase", "WazirX", "CoinDCX", "ZebPay", "Other"]
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setCategory(""); // reset
    setMaturityDate("");
    setInvestmentInstitute("");
    setInvestmentPlatform("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !type || !amount) {
      alert("All fields are required");
      return;
    }

    // Validate investment-specific fields if needed
    if (type === "INVESTMENT" && investmentTypesWithMaturity.includes(category)) {
      if (!maturityDate || !investmentInstitute) {
        alert("Maturity date and institute name are required for this investment type");
        return;
      }
    }

    // Validate platform for certain investment types
    if (type === "INVESTMENT" && investmentTypesWithPlatform.includes(category)) {
      if (!investmentPlatform) {
        alert("Investment platform is required for this investment type");
        return;
      }
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

    // Add investment-specific fields if present
    if (type === "INVESTMENT" && investmentTypesWithMaturity.includes(category)) {
      payload.maturityDate = maturityDate;
      payload.investmentInstitute = investmentInstitute;
    }

    // Add platform field for applicable investments
    if (type === "INVESTMENT" && investmentTypesWithPlatform.includes(category)) {
      payload.investmentPlatform = investmentPlatform;
    }

    await addTransaction(payload);

    // reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setMaturityDate("");
    setInvestmentInstitute("");
    setInvestmentPlatform("");

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
        setMaturityDate("");
        setInvestmentInstitute("");
        setInvestmentPlatform("");
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

      {/* Investment-specific fields - Show for FD, RD, RBI Bonds */}
      {type === "INVESTMENT" && investmentTypesWithMaturity.includes(category) && (
        <>
          {/* Maturity Date */}
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            📅 Maturity Date:
          </label>
          <input
            type="date"
            value={maturityDate}
            onChange={(e) => setMaturityDate(e.target.value)}
            placeholder="Maturity Date"
            required={investmentTypesWithMaturity.includes(category)}
            style={{ marginBottom: "10px", width: "100%", boxSizing: "border-box" }}
          />

          <br />

          {/* Bank/Institute Name */}
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            🏦 Bank/Institute Name:
          </label>
          <input
            type="text"
            value={investmentInstitute}
            onChange={(e) => setInvestmentInstitute(e.target.value)}
            placeholder="e.g., HDFC Bank, ICICI, RBI"
            required={investmentTypesWithMaturity.includes(category)}
            style={{ marginBottom: "10px", width: "100%", boxSizing: "border-box" }}
          />

          <br />
        </>
      )}

      {/* Investment platform - Show for Mutual Fund, Stocks, Gold, Crypto */}
      {type === "INVESTMENT" && investmentTypesWithPlatform.includes(category) && (
        <>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
            📱 Investment Platform/App:
          </label>
          <select
            value={investmentPlatform}
            onChange={(e) => setInvestmentPlatform(e.target.value)}
            style={{ marginBottom: "10px", width: "100%", boxSizing: "border-box" }}
          >
            <option value="">Select Platform</option>
            {platformSuggestions[category]?.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>

          <br />
        </>
      )}

      <button type="submit" disabled={!amount || !category}>Add Transaction</button>

    </form>
    </div>
  );
}