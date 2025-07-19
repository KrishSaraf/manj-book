import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogAPI, apiUtils } from '../utils/api';
import { Calendar, ArrowLeft, Tag, User, Leaf } from 'lucide-react';
import { format } from 'date-fns';

const PostPage = () => {
  const { id } = useParams();

  const { data: post, isLoading, error } = useQuery(
    ['blog-post', id],
    () => blogAPI.getPost(id),
    {
      select: (response) => response.data,
      retry: false
    }
  );

  if (error && error.response?.status === 404) {
    return <Navigate to="/blog" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-sage-200 rounded w-1/4"></div>
            <div className="h-64 bg-sage-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-12 bg-sage-200 rounded w-3/4"></div>
              <div className="h-4 bg-sage-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-sage-200 rounded"></div>
                <div className="h-4 bg-sage-200 rounded w-5/6"></div>
                <div className="h-4 bg-sage-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold text-sage-700">Post not found</h1>
          <Link to="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all posts</span>
          </Link>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={apiUtils.formatImageUrl(post.featured_image)}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8 space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-forest-900 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-sage-700 leading-relaxed italic">
              {post.excerpt}
            </p>
          )}

          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sage-600 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <div className="font-medium text-forest-800">
                  {post.author_name || 'Nature Blogger'}
                </div>
                <div className="text-xs text-sage-500">Author</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.created_at}>
                {format(new Date(post.created_at), 'MMMM dd, yyyy')}
              </time>
            </div>

            {post.category && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-medium"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <div className="bg-white rounded-xl shadow-md border border-sage-200 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="prose-nature">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-display font-bold text-forest-900 mt-8 mb-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-display font-bold text-forest-800 mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-display font-semibold text-forest-700 mt-5 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-sage-800 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary-300 bg-primary-50 pl-6 py-4 my-6 italic text-forest-700">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-4 text-sage-800">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 mb-4 text-sage-800">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-primary-600 hover:text-primary-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-sage-100 text-forest-800 px-2 py-1 rounded text-sm">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-sage-100 p-4 rounded-lg overflow-x-auto mb-4">
                        <code className="text-forest-800 text-sm">{children}</code>
                      </pre>
                    );
                  },
                  img: ({ src, alt }) => (
                    <div className="my-6">
                      <img
                        src={src}
                        alt={alt}
                        className="w-full rounded-lg shadow-md"
                      />
                      {alt && (
                        <p className="text-center text-sm text-sage-600 mt-2 italic">
                          {alt}
                        </p>
                      )}
                    </div>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-sage-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Leaf className="h-6 w-6 text-primary-600" />
              <span className="text-sage-600">
                Thank you for reading! 🌱
              </span>
            </div>
            
            <Link
              to="/blog"
              className="btn-ghost"
            >
              More posts
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default PostPage; 