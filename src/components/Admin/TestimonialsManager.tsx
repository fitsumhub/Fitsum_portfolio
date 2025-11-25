import { useState, useEffect, useCallback, memo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useNotification } from '../../contexts/NotificationContext';
import apiService from '../../services/api';
import { Plus, Edit, Trash2, Save, X, Star, MessageSquare, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { Testimonial } from '../../contexts/DataContext';

interface TestimonialForm {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  featured: boolean;
}

const TestimonialsManager = memo(() => {
  const { state, actions } = useData();
  const { addNotification } = useNotification();
  const testimonials = state.testimonials || [];
  const loading = state.loading.testimonials;
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [managerRef, managerVisible] = useScrollReveal({ threshold: 0.1 });
  const [formData, setFormData] = useState<TestimonialForm>({
    id: '',
    name: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    avatar: '',
    featured: false
  });

  // Load testimonials on mount (only once)
  useEffect(() => {
    if (testimonials.length === 0 && !loading && navigator.onLine) {
      actions.loadTestimonials().catch(() => {
        // Silently handle errors
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  const handleSave = useCallback(async () => {
    try {
      const testimonialData = {
        name: formData.name,
        position: formData.position,
        company: formData.company,
        content: formData.content,
        rating: formData.rating,
        avatar_url: formData.avatar,
        featured: formData.featured
      };

      if (isEditing) {
        await apiService.updateTestimonial(isEditing, testimonialData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Testimonial updated successfully!'
        });
      } else {
        await apiService.createTestimonial(testimonialData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Testimonial added successfully!'
        });
      }
      
      await actions.loadTestimonials();
      setShowForm(false);
      setIsEditing(null);
      setFormData({
        id: '',
        name: '',
        position: '',
        company: '',
        content: '',
        rating: 5,
        avatar: '',
        featured: false
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to ${isEditing ? 'update' : 'add'} testimonial. Please try again.`
      });
    }
  }, [formData, isEditing, actions, addNotification]);

  const handleEdit = useCallback((testimonial: Testimonial) => {
    setFormData({
      id: testimonial._id,
      name: testimonial.name || '',
      position: testimonial.position || '',
      company: testimonial.company || '',
      content: testimonial.content || '',
      rating: testimonial.rating || 5,
      avatar: testimonial.avatar_url || '',
      featured: testimonial.featured || false
    });
    setIsEditing(testimonial._id);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      await apiService.deleteTestimonial(id);
      await actions.loadTestimonials();
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Testimonial deleted successfully!'
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete testimonial. Please try again.'
      });
    }
  }, [actions, addNotification]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div ref={managerRef as React.RefObject<HTMLDivElement>} className="relative min-h-screen">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10 animate-gradient opacity-50 -z-10"></div>
      
      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-purple-400/10 dark:text-purple-500/10 font-mono text-xs opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['testimonial', 'review', 'quote', 'export'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 space-y-6">
        <div className={`md:flex md:items-center md:justify-between ${managerVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Testimonials Management
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  <span>Manage client testimonials and reviews</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${managerVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial._id} 
              className="group glass backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="h-14 w-14 rounded-full object-cover border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors">
                      <span className="text-white font-semibold text-lg">
                        {testimonial.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {testimonial.name}
                    </h4>
                    {(testimonial.featured) && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {testimonial.position} at {testimonial.company}
                  </p>
                  <div className="flex items-center mt-2">
                    {renderStars(testimonial.rating || 5)}
                  </div>
                </div>
              </div>
              <blockquote className="text-sm text-gray-700 dark:text-gray-300 mb-4 italic border-l-4 border-purple-500/30 pl-4">
                "{testimonial.content}"
              </blockquote>
              <div className="flex justify-between pt-4 border-t border-white/20 dark:border-gray-700/50">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="inline-flex items-center px-3 py-1.5 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
                    className="inline-flex items-center px-3 py-1.5 glass backdrop-blur-sm border border-red-500/30 dark:border-red-600/50 rounded-lg text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-105"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="glass backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(null);
                    setFormData({
                      id: '',
                      name: '',
                      position: '',
                      company: '',
                      content: '',
                      rating: 5,
                      avatar: '',
                      featured: false
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      Featured Testimonial
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Testimonial Content
                  </label>
                  <textarea
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="What did the client say about your work?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= formData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Client Avatar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                  />
                  {formData.avatar && (
                    <div className="mt-2">
                      <img
                        src={formData.avatar}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(null);
                    setFormData({
                      id: '',
                      name: '',
                      position: '',
                      company: '',
                      content: '',
                      rating: 5,
                      avatar: '',
                      featured: false
                    });
                  }}
                  className="px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
});

TestimonialsManager.displayName = 'TestimonialsManager';

export default TestimonialsManager;
