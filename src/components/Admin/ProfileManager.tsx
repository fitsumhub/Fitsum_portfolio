import { useState, useEffect, useCallback, memo } from 'react';
import { Save, User, Sparkles } from 'lucide-react';
import apiService from '../../services/api';
import { useData } from '../../contexts/DataContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface ProfileData {
  name: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  youtube_ethiopia_url: string;
  youtube_hustler_url: string;
  telegram_username?: string;
  telegram_channel_url?: string;
  profile_image: string;
}

const ProfileManager = memo(() => {
  const { state, actions } = useData();
  const { addNotification } = useNotification();
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    title: '',
    description: '',
    email: '',
    phone: '',
    location: '',
    github_url: '',
    linkedin_url: '',
    youtube_ethiopia_url: '',
    youtube_hustler_url: '',
    telegram_username: '',
    telegram_channel_url: '',
    profile_image: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileRef, profileVisible] = useScrollReveal({ threshold: 0.1 });

  // Load profile from DataContext or API
  useEffect(() => {
    if (state.profile) {
      setProfile({
        name: state.profile.name || '',
        title: state.profile.title || '',
        description: state.profile.description || '',
        email: state.profile.email || '',
        phone: state.profile.phone || '',
        location: state.profile.location || '',
        github_url: state.profile.github_url || '',
        linkedin_url: state.profile.linkedin_url || '',
        youtube_ethiopia_url: state.profile.youtube_ethiopia_url || '',
        youtube_hustler_url: state.profile.youtube_hustler_url || '',
        telegram_username: state.profile.telegram_username || '',
        telegram_channel_url: state.profile.telegram_channel_url || '',
        profile_image: state.profile.profile_image || ''
      });
    } else if (!state.loading.profile && navigator.onLine) {
      actions.loadProfile().catch(() => {
        // Silently handle errors
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.profile]); // Only reload when profile changes

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage('');
      await apiService.updateProfile(profile);
      // Refresh profile from context
      await actions.loadProfile();
      setMessage('Profile updated successfully!');
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Profile updated successfully!'
      });
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Error saving profile');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save profile. Please try again.'
      });
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [profile, actions, addNotification]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setMessage('');
        const result = await apiService.uploadProfileImage(file);
        // Safely extract image URL from various response shapes
        let imageUrl = '';
        if (result) {
          if (typeof result === 'object') {
            const r = result as Record<string, unknown>;
            if (typeof r.imageUrl === 'string') imageUrl = r.imageUrl;
            else if (r.data && typeof r.data === 'object' && typeof (r.data as Record<string, unknown>).imageUrl === 'string') {
              imageUrl = (r.data as Record<string, unknown>).imageUrl as string;
            } else if (typeof r.url === 'string') imageUrl = r.url;
          }
        }
        if (imageUrl) {
          setProfile(prev => ({ ...prev, profile_image: imageUrl }));
        }
        setMessage('Profile image uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error uploading image:', error);
        setMessage('Error uploading image');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <div ref={profileRef as React.RefObject<HTMLDivElement>} className="relative min-h-screen">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient opacity-50 -z-10"></div>
      
      <div className="relative z-10 space-y-6">
        <div className={`md:flex md:items-center md:justify-between ${profileVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Profile Management
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span>Update your personal information and bio</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`glass backdrop-blur-sm border rounded-xl p-4 ${profileVisible ? 'animate-fade-in-up' : 'opacity-0'} ${
            message.includes('Error') 
              ? 'border-red-500/30 text-red-700 dark:text-red-300' 
              : 'border-green-500/30 text-green-700 dark:text-green-300'
          }`} style={{ animationDelay: '0.1s' }}>
            {message}
          </div>
        )}

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${profileVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
        {/* Profile Image */}
        <div className="lg:col-span-1">
          <div className="glass backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Profile Image
            </h3>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={profile.profile_image || '/images/profile.jpg'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NCA0MEM3Mi44NDI3IDQwIDgwIDQ3LjE1NzMgODAgNTZWNzJDODAgODAuODQyNyA3Mi44NDI3IDg4IDY0IDg4QzU1LjE1NzMgODggNDggODAuODQyNyA0OCA3MlY1NkM0OCA0Ny4xNTczIDU1LjE1NzMgNDAgNjQgNDBaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0zMiA5NkMzMiA4Ny4xNTczIDM5LjE1NzMgODAgNDggODBINDBDNDguODQyNyA4MCA1NiA4Ny4xNTczIDU2IDk2VjEwNEM1NiAxMTIuODQzIDQ4Ljg0MjcgMTIwIDQwIDEyMEgzMkMyMy4xNTczIDEyMCAxNiAxMTIuODQzIDE2IDEwNFY5NloiIGZpbGw9IiM5QjlCOUIiLz4KPC9zdmc+';
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload New Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="glass backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={profile.description}
                    onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={profile.github_url}
                      onChange={(e) => setProfile(prev => ({ ...prev, github_url: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={profile.linkedin_url}
                      onChange={(e) => setProfile(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      YouTube Ethiopia URL
                    </label>
                    <input
                      type="url"
                      value={profile.youtube_ethiopia_url}
                      onChange={(e) => setProfile(prev => ({ ...prev, youtube_ethiopia_url: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      YouTube Hustler URL
                    </label>
                    <input
                      type="url"
                      value={profile.youtube_hustler_url}
                      onChange={(e) => setProfile(prev => ({ ...prev, youtube_hustler_url: e.target.value }))}
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Telegram Username
                    </label>
                    <input
                      type="text"
                      value={profile.telegram_username}
                      onChange={(e) => setProfile(prev => ({ ...prev, telegram_username: e.target.value }))}
                      placeholder="@fitsum00000"
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Telegram Channel URL
                    </label>
                    <input
                      type="url"
                      value={profile.telegram_channel_url}
                      onChange={(e) => setProfile(prev => ({ ...prev, telegram_channel_url: e.target.value }))}
                      placeholder="https://t.me/AplusHustler"
                      className="mt-1 block w-full glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white sm:text-sm transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
});

ProfileManager.displayName = 'ProfileManager';

export default ProfileManager;
