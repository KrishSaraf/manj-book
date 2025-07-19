import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Leaf, Menu, X, BookOpen, Home, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-sage-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-forest-800 hover:text-primary-600 transition-colors duration-200"
            onClick={closeMenu}
          >
            <div className="relative">
              <Leaf className="h-8 w-8 text-primary-600 floating-animation" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-forest-400 rounded-full opacity-60"></div>
            </div>
            <span className="text-xl font-display font-semibold">
              Nature Blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'text-primary-700 bg-primary-50' 
                  : 'text-sage-700 hover:text-primary-600 hover:bg-sage-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/blog"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/blog') || location.pathname.startsWith('/blog/') 
                  ? 'text-primary-700 bg-primary-50' 
                  : 'text-sage-700 hover:text-primary-600 hover:bg-sage-50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </Link>

            {isAuthenticated() && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname.startsWith('/admin') && location.pathname !== '/admin/login'
                      ? 'text-primary-700 bg-primary-50' 
                      : 'text-sage-700 hover:text-primary-600 hover:bg-sage-50'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sage-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}

            {!isAuthenticated() && (
              <Link
                to="/admin/login"
                className="btn-primary text-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-sage-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-sage-200">
              <Link
                to="/"
                onClick={closeMenu}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/') 
                    ? 'text-primary-700 bg-primary-50' 
                    : 'text-sage-700 hover:text-primary-600 hover:bg-sage-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/blog"
                onClick={closeMenu}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/blog') || location.pathname.startsWith('/blog/') 
                    ? 'text-primary-700 bg-primary-50' 
                    : 'text-sage-700 hover:text-primary-600 hover:bg-sage-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Link>

              {isAuthenticated() && (
                <>
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname.startsWith('/admin') && location.pathname !== '/admin/login'
                        ? 'text-primary-700 bg-primary-50' 
                        : 'text-sage-700 hover:text-primary-600 hover:bg-sage-50'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sage-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!isAuthenticated() && (
                <div className="pt-2">
                  <Link
                    to="/admin/login"
                    onClick={closeMenu}
                    className="btn-primary w-full text-center"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 