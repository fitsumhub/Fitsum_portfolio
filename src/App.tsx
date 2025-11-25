import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DataProvider } from './contexts/DataContext';
import DataSync from './components/DataSync';

// Lazy load components with better chunk names for caching
const Navigation = lazy(() => import('./components/Navigation'));
// Hero is above the fold, but still lazy loaded for better initial bundle size
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const ProjectsShowcase = lazy(() => import('./components/ProjectsShowcase'));
const Company = lazy(() => import('./components/Company'));
const YouTube = lazy(() => import('./components/YouTube'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const CVDownload = lazy(() => import('./components/CVDownload'));

// Admin components (still use routing)
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));
const ProfileManager = lazy(() => import('./components/Admin/ProfileManager'));
const ProjectsManager = lazy(() => import('./components/Admin/SimpleProjectsManager'));
const YouTubeManager = lazy(() => import('./components/Admin/YouTubeManager'));
const Login = lazy(() => import('./components/Admin/Login'));
const ProtectedRoute = lazy(() => import('./components/Admin/ProtectedRoute'));
const TestimonialsManager = lazy(() => import('./components/Admin/TestimonialsManager'));
const ImagesManager = lazy(() => import('./components/Admin/ImagesManager'));
const DataSyncManager = lazy(() => import('./components/Admin/DataSyncManager'));

// Loading component
const LoadingFallback = ({ height = 'h-96' }: { height?: string }) => (
  <div className={`${height} bg-gray-100 dark:bg-gray-800 relative overflow-hidden`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setDarkMode(saved === 'true');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <DataProvider>
            <DataSync />
            <Router>
              <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''} relative`}>
                {/* Global Code Brackets Decorations */}
                <div className="fixed top-20 left-4 text-4xl font-mono text-blue-600/10 dark:text-blue-400/10 animate-code-bracket pointer-events-none z-0">
                  {'{'}
                </div>
                <div className="fixed bottom-20 right-4 text-4xl font-mono text-purple-600/10 dark:text-purple-400/10 animate-code-bracket pointer-events-none z-0" style={{ animationDelay: '1s' }}>
                  {'}'}
                </div>
                <div className="fixed top-20 right-4 text-4xl font-mono text-pink-600/10 dark:text-pink-400/10 animate-code-bracket pointer-events-none z-0" style={{ animationDelay: '0.5s' }}>
                  {'['}
                </div>
                <div className="fixed bottom-20 left-4 text-4xl font-mono text-cyan-600/10 dark:text-cyan-400/10 animate-code-bracket pointer-events-none z-0" style={{ animationDelay: '1.5s' }}>
                  {']'}
                </div>
                
                <Routes>
                  {/* Single Page Website */}
                  <Route path="/" element={
                    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative z-10">
                      <Suspense fallback={<LoadingFallback height="h-20" />}>
                        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
                      </Suspense>
                      
                      {/* Hero Section */}
                      <Suspense fallback={<LoadingFallback height="h-screen" />}>
                        <Hero />
                      </Suspense>
                      
                      {/* About Section */}
                      <Suspense fallback={<LoadingFallback />}>
                        <About />
                      </Suspense>
                      
                      {/* Skills Section */}
                      <Suspense fallback={<LoadingFallback />}>
                        <Skills />
                      </Suspense>
                      
                      {/* Projects Section */}
                      <Suspense fallback={<LoadingFallback />}>
                        <ProjectsShowcase />
                      </Suspense>
                      
                      {/* Company Section */}
                      <Suspense fallback={<LoadingFallback />}>
                        <Company />
                      </Suspense>
                      
                      {/* YouTube Section */}
                      <Suspense fallback={<LoadingFallback />}>
                        <YouTube />
                      </Suspense>
                      
                      {/* Testimonials Section */}
                      <Suspense fallback={<LoadingFallback />}>
                        <Testimonials />
                      </Suspense>
                      
                      {/* Contact Section */}
                      <Suspense fallback={<LoadingFallback />}>
                        <Contact />
                      </Suspense>
                      
                      {/* Footer */}
                      <Suspense fallback={<LoadingFallback height="h-32" />}>
                        <Footer />
                      </Suspense>
                      
                      {/* CV Download */}
                      <Suspense fallback={null}>
                        <CVDownload />
                      </Suspense>
                    </div>
                  } />

                  {/* Admin Routes (still use routing) */}
                  <Route path="/login" element={<Suspense fallback={<LoadingFallback height="h-screen" />}><Login /></Suspense>} />
                  <Route path="/admin" element={<Suspense fallback={<LoadingFallback height="h-screen" />}><Login /></Suspense>} />
                  <Route path="/fitsum" element={
                    <Suspense fallback={<LoadingFallback height="h-screen" />}>
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    </Suspense>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="profile" element={<ProfileManager />} />
                    <Route path="projects" element={<ProjectsManager />} />
                    <Route path="youtube" element={<YouTubeManager />} />
                    <Route path="testimonials" element={<TestimonialsManager />} />
                    <Route path="images" element={<ImagesManager />} />
                    <Route path="data-sync" element={<DataSyncManager />} />
                    <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Settings page coming soon...</p></div>} />
                  </Route>
                </Routes>
              </div>
            </Router>
          </DataProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
