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