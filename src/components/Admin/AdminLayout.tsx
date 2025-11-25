import { useState, useMemo, useCallback, memo, type RefObject } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Youtube,
  MessageSquare,
  Settings,
  Image as ImageIcon,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Database,
  Code,
  Terminal
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const AdminLayout = memo(() => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();

  const handleLogout = useCallback(() => {
    logout();
    addNotification({
      type: 'success',
      title: 'Logged Out',
      message: 'You have been successfully logged out.'
    });
  }, [logout, addNotification]);

  const menuItems = useMemo(() => [
    { path: '/fitsum', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/fitsum/profile', icon: User, label: 'Profile' },
    { path: '/fitsum/projects', icon: Briefcase, label: 'Projects' },
    { path: '/fitsum/youtube', icon: Youtube, label: 'YouTube' },
    { path: '/fitsum/testimonials', icon: MessageSquare, label: 'Testimonials' },
    { path: '/fitsum/images', icon: ImageIcon, label: 'Images' },
    { path: '/fitsum/data-sync', icon: Database, label: 'Data Sync' },
    { path: '/fitsum/settings', icon: Settings, label: 'Settings' },
  ], []);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const [sidebarRef, sidebarVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-gradient opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      {/* Code Brackets in corners */}
      <div className="absolute top-10 left-10 text-4xl font-mono text-blue-600/20 dark:text-blue-400/20 animate-code-bracket pointer-events-none z-0">
        {'{'}
      </div>
      <div className="absolute bottom-10 right-10 text-4xl font-mono text-purple-600/20 dark:text-purple-400/20 animate-code-bracket pointer-events-none z-0" style={{ animationDelay: '1s' }}>
        {'}'}
      </div>
      <div className="absolute top-10 right-10 text-4xl font-mono text-pink-600/20 dark:text-pink-400/20 animate-code-bracket pointer-events-none z-0" style={{ animationDelay: '0.5s' }}>
        {'['}
      </div>
      <div className="absolute bottom-10 left-10 text-4xl font-mono text-cyan-600/20 dark:text-cyan-400/20 animate-code-bracket pointer-events-none z-0" style={{ animationDelay: '1.5s' }}>
        {']'}
      </div>

      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-blue-400/10 dark:text-blue-500/10 font-mono text-xs opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['const', 'function', 'import', 'export', 'return'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full glass backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Terminal className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CMS</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
                </div>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/50'
                  } group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:translate-x-1`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        ref={sidebarRef as RefObject<HTMLDivElement>}
        className={`hidden lg:flex lg:flex-shrink-0 relative z-10 transition-all duration-500 ${
          sidebarVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 glass backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 shadow-xl">
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Terminal className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CMS</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Content Manager</p>
                  </div>
                </div>
              </div>
              <nav className="mt-2 flex-1 px-3 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/50'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:translate-x-1 hover:shadow-md`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-white/20 dark:border-gray-700/50 p-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <Code className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  View Portfolio
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-20 glass backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              {/* Search bar */}
              <div className="flex-1 max-w-lg mx-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="block w-full pl-10 pr-3 py-2 border border-white/30 dark:border-gray-600/50 rounded-lg leading-5 glass backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-semibold text-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.role}
                      </p>
                    </div>
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 glass backdrop-blur-xl rounded-xl shadow-2xl py-2 z-50 border border-white/20 dark:border-gray-700/50">
                      <div className="px-4 py-2 border-b border-white/20 dark:border-gray-700/50">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/fitsum/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
