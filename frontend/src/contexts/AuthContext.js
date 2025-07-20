import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiUtils } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          // Verify token is still valid
          const response = await authAPI.verifyToken();
          if (response.data.valid) {
            setUser(JSON.parse(savedUser));
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      console.log('🔐 AuthContext: Login function called');
      console.log('🔐 AuthContext: Credentials received:', { username: credentials.username, password: '***' });
      
      setLoading(true);
      setError(null);

      console.log('🔐 AuthContext: About to call authAPI.login');
      console.log('🔐 AuthContext: API endpoint should be:', '/.netlify/functions/api/auth/login');
      
      const response = await authAPI.login(credentials);
      
      console.log('🔐 AuthContext: API response received');
      console.log('🔐 AuthContext: Response status:', response.status);
      console.log('🔐 AuthContext: Response data:', response.data);
      
      const { token, user: userData } = response.data;
      
      console.log('🔐 AuthContext: Extracted token:', token ? 'EXISTS' : 'MISSING');
      console.log('🔐 AuthContext: Extracted user data:', userData);

      // Save to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('🔐 AuthContext: Saved to localStorage');

      // Update state
      setUser(userData);
      console.log('🔐 AuthContext: Updated user state');

      const successResult = { success: true, user: userData };
      console.log('🔐 AuthContext: Returning success result:', successResult);
      return successResult;
    } catch (error) {
      console.log('🔐 AuthContext: ERROR occurred');
      console.error('🔐 AuthContext: Error object:', error);
      console.error('🔐 AuthContext: Error message:', error.message);
      console.error('🔐 AuthContext: Error response:', error.response);
      
      const errorMessage = apiUtils.handleError(error);
      console.log('🔐 AuthContext: Processed error message:', errorMessage);
      
      setError(errorMessage);
      
      const failureResult = { success: false, error: errorMessage };
      console.log('🔐 AuthContext: Returning failure result:', failureResult);
      return failureResult;
    } finally {
      console.log('🔐 AuthContext: Setting loading to false');
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('authToken');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAdmin,
    isAuthenticated,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 