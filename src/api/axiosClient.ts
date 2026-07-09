import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ??
    (import.meta.env.PROD
        ? "https://fixhub-server.vercel.app/api"
        : "http://localhost:5000/api");

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("fixhub-token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default axiosClient;
