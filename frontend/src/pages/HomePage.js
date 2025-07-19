import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { blogAPI, apiUtils } from '../utils/api';
import { BookOpen, ArrowRight, Calendar, Leaf, TreePine, Flower } from 'lucide-react';
import { format } from 'date-fns';

const HomePage = () => {
  // Fetch recent posts
  const { data: postsData, isLoading } = useQuery(
    'recent-posts',
    () => blogAPI.getPosts({ limit: 6 }),
    {
      select: (response) => response.data
    }
  );

  const recentPosts = postsData?.posts || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sage-50 via-primary-50 to-forest-50 nature-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
        
        {/* Floating nature elements */}
        <div className="absolute top-20 left-10 text-primary-300/30">
          <Leaf className="h-16 w-16 transform rotate-12 floating-animation" />
        </div>
        <div className="absolute top-40 right-16 text-forest-300/30">
          <TreePine className="h-20 w-20 transform -rotate-12" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-32 left-20 text-sage-300/30">
          <Flower className="h-12 w-12 transform rotate-45" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-forest-900 leading-tight">
                Welcome to My{' '}
                <span className="text-transparent bg-clip-text bg-nature-gradient">
                  Digital Garden
                </span>
              </h1>
              <p className="max-w-3xl mx-auto text-lg sm:text-xl text-sage-700 leading-relaxed">
                A serene sanctuary where books, nature, and thoughts intertwine. 
                Join me on literary adventures and peaceful reflections in this 
                nature-inspired corner of the internet.
              </p>
              
              {/* Personal Introduction */}
              <div className="max-w-2xl mx-auto mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-sage-200/50 shadow-soft">
                <p className="text-sage-800 leading-relaxed">
                  Hi, I'm <span className="font-semibold text-forest-700">Manjari Bagri</span> — an economics enthusiast with experience across finance at companies like Louis Dreyfus Company and EY. 
                  When I'm not diving into market analysis or research, you'll find me lost in books and sharing the stories that shape my world.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/blog"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 group"
              >
                <BookOpen className="h-5 w-5" />
                <span>Explore the Garden</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <div className="flex items-center space-x-2 text-sage-600 text-sm">
                <div className="flex -space-x-1">
                  <div className="w-8 h-8 bg-primary-200 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-forest-200 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-sage-200 rounded-full border-2 border-white"></div>
                </div>
                <span>Join the community of nature lovers & book enthusiasts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-forest-900">
              Recent Stories
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-sage-700">
              Fresh thoughts, book discoveries, and nature musings from the garden
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
          ) : recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
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
                      <Link to={`/blog/${post.id}`} className="stretched-link">
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
                      
                      <div className="text-primary-600 group-hover:text-primary-700">
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="mx-auto w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-sage-400" />
                </div>
                <h3 className="text-xl font-semibold text-sage-700">No posts yet</h3>
                <p className="text-sage-600">The garden is being prepared. Check back soon for fresh content!</p>
              </div>
            </div>
          )}

          {recentPosts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/blog"
                className="btn-secondary inline-flex items-center space-x-2 group"
              >
                <span>View All Posts</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-forest-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
            Cultivate Your Reading Journey
          </h2>
          <p className="text-xl text-forest-100 leading-relaxed">
            Every book is a seed, every page a new leaf in your personal garden of knowledge. 
            Let's grow together through the seasons of storytelling.
          </p>
          <Link
            to="/blog"
            className="inline-block bg-white text-forest-700 hover:bg-forest-50 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Start Reading
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 