import { ArrowRight, Github, Linkedin, Youtube, Play, Code, Video, Send } from 'lucide-react';
import React, { useState, useEffect, memo } from 'react';
import apiService from '../services/api';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCounter } from '../hooks/useCounter';
import CodeTypingEffect from './CodeTypingEffect';
import TerminalWindow from './TerminalWindow';

const Hero = memo(() => {
  const [profile, setProfile] = useState<{
    name: string;
    title: string;
    description: string;
    profile_image: string;
    github_url: string;
    linkedin_url: string;
    youtube_ethiopia_url: string;
    youtube_hustler_url: string;
    telegram_username?: string;
    telegram_channel_url?: string;
  }>({
    name: 'Fitsum Enunu',
    title: 'Web Developer & Tech Creator | Business • Tech • Hustle',
    description: 'Passionate about building innovative solutions and creating engaging content.',
    profile_image: '/images/profile.jpg',
    github_url: 'https://github.com/fitsumhub',
    linkedin_url: 'https://linkedin.com/in/fitsum-enunu',
    youtube_ethiopia_url: 'https://www.youtube.com/@AplusEthiopia',
    youtube_hustler_url: 'https://www.youtube.com/@AplusHustler',
    telegram_username: 'fitsum00000',
    telegram_channel_url: 'https://t.me/AplusHustler'
  });

  const [typingText, setTypingText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [shouldAnimateCounters, setShouldAnimateCounters] = useState(false);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });
  const { count: youtubeCount, animate: animateYoutube } = useCounter(100, { duration: 2000, startOnMount: false });
  const { count: projectsCount, animate: animateProjects } = useCounter(100, { duration: 2000, startOnMount: false });
  const { count: experienceCount, animate: animateExperience } = useCounter(5, { duration: 2000, startOnMount: false });

  const codeSnippets = [
    'const developer = new Programmer();',
    'function createContent() { return "Amazing!"; }',
    'const skills = ["React", "TypeScript", "Node.js"];',
    'console.log("Building the future!");'
  ];

  const terminalCommands = [
    'git init',
    'npm install',
    'yarn build',
    'code .'
  ];

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

  // Typing animation effect
  useEffect(() => {
    const fullText = profile.name;
    let currentIndex = 0;
    const typingSpeed = 100;

    const typeChar = () => {
      if (currentIndex < fullText.length) {
        setTypingText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeChar, typingSpeed);
      } else {
        setShowCursor(false);
      }
    };

    const timer = setTimeout(() => {
      typeChar();
    }, 500);

    return () => clearTimeout(timer);
  }, [profile.name]);

  // Animate counters when section is visible
  useEffect(() => {
    if (isVisible && !shouldAnimateCounters) {
      setShouldAnimateCounters(true);
      setTimeout(() => {
        animateYoutube();
        animateProjects();
        animateExperience();
      }, 500);
    }
  }, [isVisible, shouldAnimateCounters, animateYoutube, animateProjects, animateExperience]);

  // Rotate code snippets
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible, codeSnippets.length]);

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      id="home" 
      className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 relative overflow-hidden border-b-2 border-gray-200 dark:border-gray-800"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      {/* Binary/Code background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xs font-mono text-gray-600 dark:text-gray-400 animate-binary-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {Math.random() > 0.5 ? '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16) : Math.floor(Math.random() * 2).toString().repeat(8)}
          </div>
        ))}
      </div>

      {/* Code Brackets in corners */}
      <div className="absolute top-10 left-10 text-6xl font-mono text-blue-600/20 dark:text-blue-400/20 animate-code-bracket pointer-events-none">
        {'{'}
      </div>
      <div className="absolute bottom-10 right-10 text-6xl font-mono text-purple-600/20 dark:text-purple-400/20 animate-code-bracket pointer-events-none" style={{ animationDelay: '1s' }}>
        {'}'}
      </div>
      <div className="absolute top-10 right-10 text-6xl font-mono text-pink-600/20 dark:text-pink-400/20 animate-code-bracket pointer-events-none" style={{ animationDelay: '0.5s' }}>
        {'['}
      </div>
      <div className="absolute bottom-10 left-10 text-6xl font-mono text-cyan-600/20 dark:text-cyan-400/20 animate-code-bracket pointer-events-none" style={{ animationDelay: '1.5s' }}>
        {']'}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left Column - Text Content */}
          <div className={`space-y-6 text-center lg:text-left ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
              Hi, I'm{' '}
              <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {typingText}
                {showCursor && (
                  <span className="inline-block w-1 h-10 sm:h-12 lg:h-14 bg-blue-600 dark:bg-blue-400 ml-2 animate-pulse"></span>
                )}
              </span>
            </h1>
            
            <div className={`flex flex-wrap items-center gap-3 mb-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Full-Stack Developer
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                <Video className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Content Creator
                </p>
              </div>
            </div>

            <p className={`text-xl sm:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              {profile.description}
            </p>

            {/* Code Typing Effect */}
            {isVisible && (
              <div className={`mt-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                <CodeTypingEffect 
                  code={codeSnippets[currentCodeIndex]} 
                  language="javascript"
                  speed={80}
                />
              </div>
            )}

            {/* Stats */}
            <div className={`flex flex-wrap gap-4 justify-center lg:justify-start my-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <div className="text-center lg:text-left group relative px-6 py-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-red-200 dark:border-red-800 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Youtube className="w-7 h-7 text-red-600 dark:text-red-400" />
                  <div className="text-4xl font-extrabold text-red-600 dark:text-red-400 transition-transform duration-300 group-hover:scale-110 font-mono">
                    {isVisible ? `${youtubeCount}K+` : '0K+'}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">YouTube Subscribers</div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-recording-pulse border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="text-center lg:text-left group px-6 py-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Code className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110 font-mono">
                    {isVisible ? `${projectsCount}+` : '0+'}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Projects</div>
              </div>
              <div className="text-center lg:text-left group px-6 py-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 flex items-center justify-center text-2xl">💻</div>
                  <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110 font-mono">
                    {isVisible ? `${experienceCount}+` : '0+'}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Years Experience</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-wrap gap-4 justify-center lg:justify-start ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 dark:shadow-purple-500/50"
              >
                View My Work
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Get In Touch
              </a>
            </div>

            {/* Social Links */}
            <div className={`flex gap-4 justify-center lg:justify-start pt-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
              <a
                href="https://github.com/fitsumhub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                aria-label="GitHub"
              >
                <Github size={20} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href={profile.youtube_ethiopia_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-400 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/20"
                aria-label="YouTube"
              >
                <Youtube size={20} className="text-red-600 dark:text-red-400" />
              </a>
              {profile.telegram_channel_url && (
                <a
                  href={profile.telegram_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                  aria-label="Telegram"
                  title={`Telegram: @${profile.telegram_username || 'AplusHustler'}`}
                >
                  <Send size={20} className="text-blue-600 dark:text-blue-400" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Profile Image & Terminal */}
          <div className={`flex flex-col gap-6 justify-center lg:justify-end ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            {/* Terminal Window */}
            {isVisible && (
              <div className="w-full max-w-md">
                <TerminalWindow commands={terminalCommands} />
              </div>
            )}
            
            {/* Profile Image with Video Play Overlay */}
            <div className="w-full max-w-md group relative">
              <div className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-4 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/50 group-hover:scale-105">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={profile.profile_image || "/images/profile.jpg"}
                    alt={profile.name}
                    className="w-full aspect-square object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Video Play Button Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 animate-video-play">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                  {/* Recording Indicator */}
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-white rounded-full animate-recording-pulse"></div>
                    LIVE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
