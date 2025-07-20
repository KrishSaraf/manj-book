import axios from 'axios';

// API base URL configuration (kept for reference, but we'll use absolute paths)
const API_BASE_PATH = '/.netlify/functions/api';

// Create axios instance with base configuration
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response);
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Use replace to prevent user from navigating back to the broken page
      window.location.replace('/admin/login'); 
    }
    return Promise.reject(error);
  }
);

// Auth API calls - USING ABSOLUTE PATHS
export const authAPI = {
  login: (credentials) => api.post(`${API_BASE_PATH}/auth/login`, credentials),
  verifyToken: () => api.get(`${API_BASE_PATH}/auth/verify`),
  getProfile: () => api.get(`${API_BASE_PATH}/auth/profile`),
};

// Blog API calls - USING ABSOLUTE PATHS
export const blogAPI = {
  // Public endpoints
  getPosts: (params) => api.get(`${API_BASE_PATH}/blog/posts`, { params }),
  getPost: (id) => api.get(`${API_BASE_PATH}/blog/posts/${id}`),
  getPostById: (id) => api.get(`${API_BASE_PATH}/blog/posts/${id}`), // Alias for compatibility
  getCategories: () => api.get(`${API_BASE_PATH}/blog/categories`),
  
  // Admin endpoints
  getAdminPosts: () => api.get(`${API_BASE_PATH}/blog/admin/posts`),
  createPost: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        // Handle boolean values properly
        if (key === 'is_published') {
          formData.append(key, data[key] ? '1' : '0');
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    return api.post(`${API_BASE_PATH}/blog/admin/posts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updatePost: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        // Handle boolean values properly
        if (key === 'is_published') {
          formData.append(key, data[key] ? '1' : '0');
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    return api.put(`${API_BASE_PATH}/blog/admin/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deletePost: (id) => api.delete(`${API_BASE_PATH}/blog/admin/posts/${id}`),
};

// Blog API calls (Admin) - USING ABSOLUTE PATHS
export const adminAPI = {
  getPosts: () => api.get(`${API_BASE_PATH}/blog/admin/posts`),
  createPost: (formData) => api.post(`${API_BASE_PATH}/blog/admin/posts`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePost: (id, formData) => api.put(`${API_BASE_PATH}/blog/admin/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePost: (id) => api.delete(`${API_BASE_PATH}/blog/admin/posts/${id}`),
};

// General API utilities
export const apiUtils = {
  // Helper for handling API errors
  handleError: (error) => {
    console.error('API Error:', error);
    
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    if (error.message === 'Network Error') {
      return 'Unable to connect to server. Please check your connection.';
    }
    
    return 'An unexpected error occurred. Please try again.';
  },

  // Helper for formatting image URLs
  formatImageUrl: (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL (Cloudinary, Unsplash, etc.), return as-is
    if (imagePath.startsWith('http')) return imagePath;
    
    // For relative paths, you might need to handle differently
    // For now, assume it's already a valid URL
    return imagePath;
  },
};

export default api; 