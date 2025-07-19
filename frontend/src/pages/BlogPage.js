import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { blogAPI, apiUtils } from '../utils/api';
import { Search, Filter, Calendar, ArrowRight, Leaf, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  // Fetch posts with filters
  const { data: postsData, isLoading: postsLoading } = useQuery(
    ['blog-posts', currentPage, selectedCategory, searchTerm],
    () => blogAPI.getPosts({
      page: currentPage,
      limit: 12,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      search: searchTerm || undefined
    }),
    {
      select: (response) => response.data,
      keepPreviousData: true
    }
  );

  // Fetch categories
  const { data: categoriesData } = useQuery(
    'categories',
    () => blogAPI.getCategories(),
    {
      select: (response) => response.data
    }
  );

  const posts = postsData?.posts || [];
  const pagination = postsData?.pagination || {};
  const categories = categoriesData || [];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, currentPage, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Header Section */}
      <section className="bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-forest-900">
              Explore the Garden
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-sage-700">
              Discover stories, book reviews, and nature-inspired thoughts in our collection of posts
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="w-full lg:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sage-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </form>

            {/* Categories */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sage-600">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                  }`}
                >
                  All Posts
                </button>
                {categories.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => handleCategoryChange(category.category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category.category
                        ? 'bg-primary-600 text-white'
                        : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                    }`}
                  >
                    {category.category} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-sage-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-sage-200 rounded w-3/4"></div>
                    <div className="h-4 bg-sage-200 rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-sage-200 rounded"></div>
                      <div className="h-3 bg-sage-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="card hover:shadow-xl transition-all duration-300 group">
                    {post.featured_image && (
                      <div className="relative overflow-hidden">
                        <img
                          src={apiUtils.formatImageUrl(post.featured_image)}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    )}
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-sage-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={post.created_at}>
                            {format(new Date(post.created_at), 'MMM dd, yyyy')}
                          </time>
                        </div>
                        {post.category && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-display font-semibold text-forest-900 group-hover:text-primary-600 transition-colors duration-200">
                        <Link to={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {post.excerpt && (
                        <p className="text-sage-700 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2 text-sm text-sage-600">
                          <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-primary-700" />
                          </div>
                          <span>{post.author_name || 'Nature Blogger'}</span>
                        </div>
                        
                        <Link 
                          to={`/blog/${post.id}`}
                          className="text-primary-600 hover:text-primary-700 group-hover:translate-x-1 transition-all duration-200"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-4 py-2 text-sm font-medium text-sage-700 bg-white border border-sage-300 rounded-lg hover:bg-sage-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            page === currentPage
                              ? 'bg-primary-600 text-white'
                              : 'text-sage-700 bg-white border border-sage-300 hover:bg-sage-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-4 py-2 text-sm font-medium text-sage-700 bg-white border border-sage-300 rounded-lg hover:bg-sage-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="mx-auto w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-sage-400" />
                </div>
                <h3 className="text-xl font-semibold text-sage-700">No posts found</h3>
                <p className="text-sage-600">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'The garden is being prepared. Check back soon for fresh content!'
                  }
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setCurrentPage(1);
                    }}
                    className="btn-secondary"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage; 