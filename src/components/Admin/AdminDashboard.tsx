import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { 
  Briefcase, 
  Youtube, 
  MessageSquare, 
  Plus,
  Edit,
  Eye,
  TrendingUp,
  RefreshCw,
  Download,
  Code,
  Terminal,
  Sparkles,
  Zap,
  ShieldCheck,
  ServerCog,
  Loader2,
  UploadCloud,
  RotateCcw,
  Search,
  ExternalLink,
  AlertTriangle,
  Database,
  ArrowUpRight,
  PlayCircle,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  BarChart3,
  Filter,
  Calendar,
  Users,
  Globe,
  FileText,
  Image as ImageIcon,
  Settings,
  ChevronRight,
  MoreVertical,
  Bell
} from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCounter } from '../../hooks/useCounter';
import type { BackendDataSummary } from '../../services/frontend-sync';
import { frontendData } from '../../data/frontendData';

interface DashboardStats {
  totalProjects: number;
  totalVideos: number;
  totalTestimonials: number;
  totalViews: number;
  featuredProjects: number;
  averageRating: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
    status: string;
    icon: React.ReactNode;
  }>;
}

type DataStatus = 'ok' | 'warning' | 'error' | 'loading';
type BackendDatasetKey = keyof BackendDataSummary['counts'];

interface DataHealthItem {
  key: string;
  label: string;
  count: number;
  status: DataStatus;
  statusLabel: string;
  lastUpdatedLabel: string;
  backendCount: number | null;
  backendMismatch: boolean;
  error: string | null;
  icon: React.ReactNode;
  color: string;
}

const STATUS_CLASS_MAP: Record<DataStatus, string> = {
  ok: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  error: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  loading: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
};

const STALE_THRESHOLD_MS = 1000 * 60 * 60 * 12; // 12 hours

const AdminDashboard = memo(() => {
  const { addNotification } = useNotification();
  const { state, actions } = useData();
  const navigate = useNavigate();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [backendSummary, setBackendSummary] = useState<BackendDataSummary | null>(null);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [backendCheckedAt, setBackendCheckedAt] = useState<Date | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured' | 'recent'>('all');
  const [showFrontendData, setShowFrontendData] = useState(false);
  const [isLoadingFrontendData, setIsLoadingFrontendData] = useState(false);
  const hasShownBackendErrorRef = useRef(false);
  
  const [dashboardRef, dashboardVisible] = useScrollReveal({ threshold: 0.1 });

  // Calculate enhanced stats from real data
  const stats = useMemo<DashboardStats>(() => {
    const projects = state.projects || [];
    const videos = state.youtubeVideos || [];
    const testimonials = state.testimonials || [];
    
    const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
    const featuredProjects = projects.filter(p => p.featured).length;
    const averageRating = testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length
      : 0;

    const recentActivity = [
      ...projects.slice(0, 3).map((project, index) => ({
        id: `project-${project._id}`,
        type: 'project',
        title: project.title,
        timestamp: project.updatedAt 
          ? new Date(project.updatedAt).toLocaleDateString()
          : 'Recently',
        status: project.status?.toLowerCase() || 'completed',
        icon: <Briefcase className="h-4 w-4" />
      })),
      ...videos.slice(0, 2).map((video) => ({
        id: `video-${video._id}`,
        type: 'video',
        title: video.title || 'New YouTube video',
        timestamp: video.createdAt 
          ? new Date(video.createdAt).toLocaleDateString()
          : 'Recently',
        status: 'published',
        icon: <Youtube className="h-4 w-4" />
      })),
      ...testimonials.slice(0, 1).map((testimonial) => ({
        id: `testimonial-${testimonial._id}`,
        type: 'testimonial',
        title: `Testimonial from ${testimonial.name}`,
        timestamp: testimonial.createdAt 
          ? new Date(testimonial.createdAt).toLocaleDateString()
          : 'Recently',
        status: 'completed',
        icon: <MessageSquare className="h-4 w-4" />
      }))
    ].slice(0, 6);

    return {
      totalProjects: projects.length,
      totalVideos: videos.length,
      totalTestimonials: testimonials.length,
      totalViews,
      featuredProjects,
      averageRating,
      recentActivity
    };
  }, [state.projects, state.youtubeVideos, state.testimonials]);

  const formatLastUpdated = useCallback((timestamp: number | null) => {
    if (!timestamp) return 'Not loaded yet';
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }, []);

  // Counter hooks
  const { count: projectsCount, animate: animateProjects } = useCounter(stats.totalProjects, { duration: 1500, startOnMount: false });
  const { count: videosCount, animate: animateVideos } = useCounter(stats.totalVideos, { duration: 1500, startOnMount: false });
  const { count: testimonialsCount, animate: animateTestimonials } = useCounter(stats.totalTestimonials, { duration: 1500, startOnMount: false });
  const { count: viewsCount, animate: animateViews } = useCounter(stats.totalViews, { duration: 2000, startOnMount: false });

  // Animate counters when dashboard becomes visible
  useEffect(() => {
    if (dashboardVisible) {
      animateProjects();
      animateVideos();
      animateTestimonials();
      animateViews();
    }
  }, [dashboardVisible, animateProjects, animateVideos, animateTestimonials, animateViews]);

  // Check API status
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/health`);
        setApiStatus(response.ok ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load data on mount
  useEffect(() => {
    if (navigator.onLine) {
      actions.refreshAll().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBackendSummary = useCallback(async () => {
    setIsCheckingBackend(true);
    try {
      const summary = await actions.checkBackendData();
      setBackendSummary(summary);
      setBackendCheckedAt(new Date());
      hasShownBackendErrorRef.current = false;
    } catch (error) {
      console.error('Backend status check failed:', error);
      if (!hasShownBackendErrorRef.current) {
        addNotification({
          type: 'error',
          title: 'Backend Check Failed',
          message: 'Unable to verify backend data status. Please try again later.'
        });
        hasShownBackendErrorRef.current = true;
      }
    } finally {
      setIsCheckingBackend(false);
    }
  }, [actions, addNotification]);

  useEffect(() => {
    loadBackendSummary();
    const interval = setInterval(loadBackendSummary, 60000);
    return () => clearInterval(interval);
  }, [loadBackendSummary]);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await actions.refreshAll();
      setLastUpdated(new Date());
      addNotification({
        type: 'success',
        title: 'Data Refreshed',
        message: 'Dashboard data has been updated successfully.'
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh dashboard data. Please check your connection.'
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [actions, addNotification]);

  const exportData = useCallback(() => {
    const data = {
      stats,
      projects: state.projects,
      videos: state.youtubeVideos,
      testimonials: state.testimonials,
      profile: state.profile,
      lastUpdated,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addNotification({
      type: 'success',
      title: 'Data Exported',
      message: 'Dashboard data has been exported successfully.'
    });
  }, [stats, state, lastUpdated, addNotification]);

  const quickActions = useMemo(() => [
    {
      title: 'New Project',
      description: 'Create project',
      icon: <Plus className="h-5 w-5" />,
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-600 to-cyan-600',
      onClick: () => navigate('/fitsum/projects')
    },
    {
      title: 'Add Video',
      description: 'YouTube video',
      icon: <Youtube className="h-5 w-5" />,
      gradient: 'from-red-500 to-pink-500',
      hoverGradient: 'from-red-600 to-pink-600',
      onClick: () => navigate('/fitsum/youtube')
    },
    {
      title: 'Testimonial',
      description: 'Add feedback',
      icon: <MessageSquare className="h-5 w-5" />,
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'from-emerald-600 to-teal-600',
      onClick: () => navigate('/fitsum/testimonials')
    },
    {
      title: 'Analytics',
      description: 'View insights',
      icon: <BarChart3 className="h-5 w-5" />,
      gradient: 'from-purple-500 to-indigo-500',
      hoverGradient: 'from-purple-600 to-indigo-600',
      onClick: () => navigate('/fitsum/data-sync')
    }
  ], [navigate]);

  const filteredProjects = useMemo(() => {
    let projects = state.projects || [];
    
    // Apply search filter
    if (projectSearch.trim()) {
      const query = projectSearch.trim().toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.technologies?.some(t => t.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (activeFilter === 'featured') {
      projects = projects.filter(p => p.featured);
    } else if (activeFilter === 'recent') {
      projects = projects.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      }).slice(0, 5);
    }
    
    return projects.slice(0, 8);
  }, [projectSearch, activeFilter, state.projects]);

  const dataHealth = useMemo<DataHealthItem[]>(() => {
    const datasetConfigs: Array<{
      key: 'projects' | 'profile' | 'testimonials' | 'youtubeVideos';
      label: string;
      count: number;
      loading: boolean;
      error: string | null;
      lastUpdated: number | null;
      backendKey: BackendDatasetKey;
      icon: React.ReactNode;
      color: string;
    }> = [
      {
        key: 'projects',
        label: 'Projects',
        count: state.projects.length,
        loading: state.loading.projects,
        error: state.errors.projects,
        lastUpdated: state.lastUpdated.projects,
        backendKey: 'projects',
        icon: <Briefcase className="h-5 w-5" />,
        color: 'blue'
      },
      {
        key: 'profile',
        label: 'Profile',
        count: state.profile ? 1 : 0,
        loading: state.loading.profile,
        error: state.errors.profile,
        lastUpdated: state.lastUpdated.profile,
        backendKey: 'profile',
        icon: <Users className="h-5 w-5" />,
        color: 'purple'
      },
      {
        key: 'testimonials',
        label: 'Testimonials',
        count: state.testimonials.length,
        loading: state.loading.testimonials,
        error: state.errors.testimonials,
        lastUpdated: state.lastUpdated.testimonials,
        backendKey: 'testimonials',
        icon: <MessageSquare className="h-5 w-5" />,
        color: 'emerald'
      },
      {
        key: 'youtubeVideos',
        label: 'YouTube',
        count: state.youtubeVideos.length,
        loading: state.loading.youtubeVideos,
        error: state.errors.youtubeVideos,
        lastUpdated: state.lastUpdated.youtubeVideos,
        backendKey: 'youtube',
        icon: <Youtube className="h-5 w-5" />,
        color: 'red'
      }
    ];

    const statusLabelMap: Record<DataStatus, string> = {
      ok: 'Healthy',
      warning: 'Stale',
      error: 'Error',
      loading: 'Loading'
    };

    return datasetConfigs.map((dataset) => {
      let status: DataStatus = 'ok';

      if (dataset.loading) {
        status = 'loading';
      } else if (dataset.error) {
        status = 'error';
      } else if (!dataset.lastUpdated || Date.now() - dataset.lastUpdated > STALE_THRESHOLD_MS) {
        status = 'warning';
      }

      const backendCount = backendSummary ? backendSummary.counts[dataset.backendKey] : null;
      const backendMismatch = backendCount !== null && backendCount !== dataset.count;

      if (backendMismatch && status === 'ok') {
        status = 'warning';
      }

      return {
        key: dataset.key,
        label: dataset.label,
        count: dataset.count,
        status,
        statusLabel: statusLabelMap[status],
        lastUpdatedLabel: formatLastUpdated(dataset.lastUpdated),
        backendCount,
        backendMismatch,
        error: dataset.error,
        icon: dataset.icon,
        color: dataset.color
      };
    });
  }, [
    state.projects.length,
    state.profile,
    state.testimonials.length,
    state.youtubeVideos.length,
    state.loading,
    state.errors,
    state.lastUpdated,
    backendSummary,
    formatLastUpdated
  ]);

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Import frontendSyncService to use syncAll with data
      const frontendSyncService = (await import('../../services/frontend-sync')).default;
      const result = await frontendSyncService.syncAll(frontendData);
      await actions.refreshAll();
      setLastUpdated(new Date());
      await loadBackendSummary();
      addNotification({
        type: 'success',
        title: 'Content Synced',
        message: result.message || `Synced ${frontendData.projects.length} projects, ${frontendData.testimonials.length} testimonials, ${frontendData.youtubeVideos.length} videos, and profile to the backend.`
      });
    } catch (error) {
      console.error('Sync failed:', error);
      addNotification({
        type: 'error',
        title: 'Sync Failed',
        message: error instanceof Error ? error.message : 'Unable to sync frontend data.'
      });
    } finally {
      setIsSyncing(false);
    }
  }, [actions, addNotification, loadBackendSummary]);

  const handleReset = useCallback(async () => {
    setIsResetting(true);
    try {
      // Import frontendSyncService to use resetToFrontend with data
      const frontendSyncService = (await import('../../services/frontend-sync')).default;
      const result = await frontendSyncService.resetToFrontend(frontendData);
      await actions.refreshAll();
      setLastUpdated(new Date());
      await loadBackendSummary();
      addNotification({
        type: 'success',
        title: 'Frontend Data Restored',
        message: result.message || `Backend has been reset with ${frontendData.projects.length} projects, ${frontendData.testimonials.length} testimonials, ${frontendData.youtubeVideos.length} videos, and profile.`
      });
    } catch (error) {
      console.error('Reset failed:', error);
      addNotification({
        type: 'error',
        title: 'Reset Failed',
        message: error instanceof Error ? error.message : 'Unable to reset backend data.'
      });
    } finally {
      setIsResetting(false);
    }
  }, [actions, addNotification, loadBackendSummary]);

  const topContent = useMemo(() => {
    const videos = state.youtubeVideos || [];
    const testimonials = state.testimonials || [];

    const topVideo = videos.length
      ? [...videos].sort((a, b) => (b.views || 0) - (a.views || 0))[0]
      : null;

    const latestTestimonial = testimonials.length
      ? [...testimonials].sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        })[0]
      : null;

    return { topVideo, latestTestimonial };
  }, [state.youtubeVideos, state.testimonials]);

  // Frontend data stats
  const frontendStats = useMemo(() => {
    return {
      projects: frontendData.projects.length,
      profile: frontendData.profile ? 1 : 0,
      testimonials: frontendData.testimonials.length,
      youtubeVideos: frontendData.youtubeVideos.length,
      totalViews: frontendData.youtubeVideos.reduce((sum, v) => sum + (v.views || 0), 0)
    };
  }, []);

  // Load frontend data into context
  const loadFrontendData = useCallback(async () => {
    setIsLoadingFrontendData(true);
    try {
      // Dispatch frontend data to context
      // Note: This would need to be added to DataContext actions
      // For now, we'll use the sync functionality
      addNotification({
        type: 'info',
        title: 'Frontend Data',
        message: 'Use "Sync to Backend" to add frontend data to the database.'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load frontend data.'
      });
    } finally {
      setIsLoadingFrontendData(false);
    }
  }, [addNotification]);

  return (
    <div ref={dashboardRef as React.RefObject<HTMLDivElement>} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className={`sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm ${dashboardVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <Terminal className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Last updated {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${dashboardVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                stats.featuredProjects > 0 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {stats.featuredProjects} featured
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{projectsCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Active portfolio items</p>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Youtube className="h-6 w-6 text-white" />
              </div>
              <div className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {viewsCount.toLocaleString()} views
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">YouTube Videos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{videosCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Published content</p>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {stats.averageRating.toFixed(1)}★ avg
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Testimonials</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{testimonialsCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Client feedback</p>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                apiStatus === 'online'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {apiStatus === 'online' ? 'Online' : 'Offline'}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{viewsCount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Across all content</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="group relative p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-transparent transition-all duration-300 hover:shadow-lg"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300`} />
                    <div className="relative flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                          {action.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h2>
                </div>
                <button
                  onClick={() => navigate('/fitsum/projects')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  {['all', 'featured', 'recent'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter as any)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                        activeFilter === filter
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div
                      key={project._id}
                      className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {project.title}
                            </h3>
                            {project.featured && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {project.category} • {project.technologies?.slice(0, 3).join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.live_url && (
                          <button
                            onClick={() => window.open(project.live_url, '_blank')}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View live"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => navigate('/fitsum/projects', { state: { focusId: project._id } })}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit project"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {projectSearch ? 'No projects found matching your search.' : 'No projects available.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Data Health */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Health</h2>
                </div>
                <button
                  onClick={loadBackendSummary}
                  disabled={isCheckingBackend}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh status"
                >
                  <RefreshCw className={`h-4 w-4 ${isCheckingBackend ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="space-y-3">
                {dataHealth.map((item) => (
                  <div
                    key={item.key}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center`}>
                          <div className={`text-${item.color}-600 dark:text-${item.color}-400`}>
                            {item.icon}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.lastUpdatedLabel}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_CLASS_MAP[item.status]}`}>
                        {item.statusLabel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.count}</p>
                      {item.backendCount !== null && (
                        <p className={`text-xs ${item.backendMismatch ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          Backend: {item.backendCount}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frontend Data Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frontend Data</h2>
                </div>
                <button
                  onClick={() => setShowFrontendData(!showFrontendData)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={showFrontendData ? 'Hide' : 'Show'}
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${showFrontendData ? 'rotate-90' : ''}`} />
                </button>
              </div>
              
              {showFrontendData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Projects</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{frontendStats.projects}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Testimonials</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{frontendStats.testimonials}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Videos</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{frontendStats.youtubeVideos}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{frontendStats.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                      <strong>Frontend Data:</strong> This is the default data embedded in the frontend code. Use the sync button below to add it to the database.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sync Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <ServerCog className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sync</h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      Sync Frontend → Backend
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Reset Backend from Frontend
                    </>
                  )}
                </button>
              </div>
              {backendSummary && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                  {backendSummary.hasData
                    ? 'Backend has content. Syncing will update existing entries.'
                    : 'Backend is empty. Sync to populate it with frontend data.'}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity</h2>
              </div>
              <div className="space-y-3">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                          <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded">
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;
