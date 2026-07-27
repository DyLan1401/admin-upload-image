import axios from "axios";

const DEFAULT_API_URL = "http://localhost:5000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

const api = axios.create({
    baseURL: `${API_URL.replace(/\/$/, "")}`,
    timeout: 15000,
});

export default api;
