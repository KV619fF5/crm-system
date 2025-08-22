import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // backend URL
  timeout: 5000,
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error("Backend error:", error.response.data);
    } else if (error.request) {
      console.error("No response from server:", error.message);
    } else {
      console.error("Axios error:", error.message);
    }
    return Promise.reject(error);
  }
);

// --- Customers ---
export const getCustomers = async () => API.get("/customers/");
export const createCustomer = async (data) => API.post("/customers/", data);
export const updateCustomer = async (id, data) => API.put(`/customers/${id}`, data);
export const deleteCustomer = async (id) => API.delete(`/customers/${id}`);

// --- Activities ---
export const getActivities = async () => API.get("/activities/");
export const createActivity = async (data) => API.post("/activities/", data);
export const updateActivity = async (id, data) => API.put(`/activities/${id}`, data);
export const deleteActivity = async (id) => API.delete(`/activities/${id}`);

// --- Deals ---
export const getDeals = async () => API.get("/deals/");
export const createDeal = async (data) => API.post("/deals/", data);
export const updateDeal = async (id, data) => API.put(`/deals/${id}`, data);
export const deleteDeal = async (id) => API.delete(`/deals/${id}`);

// --- Leads (NEW) ---
export const getLeads = async () => API.get("/leads/");
export const createLead = async (data) => API.post("/leads/", data);
export const updateLead = async (id, data) => API.put(`/leads/${id}`, data);
export const deleteLead = async (id) => API.delete(`/leads/${id}`);
