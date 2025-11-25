import { useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight, GitBranch, GitCommit, CheckCircle, MessageSquare, ThumbsUp, Code } from 'lucide-react';
import apiService from '../services/api';
import { useScrollReveal } from '../hooks/useScrollReveal';
import CodeTypingEffect from './CodeTypingEffect';

interface Testimonial {
  _id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar_url: string;
  rating: number;
  featured: boolean;
  order_index: number;
  createdAt: string;
  updatedAt: string;
}

const Testimonials = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  
  // Fallback testimonials if API fails
  const fallbackTestimonials: Testimonial[] = [
    {
      _id: '1',
      name: 'Dr. Samuel Tadesse',
      position: 'Computer Science Professor',
      company: 'Addis Ababa University',
      content: "Fitsum is an exceptional student with a natural talent for problem-solving. His dedication to learning and helping others makes him stand out. He has a bright future in technology.",
      avatar_url: '',
      rating: 5,
      featured: true,
      order_index: 0,
      createdAt: '',
      updatedAt: ''
    },
    {
      _id: '2',
      name: 'Sarah Johnson',
      position: 'Tech Lead',
      company: 'Digital Solutions Inc',
      content: "Working with Fitsum has been a pleasure. His code quality is excellent, and his ability to communicate complex technical concepts clearly is impressive. A true professional.",
      avatar_url: '',
      rating: 5,
      featured: true,
      order_index: 1,
      createdAt: '',
      updatedAt: ''
    },
    {
      _id: '3',
      name: 'Michael Chen',
      position: 'Senior Developer',
      company: 'WebTech Global',
      content: "Fitsum's YouTube channel helped me learn React. His teaching style is clear and engaging. He breaks down complex topics into understandable pieces. Highly recommended!",
      avatar_url: '',
      rating: 5,
      featured: true,
      order_index: 2,
      createdAt: '',
      updatedAt: ''
    },
    {
      _id: '4',
      name: 'Abeba Mekonnen',
      position: 'Student',
      company: 'A+ Ethiopia Subscriber',
      content: "As someone new to programming, Fitsum's tutorials have been invaluable. His patience and clear explanations made learning to code accessible and enjoyable. Thank you!",
      avatar_url: '',
      rating: 5,
      featured: true,
      order_index: 3,
      createdAt: '',
      updatedAt: ''
    },
    {
      _id: '5',
      name: 'David Williams',
      position: 'Project Manager',
      company: 'Innovation Labs',
      content: "Fitsum delivered our project ahead of schedule with exceptional quality. His technical expertise and problem-solving abilities are outstanding. A reliable team member.",
      avatar_url: '',
      rating: 5,
      featured: true,
      order_index: 4,
      createdAt: '',
      updatedAt: ''
    },
  ];

  // Use API data if available, otherwise fallback
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayTestimonials.length]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTestimonials();
      // Transform API data to match component interface
      const dataArray = Array.isArray(data) ? data : [];
      const transformedTestimonials: Testimonial[] = dataArray.map((item: unknown) => {
        const obj = typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {};
        const getString = (key: string, fallback = ''): string => {
          const v = obj[key];
          return typeof v === 'string' ? v : fallback;
        };
        const getNumber = (key: string, fallback = 5): number => {
          const v = obj[key];
          return typeof v === 'number' ? v : fallback;
        };

        return {
          _id: getString('_id', getString('id')),
          name: getString('name', 'Anonymous'),
          position: getString('position', getString('role')),
          company: getString('company', ''),
          content: getString('content', ''),
          avatar_url: getString('avatar_url', getString('avatar')),
          rating: getNumber('rating', 5),
          featured: !!obj['featured'],
          order_index: 0,
          createdAt: getString('createdAt', new Date().toISOString()),
          updatedAt: new Date().toISOString(),
        } as Testimonial;
      });
      setTestimonials(transformedTestimonials);
    } catch {
      // Silently use fallback testimonials if API is unavailable
      // This is expected when backend server is not running
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  // Generate commit hash
  const generateCommitHash = (index: number) => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 7; i++) {
      hash += chars[Math.floor((index * 7 + i) % chars.length)];
    }
    return hash;
  };

  // Use loading state in JSX
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono animate-pulse">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      id="testimonials" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full mix-blend-multiply filter blur-lg opacity-20 animate-bounce"></div>
        <div className="absolute top-1/4 left-1/4 w-30 h-30 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mix-blend-multiply filter blur-lg opacity-25 animate-float delay-2000"></div>
          
        {/* Floating Code Elements */}
        <div className="absolute top-1/6 left-1/6 text-green-400 text-xs font-mono opacity-20 animate-float">
          <div className="animate-typing">// Testimonials</div>
        </div>
        <div className="absolute top-2/6 right-1/6 text-blue-400 text-xs font-mono opacity-20 animate-float delay-1000">
          <div className="animate-typing">const feedback = [];</div>
        </div>
        <div className="absolute bottom-1/6 left-2/6 text-yellow-400 text-xs font-mono opacity-20 animate-float delay-2000">
          <div className="animate-typing">function inspire() &#123; return "success"; &#125;</div>
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
        
      {/* Code Review Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 font-mono text-xs text-green-400 animate-float">
          <CodeTypingEffect code="// Code Review Comments" language="javascript" speed={100} />
        </div>
        <div className="absolute bottom-10 right-10 font-mono text-xs text-blue-400 animate-float" style={{ animationDelay: '1s' }}>
          <CodeTypingEffect code="+1 LGTM" language="javascript" speed={100} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800/50 backdrop-blur-sm border border-green-500/30 mb-6 animate-scale-in">
            <GitBranch className="w-4 h-4 mr-2 text-green-400" />
            <span className="text-green-400 font-mono">Pull Requests</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">
            Code Reviews & Feedback
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-mono">
            <span className="text-green-400">//</span> What colleagues, mentors, and clients say about working with me
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Pull Request Card Style */}
          <div className={`relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
              {/* PR Header */}
              <div className="bg-gray-900 border-b border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-mono text-sm font-semibold">Merged</span>
                    </div>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 font-mono text-sm">
                        {displayTestimonials[currentIndex]?.name.split(' ')[0]?.toLowerCase() || 'reviewer'}/feedback
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <GitCommit className="w-4 h-4" />
                    <span className="text-green-400">{generateCommitHash(currentIndex)}</span>
                  </div>
                </div>
              </div>

              {/* PR Content */}
              <div className="p-6">
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-700">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl">
                      {displayTestimonials[currentIndex]?.avatar_url ? (
                        <img
                          src={`http://localhost:5000${displayTestimonials[currentIndex].avatar_url}`}
                          alt={displayTestimonials[currentIndex].name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white font-mono">
                        {displayTestimonials[currentIndex]?.name}
                      </h3>
                      <span className="text-gray-500 font-mono text-sm">commented</span>
                    </div>
                    <p className="text-gray-400 text-sm font-mono">
                      {displayTestimonials[currentIndex]?.position} at {displayTestimonials[currentIndex]?.company}
                    </p>
                    <p className="text-gray-500 text-xs font-mono mt-1">
                      {new Date().toLocaleDateString()} • {Math.floor(Math.random() * 5 + 1)} days ago
                    </p>
                  </div>
                </div>

                {/* Code Review Comment */}
                <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4 mb-4 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                  <div className="pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-xs font-mono">Approved</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed font-mono text-sm">
                      {displayTestimonials[currentIndex]?.content}
                    </p>
                  </div>
                </div>

                {/* Code Diff Preview */}
                <div className="bg-gray-900 rounded border border-gray-700 overflow-hidden mb-4">
                  <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                    <Code className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-xs font-mono">feedback.ts</span>
                  </div>
                  <div className="p-4 font-mono text-xs">
                    <div className="space-y-1">
                      <div className="text-gray-500">- const oldFeedback = "Needs improvement";</div>
                      <div className="text-green-400">+ const newFeedback = "{displayTestimonials[currentIndex]?.content.substring(0, 50)}...";</div>
                      <div className="text-gray-500">- rating: 3</div>
                      <div className="text-green-400">+ rating: {displayTestimonials[currentIndex]?.rating || 5}</div>
                    </div>
                  </div>
                </div>

                {/* Reactions */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-all duration-300 group">
                    <ThumbsUp className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-300 text-xs font-mono">{Math.floor(Math.random() * 10 + 5)}</span>
                  </button>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Changes approved</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prevTestimonial}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-all duration-300 hover:border-green-500 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-sm">Previous</span>
              </button>

              <div className="flex gap-2">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-green-400 w-8 animate-pulse-glow'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-700 transition-all duration-300 hover:border-green-500 group"
                aria-label="Next testimonial"
              >
                <span className="font-mono text-sm">Next</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Commit History */}
            <div className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              {displayTestimonials.slice(0, 3).map((testimonial, index) => (
                <div
                  key={testimonial._id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:border-green-500/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setCurrentIndex(index)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GitCommit className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-xs font-mono">{generateCommitHash(index)}</span>
                  </div>
                  <p className="text-gray-300 text-sm font-mono line-clamp-2">{testimonial.content.substring(0, 60)}...</p>
                  <p className="text-gray-500 text-xs font-mono mt-2">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
