import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, BookOpen, Coffee } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-800 text-sage-100">
      {/* Nature pattern decoration */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-forest-500 to-sage-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-display font-semibold text-sage-50">
                Nature Blog
              </span>
            </div>
            <p className="text-sage-300 text-sm leading-relaxed">
              A digital garden where books and nature meet. Sharing stories, 
              reviews, and thoughts in a serene online sanctuary.
            </p>
            <div className="flex items-center space-x-1 text-sm text-sage-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span>and</span>
              <Coffee className="h-4 w-4 text-amber-400" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-sage-50">
              Explore
            </h3>
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block text-sage-300 hover:text-primary-400 transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className="block text-sage-300 hover:text-primary-400 transition-colors duration-200"
              >
                All Posts
              </Link>
              <a 
                href="/blog?category=books" 
                className="block text-sage-300 hover:text-primary-400 transition-colors duration-200"
              >
                Book Reviews
              </a>
              <a 
                href="/blog?category=nature" 
                className="block text-sage-300 hover:text-primary-400 transition-colors duration-200"
              >
                Nature Thoughts
              </a>
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-sage-50">
              Daily Inspiration
            </h3>
            <blockquote className="text-sage-300 italic text-sm leading-relaxed">
              "In every walk with nature, one receives far more than they seek. 
              The same is true with every book we read."
            </blockquote>
            <div className="flex items-center space-x-2 text-primary-400">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs text-sage-400">— Nature Blog Philosophy</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-forest-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-sage-400">
              © {currentYear} Nature Blog. All rights reserved.
            </div>
            <div className="text-sm text-sage-400">
              <span>Built with </span>
              <span className="text-primary-400">React</span>
              <span> & </span>
              <span className="text-primary-400">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 