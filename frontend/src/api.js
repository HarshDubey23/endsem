import axios from "axios";

// Deployed Render backend API base URL
const API = axios.create({
  baseURL: "https://endsem-qqh6.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every protected request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
