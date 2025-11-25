import { Youtube, Play, Users, TrendingUp, Eye, ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCounter } from '../hooks/useCounter';

const YouTubeSection = () => {
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  const { count: subscriberCount, animate: animateSubscribers } = useCounter(100, { duration: 2000, startOnMount: false });
  const { count: videoCount, animate: animateVideos } = useCounter(100, { duration: 2000, startOnMount: false });
  const { count: viewCount, animate: animateViews } = useCounter(500, { duration: 2000, startOnMount: false });

  useEffect(() => {
    if (isVisible && !shouldAnimate) {
      setShouldAnimate(true);
      setTimeout(() => {
        animateSubscribers();
        animateVideos();
        animateViews();
      }, 300);
    }
  }, [isVisible, shouldAnimate, animateSubscribers, animateVideos, animateViews]);
  const videos = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of building websites from scratch',
      thumbnail: '🌐',
      views: '15K',
      youtubeId: 'dQw4w9WgXcQ',
    },
    {
      id: 2,
      title: 'JavaScript Tutorial for Beginners',
      description: 'Master JavaScript basics with practical examples',
      thumbnail: '💻',
      views: '22K',
      youtubeId: 'dQw4w9WgXcQ',
    },
    {
      id: 3,
      title: 'React Crash Course',
      description: 'Build modern web applications with React',
      thumbnail: '⚛️',
      views: '18K',
      youtubeId: 'dQw4w9WgXcQ',
    },
    {
      id: 4,
      title: 'Python Programming Guide',
      description: 'Complete Python tutorial for all skill levels',
      thumbnail: '🐍',
      views: '25K',
      youtubeId: 'dQw4w9WgXcQ',
    },
  ];

  const playlists = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      description: 'Complete series covering HTML, CSS, and JavaScript',
      videoCount: 24,
      thumbnail: '📚',
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Deep dive into React hooks, context, and performance',
      videoCount: 18,
      thumbnail: '🚀',
    },
    {
      id: 3,
      title: 'Python for Data Science',
      description: 'Learn data analysis and visualization with Python',
      videoCount: 15,
      thumbnail: '📊',
    },
  ];

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      id="youtube" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(120,119,198,0.3),transparent_50%)] opacity-60 animate-gradient"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 mb-6 animate-scale-in">
            <Youtube className="w-4 h-4 mr-2 text-cyan-400 animate-video-play" />
            <span className="text-cyan-400 font-mono">A+ Ethiopia</span>
            <div className="ml-2 w-2 h-2 bg-red-600 rounded-full animate-recording-pulse"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-4">
            <span className="text-slate-100">Educational</span>
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient"> Content</span>
          </h2>
          <p className="text-xl text-slate-300 font-mono max-w-3xl mx-auto mb-6">
            Educational content helping thousands learn programming and technology
          </p>
          <a
            href="https://youtube.com/@APlusEthiopia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono font-bold rounded-lg shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 group"
          >
            <Youtube size={24} className="animate-video-play" />
            Subscribe to Channel
            <span className="text-xs bg-white/20 px-2 py-1 rounded">{shouldAnimate ? `${subscriberCount}K+` : '0K+'} Subscribers</span>
          </a>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 relative group">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-recording-pulse"></div>
            <div className="inline-flex p-4 bg-cyan-500/20 rounded-full mb-4 border border-cyan-400/30 group-hover:scale-110 transition-transform animate-subscriber-count">
              <Users size={32} className="text-cyan-400" />
            </div>
            <h3 className="text-3xl font-bold font-mono text-cyan-400 mb-2 font-mono animate-subscriber-count">
              {shouldAnimate ? `${subscriberCount}K+` : '0K+'}
            </h3>
            <p className="text-slate-400 font-mono">Subscribers</p>
            <div className="absolute bottom-2 left-2 text-xs text-green-400 font-mono animate-pulse">
              ↑ Live
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 text-center hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 group">
            <div className="inline-flex p-4 bg-purple-500/20 rounded-full mb-4 border border-purple-400/30 group-hover:scale-110 transition-transform">
              <Play size={32} className="text-purple-400 animate-video-play" />
            </div>
            <h3 className="text-3xl font-bold font-mono text-purple-400 mb-2">
              {shouldAnimate ? `${videoCount}+` : '0+'}
            </h3>
            <p className="text-slate-400 font-mono">Videos</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-pink-500/30 rounded-xl p-6 text-center hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 group">
            <div className="inline-flex p-4 bg-pink-500/20 rounded-full mb-4 border border-pink-400/30 group-hover:scale-110 transition-transform">
              <TrendingUp size={32} className="text-pink-400" />
            </div>
            <h3 className="text-3xl font-bold font-mono text-pink-400 mb-2">
              {shouldAnimate ? `${viewCount}K+` : '0K+'}
            </h3>
            <p className="text-slate-400 font-mono">Total Views</p>
          </div>
        </div>

        <div className={`mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <h3 className="text-3xl font-bold font-mono text-slate-100 mb-8">Featured Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="group bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl overflow-hidden hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredVideo(video.id)}
                onMouseLeave={() => setHoveredVideo(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-6xl overflow-hidden">
                  {video.thumbnail}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent"></div>
                  
                  {/* YouTube Play Button */}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
                    hoveredVideo === video.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 animate-video-play">
                      <Play size={24} className="text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* Video Metrics */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 transition-all duration-300 ${
                    hoveredVideo === video.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}>
                    <div className="flex items-center justify-between text-white text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        <span className="font-mono">{video.views}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="font-mono">{Math.floor(Math.random() * 2 + 1)}K</span>
                      </div>
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: hoveredVideo === video.id ? '65%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono">
                    {Math.floor(Math.random() * 20 + 5)}:00
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-bold font-mono text-slate-100 mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2 font-mono">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-mono">
                      <Eye className="w-4 h-4" />
                      <span>{video.views}</span>
                    </div>
                    <a
                      href={`https://youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-sm font-semibold font-mono hover:text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      <Play size={14} />
                      Watch
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold font-mono text-slate-100 mb-8">Popular Playlists</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="group bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">{playlist.thumbnail}</div>
                  <h4 className="text-xl font-bold font-mono text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">
                    {playlist.title}
                  </h4>
                  <p className="text-slate-400 text-sm mb-3 font-mono">
                    {playlist.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
                    <Play size={16} className="text-purple-400" />
                    <span className="text-sm font-semibold font-mono text-purple-400">
                      {playlist.videoCount} Videos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 sm:p-12 text-center shadow-lg shadow-cyan-500/10">
          <h3 className="text-3xl font-bold font-mono text-slate-100 mb-4">Join Our Learning Community</h3>
          <p className="text-lg text-slate-300 font-mono mb-6 max-w-2xl mx-auto">
            Subscribe to A+ Ethiopia for weekly tutorials, coding tips, and career advice in tech
          </p>
          <a
            href="https://youtube.com/@APlusEthiopia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono font-bold rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Youtube size={24} />
            Subscribe Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
