import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

interface UseApiOptions {
  immediate?: boolean;
  retryOnError?: boolean;
  retryDelay?: number;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const {
    immediate = true,
    retryOnError = true,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      if (retryOnError) {
        setTimeout(() => {
          execute();
        }, retryDelay);
      }
    }
  }, [apiCall, retryOnError, retryDelay]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    refetch,
    reset
  };
}

// Specific hooks for different data types
export function useProjects() {
  return useApi(() => apiService.getProjects());
}

export function useProfile() {
  return useApi(() => apiService.getProfile());
}

export function useTestimonials() {
  return useApi(() => apiService.getTestimonials());
}

export function useYouTubeVideos() {
  return useApi(() => apiService.getYouTubeVideos());
}

export function useImages(category?: string) {
  return useApi(() => apiService.getImages(category));
}
