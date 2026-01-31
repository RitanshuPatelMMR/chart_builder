const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export { API_BASE_URL };

export const API_ENDPOINTS = {
    // Admin endpoints
    admin: {
        metrics: `${API_BASE_URL}/api/admin/metrics`,
        growth: `${API_BASE_URL}/api/admin/growth`,
        users: `${API_BASE_URL}/api/admin/users`,
        userDetails: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
    },

    // User endpoints
    user: {
        me: `${API_BASE_URL}/api/user/me`,
    },

    // Chart endpoints
    charts: {
        list: `${API_BASE_URL}/api/charts`,
        create: `${API_BASE_URL}/api/charts`,
        get: (id: string) => `${API_BASE_URL}/api/charts/${id}`,
        update: (id: string) => `${API_BASE_URL}/api/charts/${id}`,
        delete: (id: string) => `${API_BASE_URL}/api/charts/${id}`,
        duplicate: (id: string) => `${API_BASE_URL}/api/charts/duplicate?id=${id}`, // ✅ Changed
    },
};