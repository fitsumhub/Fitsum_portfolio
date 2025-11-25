import { useState, useEffect, useCallback, memo } from 'react';
import { Edit, Save, X, RefreshCw } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useNotification } from '../../contexts/NotificationContext';
import type { Project } from '../../contexts/DataContext';

type ProjectFormState = Omit<Project, '_id' | 'createdAt' | 'updatedAt'> & { status: string };

const SimpleProjectsManager = memo(() => {
  const { state, actions } = useData();
  const { addNotification } = useNotification();
  const projects = state.projects || [];
  const loading = state.loading.projects;
  
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProjectFormState>({
    title: '',
    description: '',
    image_url: '',
    technologies: [] as string[],
    github_url: '',
    live_url: '',
    category: 'Web Development',
    featured: false,
    status: 'Live',
    order_index: 0
  });

  // Load projects on mount (only once)
  useEffect(() => {
    if (projects.length === 0 && !loading && navigator.onLine) {
      actions.loadProjects().catch(() => {
        // Silently handle errors
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  // Update project with optimistic update
  const updateProject = useCallback(async (id: string, projectData: Partial<Project>) => {
    try {
      await actions.updateProject(id, projectData);
      setMessage('Project updated successfully!');
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Project updated successfully!'
      });
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Error updating project');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update project. Please try again.'
      });
      setTimeout(() => setMessage(''), 3000);
    }
  }, [actions, addNotification]);

  const handleEdit = useCallback((project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      technologies: project.technologies,
      github_url: project.github_url,
      live_url: project.live_url,
      category: project.category,
      featured: project.featured,
      status: project.status || 'Live',
      order_index: project.order_index
    });
    setIsEditing(project._id);
    setShowForm(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (isEditing) {
      await updateProject(isEditing, formData);
    }
    setShowForm(false);
    setIsEditing(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      technologies: [],
      github_url: '',
      live_url: '',
      category: 'Web Development',
      featured: false,
      status: 'Live',
      order_index: 0
    });
  }, [isEditing, formData, updateProject]);

  const handleRefresh = useCallback(() => {
    if (navigator.onLine) {
      actions.loadProjects().catch(() => {
        // Silently handle errors
      });
    }
  }, [actions]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Simple Projects Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your projects - {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">{message}</p>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {project.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {project.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {project.category} • {project.status}
              </span>
              <button
                onClick={() => handleEdit(project)}
                className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Project
              </h2>
              <button
                onClick={() => setShowForm(false)}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Live">Live</option>
                  <option value="Prototype">Prototype</option>
                  <option value="Completed">Completed</option>
                  <option value="In Development">In Development</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SimpleProjectsManager.displayName = 'SimpleProjectsManager';

export default SimpleProjectsManager;

