import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Leaf } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-50">
        <div className="text-center">
          <div className="relative inline-block">
            <Leaf className="h-12 w-12 text-primary-600 animate-pulse" />
            <div className="absolute inset-0 animate-spin">
              <div className="h-12 w-12 border-2 border-transparent border-t-primary-400 rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-sage-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute; 