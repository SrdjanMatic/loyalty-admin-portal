import axios from "axios";
import { keycloak } from "./keycloak.ts";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("token");

  if (keycloak.authenticated && keycloak.token) {
    try {
      await keycloak.updateToken(30);
      token = keycloak.token;
      localStorage.setItem("token", token || "");
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
