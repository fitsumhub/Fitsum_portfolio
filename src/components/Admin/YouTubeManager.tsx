import { useState, useEffect, useCallback, memo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useNotification } from '../../contexts/NotificationContext';
import apiService from '../../services/api';
import { Plus, Edit, Trash2, ExternalLink, Save, X, Play, Youtube, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { YouTubeVideo as StoredYouTubeVideo } from '../../contexts/DataContext';

interface YouTubeVideoForm {
  id: string;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  featured: boolean;
}

const YouTubeManager = memo(() => {
  const { state, actions } = useData();
  const { addNotification } = useNotification();
  const videos = state.youtubeVideos || [];
  const loading = state.loading.youtubeVideos;
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [managerRef, managerVisible] = useScrollReveal({ threshold: 0.1 });
  const [formData, setFormData] = useState<YouTubeVideoForm>({
    id: '',
    title: '',
    description: '',
    videoId: '',
    thumbnail: '',
    duration: '',
    publishedAt: '',
    featured: false
  });

  // Load videos on mount (only once)
  useEffect(() => {
    if (videos.length === 0 && !loading && navigator.onLine) {
      actions.loadYouTubeVideos().catch(() => {
        // Silently handle errors
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  const handleSave = useCallback(async () => {
    try {
      const videoData = {
        title: formData.title,
        description: formData.description,
        video_id: formData.videoId,
        thumbnail_url: formData.thumbnail,
        channel: 'AplusEthiopia',
        featured: formData.featured,
        published_at: formData.publishedAt ? new Date(formData.publishedAt) : new Date()
      };

      if (isEditing) {
        await apiService.updateYouTubeVideo(isEditing, videoData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Video updated successfully!'
        });
      } else {
        await apiService.createYouTubeVideo(videoData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Video added successfully!'
        });
      }
      
      await actions.loadYouTubeVideos();
      setShowForm(false);
      setIsEditing(null);
      setFormData({
        id: '',
        title: '',
        description: '',
        videoId: '',
        thumbnail: '',
        duration: '',
        publishedAt: '',
        featured: false
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to ${isEditing ? 'update' : 'add'} video. Please try again.`
      });
    }
  }, [formData, isEditing, actions, addNotification]);

  const handleEdit = useCallback((video: StoredYouTubeVideo) => {
    setFormData({
      id: video._id,
      title: video.title || '',
      description: video.description || '',
      videoId: video.video_id || video.videoId || '',
      thumbnail: video.thumbnail_url || video.thumbnail || '',
      duration: '',
      publishedAt: video.published_at ? new Date(video.published_at).toISOString().split('T')[0] : '',
      featured: video.featured || false
    });
    setIsEditing(video._id);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }
    
    try {
      await apiService.deleteYouTubeVideo(id);
      await actions.loadYouTubeVideos();
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Video deleted successfully!'
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete video. Please try again.'
      });
    }
  }, [actions, addNotification]);

  const extractVideoId = useCallback((url: string) => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }, []);

  const handleVideoIdChange = useCallback((videoId: string) => {
    const extractedId = extractVideoId(videoId);
    setFormData(prev => ({
      ...prev,
      videoId: extractedId,
      thumbnail: extractedId ? `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg` : ''
    }));
  }, [extractVideoId]);

  return (
    <div ref={managerRef as React.RefObject<HTMLDivElement>} className="relative min-h-screen">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-pink-400/10 to-purple-400/10 animate-gradient opacity-50 -z-10"></div>
      
      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-red-400/10 dark:text-red-500/10 font-mono text-xs opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['video', 'youtube', 'play', 'export'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 space-y-6">
        <div className={`md:flex md:items-center md:justify-between ${managerVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Youtube className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  YouTube Content
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  <span>Manage your YouTube videos and playlists</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </button>
          </div>
        </div>

        {/* Videos Grid */}
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${managerVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {videos.map((video, index) => (
            <div 
              key={video._id} 
              className="group glass backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
            <div className="relative overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative">
                {(video.thumbnail_url || video.thumbnail) ? (
                  <img
                    src={video.thumbnail_url || video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-gray-400">No Thumbnail</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              {(video.featured) && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                    ⭐ Featured
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {video.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-white/20 dark:border-gray-700/50">
                <span className="font-medium">{video.views || 0} views</span>
                <span>{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Recently'}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="inline-flex items-center px-3 py-1.5 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="inline-flex items-center px-3 py-1.5 glass backdrop-blur-sm border border-red-500/30 dark:border-red-600/50 rounded-lg text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-105"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
                <a
                  href={`https://youtube.com/watch?v=${video.video_id || video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  title="Open video in new tab"
                  aria-label={`Open ${video.title} in new tab`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    {isEditing ? 'Edit Video' : 'Add New Video'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(null);
                    setFormData({
                      id: '',
                      title: '',
                      description: '',
                      videoId: '',
                      thumbnail: '',
                      duration: '',
                      publishedAt: '',
                      featured: false
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Close form"
                  aria-label="Close form"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                      placeholder="Enter video title"
                      aria-label="Video title"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label="Featured video"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      Featured Video
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Enter video description"
                    aria-label="Video description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    YouTube URL or Video ID
                  </label>
                  <input
                    type="text"
                    value={formData.videoId}
                    onChange={(e) => handleVideoIdChange(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or video ID"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2">
                      <img
                        src={formData.thumbnail}
                        alt="Video thumbnail"
                        className="w-32 h-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 5:30"
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Published Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                      aria-label="Published date"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setIsEditing(null);
                    setFormData({
                      id: '',
                      title: '',
                      description: '',
                      videoId: '',
                      thumbnail: '',
                      duration: '',
                      publishedAt: '',
                      featured: false
                    });
                  }}
                  className="px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Video' : 'Add Video'}
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

YouTubeManager.displayName = 'YouTubeManager';

export default YouTubeManager;
