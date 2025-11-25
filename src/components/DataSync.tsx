import { useEffect, useRef, useCallback } from 'react';
import { useData } from '../contexts/DataContext';

interface DataSyncProps {
  syncInterval?: number; // in milliseconds
  enableAutoSync?: boolean;
}

export function DataSync({ 
  syncInterval = 30000, // 30 seconds
  enableAutoSync = true 
}: DataSyncProps) {
  const { actions, state } = useData();
  const isSyncingRef = useRef(false);
  const lastSyncRef = useRef<number>(0);
  const refreshAllRef = useRef(actions.refreshAll);
  const stateRef = useRef(state);

  // Update refs when they change (without causing re-renders)
  useEffect(() => {
    refreshAllRef.current = actions.refreshAll;
    stateRef.current = state;
  }, [actions.refreshAll, state]);

  // Debounced refresh function - stable reference
  const debouncedRefresh = useCallback(async () => {
    const now = Date.now();
    const minInterval = 5000; // Minimum 5 seconds between refreshes
    
    if (now - lastSyncRef.current < minInterval) {
      return; // Skip if too soon
    }

    if (!navigator.onLine || isSyncingRef.current) {
      return;
    }

    // Check loading state from ref
    const hasActiveLoading = Object.values(stateRef.current.loading).some(loading => loading);
    if (hasActiveLoading) {
      return;
    }

    isSyncingRef.current = true;
    lastSyncRef.current = now;

    try {
      await refreshAllRef.current();
    } catch {
      // Silently handle errors (backend might not be available)
    } finally {
      isSyncingRef.current = false;
    }
  }, []); // Empty deps - uses refs

  // Initial load (only once on mount)
  useEffect(() => {
    if (!enableAutoSync) return;

    // Initial load with delay to avoid blocking initial render
    const timer = setTimeout(() => {
      if (navigator.onLine && !isSyncingRef.current) {
        debouncedRefresh();
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Set up interval for auto-sync - stable reference
  useEffect(() => {
    if (!enableAutoSync) return;

    const intervalId = setInterval(() => {
      debouncedRefresh();
    }, syncInterval);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncInterval, enableAutoSync]); // Don't include debouncedRefresh to prevent recreation

  // Sync on window focus (debounced) - stable reference
  useEffect(() => {
    const handleFocus = () => {
      // Debounce focus events
      setTimeout(() => {
        debouncedRefresh();
      }, 500);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only set up once

  // Sync when online (if was offline) - stable reference
  useEffect(() => {
    const handleOnline = () => {
      // Wait a bit after coming online
      setTimeout(() => {
        debouncedRefresh();
      }, 1000);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only set up once

  return null; // This component doesn't render anything
}

export default DataSync;
