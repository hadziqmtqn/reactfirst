import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Interceptor response
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Jika status 401/403, token tidak valid/expired
        if (error.response && error.response.status === 401) {
            // Hapus token
            localStorage.removeItem("token");
            // Redirect ke login
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;