import { useState, memo } from 'react';
import { ExternalLink, Github, Zap, ArrowRight, Play, Eye, ThumbsUp, Share2 } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  image_url: string;
  github_url: string;
  live_url: string;
  technologies: string[];
  category: string;
  featured: boolean;
  status: string;
  impact?: string;
  subscribers?: number;
  achievements?: string[];
}

const ProjectsShowcase = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const generateObjectId = () => {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const random = Math.random().toString(16).substring(2, 8);
    const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    return timestamp + random + counter;
  };

  const projects: Project[] = [
    {
      _id: generateObjectId(),
      title: 'AplusEthiopia.com',
      description: 'Educational platform for Grade 12 and Freshman students',
      longDescription: 'A comprehensive educational website helping Grade 12 and Freshman students in Ethiopia access study materials, quizzes, tech learning content, and online income tips.',
      image_url: '/images/profile.jpg',
      github_url: 'https://github.com/fitsumhub',
      live_url: 'https://aplusethiopia.com',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'SEO'],
      category: 'Web Development',
      featured: true,
      status: 'Live',
      impact: '100K+ YouTube subscribers across @AplusEthiopia & @AplusHustler, helping thousands of Ethiopian students',
      achievements: ['100K+ Subscribers', 'Educational Impact', 'SEO Optimized']
    },
    {
      _id: generateObjectId(),
      title: 'APlus Library',
      description: 'Free platform for downloading books and PDFs',
      longDescription: 'A free platform for downloading books and PDFs for students, developers, and learners.',
      image_url: '/images/profile.jpg',
      github_url: 'https://github.com/fitsumhub',
      live_url: '#',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      category: 'Web Development',
      featured: true,
      status: 'Live',
      impact: 'Free educational resources for thousands of students'
    },
    {
      _id: generateObjectId(),
      title: 'FreshmanQuiz Website',
      description: 'Quiz-based learning platform with course selection',
      longDescription: 'A quiz-based site where users can choose courses and answer chapter-wise questions.',
      image_url: '/images/profile.jpg',
      github_url: 'https://github.com/fitsumhub',
      live_url: '#',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Admin Dashboard'],
      category: 'Web Development',
      featured: true,
      status: 'Live'
    },
    {
      _id: generateObjectId(),
      title: 'AI Messaging App',
      description: 'Chat app with AI auto-reply integration',
      longDescription: 'A chat app clone integrated with AI auto-reply for specific messages.',
      image_url: '/images/profile.jpg',
      github_url: 'https://github.com/fitsumhub',
      live_url: '#',
      technologies: ['React Native', 'AI Integration', 'Firebase', 'Expo'],
      category: 'Mobile Development',
      featured: true,
      status: 'Prototype'
    },
    {
      _id: generateObjectId(),
      title: 'Java Employee Management',
      description: 'Desktop app with CRUD operations and authentication',
      longDescription: 'A desktop app using Java Swing, connected to MySQL/SQLite, featuring CRUD operations.',
      image_url: '/images/profile.jpg',
      github_url: 'https://github.com/fitsumhub',
      live_url: '#',
      technologies: ['Java', 'Java Swing', 'MySQL', 'SQLite', 'CSV Export'],
      category: 'Desktop Development',
      featured: true,
      status: 'Completed'
    },
    {
      _id: generateObjectId(),
      title: 'YouTube Meta Tag Generator',
      description: 'React Native app for smart YouTube tag generation',
      longDescription: 'A React Native app that generates smart YouTube tags, copies tags to clipboard.',
      image_url: '/images/profile.jpg',
      github_url: 'https://github.com/fitsumhub',
      live_url: '#',
      technologies: ['React Native', 'Expo', 'AI Integration', 'Clipboard API'],
      category: 'Mobile Development',
      featured: true,
      status: 'Live'
    }
  ];

  const categories = ['All', 'Web Development', 'Mobile Development', 'Desktop Development', 'Featured'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : selectedCategory === 'Featured'
    ? projects.filter(p => p.featured)
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      id="projects" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 border-b-2 border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 mb-6 animate-scale-in border border-blue-200 dark:border-blue-800 shadow-sm">
            <Zap className="w-4 h-4 mr-2" />
            <span>My Work</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A showcase of my work across web development, mobile apps, and educational platforms
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-110 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project._id}
              className={`group relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {/* Project Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700 h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 dark:hover:border-blue-600 transform-gpu">
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg animate-pulse-glow">
                      ⭐ Featured
                    </div>
                  </div>
                )}

                {/* Project Image - YouTube Style */}
                <div 
                  className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden group cursor-pointer"
                  onMouseEnter={() => setHoveredProject(project._id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <div className="text-6xl opacity-50 transition-opacity duration-300 group-hover:opacity-30">
                      {project.category === 'Web Development' && '🌐'}
                      {project.category === 'Mobile Development' && '📱'}
                      {project.category === 'Desktop Development' && '💻'}
                    </div>
                  </div>
                  
                  {/* YouTube-style Play Button Overlay */}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
                    hoveredProject === project._id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="bg-red-600 rounded-full p-6 transform scale-0 group-hover:scale-100 transition-transform duration-300 animate-video-play">
                      <Play className="w-12 h-12 text-white fill-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Video Metrics Overlay (Bottom) */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-all duration-300 ${
                    hoveredProject === project._id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}>
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 animate-view-count">
                          <Eye className="w-4 h-4" />
                          <span className="font-mono">{Math.floor(Math.random() * 50 + 10)}K views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4 text-red-500" />
                          <span className="font-mono">{Math.floor(Math.random() * 5 + 1)}K</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        <span className="font-mono">{Math.floor(Math.random() * 2 + 1)}K</span>
                      </div>
                    </div>
                    {/* Video Timeline Progress Bar */}
                    <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: hoveredProject === project._id ? '75%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">
                    {Math.floor(Math.random() * 30 + 5)}:00
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold font-mono transition-all duration-300 transform group-hover:scale-110 ${
                      project.status === 'Live' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      project.status === 'Prototype' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Impact */}
                  {project.impact && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                        <Zap className="h-4 w-4" />
                        <span>{project.impact}</span>
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg text-xs border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs border border-gray-200 dark:border-gray-600">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm transform hover:scale-105 group/btn"
                    >
                      <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      Live
                    </a>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-transparent border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white font-bold rounded-lg transition-all duration-300 text-sm transform hover:scale-105 group/btn"
                    >
                      <Github className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-12" />
                      Code
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
          <div className="inline-block bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Want to collaborate on your next project?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              I'm always excited to work on new challenges and create amazing solutions together.
            </p>
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 transform hover:scale-105 group/cta"
            >
              <span>Let's Build Something Amazing</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

ProjectsShowcase.displayName = 'ProjectsShowcase';

export default ProjectsShowcase;
