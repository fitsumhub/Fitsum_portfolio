import { GraduationCap, Briefcase, Heart, Target, User, Code, Video, Camera, PlayCircle } from 'lucide-react';
import { useState, useEffect, memo } from 'react';
import apiService from '../services/api';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCounter } from '../hooks/useCounter';
import CodeTypingEffect from './CodeTypingEffect';

const About = memo(() => {
  const [profile, setProfile] = useState({
    name: 'Fitsum Enunu',
    title: 'Full-Stack Developer | Content Creator | Tech Enthusiast',
    description: '🎓 University IT Student | 💻 Web Developer | 📚 Educator | 🎥 YouTuber | 💡 Content Creator. Passionate about technology and education!',
    location: 'Ethiopia',
  });

  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [shouldAnimateCounters, setShouldAnimateCounters] = useState(false);
  const { count: youtubeCount, animate: animateYoutube } = useCounter(100, { duration: 2000, startOnMount: false });
  const { count: projectsCount, animate: animateProjects } = useCounter(100, { duration: 2000, startOnMount: false });
  const { count: experienceCount, animate: animateExperience } = useCounter(5, { duration: 2000, startOnMount: false });
  const { count: techCount, animate: animateTech } = useCounter(10, { duration: 2000, startOnMount: false });

  const loadProfile = async () => {
    try {
      const profileData = await apiService.getProfile() as typeof profile;
      setProfile(profileData);
    } catch {
      // Silently use fallback profile data if API is unavailable
      // This is expected when backend server is not running
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isVisible && !shouldAnimateCounters) {
      setShouldAnimateCounters(true);
      setTimeout(() => {
        animateYoutube();
        animateProjects();
        animateExperience();
        animateTech();
      }, 300);
    }
  }, [isVisible, shouldAnimateCounters, animateYoutube, animateProjects, animateExperience, animateTech]);

  const features = [
    {
      icon: GraduationCap,
      title: 'Education',
      description: 'University IT student continuously learning and growing through formal education and self-study.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Briefcase,
      title: 'Experience',
      description: 'Building real-world applications and creating educational content for thousands of learners.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Driven by a desire to solve problems and empower others through technology and education.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Target,
      title: 'Mission',
      description: 'Make learning and earning easier through technology for Ethiopian youth.',
      color: 'from-blue-500 to-cyan-500'
    },
  ];

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      id="about" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 border-b-2 border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 mb-6 animate-scale-in border border-blue-200 dark:border-blue-800 shadow-sm">
            <User className="w-4 h-4 mr-2" />
            <span>About Me</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Building the Future with Code
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {profile.description}
          </p>
        </div>

        {/* Dual Identity Showcase */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Programmer Side */}
          <div className={`relative bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-blue-300 dark:border-blue-700 overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            {/* Floating Code Snippets */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              {['const', 'function', 'return', 'import', 'export', 'async'].map((word, i) => (
                <div
                  key={i}
                  className="absolute font-mono text-xs text-blue-600 dark:text-blue-400 animate-float"
                  style={{
                    left: `${15 + (i % 3) * 30}%`,
                    top: `${20 + Math.floor(i / 3) * 30}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            
            {/* Code Brackets */}
            <div className="absolute top-2 right-2 text-2xl font-mono text-blue-600/30 dark:text-blue-400/30 animate-code-bracket">
              {'{'}
            </div>
            <div className="absolute bottom-2 left-2 text-2xl font-mono text-blue-600/30 dark:text-blue-400/30 animate-code-bracket" style={{ animationDelay: '1s' }}>
              {'}'}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
                  <Code className="w-6 h-6 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Programmer</h3>
              </div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">Full-Stack Developer</p>
                <p>Building scalable web applications with React, Node.js, and modern technologies.</p>
                <div className="mt-4">
                  <CodeTypingEffect 
                    code="const build = () => 'Amazing Apps';" 
                    language="javascript"
                    speed={60}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['React', 'TypeScript', 'Node.js', 'Python'].map((tech, i) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-mono border border-blue-300 dark:border-blue-700"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Creator Side */}
          <div className={`relative bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-8 border-2 border-red-200 dark:border-red-800 overflow-hidden group ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            {/* Video Icons Floating */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <PlayCircle
                  key={i}
                  className="absolute text-red-600 dark:text-red-400 animate-float"
                  size={20}
                  style={{
                    left: `${10 + (i % 3) * 35}%`,
                    top: `${15 + Math.floor(i / 3) * 35}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>
            
            {/* Recording Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-recording-pulse"></div>
              <span className="font-mono">REC</span>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-600 dark:bg-red-500 rounded-lg relative">
                  <Video className="w-6 h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-recording-pulse border-2 border-white"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Content Creator</h3>
              </div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">YouTube Educator</p>
                <p>Creating educational content in Amharic to make tech learning accessible to Ethiopian students.</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700">
                    <Camera className="w-5 h-5 text-red-600 dark:text-red-400 animate-recording-pulse" />
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400 font-mono">50K+</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Subs</span>
                  </div>
                  <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700">
                    <PlayCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400 font-mono">100+</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Videos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Story */}
          <div className={`space-y-6 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Story</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                I'm <span className="font-semibold text-blue-600 dark:text-blue-400">{profile.name}</span>, a passionate
                <span className="font-semibold"> Full-Stack Developer, Content Creator, and Tech Educator</span> from
                <span className="font-semibold"> {profile.location}</span>.
              </p>
              <p>
                I'm the founder of <span className="font-semibold text-blue-600 dark:text-blue-400">A+ Solution PLC</span>, a startup focused on solving
                educational problems for Grade 12 and Freshman university students, and the creator of the popular educational
                YouTube channels <span className="font-semibold text-blue-600 dark:text-blue-400">@AplusEthiopia</span> and <span className="font-semibold text-blue-600 dark:text-blue-400">@AplusHustler</span> with
                <span className="font-semibold"> 100,000+ subscribers</span> combined.
              </p>
              <p>
                Through my YouTube channel, I create educational content on programming, psychology, online business, and motivation.
                I teach programming (Python, HTML, C++, etc.) in <span className="font-semibold text-blue-600 dark:text-blue-400">Amharic</span> to make
                tech learning accessible to every Ethiopian student.
              </p>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${
                    isVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg w-fit mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: youtubeCount, suffix: 'K+', label: 'YouTube Subscribers', color: 'text-blue-600 dark:text-blue-400' },
            { number: projectsCount, suffix: '+', label: 'Projects Completed', color: 'text-blue-600 dark:text-blue-400' },
            { number: experienceCount, suffix: '+', label: 'Years Experience', color: 'text-blue-600 dark:text-blue-400' },
            { number: techCount, suffix: '+', label: 'Technologies Mastered', color: 'text-blue-600 dark:text-blue-400' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className={`text-4xl font-bold mb-2 ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                {shouldAnimateCounters ? `${stat.number}${stat.suffix}` : `0${stat.suffix}`}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;
