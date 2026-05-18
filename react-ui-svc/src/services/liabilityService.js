import api from "../api/api";

export const createLiability = async (liabilityData) => {
    // Use the centralized API client which has JWT interceptor and dynamic baseURL
    return await api.post('/liabilities', liabilityData, {
        headers: {
            'Content-Type': 'application/json'
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