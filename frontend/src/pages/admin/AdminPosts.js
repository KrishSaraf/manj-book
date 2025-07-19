import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { blogAPI, apiUtils } from '../../utils/api';
import { Plus, Edit3, Trash2, Eye, EyeOff, Calendar, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const AdminPosts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  // Fetch admin posts
  const { data: posts = [], isLoading } = useQuery(
    'admin-posts',
    () => blogAPI.getAdminPosts(),
    {
      select: (response) => response.data
    }
  );

  // Delete post mutation
  const deleteMutation = useMutation(
    (id) => blogAPI.deletePost(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-posts');
      }
    }
  );

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'published' && post.is_published) ||
                          (filterStatus === 'draft' && !post.is_published);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      deleteMutation.mutate(post.id);
    }
  };

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-forest-900">
                Manage Posts
              </h1>
              <p className="mt-2 text-sage-700">
                Create, edit, and organize your blog posts
              </p>
            </div>
            
            <Link
              to="/admin/posts/new"
              className="btn-primary inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>New Post</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sage-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sage-600">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Status:</span>
              </div>
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: 'All Posts' },
                  { value: 'published', label: 'Published' },
                  { value: 'draft', label: 'Drafts' }
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => setFilterStatus(status.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      filterStatus === status.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 bg-sage-200 rounded w-1/3"></div>
                    <div className="h-4 bg-sage-200 rounded w-1/4"></div>
                    <div className="h-4 bg-sage-200 rounded w-1/6"></div>
                    <div className="h-4 bg-sage-200 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sage-50 border-b border-sage-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-sage-700">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-sage-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-sage-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${post.is_published ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          <div>
                            <h3 className="text-sm font-medium text-forest-900">{post.title}</h3>
                            {post.excerpt && (
                              <p className="text-xs text-sage-600 mt-1 line-clamp-1">{post.excerpt}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${
                          post.is_published 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          <span>{post.is_published ? 'Published' : 'Draft'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-sage-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {post.is_published && (
                            <Link
                              to={`/blog/${post.id}`}
                              className="text-sage-600 hover:text-primary-600 p-1"
                              title="View post"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          )}
                          <Link
                            to={`/admin/posts/edit/${post.id}`}
                            className="text-primary-600 hover:text-primary-700 p-1"
                            title="Edit post"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete post"
                            disabled={deleteMutation.isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-sage-400" />
                </div>
                <h3 className="text-lg font-medium text-sage-700">
                  {searchTerm || filterStatus !== 'all' ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-sage-600">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start by creating your first blog post!'
                  }
                </p>
                {(!searchTerm && filterStatus === 'all') && (
                  <Link to="/admin/posts/new" className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {filteredPosts.length > 0 && (
          <div className="mt-6 text-center text-sm text-sage-600">
            Showing {filteredPosts.length} of {posts.length} posts
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPosts; 