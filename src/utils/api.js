import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Campaign API
export const campaignApi = {
  getAll: () => api.get("/campaigns"),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post("/campaigns", data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
};

// Contact API
export const contactApi = {
  getAll: () => api.get("/contacts"),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post("/contacts", data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// Company API
export const companyApi = {
  getAll: () => api.get("/companies"),
  getById: (id) => api.get(`/companies/${id}`),
  getByCode: (companyCode) => api.get(`/companies/code/${companyCode}`),
  create: (data) => api.post("/companies", data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
};

export default api;
