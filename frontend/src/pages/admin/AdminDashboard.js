import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { blogAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Plus, 
  BookOpen, 
  Edit3, 
  Calendar,
  Leaf,
  Eye,
  FileText,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Fetch admin posts for stats
  const { data: posts = [] } = useQuery(
    'admin-posts',
    () => blogAPI.getAdminPosts(),
    {
      select: (response) => response.data
    }
  );

  const publishedPosts = posts.filter(post => post.is_published);
  const draftPosts = posts.filter(post => !post.is_published);
  const recentPosts = posts.slice(0, 5);

  const stats = [
    {
      title: 'Total Posts',
      value: posts.length,
      icon: FileText,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      title: 'Published',
      value: publishedPosts.length,
      icon: Eye,
      color: 'text-forest-600',
      bgColor: 'bg-forest-100'
    },
    {
      title: 'Drafts',
      value: draftPosts.length,
      icon: Edit3,
      color: 'text-sage-600',
      bgColor: 'bg-sage-100'
    },
    {
      title: 'This Month',
      value: posts.filter(post => {
        const postDate = new Date(post.created_at);
        const now = new Date();
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      }).length,
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-forest-900">
                Welcome back, {user?.username}! 🌿
              </h1>
              <p className="mt-2 text-sage-700">
                Ready to tend to your digital garden? Let's create something beautiful.
              </p>
            </div>
            
            {/* Primary Action - Add New Post */}
            <Link
              to="/admin/posts/new"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
            >
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">New Post</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-forest-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-6 border-b border-sage-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-semibold text-forest-900">
                    Recent Posts
                  </h2>
                  <Link
                    to="/admin/posts"
                    className="btn-ghost text-sm"
                  >
                    View all
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {recentPosts.length > 0 ? (
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="flex items-center space-x-4 p-4 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors duration-200">
                        <div className={`w-3 h-3 rounded-full ${post.is_published ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-forest-900 truncate">
                            {post.title}
                          </h3>
                          <p className="text-xs text-sage-600">
                            {format(new Date(post.created_at), 'MMM dd, yyyy')} • {post.category}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.is_published 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {post.is_published ? 'Published' : 'Draft'}
                          </span>
                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            className="text-primary-600 hover:text-primary-700 p-1"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="h-8 w-8 text-sage-400" />
                    </div>
                    <h3 className="text-lg font-medium text-sage-700 mb-2">No posts yet</h3>
                    <p className="text-sage-600 mb-4">Start by creating your first blog post!</p>
                    <Link to="/admin/posts/new" className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Primary Action Card */}
            <div className="card overflow-hidden">
              <div className="bg-nature-gradient p-6 text-white text-center">
                <Leaf className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-lg font-display font-semibold mb-2">
                  Ready to Share?
                </h3>
                <p className="text-sm opacity-90 mb-4">
                  Create a new blog post and share your thoughts with the world.
                </p>
                <Link
                  to="/admin/posts/new"
                  className="inline-flex items-center space-x-2 bg-white text-forest-700 px-6 py-3 rounded-lg font-medium hover:bg-forest-50 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>New Post</span>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card p-6">
              <h3 className="text-lg font-display font-semibold text-forest-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/admin/posts"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors duration-200 group"
                >
                  <FileText className="h-5 w-5 text-primary-600" />
                  <span className="text-sage-700 group-hover:text-forest-700">Manage Posts</span>
                </Link>
                
                <Link
                  to="/blog"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors duration-200 group"
                >
                  <Eye className="h-5 w-5 text-forest-600" />
                  <span className="text-sage-700 group-hover:text-forest-700">View Blog</span>
                </Link>
                
                <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-sage-50 transition-colors duration-200 group w-full text-left">
                  <Settings className="h-5 w-5 text-sage-600" />
                  <span className="text-sage-700 group-hover:text-forest-700">Settings</span>
                </button>
              </div>
            </div>

            {/* Inspiration */}
            <div className="card p-6 bg-gradient-to-br from-primary-50 to-forest-50 border-primary-200">
              <div className="text-center">
                <Leaf className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="text-sm font-display font-semibold text-forest-900 mb-2">
                  Daily Inspiration
                </h3>
                <blockquote className="text-sm text-sage-700 italic">
                  "Every post is a seed, every word a new leaf in your garden of stories."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 