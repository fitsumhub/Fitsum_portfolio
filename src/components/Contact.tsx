import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Youtube, Download, Terminal, MessageCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import CodeTypingEffect from './CodeTypingEffect';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      id="contact" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-gray-950 relative overflow-hidden border-t-2 border-gray-700 dark:border-gray-800"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-slate-900"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 mb-6 animate-scale-in">
            <Mail className="w-4 h-4 mr-2" />
            <span>Contact</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-mono mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Get In Touch
          </h2>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto font-mono leading-relaxed">
            Have a project in mind or want to collaborate? Let's connect and create something amazing together
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-3xl font-bold font-mono text-slate-100 mb-6">
                Let's Talk
              </h3>
              <p className="text-slate-400 font-mono mb-8">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of
                your vision. Feel free to reach out through any of the following channels.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-slate-800 dark:bg-gray-900 border-2 border-cyan-500/50 dark:border-cyan-600/50 rounded-xl hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <div className="p-3 bg-cyan-500/20 rounded-lg border border-cyan-400/30 transition-transform duration-300 group-hover:rotate-6">
                  <Mail size={24} className="text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold font-mono text-slate-100 mb-1">Email</h4>
                  <a
                    href="mailto:fitsumenunu21@gmail.com"
                    className="text-slate-400 hover:text-cyan-400 font-mono transition-colors"
                  >
                    fitsumenunu21@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-slate-800 dark:bg-gray-900 border-2 border-purple-500/50 dark:border-purple-600/50 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-400/30 transition-transform duration-300 group-hover:rotate-6">
                  <Phone size={24} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold font-mono text-slate-100 mb-1">Phone</h4>
                  <a
                    href="tel:+251920209609"
                    className="text-slate-400 hover:text-purple-400 font-mono transition-colors"
                  >
                    +251 920 209 609
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-slate-800 dark:bg-gray-900 border-2 border-pink-500/50 dark:border-pink-600/50 rounded-xl hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <div className="p-3 bg-pink-500/20 rounded-lg border border-pink-400/30 transition-transform duration-300 group-hover:rotate-6">
                  <MapPin size={24} className="text-pink-400" />
                </div>
                <div>
                  <h4 className="font-semibold font-mono text-slate-100 mb-1">Location</h4>
                  <p className="text-slate-300 font-mono font-medium">Addis Ababa, Ethiopia</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-cyan-500/50 dark:border-cyan-600/50">
              <h4 className="font-bold font-mono text-slate-100 mb-5 text-lg">Connect With Me</h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/fitsum-enunu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-800 dark:bg-gray-900 border-2 border-cyan-500/50 dark:border-cyan-600/50 rounded-xl hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-110 transition-all duration-300 transform"
                  aria-label="GitHub"
                >
                  <Github size={28} className="text-cyan-400" />
                </a>
                <a
                  href="https://linkedin.com/in/fitsum-enunu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-800 dark:bg-gray-900 border-2 border-purple-500/50 dark:border-purple-600/50 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-110 transition-all duration-300 transform"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={28} className="text-purple-400" />
                </a>
                <a
                  href="https://youtube.com/@APlusEthiopia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-800 dark:bg-gray-900 border-2 border-red-500/50 dark:border-red-600/50 rounded-xl hover:border-red-400 dark:hover:border-red-500 hover:shadow-xl hover:shadow-red-500/30 hover:scale-110 transition-all duration-300 transform"
                  aria-label="YouTube"
                >
                  <Youtube size={28} className="text-red-400" />
                </a>
                <a
                  href="https://t.me/AplusHustler"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-800 dark:bg-gray-900 border-2 border-blue-500/50 dark:border-blue-600/50 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110 transition-all duration-300 transform"
                  aria-label="Telegram"
                  title="Telegram: @fitsum00000 | Channel: @AplusHustler (24.4K followers, 201.9K likes)"
                >
                  <MessageCircle size={28} className="text-blue-400" />
                </a>
              </div>
            </div>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 group">
              <Download size={20} className="transition-transform duration-300 group-hover:translate-y-1" />
              Download CV
            </button>
          </div>

          <div className={`bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            {/* Terminal Header */}
            <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-cyan-500/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-mono">fitsumenunu21@gmail.com</span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 bg-slate-900/50">
              {/* Terminal Prompt Display */}
              <div className="mb-6 space-y-2 font-mono text-sm">
                <div className="text-green-400">
                  <span className="text-cyan-400">$</span> send_message --help
                </div>
                <div className="text-gray-400 text-xs ml-4">
                  Usage: send_message [options]<br/>
                  Options:<br/>
                  &nbsp;&nbsp;--name &lt;string&gt;&nbsp;&nbsp;&nbsp;Your name<br/>
                  &nbsp;&nbsp;--email &lt;string&gt;&nbsp;&nbsp;Your email address<br/>
                  &nbsp;&nbsp;--message &lt;text&gt;&nbsp;&nbsp;Your message
                </div>
              </div>

              {/* Code Background */}
              <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                <CodeTypingEffect 
                  code="const sendMessage = async (name, email, message) => { await api.post('/contact', { name, email, message }); }"
                  language="javascript"
                  speed={30}
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyan-400 font-mono">$</span>
                    <label htmlFor="name" className="text-sm font-semibold font-mono text-slate-300">
                      send_message --name
                    </label>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-lg transition-all duration-300 text-green-400 font-mono placeholder-slate-600 focus:outline-none ${
                      focusedField === 'name'
                        ? 'border-cyan-400/50 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/25 scale-[1.02]'
                        : 'border-cyan-500/30 hover:border-cyan-400/40'
                    }`}
                    placeholder="Enter your name..."
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyan-400 font-mono">$</span>
                    <label htmlFor="email" className="text-sm font-semibold font-mono text-slate-300">
                      send_message --email
                    </label>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-lg transition-all duration-300 text-green-400 font-mono placeholder-slate-600 focus:outline-none ${
                      focusedField === 'email'
                        ? 'border-purple-400/50 ring-2 ring-purple-400/50 shadow-lg shadow-purple-500/25 scale-[1.02]'
                        : 'border-purple-500/30 hover:border-purple-400/40'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-cyan-400 font-mono">$</span>
                    <label htmlFor="message" className="text-sm font-semibold font-mono text-slate-300">
                      send_message --message
                    </label>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 bg-slate-800 border rounded-lg transition-all duration-300 text-green-400 font-mono placeholder-slate-600 resize-none focus:outline-none ${
                      focusedField === 'message'
                        ? 'border-pink-400/50 ring-2 ring-pink-400/50 shadow-lg shadow-pink-500/25 scale-[1.02]'
                        : 'border-pink-500/30 hover:border-pink-400/40'
                    }`}
                    placeholder="Enter your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono font-bold rounded-lg shadow-lg hover:shadow-cyan-500/25 transform transition-all duration-300 group ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="font-mono">Executing...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-cyan-300 font-mono">$</span>
                      <span className="font-mono">send_message --execute</span>
                      <Send size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-400/30 text-green-300 font-mono rounded-lg animate-fade-in-up">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Message sent successfully! Response: 200 OK</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
