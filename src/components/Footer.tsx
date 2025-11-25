import { Heart, Github, Linkedin, Youtube, Mail, Send } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'YouTube', href: '#youtube' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer 
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-16 pb-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(120,119,198,0.3),transparent_50%)] opacity-60 animate-gradient"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}>
            <h3 className="text-2xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-gradient">
              Fitsum Enunu
            </h3>
            <p className="text-slate-300 font-mono mb-6">
              Creative Developer & Problem Solver passionate about building innovative solutions and empowering others through technology.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/fitsum-enunu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25 transform hover:rotate-12"
                aria-label="GitHub"
              >
                <Github size={20} className="text-cyan-400" />
              </a>
              <a
                href="https://linkedin.com/in/fitsum-enunu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 transform hover:rotate-12"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-purple-400" />
              </a>
              <a
                href="https://youtube.com/@APlusEthiopia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800/50 backdrop-blur-sm border border-pink-500/30 hover:border-pink-400/50 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25 transform hover:rotate-12"
                aria-label="YouTube"
              >
                <Youtube size={20} className="text-pink-400" />
              </a>
              <a
                href="mailto:fitsumenunu21@gmail.com"
                className="p-3 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25 transform hover:rotate-12"
                aria-label="Email"
              >
                <Mail size={20} className="text-cyan-400" />
              </a>
              <a
                href="https://t.me/AplusHustler"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 transform hover:rotate-12"
                aria-label="Telegram"
                title="Telegram: @fitsum00000 | Channel: @AplusHustler"
              >
                <Send size={20} className="text-blue-400" />
              </a>
            </div>
          </div>

          <div className={isVisible ? 'animate-fade-in-up' : 'opacity-0'} style={{ animationDelay: '0.2s' }}>
            <h4 className="text-xl font-bold font-mono text-slate-100 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-300 hover:text-cyan-400 font-mono transition-all duration-300 hover:translate-x-2 inline-block transform"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={isVisible ? 'animate-fade-in-up' : 'opacity-0'} style={{ animationDelay: '0.3s' }}>
            <h4 className="text-xl font-bold font-mono text-slate-100 mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-slate-300 font-mono">
              <li>
                <a
                  href="mailto:fitsumenunu21@gmail.com"
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  fitsumenunu21@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+251920209609"
                  className="hover:text-purple-400 transition-colors duration-200"
                >
                  +251 920 209 609
                </a>
              </li>
              <li className="text-pink-400">Addis Ababa, Ethiopia</li>
            </ul>
          </div>
        </div>

        <div className={`border-t border-cyan-500/30 pt-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-300 text-sm text-center sm:text-left font-mono">
              &copy; {currentYear} Fitsum Enunu. All rights reserved.
            </p>
            <p className="text-slate-300 text-sm flex items-center gap-2 font-mono">
              Made with <Heart size={16} className="text-pink-400 fill-current animate-pulse transition-transform duration-300 hover:scale-125" /> in Ethiopia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
