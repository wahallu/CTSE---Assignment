import axios from "axios";

// Reusable axios instance — reads base URL from environment
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:7000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// ---- Request interceptor: attach JWT token ----
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---- Response interceptor: normalise errors ----
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with an error status
            const message =
                error.response.data?.message ||
                error.response.data?.errors?.join(", ") ||
                "Something went wrong";
            return Promise.reject(new Error(message));
        }
        if (error.request) {
            // No response received (network issue)
            return Promise.reject(
                new Error("Network error — please check your connection")
            );
        }
        return Promise.reject(error);
    }
);

export default api;
