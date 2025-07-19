import axios from 'axios';

// API base URL configuration
const getBaseURL = () => {
  // Always use Netlify Functions - no separate backend needed!
  return '/.netlify/functions/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
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
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Blog API calls
export const blogAPI = {
  // Public endpoints
  getPosts: (params = {}) => api.get('/blog/posts', { params }),
  getPost: (id) => api.get(`/blog/posts/${id}`),
  getCategories: () => api.get('/blog/categories'),
  
  // Admin endpoints
  getAdminPosts: () => api.get('/blog/admin/posts'),
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
    return api.post('/blog/admin/posts', formData, {
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
    return api.put(`/blog/admin/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deletePost: (id) => api.delete(`/blog/admin/posts/${id}`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/blog/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
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