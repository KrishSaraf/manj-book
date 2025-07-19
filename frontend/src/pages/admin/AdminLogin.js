import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Leaf, Lock, User, Eye, EyeOff, TreePine, Flower } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, error, clearError } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already authenticated
  if (isAuthenticated()) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return;
    }

    setIsLoading(true);
    // The login function in useAuth handles success by updating context.
    // We just need to call it and let the component re-render.
    // It will set an error state on failure.
    await login(formData); 
    setIsLoading(false);

    // The redirect logic is handled by the useEffect that watches for
    // the `isAuthenticated` state change. No need to check for a result here.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-primary-50 to-forest-50 flex items-center justify-center nature-pattern">
      {/* Floating nature elements */}
      <div className="absolute top-20 left-10 text-primary-300/20">
        <Leaf className="h-16 w-16 transform rotate-12 floating-animation" />
      </div>
      <div className="absolute top-40 right-16 text-forest-300/20">
        <TreePine className="h-20 w-20 transform -rotate-12" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute bottom-32 left-20 text-sage-300/20">
        <Flower className="h-12 w-12 transform rotate-45" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative w-full max-w-md mx-auto px-4">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-sage-200 overflow-hidden">
          {/* Header */}
          <div className="bg-forest-gradient p-8 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Leaf className="h-6 w-6 text-white/80 animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-forest-100 text-sm">
              Sign in to your nature blog dashboard
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-forest-800">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sage-400" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-forest-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sage-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.username || !formData.password}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <Leaf className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </form>

            {/* Helper Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-sage-600">
                This is a private area for blog administration.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-sage-500">
                <Leaf className="h-3 w-3" />
                <span>Secured by nature-inspired authentication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-sage-600">
            Need help? The default credentials are in your configuration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 