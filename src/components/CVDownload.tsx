import { useState } from 'react';
import { Download, FileText } from 'lucide-react';

interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  youtube: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    description: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url: string;
  }>;
  achievements: string[];
}

const CVDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const cvData: CVData = {
    name: "Fitsum Enunu",
    title: "Full-Stack Developer | Content Creator | Tech Educator",
    email: "fitsumenunu21@gmail.com",
    phone: "+251 920 209 609",
    location: "Ethiopia",
    github: "https://github.com/fitsumhub",
    linkedin: "https://linkedin.com/in/fitsum-enunu",
    youtube: "https://youtube.com/@AplusEthiopia",
    summary: "Passionate Full-Stack Developer, Content Creator, and Tech Educator with 3+ years of experience building web applications and educational platforms. Founder of A+ Solution PLC, creating digital solutions for Ethiopian students. YouTube educator with 100K+ subscribers across @AplusEthiopia and @AplusHustler channels, teaching programming in Amharic to make tech accessible to every Ethiopian student.",
    experience: [
      {
        title: "Founder & Full-Stack Developer",
        company: "A+ Solution PLC",
        duration: "2022 - Present",
        description: "Founded and lead a web & app development company focused on educational platforms and student engagement systems.",
        achievements: [
          "Built AplusEthiopia.com - educational platform for Grade 12 and Freshman students",
          "Developed APlus Library - free platform for downloading educational books and PDFs",
          "Created FreshmanQuiz Website - quiz-based learning platform with MERN Stack",
          "Built AI Messaging App with auto-reply integration",
          "Developed Java Employee Management System with CRUD operations"
        ]
      },
      {
        title: "Content Creator & YouTuber",
        company: "Aplus Ethiopia",
        duration: "2021 - Present",
        description: "Create educational content on programming, psychology, online business, and motivation for Ethiopian students.",
        achievements: [
          "Grew YouTube channels to 100K+ subscribers across @AplusEthiopia and @AplusHustler",
          "Teach programming (Python, HTML, C++, Java) in Amharic",
          "Created 200+ educational videos",
          "Built community of 50K+ Ethiopian students"
        ]
      },
      {
        title: "IT Student",
        company: "Debre Berhan University, College of Computing",
        duration: "2021 - Present",
        description: "Pursuing degree in Information Technology with focus on software development and computer science.",
        achievements: [
          "Maintaining excellent academic performance",
          "Applied theoretical knowledge to real-world projects",
          "Contributed to university tech initiatives"
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Information Technology",
        institution: "Debre Berhan University, College of Computing",
        year: "2021 - Present",
        description: "Focus on software development, computer science, and technology applications."
      }
    ],
    skills: [
      {
        category: "Frontend Development",
        items: ["JavaScript", "React", "HTML5", "CSS3", "Tailwind CSS", "TypeScript"]
      },
      {
        category: "Backend Development",
        items: ["Node.js", "Express.js", "Python", "Java", "PHP", "C++"]
      },
      {
        category: "Database & Cloud",
        items: ["MongoDB", "MySQL", "SQLite", "Firebase", "Git", "GitHub"]
      },
      {
        category: "Mobile Development",
        items: ["React Native", "Expo", "Android Development"]
      },
      {
        category: "Tools & Technologies",
        items: ["Git", "GitHub", "XAMPP", "Postman", "Video Editing", "SEO", "Digital Marketing"]
      }
    ],
    projects: [
      {
        name: "AplusEthiopia.com",
        description: "Educational platform helping Grade 12 and Freshman students access study materials, quizzes, and tech learning content.",
        technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
        url: "https://aplusethiopia.com"
      },
      {
        name: "APlus Library",
        description: "Free platform for downloading books and PDFs for students, developers, and learners.",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        url: "#"
      },
      {
        name: "FreshmanQuiz Website",
        description: "Quiz-based learning platform where users can choose courses and answer chapter-wise questions.",
        technologies: ["React", "Node.js", "MongoDB", "Express", "Admin Dashboard"],
        url: "#"
      },
      {
        name: "AI Messaging App",
        description: "Chat app with AI auto-reply integration for specific messages.",
        technologies: ["React Native", "AI Integration", "Firebase", "Expo"],
        url: "#"
      },
      {
        name: "Java Employee Management System",
        description: "Desktop application with CRUD operations, authentication, and CSV export features.",
        technologies: ["Java", "Java Swing", "MySQL", "SQLite"],
        url: "#"
      }
    ],
    achievements: [
      "100K+ YouTube subscribers across @AplusEthiopia and @AplusHustler channels",
      "Founded A+ Solution PLC - Web & App Development company",
      "Built 8+ major projects including web and mobile applications",
      "Created educational content reaching thousands of Ethiopian students",
      "Developed AI-powered learning tools and educational platforms",
      "Expert in MERN Stack development",
      "Proficient in multiple programming languages (JavaScript, Python, Java, PHP, C++)",
      "Strong background in educational technology and content creation"
    ]
  };

  const generateCV = async () => {
    setIsGenerating(true);
    
    try {
      // Create a comprehensive CV HTML
      const cvHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${cvData.name} - CV</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: #fff;
                }
                
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 10px;
                }
                
                .header h1 {
                    font-size: 2.5em;
                    margin-bottom: 10px;
                    font-weight: 700;
                }
                
                .header h2 {
                    font-size: 1.3em;
                    margin-bottom: 20px;
                    opacity: 0.9;
                }
                
                .contact-info {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9em;
                }
                
                .section {
                    margin-bottom: 30px;
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 10px;
                    border-left: 4px solid #667eea;
                }
                
                .section h3 {
                    color: #667eea;
                    font-size: 1.5em;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 5px;
                }
                
                .summary {
                    font-size: 1.1em;
                    line-height: 1.7;
                    text-align: justify;
                }
                
                .experience-item, .education-item, .project-item {
                    margin-bottom: 20px;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .experience-item h4, .education-item h4, .project-item h4 {
                    color: #667eea;
                    font-size: 1.2em;
                    margin-bottom: 5px;
                }
                
                .company, .institution {
                    font-weight: 600;
                    color: #555;
                    margin-bottom: 5px;
                }
                
                .duration {
                    color: #888;
                    font-size: 0.9em;
                    margin-bottom: 10px;
                }
                
                .description {
                    margin-bottom: 10px;
                    line-height: 1.6;
                }
                
                .achievements, .technologies {
                    margin-top: 10px;
                }
                
                .achievements ul, .technologies ul {
                    margin-left: 20px;
                }
                
                .achievements li, .technologies li {
                    margin-bottom: 5px;
                    line-height: 1.5;
                }
                
                .skills-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                
                .skill-category {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .skill-category h4 {
                    color: #667eea;
                    margin-bottom: 10px;
                    font-size: 1.1em;
                }
                
                .skill-items {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                .skill-tag {
                    background: #667eea;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 15px;
                    font-size: 0.8em;
                    font-weight: 500;
                }
                
                .achievements-list {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .achievements-list ul {
                    margin-left: 20px;
                }
                
                .achievements-list li {
                    margin-bottom: 8px;
                    line-height: 1.6;
                }
                
                .project-url {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 500;
                }
                
                .project-url:hover {
                    text-decoration: underline;
                }
                
                @media print {
                    body { margin: 0; }
                    .container { max-width: none; }
                    .section { break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${cvData.name}</h1>
                    <h2>${cvData.title}</h2>
                    <div class="contact-info">
                        <div class="contact-item">📧 ${cvData.email}</div>
                        <div class="contact-item">📱 ${cvData.phone}</div>
                        <div class="contact-item">📍 ${cvData.location}</div>
                        <div class="contact-item">🔗 ${cvData.github}</div>
                        <div class="contact-item">📺 ${cvData.youtube}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h3>Professional Summary</h3>
                    <div class="summary">${cvData.summary}</div>
                </div>
                
                <div class="section">
                    <h3>Professional Experience</h3>
                    ${cvData.experience.map(exp => `
                        <div class="experience-item">
                            <h4>${exp.title}</h4>
                            <div class="company">${exp.company}</div>
                            <div class="duration">${exp.duration}</div>
                            <div class="description">${exp.description}</div>
                            <div class="achievements">
                                <strong>Key Achievements:</strong>
                                <ul>
                                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h3>Education</h3>
                    ${cvData.education.map(edu => `
                        <div class="education-item">
                            <h4>${edu.degree}</h4>
                            <div class="institution">${edu.institution}</div>
                            <div class="duration">${edu.year}</div>
                            <div class="description">${edu.description}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h3>Technical Skills</h3>
                    <div class="skills-grid">
                        ${cvData.skills.map(skill => `
                            <div class="skill-category">
                                <h4>${skill.category}</h4>
                                <div class="skill-items">
                                    ${skill.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="section">
                    <h3>Key Projects</h3>
                    ${cvData.projects.map(project => `
                        <div class="project-item">
                            <h4>${project.name}</h4>
                            <div class="description">${project.description}</div>
                            <div class="technologies">
                                <strong>Technologies:</strong>
                                <ul>
                                    ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
                                </ul>
                            </div>
                            ${project.url !== '#' ? `<div><strong>URL:</strong> <a href="${project.url}" class="project-url">${project.url}</a></div>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div class="section">
                    <h3>Key Achievements</h3>
                    <div class="achievements-list">
                        <ul>
                            ${cvData.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([cvHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cvData.name.replace(' ', '_')}_CV.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Also create a PDF version using browser's print functionality
      setTimeout(() => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(cvHTML);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }
      }, 1000);

    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Error generating CV. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={generateCV}
        disabled={isGenerating}
        className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-blue-500/50 animate-pulse-glow overflow-hidden font-mono border-2 border-blue-400/50 hover:border-blue-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy"></div>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 animate-pulse"></div>
        
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span className="relative z-10">Generating CV...</span>
          </>
        ) : (
          <>
            <Download className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Download CV</span>
            <FileText className="h-4 w-4 relative z-10 animate-bounce" />
          </>
        )}
        
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping delay-300"></div>
      </button>
    </div>
  );
};

export default CVDownload;
