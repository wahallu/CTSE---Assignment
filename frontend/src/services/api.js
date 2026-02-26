import axios from "axios";

// Reusable axios instance — reads base URL from environment
const api = axios.create({
    baseURL: "http://localhost:7000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
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
