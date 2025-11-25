import { useState, useEffect, memo } from 'react';
import { Plus, Edit, Trash2, ExternalLink, Save, X, Upload, RefreshCw, Code, Sparkles } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import DebugInfo from './DebugInfo';
import StateDebugger from './StateDebugger';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  image_url: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  category: string;
  featured: boolean;
  status?: string;
  impact?: string;
  achievements?: string[];
  order_index: number;
  createdAt: string;
  updatedAt: string;
}

const ProjectsManager = memo(() => {
  const { state, actions } = useData();
  const { projects, loading, errors } = state;
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [managerRef, managerVisible] = useScrollReveal({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    image_url: '',
    technologies: [] as string[],
    github_url: '',
    live_url: '',
    category: 'Web Development',
    featured: false,
    status: 'Live',
    impact: '',
    achievements: [] as string[],
    order_index: 0
  });

  // Load projects from DataContext (only once on mount)
  useEffect(() => {
    if (projects.length === 0 && !loading.projects && navigator.onLine) {
      actions.loadProjects().catch(() => {
        // Silently handle errors
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      image_url: '',
      technologies: [],
      github_url: '',
      live_url: '',
      category: 'Web Development',
      featured: false,
      status: 'Live',
      impact: '',
      achievements: [],
      order_index: 0
    });
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      image_url: project.image_url,
      technologies: project.technologies,
      github_url: project.github_url,
      live_url: project.live_url,
      category: project.category,
      featured: project.featured,
      status: project.status || 'Live',
      impact: project.impact || '',
      achievements: project.achievements || [],
      order_index: project.order_index
    });
    setIsEditing(project._id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      console.log('=== SAVE PROJECT DEBUG ===');
      console.log('isEditing:', isEditing);
      console.log('formData:', formData);
      
      if (isEditing) {
        console.log('Updating project...');
        await actions.updateProject(isEditing, formData);
        setMessage('Project updated successfully!');
      } else {
        console.log('Creating project...');
        await actions.addProject(formData);
        setMessage('Project created successfully!');
      }
      
      console.log('Projects updated successfully');
      
      setShowForm(false);
      setIsEditing(null);
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save project:', error);
      setMessage('Failed to save project');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await actions.deleteProject(id);
        setMessage('Project deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Failed to delete project:', error);
        setMessage('Failed to delete project');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // For now, just set the file name as the image URL
      // In a real app, you'd upload to a server
      setFormData(prev => ({
        ...prev,
        image_url: `/uploads/projects/${file.name}`
      }));
    } catch (error) {
      console.error('Failed to upload image:', error);
      setMessage('Failed to upload image');
    }
  };

  const addTechnology = () => {
    const tech = prompt('Enter technology:');
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const addAchievement = () => {
    const achievement = prompt('Enter achievement:');
    if (achievement && !formData.achievements.includes(achievement)) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement]
      }));
    }
  };

  const removeAchievement = (achievement: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a !== achievement)
    }));
  };

  if (loading.projects) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (errors.projects) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading projects</h3>
          <p className="text-red-600 mt-1">{errors.projects}</p>
          <button
            onClick={() => actions.loadProjects()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={managerRef as React.RefObject<HTMLDivElement>} className="relative min-h-screen">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient opacity-50 -z-10"></div>
      
      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(8)].map((_, i) => (
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
            {['project', 'const', 'function', 'export'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 p-6">
        <DebugInfo />
        <StateDebugger />
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 ${managerVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Projects Manager
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span>Manage your portfolio projects</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{projects.length} projects</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={async () => {
                console.log('=== MANUAL REFRESH ===');
                await actions.loadProjects();
                console.log('Manual refresh completed');
              }}
              className="flex items-center px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
                setIsEditing(null);
              }}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </button>
          </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 glass backdrop-blur-sm border border-green-500/30 rounded-xl ${managerVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          <p className="text-green-700 dark:text-green-400 font-medium">{message}</p>
        </div>
      )}

      {/* Projects Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${managerVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
        {projects.map((project, index) => (
          <div 
            key={project._id} 
            className="group glass backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
              <img
                src={project.image_url.startsWith('/uploads/') ? `http://localhost:5000${project.image_url}` : project.image_url}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">No Image</span>
              </div>
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-110"
                >
                  <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="p-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
              {project.featured && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  ⭐ Featured
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 dark:border-purple-500/30 text-blue-700 dark:text-purple-300 text-xs rounded-full font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/20 dark:border-gray-700/50">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {project.category}{project.status && ` • ${project.status}`}
                </span>
                <div className="flex space-x-2">
                  {project.github_url && project.github_url !== '#' && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.live_url && project.live_url !== '#' && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {isEditing ? 'Edit Project' : 'Add New Project'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Long Description
                </label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Desktop Development">Desktop Development</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                  >
                    <option value="Live">Live</option>
                    <option value="Prototype">Prototype</option>
                    <option value="Completed">Completed</option>
                    <option value="In Development">In Development</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <label className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                    className="w-full px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
                    className="w-full px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Technologies
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full flex items-center"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={addTechnology}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  + Add Technology
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Impact
                </label>
                <input
                  type="text"
                  value={formData.impact}
                  onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                  className="w-full px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Achievements
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.achievements.map((achievement) => (
                    <span
                      key={achievement}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full flex items-center"
                    >
                      {achievement}
                      <button
                        onClick={() => removeAchievement(achievement)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={addAchievement}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  + Add Achievement
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Featured Project</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(null);
                  resetForm();
                }}
                className="px-4 py-2 glass backdrop-blur-sm border border-white/30 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
});

ProjectsManager.displayName = 'ProjectsManager';

export default ProjectsManager;
