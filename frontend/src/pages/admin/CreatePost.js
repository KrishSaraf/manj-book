import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { blogAPI, apiUtils } from '../../utils/api';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Image, 
  Upload,
  Leaf,
  BookOpen,
  FileText
} from 'lucide-react';

const CreatePost = () => {
  const [preview, setPreview] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      tags: '',
      is_published: true
    }
  });

  const watchedContent = watch('content');

  // Create post mutation
  const createMutation = useMutation(
    (data) => blogAPI.createPost(data),
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

    createMutation.mutate(formData);
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
    
    // Reset cursor position
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
                  Create New Post
                </h1>
                <p className="mt-2 text-sage-700">
                  Share your thoughts with the world 🌱
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
                    autoFocus
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
                      placeholder="Write your content in Markdown...

**This text will be bold**
*This text will be italic*

## This is a heading

> This is a quote

- List item 1
- List item 2

[Link text](https://example.com)

```
Code block
```"
                    />
                  ) : (
                    <div className="prose-nature min-h-96">
                      <div className="prose prose-lg max-w-none">
                        {watchedContent ? (
                          <div dangerouslySetInnerHTML={{ 
                            __html: watchedContent.replace(/\n/g, '<br>') 
                          }} />
                        ) : (
                          <p className="text-sage-500 italic">Nothing to preview yet. Start writing!</p>
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
                  Publish Settings
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
                      Publish immediately
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={createMutation.isLoading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createMutation.isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Create Post</span>
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
                    <span>Choose Image</span>
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

              {/* Inspiration */}
              <div className="card p-6 bg-gradient-to-br from-primary-50 to-forest-50 border-primary-200">
                <div className="text-center">
                  <Leaf className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                  <h3 className="text-sm font-display font-semibold text-forest-900 mb-2">
                    Writing Tip
                  </h3>
                  <p className="text-sm text-sage-700">
                    "Write with the seasons in your heart and the reader will feel the breeze of your words."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Error Display */}
        {createMutation.error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">
              {apiUtils.handleError(createMutation.error)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost; 