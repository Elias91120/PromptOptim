import axios from 'axios';

// API Base URL (empty string for relative paths used with proxy/rewrites)
const API_BASE_URL = '';

// Create Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // 60s timeout to handle long Render cold starts
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management (persisted for performance)
let accessToken = localStorage.getItem('access_token');

export const setAccessToken = (token) => {
    accessToken = token;
    if (token) {
        localStorage.setItem('access_token', token);
    } else {
        localStorage.removeItem('access_token');
    }
};

export const getAccessToken = () => accessToken;

export const clearTokens = () => {
    accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
};

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');

                if (!refreshToken) {
                    clearTokens();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Call refresh endpoint (V5: /auth/refresh)
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refresh_token: refreshToken,
                });

                // Save new tokens
                const { access_token, refresh_token } = response.data;
                setAccessToken(access_token);
                localStorage.setItem('refresh_token', refresh_token);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ================================
// AUTH ENDPOINTS (V5: /auth/* prefix)
// ================================

export const authAPI = {
    // Register new user
    register: async (email, password) => {
        const response = await api.post('/auth/register', { email, password });
        return response.data;
    },

    // Login (V5: JSON with email field, not form-data with username)
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // Logout (V5: new endpoint, invalidates session)
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password (V5: sends access_token + refresh_token from URL fragment)
    resetPassword: async (accessToken, refreshToken, newPassword, token = null) => {
        const body = token
            ? { token, new_password: newPassword }
            : {
                access_token: accessToken,
                refresh_token: refreshToken,
                new_password: newPassword,
            };
        const response = await api.post('/auth/reset-password', body);
        return response.data;
    },

    // Get current user info
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Delete account (V5: /auth/me instead of /users/me)
    deleteAccount: async () => {
        const response = await api.delete('/auth/me');
        return response.data;
    },
};

// ================================
// PROMPT ENDPOINTS
// ================================

export const promptAPI = {
    // Generate optimized prompt
    generate: async (inputText, targetModel = 'mistral_2') => {
        const response = await api.post('/api/generate', {
            input_text: inputText,
            target_model: targetModel,
        });
        return response.data;
    },

    // Get history
    getHistory: async (skip = 0, limit = 100) => {
        const response = await api.get('/api/history', {
            params: { skip, limit },
        });
        return response.data;
    },

    // Get stats
    getStats: async () => {
        const response = await api.get('/api/stats');
        return response.data;
    },
};

// ================================
// MODELS ENDPOINT (V5: new, public)
// ================================

export const modelsAPI = {
    // Get all supported models with sovereignty & green data
    getAll: async () => {
        const response = await api.get('/api/models');
        return response.data;
    },
};

// ================================
// TEMPLATES ENDPOINTS (V5: new)
// ================================

export const templatesAPI = {
    // Get templates (user's + public)
    getAll: async (params = {}) => {
        const response = await api.get('/api/templates', { params });
        return response.data;
    },

    // Create a template
    create: async (template) => {
        const response = await api.post('/api/templates', template);
        return response.data;
    },

    // Delete a template
    delete: async (id) => {
        const response = await api.delete(`/api/templates/${id}`);
        return response.data;
    },
};

// ================================
// HEALTH CHECK
// ================================

export const healthAPI = {
    check: async () => {
        const response = await api.get('/health');
        return response.data;
    },
};

export default api;
