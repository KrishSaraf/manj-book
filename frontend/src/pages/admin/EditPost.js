import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { blogAPI, apiUtils } from '../../utils/api';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Image, 
  Upload,
  BookOpen,
  FileText,
  Trash2
} from 'lucide-react';

const EditPost = () => {
  const { id } = useParams();
  const [preview, setPreview] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();

  // Fetch post data
  const { data: post, isLoading } = useQuery(
    ['admin-post', id],
    () => blogAPI.getPost(id),
    {
      select: (response) => response.data,
      onSuccess: (data) => {
        // Populate form with existing data
        reset({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || '',
          category: data.category,
          tags: data.tags ? data.tags.join(', ') : '',
          is_published: data.is_published
        });
        
        // Set existing image preview
        if (data.featured_image) {
          setImagePreview(apiUtils.formatImageUrl(data.featured_image));
        }
      }
    }
  );

  const watchedContent = watch('content');

  // Update post mutation
  const updateMutation = useMutation(
    (data) => blogAPI.updatePost(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-posts');
        queryClient.invalidateQueries(['admin-post', id]);
        navigate('/admin/posts');
      }
    }
  );

  // Delete post mutation
  const deleteMutation = useMutation(
    () => blogAPI.deletePost(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-posts');
        navigate('/admin/posts');
      }
    }
  );

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      featured_image: imageFile,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${post?.title}"? This action cannot be undone.`)) {
      deleteMutation.mutate();
    }
  };

  const insertAtCursor = (text) => {
    const textarea = document.getElementById('content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = watchedContent;
    const before = current.substring(0, start);
    const after = current.substring(end);
    const newContent = before + text + after;
    setValue('content', newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const markdownHelpers = [
    { label: 'Bold', syntax: '**text**', icon: 'B' },
    { label: 'Italic', syntax: '*text*', icon: 'I' },
    { label: 'Heading', syntax: '## ', icon: 'H' },
    { label: 'Link', syntax: '[text](url)', icon: '🔗' },
    { label: 'Quote', syntax: '> ', icon: '"' },
    { label: 'Code', syntax: '`code`', icon: '</>' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold text-sage-700">Post not found</h1>
          <button onClick={() => navigate('/admin/posts')} className="btn-primary">
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/posts')}
                className="text-sage-600 hover:text-primary-600 transition-colors duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-display font-bold text-forest-900">
                  Edit Post
                </h1>
                <p className="mt-2 text-sage-700">
                  Refine your thoughts 🌱
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>{preview ? 'Edit' : 'Preview'}</span>
              </button>
              
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Delete post"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="card p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-forest-800">
                    <BookOpen className="h-5 w-5" />
                    <label className="font-medium">Post Title</label>
                  </div>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="w-full text-2xl font-display font-bold border-none bg-transparent placeholder-sage-400 focus:ring-0 focus:outline-none resize-none"
                    placeholder="Enter your post title..."
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm">{errors.title.message}</p>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="card">
                <div className="p-6 border-b border-sage-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-forest-800">
                      <FileText className="h-5 w-5" />
                      <label className="font-medium">Content</label>
                    </div>
                    
                    {/* Markdown Helpers */}
                    <div className="flex items-center space-x-1">
                      {markdownHelpers.map((helper, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => insertAtCursor(helper.syntax)}
                          className="px-2 py-1 text-xs font-mono bg-sage-100 hover:bg-sage-200 text-sage-700 rounded transition-colors duration-200"
                          title={helper.label}
                        >
                          {helper.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {!preview ? (
                    <textarea
                      id="content"
                      {...register('content', { required: 'Content is required' })}
                      rows={20}
                      className="w-full border-none bg-transparent placeholder-sage-400 focus:ring-0 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                    />
                  ) : (
                    <div className="prose-nature min-h-96">
                      <div className="prose prose-lg max-w-none">
                        {watchedContent ? (
                          <div dangerouslySetInnerHTML={{ 
                            __html: watchedContent.replace(/\n/g, '<br>') 
                          }} />
                        ) : (
                          <p className="text-sage-500 italic">Nothing to preview yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                  {errors.content && (
                    <p className="text-red-600 text-sm mt-2">{errors.content.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="card p-6">
                <h3 className="text-lg font-display font-semibold text-forest-900 mb-4">
                  Update Settings
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_published"
                      {...register('is_published')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-sage-300 rounded"
                    />
                    <label htmlFor="is_published" className="text-sm font-medium text-sage-700">
                      Published
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={updateMutation.isLoading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateMutation.isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Update Post</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Featured Image */}
              <div className="card p-6">
                <h3 className="text-lg font-display font-semibold text-forest-900 mb-4">
                  Featured Image
                </h3>
                
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-sage-300 rounded-lg p-6 text-center">
                      <Image className="h-8 w-8 text-sage-400 mx-auto mb-2" />
                      <p className="text-sm text-sage-600">No image selected</p>
                    </div>
                  )}
                  
                  <label className="btn-secondary w-full cursor-pointer inline-flex items-center justify-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Change Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Post Meta */}
              <div className="card p-6">
                <h3 className="text-lg font-display font-semibold text-forest-900 mb-4">
                  Post Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      {...register('excerpt')}
                      rows={3}
                      className="input-field resize-none text-sm"
                      placeholder="Brief description of your post..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Category
                    </label>
                    <select {...register('category')} className="input-field">
                      <option value="general">General</option>
                      <option value="books">Books</option>
                      <option value="nature">Nature</option>
                      <option value="thoughts">Thoughts</option>
                      <option value="reviews">Reviews</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Tags
                    </label>
                    <input
                      {...register('tags')}
                      className="input-field text-sm"
                      placeholder="reading, nature, thoughts (comma-separated)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Error Display */}
        {(updateMutation.error || deleteMutation.error) && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">
              {apiUtils.handleError(updateMutation.error || deleteMutation.error)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPost; 