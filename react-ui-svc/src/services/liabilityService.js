import api from "../api/api";

import axios from 'axios';

export const createLiability = async (liabilityData) => {
    const token = localStorage.getItem('token');

    // Ensure liabilityData is a plain JS Object: { name: '...', amount: 0 }
    return await axios.post('http://localhost:8080/liabilities', liabilityData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Explicitly enforce JSON
        }
    });
};

// GET ALL LIABILITIES
export const getLiabilities = () => {
  return api.get("/liabilities");
};

// GET OPEN LIABILITIES
export const getOpenLiabilities = () => {
  return api.get("/liabilities/open");
};

/*// CREATE LIABILITY
export const createLiability = (data) => {
  return api.post("/liabilities", data);
};*/

// PAY LIABILITY
export const payLiability = (id, amount) => {
  return api.put(`/liabilities/${id}/pay`, {
    amount: amount,
  });
};

// DELETE LIABILITY
export const deleteLiability = (id) => {
  return api.delete(`/liabilities/${id}`);
};

// LIABILITY REPORT
export const getLiabilityReport = () => {
  return api.get("/liabilities/report");
};