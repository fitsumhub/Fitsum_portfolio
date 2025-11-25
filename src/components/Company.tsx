import { useState } from 'react';
import { Building2, Users, Target, Lightbulb, Globe, TrendingUp, Heart } from 'lucide-react';

const Company = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const tabs = [
    { id: 'mission', label: 'Mission & Vision', icon: <Target className="h-5 w-5" /> },
    { id: 'services', label: 'Services', icon: <Building2 className="h-5 w-5" /> },
    { id: 'impact', label: 'Impact', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'future', label: 'Future Goals', icon: <Lightbulb className="h-5 w-5" /> }
  ];

  const services = [
    {
      title: 'Educational Platforms',
      description: 'Building comprehensive learning management systems for schools and universities',
      icon: <Globe className="h-8 w-8 text-blue-400" />,
      features: ['Student Management', 'Course Content', 'Assessment Tools', 'Progress Tracking']
    },
    {
      title: 'Student Engagement Systems',
      description: 'Creating interactive platforms that keep students motivated and engaged',
      icon: <Users className="h-8 w-8 text-green-400" />,
      features: ['Gamification', 'Social Learning', 'Peer Interaction', 'Achievement Systems']
    },
    {
      title: 'SEO-Driven Websites',
      description: 'Developing high-performance websites optimized for search engines',
      icon: <TrendingUp className="h-8 w-8 text-purple-400" />,
      features: ['SEO Optimization', 'Performance', 'Analytics', 'Content Strategy']
    },
    {
      title: 'AI-Powered Learning Tools',
      description: 'Integrating artificial intelligence to personalize learning experiences',
      icon: <Lightbulb className="h-8 w-8 text-yellow-400" />,
      features: ['Personalized Learning', 'Smart Recommendations', 'Automated Assessment', 'Predictive Analytics']
    }
  ];

  const achievements = [
    { metric: '100K+', label: 'YouTube Subscribers', description: 'Educational content reach across @AplusEthiopia & @AplusHustler' },
    { metric: '1000+', label: 'Students Helped', description: 'Through our platforms' },
    { metric: '8+', label: 'Projects Completed', description: 'Web and mobile applications' },
    { metric: '3+', label: 'Years Experience', description: 'In educational technology' }
  ];

  const futureGoals = [
    {
      title: 'A+ Freshman App',
      description: 'Mobile app for university students with course materials, schedules, and campus information',
      status: 'In Development',
      timeline: '2024'
    },
    {
      title: 'AI Learning Assistant',
      description: 'AI-powered learning assistant for Ethiopian students with personalized study plans',
      status: 'Planning',
      timeline: '2025'
    },
    {
      title: 'International Expansion',
      description: 'Expand AplusEthiopia into an international EdTech brand',
      status: 'Vision',
      timeline: '2026'
    },
    {
      title: 'Monetization Strategy',
      description: 'Implement AdSense, premium courses, and subscription models',
      status: 'In Progress',
      timeline: '2024'
    }
  ];

  return (
    <section id="company" className="section bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)] opacity-60"></div>
      <div className="container-custom relative z-10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

        {/* Header */}
        <div className="text-center mb-16 slide-up">
          <div className="badge mb-6 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30">
            <Building2 className="w-4 h-4 mr-2 text-cyan-400" />
            <span className="text-cyan-400 font-mono">A+ Solution PLC</span>
          </div>
          <h2 className="section-title font-mono">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Building the Future</span>
            <span className="text-slate-100"> of Education</span>
          </h2>
          <p className="section-subtitle text-slate-300 font-mono">
            My startup focused on <span className="text-cyan-400">solving educational problems</span> for 
            <span className="text-purple-400"> Grade 12</span> and <span className="text-pink-400">Freshman university students</span> in Ethiopia.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 font-mono ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/50'
                  : 'bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 text-slate-300 hover:border-cyan-400/50 hover:bg-slate-700/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-lg shadow-cyan-500/10">
          {activeTab === 'mission' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white font-mono mb-6">Our Mission & Vision</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-6 rounded-xl border border-purple-400/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-8 w-8 text-purple-400" />
                    <h4 className="text-xl font-bold text-white font-mono">Mission</h4>
                  </div>
                  <p className="text-gray-300 font-mono text-lg leading-relaxed">
                    <span className="text-purple-400 font-semibold">"To make learning and earning easier through technology"</span>
                  </p>
                  <p className="text-gray-400 font-mono mt-4">
                    We believe that every Ethiopian student deserves access to quality education and opportunities to build their future through technology.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-400/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="h-8 w-8 text-blue-400" />
                    <h4 className="text-xl font-bold text-white font-mono">Vision</h4>
                  </div>
                  <p className="text-gray-300 font-mono text-lg leading-relaxed">
                    <span className="text-blue-400 font-semibold">"To empower Ethiopian youth through digital transformation"</span>
                  </p>
                  <p className="text-gray-400 font-mono mt-4">
                    Creating a future where technology bridges the gap between education and opportunity for every young Ethiopian.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white font-mono mb-6">Our Services</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 p-6 rounded-xl border border-gray-600 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      {service.icon}
                      <h4 className="text-xl font-bold text-white font-mono">{service.title}</h4>
                    </div>
                    <p className="text-gray-300 font-mono mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs font-semibold border border-purple-400/30">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white font-mono mb-6">Our Impact</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 p-6 rounded-xl border border-gray-600 text-center hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                    <div className="text-3xl font-bold text-cyan-400 font-mono mb-2">{achievement.metric}</div>
                    <div className="text-white font-mono font-semibold mb-1">{achievement.label}</div>
                    <div className="text-gray-400 font-mono text-sm">{achievement.description}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 p-6 rounded-xl border border-green-400/30">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-8 w-8 text-green-400" />
                  <h4 className="text-xl font-bold text-white font-mono">Making a Difference</h4>
                </div>
                <p className="text-gray-300 font-mono leading-relaxed">
                  Through our educational platforms and YouTube content, we're helping thousands of Ethiopian students 
                  access quality education, learn new skills, and build their future in technology. Our focus on 
                  <span className="text-green-400 font-semibold"> Amharic content</span> makes tech learning accessible 
                  to every Ethiopian student, breaking language barriers in education.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'future' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white font-mono mb-6">Future Goals</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {futureGoals.map((goal, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 p-6 rounded-xl border border-gray-600 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-white font-mono">{goal.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        goal.status === 'In Development' ? 'bg-blue-500/20 text-blue-400' :
                        goal.status === 'Planning' ? 'bg-yellow-500/20 text-yellow-400' :
                        goal.status === 'In Progress' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-gray-300 font-mono mb-4">{goal.description}</p>
                    <div className="text-gray-400 font-mono text-sm">Timeline: {goal.timeline}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Company;
