import { useState, memo } from 'react';
import { Code2, Palette, Database, Cloud, MessageSquare, Lightbulb, Layers } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import CodeTypingEffect from './CodeTypingEffect';

interface Skill {
  name: string;
  icon: JSX.Element;
  description: string;
  proficiency: string;
  experience: string;
  projects: string[];
  category: 'technical' | 'soft';
  color: string;
  codeExample?: string;
}

const Skills = memo(() => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const skills: Skill[] = [
    {
      name: 'Frontend Development',
      icon: <Code2 size={32} />,
      description: 'Expert in building responsive, interactive web applications with modern frameworks',
      proficiency: 'Advanced',
      experience: '3+ years',
      projects: ['React applications', 'Interactive dashboards', 'E-commerce platforms'],
      category: 'technical',
      color: 'from-purple-500 to-pink-500',
      codeExample: 'const App = () => <div>Hello World</div>;'
    },
    {
      name: 'HTML, CSS & JavaScript',
      icon: <Palette size={32} />,
      description: 'Strong foundation in web fundamentals with expertise in modern ES6+ JavaScript',
      proficiency: 'Expert',
      experience: '4+ years',
      projects: ['Dynamic web apps', 'Animation libraries', 'Custom UI components'],
      category: 'technical',
      color: 'from-cyan-500 to-blue-500',
      codeExample: 'const greet = (name) => `Hello ${name}!`;'
    },
    {
      name: 'React & TypeScript',
      icon: <Layers size={32} />,
      description: 'Building scalable applications with React hooks, context, and type-safe TypeScript',
      proficiency: 'Advanced',
      experience: '2+ years',
      projects: ['Portfolio sites', 'SaaS applications', 'Admin dashboards'],
      category: 'technical',
      color: 'from-blue-500 to-cyan-500',
      codeExample: 'const [count, setCount] = useState<number>(0);'
    },
    {
      name: 'Backend Development',
      icon: <Database size={32} />,
      description: 'Creating robust APIs and server-side applications with Node.js and Python',
      proficiency: 'Intermediate',
      experience: '2+ years',
      projects: ['REST APIs', 'Authentication systems', 'Database integrations'],
      category: 'technical',
      color: 'from-pink-500 to-rose-500',
      codeExample: 'app.get("/api/users", (req, res) => {...});'
    },
    {
      name: 'Python & Java',
      icon: <Code2 size={32} />,
      description: 'Versatile programming skills for automation, data processing, and application development',
      proficiency: 'Advanced',
      experience: '3+ years',
      projects: ['Automation scripts', 'Data analysis tools', 'Desktop applications'],
      category: 'technical',
      color: 'from-green-500 to-emerald-500',
      codeExample: 'def process_data(data): return data.map(...)'
    },
    {
      name: 'Cloud & DevOps',
      icon: <Cloud size={32} />,
      description: 'Deploying and managing applications on cloud platforms with CI/CD pipelines',
      proficiency: 'Intermediate',
      experience: '1+ years',
      projects: ['Deployed web apps', 'Automated workflows', 'Serverless functions'],
      category: 'technical',
      color: 'from-indigo-500 to-purple-500',
      codeExample: '$ git push origin main\n$ npm run deploy'
    },
    {
      name: 'Problem Solving',
      icon: <Lightbulb size={32} />,
      description: 'Analytical thinking and creative approach to solving complex technical challenges',
      proficiency: 'Expert',
      experience: 'Core strength',
      projects: ['Algorithm optimization', 'Bug fixing', 'Architecture design'],
      category: 'soft',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Communication',
      icon: <MessageSquare size={32} />,
      description: 'Clear communication of technical concepts through content creation and teaching',
      proficiency: 'Expert',
      experience: 'YouTube creator',
      projects: ['Educational videos', 'Technical documentation', 'Team collaboration'],
      category: 'soft',
      color: 'from-rose-500 to-pink-500'
    },
  ];

  const technicalSkills = skills.filter(s => s.category === 'technical');
  const softSkills = skills.filter(s => s.category === 'soft');

  const getProficiencyPercentage = (proficiency: string) => {
    switch (proficiency) {
      case 'Expert': return 95;
      case 'Advanced': return 85;
      case 'Intermediate': return 70;
      default: return 75;
    }
  };

  const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
    const percentage = getProficiencyPercentage(skill.proficiency);

    return (
      <div
        className={`group relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
        style={{ animationDelay: `${index * 0.1}s` }}
        onMouseEnter={() => setHoveredSkill(skill.name)}
        onMouseLeave={() => setHoveredSkill(null)}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700 p-6 cursor-pointer h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 dark:hover:border-blue-600 transform-gpu">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`p-4 bg-gradient-to-r ${skill.color} rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
              {skill.icon}
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {skill.name}
            </h3>

            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Proficiency:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{skill.proficiency}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out ${
                    isVisible ? 'animate-gradient' : ''
                  }`}
                  style={{
                    width: isVisible ? `${percentage}%` : '0%',
                  }}
                ></div>
              </div>
            </div>
          </div>

          {hoveredSkill === skill.name && (
            <div className="absolute inset-0 bg-white dark:bg-gray-900 shadow-2xl p-6 z-20 border-2 border-blue-500 dark:border-blue-400 rounded-lg animate-scale-in backdrop-blur-sm overflow-y-auto">
              <div className="space-y-3 h-full flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{skill.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{skill.description}</p>
                
                {/* Code Example */}
                {skill.codeExample && (
                  <div className="mt-2 relative">
                    <CodeTypingEffect 
                      code={skill.codeExample} 
                      language={skill.name.includes('Python') ? 'python' : skill.name.includes('Cloud') ? 'bash' : 'javascript'}
                      speed={50}
                    />
                    {/* Compilation Success Indicator */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-green-500 text-xs animate-code-compile">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-mono">✓</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{skill.experience}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Projects Applied:</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.projects.map((project) => (
                        <span
                          key={project}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg text-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                        >
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      id="skills" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 mb-6 animate-scale-in border border-blue-200 dark:border-blue-800 shadow-sm">
            <Code2 className="w-4 h-4 mr-2" />
            <span>Skills & Expertise</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Technologies I Master
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Hover over each skill to see detailed information about my experience and projects
          </p>
        </div>

        {/* Technical Skills */}
        <div className="mb-16">
          <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>Technical Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>Soft Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {softSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={technicalSkills.length + index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';

export default Skills;
