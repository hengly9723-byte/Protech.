import axios from "axios";

// Base API URL pointing to the Django REST Framework backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "bypass-tunnel-reminder": "true",
    "ngrok-skip-browser-warning": "true",
  },
});

// Product API Endpoints
export const getProducts = () => api.get("/products/");
export const getProduct = (id) => api.get(`/products/${id}/`);
export const createProduct = (productData) => api.post("/products/", productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}/`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}/`);

// Auth API Endpoints
export const googleLogin = (token) => api.post("/auth/google/", { token });

export default api;

