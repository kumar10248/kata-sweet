import axios from "axios";

// Use relative URL in production (served from same domain), absolute URL in development
const baseURL = import.meta.env.MODE === 'production' 
  ? '/api'  // Relative URL - served from same Render instance
  : 'http://localhost:8000/api';  // Development - local backend

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

console.log('API Base URL:', baseURL);

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
