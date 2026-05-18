import api from "../api/api";

// GET
export const getTransactions = () => {
  return api.get("/transactions");
};

// POST
export const addTransaction = (data) => {
  return api.post("/transactions", data);
};

export const deleteTransaction = (id) => {
  return api.delete(`/transactions/${id}`);
};

export const getSummary = () => {
  return api.get("/analytics/summary");
};

export const getInsights = () => {
  return api.get("/analytics/insights");
};

export const getMonthlyReport = async (year, month, token) => {
  const apiBaseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
  const response = await fetch(
    `${apiBaseURL}/reports/monthly?year=${year}&month=${month}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch report");
  }

  return await response.json();
};