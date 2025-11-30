import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor to include token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('auth_token');
            localStorage.removeItem('email');
            window.location.pathname = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API functions
export const authAPI = {
    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('email', userData.email);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('email', credentials.email);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/logout');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('email');
            return response;
        } catch (error) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('email');
            throw error;
        }
    },

    getUser: async () => {
        try {
            const response = await api.get('/user');
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default api;
