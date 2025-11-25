import { createContext, useContext, useReducer, ReactNode, useCallback, useMemo, useRef } from 'react';
import apiService from '../services/api';
import frontendSyncService, { BackendDataSummary } from '../services/frontend-sync';

// Types
export interface Project {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  github_url: string;
  live_url: string;
  technologies: string[];
  category: string;
  featured: boolean;
  status?: string;
  order_index: number;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  name: string;
  title: string;
  description: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  github_url: string;
  linkedin_url: string;
  youtube_ethiopia_url: string;
  youtube_hustler_url: string;
  telegram_username?: string;
  telegram_channel_url?: string;
  profile_image: string;
  resume_url: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar_url: string;
  rating: number;
  featured: boolean;
  order_index: number;
  createdAt: string;
  updatedAt: string;
}

export interface YouTubeVideo {
  _id: string;
  title: string;
  description: string;
  url?: string;
  video_id?: string;
  videoId?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  channel: string;
  createdAt: string;
  published_at?: string;
  featured?: boolean;
  views?: number;
}

interface DataState {
  projects: Project[];
  profile: Profile | null;
  testimonials: Testimonial[];
  youtubeVideos: YouTubeVideo[];
  loading: {
    projects: boolean;
    profile: boolean;
    testimonials: boolean;
    youtubeVideos: boolean;
  };
  errors: {
    projects: string | null;
    profile: string | null;
    testimonials: string | null;
    youtubeVideos: string | null;
  };
  lastUpdated: {
    projects: number | null;
    profile: number | null;
    testimonials: number | null;
    youtubeVideos: number | null;
  };
}

type DataAction =
  | { type: 'SET_LOADING'; payload: { key: keyof DataState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof DataState['errors']; value: string | null } }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_PROFILE'; payload: Profile }
  | { type: 'SET_TESTIMONIALS'; payload: Testimonial[] }
  | { type: 'SET_YOUTUBE_VIDEOS'; payload: YouTubeVideo[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'RESET' };

type ProjectsApiResult = {
  data?: Project[];
  projects?: Project[];
};

const initialState: DataState = {
  projects: [],
  profile: null,
  testimonials: [],
  youtubeVideos: [],
  loading: {
    projects: false,
    profile: false,
    testimonials: false,
    youtubeVideos: false,
  },
  errors: {
    projects: null,
    profile: null,
    testimonials: null,
    youtubeVideos: null,
  },
  lastUpdated: {
    projects: null,
    profile: null,
    testimonials: null,
    youtubeVideos: null,
  },
};

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          projects: Date.now(),
        },
      };
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          profile: Date.now(),
        },
      };
    case 'SET_TESTIMONIALS':
      return {
        ...state,
        testimonials: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          testimonials: Date.now(),
        },
      };
    case 'SET_YOUTUBE_VIDEOS':
      return {
        ...state,
        youtubeVideos: action.payload,
        lastUpdated: {
          ...state.lastUpdated,
          youtubeVideos: Date.now(),
        },
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT': {
      const updatedProjects = state.projects.map(project =>
        project._id === action.payload._id ? action.payload : project
      );
      return {
        ...state,
        projects: updatedProjects,
      };
    }
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project._id !== action.payload),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface DataContextType {
  state: DataState;
  actions: {
    loadProjects: () => Promise<void>;
    loadProfile: () => Promise<void>;
    loadTestimonials: () => Promise<void>;
    loadYouTubeVideos: () => Promise<void>;
    addProject: (project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateProject: (id: string, project: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    refreshAll: () => Promise<void>;
    syncWithFrontend: () => Promise<{ success: boolean; message: string }>;
    resetToFrontend: () => Promise<{ success: boolean; message: string }>;
    checkBackendData: () => Promise<BackendDataSummary>;
    reset: () => void;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const loadProjects = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'projects', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'projects', value: null } });
    
    try {
      const response = await apiService.getProjects();
      // Handle different response structures
      let projects: Project[] = [];
      if (Array.isArray(response)) {
        projects = response;
      } else if (response && typeof response === 'object') {
        const resp = response as ProjectsApiResult;
        if (Array.isArray(resp.data)) {
          projects = resp.data;
        } else if (Array.isArray(resp.projects)) {
          projects = resp.projects;
        }
      }
      
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      // Silently handle API errors - fallback data will be used
      // This is expected when backend server is not running
      const errorMessage = error instanceof Error ? error.message : 'Failed to load projects';
      dispatch({ type: 'SET_ERROR', payload: { key: 'projects', value: errorMessage } });
      // Set empty array on error to prevent undefined state
      dispatch({ type: 'SET_PROJECTS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'projects', value: false } });
    }
  }, []);

  const loadProfile = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'profile', value: null } });
    
    try {
      const profile = await apiService.getProfile();
      dispatch({ type: 'SET_PROFILE', payload: profile as Profile });
    } catch (error) {
      // Silently handle API errors - fallback data will be used
      // This is expected when backend server is not running
      const errorMessage = error instanceof Error ? error.message : 'Failed to load profile';
      dispatch({ type: 'SET_ERROR', payload: { key: 'profile', value: errorMessage } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: false } });
    }
  }, []);

  const loadTestimonials = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'testimonials', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'testimonials', value: null } });
    
    try {
      const testimonials = await apiService.getTestimonials();
      const testimonialsArray = Array.isArray(testimonials) ? testimonials : [];
      dispatch({ type: 'SET_TESTIMONIALS', payload: testimonialsArray as Testimonial[] });
    } catch (error) {
      // Silently handle API errors - fallback data will be used
      // This is expected when backend server is not running
      const errorMessage = error instanceof Error ? error.message : 'Failed to load testimonials';
      dispatch({ type: 'SET_ERROR', payload: { key: 'testimonials', value: errorMessage } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'testimonials', value: false } });
    }
  }, []);

  const loadYouTubeVideos = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'youtubeVideos', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'youtubeVideos', value: null } });
    
    try {
      const videos = await apiService.getYouTubeVideos();
      const videosArray = Array.isArray(videos) ? videos : [];
      dispatch({ type: 'SET_YOUTUBE_VIDEOS', payload: videosArray as YouTubeVideo[] });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load YouTube videos';
      dispatch({ type: 'SET_ERROR', payload: { key: 'youtubeVideos', value: errorMessage } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'youtubeVideos', value: false } });
    }
  }, []);

  const addProject = useCallback(async (projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding project:', projectData);
      const response = await apiService.createProject(projectData);
      console.log('Create response:', response);
      
      // Always refresh the projects list after create to ensure UI is updated
      console.log('Refreshing projects list after create...');
      await loadProjects();
      
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }, [loadProjects]);

  const updateProject = useCallback(async (id: string, projectData: Partial<Project>) => {
    try {
      console.log('Updating project with ID:', id, 'Data:', projectData);
      const response = await apiService.updateProject(id, projectData);
      console.log('Update response:', response);
      
      // Always refresh the projects list after update to ensure UI is updated
      console.log('Refreshing projects list after update...');
      await loadProjects();
      
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }, [loadProjects]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      console.log('Deleting project with ID:', id);
      await apiService.deleteProject(id);
      
      // Always refresh the projects list after delete to ensure UI is updated
      console.log('Refreshing projects list after delete...');
      await loadProjects();
      
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }, [loadProjects]);

  // Request deduplication - prevent multiple simultaneous requests
  const pendingRequestsRef = useRef<Set<string>>(new Set());

  const refreshAll = useCallback(async () => {
    const requestKey = 'refreshAll';
    
    // Check if request is already pending
    if (pendingRequestsRef.current.has(requestKey)) {
      return; // Skip duplicate request
    }

    pendingRequestsRef.current.add(requestKey);

    try {
      await Promise.all([
        loadProjects(),
        loadProfile(),
        loadTestimonials(),
        loadYouTubeVideos(),
      ]);
    } finally {
      pendingRequestsRef.current.delete(requestKey);
    }
  }, [loadProjects, loadProfile, loadTestimonials, loadYouTubeVideos]);

  const syncWithFrontend = useCallback(async () => {
    try {
      const response = await frontendSyncService.syncAll();
      if (response.success) {
        // Refresh all data after sync
        await refreshAll();
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Frontend sync failed:', error);
      throw error;
    }
  }, [refreshAll]);

  const resetToFrontend = useCallback(async () => {
    try {
      const response = await frontendSyncService.resetToFrontend();
      if (response.success) {
        // Refresh all data after reset
        await refreshAll();
        return { success: true, message: response.message };
      } else {
        throw new Error(response.error || 'Reset failed');
      }
    } catch (error) {
      console.error('Frontend reset failed:', error);
      throw error;
    }
  }, [refreshAll]);

  const checkBackendData = useCallback(async (): Promise<BackendDataSummary> => {
    try {
      return await frontendSyncService.checkBackendData();
    } catch (error) {
      console.error('Error checking backend data:', error);
      return { hasData: false, counts: { projects: 0, profile: 0, testimonials: 0, youtube: 0 } };
    }
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Memoize actions to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    loadProjects,
    loadProfile,
    loadTestimonials,
    loadYouTubeVideos,
    addProject,
    updateProject,
    deleteProject,
    refreshAll,
    syncWithFrontend,
    resetToFrontend,
    checkBackendData,
    reset,
  }), [loadProjects, loadProfile, loadTestimonials, loadYouTubeVideos, addProject, updateProject, deleteProject, refreshAll, syncWithFrontend, resetToFrontend, checkBackendData, reset]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    state,
    actions,
  }), [state, actions]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
