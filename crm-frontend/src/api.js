import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// --- Customers ---
export const getCustomers = () => axios.get(`${API_URL}/customers/`);
export const createCustomer = (data) => axios.post(`${API_URL}/customers/`, data);
export const updateCustomer = (id, data) => axios.put(`${API_URL}/customers/${id}/`, data);
export const deleteCustomer = (id) => axios.delete(`${API_URL}/customers/${id}/`);

// --- Activities ---
export const getActivities = () => axios.get(`${API_URL}/activities/`);
export const createActivity = (data) => axios.post(`${API_URL}/activities/`, data);
export const updateActivity = (id, data) => axios.put(`${API_URL}/activities/${id}/`, data);
export const deleteActivity = (id) => axios.delete(`${API_URL}/activities/${id}/`);

// --- Leads ---
export const getLeads = () => axios.get(`${API_URL}/leads/`);
export const createLead = (data) => axios.post(`${API_URL}/leads/`, data);
export const updateLead = (id, data) => axios.put(`${API_URL}/leads/${id}/`, data);
export const deleteLead = (id) => axios.delete(`${API_URL}/leads/${id}/`);

// --- Deals ---
export const getDeals = () => axios.get(`${API_URL}/deals/`);
export const createDeal = (data) => axios.post(`${API_URL}/deals/`, data);
export const updateDeal = (id, data) => axios.put(`${API_URL}/deals/${id}/`, data);
export const deleteDeal = (id) => axios.delete(`${API_URL}/deals/${id}/`);

// --- Auth ---
export const login = (data) => axios.post(`${API_URL}/login/`, data);
export const register = (data) => axios.post(`${API_URL}/register/`, data);
