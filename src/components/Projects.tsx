import { useState, useEffect } from 'react';
import { ExternalLink, Github, Filter } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { state, actions } = useData();
  const { projects, loading, errors } = state;

  useEffect(() => {
    actions.loadProjects();
  }, [actions]);

  // Use loading state in JSX
  if (loading.projects) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono animate-pulse">Loading projects...</div>
      </div>
    );
  }

  // Show error state if there's an error
  if (errors.projects) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl font-mono text-center">
          <p>Failed to load projects</p>
          <p className="text-sm mt-2">{errors.projects}</p>
          <button 
            onClick={() => actions.loadProjects()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Categories for filtering (since we don't have categories in the backend yet)
  const categories = ['All', 'Featured', 'Recent'];
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : selectedCategory === 'Featured'
    ? projects.filter(p => p.featured)
    : projects.slice(0, 6); // Show recent 6 projects

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full mix-blend-multiply filter blur-lg opacity-20 animate-bounce"></div>
        <div className="absolute top-1/4 left-1/4 w-30 h-30 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mix-blend-multiply filter blur-lg opacity-25 animate-float delay-2000"></div>
        
        {/* Floating Code Elements */}
        <div className="absolute top-1/6 left-1/6 text-green-400 text-xs font-mono opacity-20 animate-float">
          <div className="animate-typing">// Projects</div>
        </div>
        <div className="absolute top-2/6 right-1/6 text-blue-400 text-xs font-mono opacity-20 animate-float delay-1000">
          <div className="animate-typing">const portfolio = [];</div>
        </div>
        <div className="absolute bottom-1/6 left-2/6 text-yellow-400 text-xs font-mono opacity-20 animate-float delay-2000">
          <div className="animate-typing">function create() &#123; return "awesome"; &#125;</div>
        </div>
        
        {/* Matrix-style Code Rain */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/6 w-0.5 h-20 bg-gradient-to-b from-green-400 to-transparent animate-code-rain"></div>
          <div className="absolute top-0 left-2/6 w-0.5 h-25 bg-gradient-to-b from-blue-400 to-transparent animate-code-rain delay-1000"></div>
          <div className="absolute top-0 left-3/6 w-0.5 h-18 bg-gradient-to-b from-yellow-400 to-transparent animate-code-rain delay-2000"></div>
          <div className="absolute top-0 left-4/6 w-0.5 h-22 bg-gradient-to-b from-purple-400 to-transparent animate-code-rain delay-3000"></div>
          <div className="absolute top-0 left-5/6 w-0.5 h-16 bg-gradient-to-b from-pink-400 to-transparent animate-code-rain delay-4000"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-2xl blur-lg animate-rainbow"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-cyan-400/50 rounded-xl animate-rainbow"></div>
            <h2 className="relative text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-mono animate-glow px-6 py-3">
              My Projects
            </h2>
          </div>
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur-sm animate-pulse-glow"></div>
            <p className="relative text-gray-300 text-lg max-w-2xl mx-auto font-mono px-4 py-2 border-l-4 border-cyan-400">
              <span className="text-cyan-400">//</span> A showcase of my work across web development, Python projects, and UI/UX design
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12 flex-wrap animate-slide-up">
          <div className="flex items-center gap-2 text-cyan-400">
            <Filter size={20} className="animate-pulse" />
            <span className="font-semibold font-mono">Filter:</span>
          </div>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-6 py-3 rounded-xl font-bold transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 font-mono ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white shadow-2xl hover:shadow-blue-500/50 animate-pulse-glow'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border-2 border-gray-600 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30'
              } category-delay-${index * 100}`}
            >
              {selectedCategory === category && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-xl opacity-0 animate-pulse-glow"></div>
              )}
              <span className="relative z-10">{category}</span>
              {selectedCategory === category && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project._id}
              className={`group relative animate-scale-in project-delay-${index * 100}`}
            >
              {/* Enhanced Project Card */}
              <div className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border-2 border-gray-600 hover:border-cyan-400">
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy"></div>
                
                {/* Enhanced Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-600 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-cyan-500/30 animate-pulse"></div>
                  {project.image_url ? (
                    <img
                      src={project.image_url.startsWith('/uploads/') ? `http://localhost:5000${project.image_url}` : project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className="text-6xl animate-bounce relative z-10">🚀</div>
                  
                  {/* Floating Particles */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-ping opacity-60"></div>
                  <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping delay-300 opacity-60"></div>
                  <div className="absolute bottom-6 left-6 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-700 opacity-60"></div>
                </div>

                <div className="p-6 space-y-4 relative z-10">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 font-mono">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-sm animate-pulse"></div>
                          <span className="relative inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900 animate-bounce">
                            ⭐ Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-3 font-mono">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 bg-cyan-900/50 text-cyan-300 rounded-full text-xs font-semibold border border-cyan-400/30 hover:bg-cyan-800/50 hover:border-cyan-300 transition-all duration-300 animate-pulse tech-delay-${idx * 100}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <div className="flex gap-3">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 font-mono font-bold"
                        >
                          <ExternalLink size={16} className="animate-bounce" />
                          <span className="text-sm">Live Demo</span>
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/30 font-mono font-bold"
                        >
                          <Github size={16} className="animate-bounce" />
                          <span className="text-sm">Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No projects found in this category
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
