import { useState, useEffect } from 'react';

interface CodeTypingEffectProps {
  code: string;
  language?: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
}

const CodeTypingEffect = ({ 
  code, 
  language = 'javascript', 
  speed = 50,
  className = '',
  showCursor = true 
}: CodeTypingEffectProps) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timer = setTimeout(() => {
        setDisplayedCode(prev => prev + code[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, code, speed]);

  // Syntax highlighting colors
  const highlightCode = (text: string, lang: string) => {
    if (lang === 'javascript' || lang === 'js') {
      return text
        .replace(/(const|let|var|function|return|if|else|for|while|class|import|export|from|default)/g, 
          '<span class="text-purple-400">$1</span>')
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, 
          '<span class="text-green-400">$&</span>')
        .replace(/(\/\/.*$)/gm, 
          '<span class="text-gray-500">$1</span>')
        .replace(/(\d+)/g, 
          '<span class="text-yellow-400">$1</span>');
    }
    if (lang === 'python') {
      return text
        .replace(/(def|class|if|else|elif|for|while|import|from|return|print)/g, 
          '<span class="text-blue-400">$1</span>')
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, 
          '<span class="text-green-400">$&</span>')
        .replace(/(#.*$)/gm, 
          '<span class="text-gray-500">$1</span>')
        .replace(/(\d+)/g, 
          '<span class="text-yellow-400">$1</span>');
    }
    if (lang === 'html') {
      return text
        .replace(/(&lt;\/?[\w\s="'-]+&gt;)/g, 
          '<span class="text-blue-400">$1</span>')
        .replace(/(&lt;!--.*?--&gt;)/g, 
          '<span class="text-gray-500">$1</span>');
    }
    return text;
  };

  return (
    <div className={`font-mono text-sm ${className}`}>
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 overflow-x-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-gray-400 text-xs">{language}</span>
        </div>
        <pre className="text-gray-100">
          <code 
            dangerouslySetInnerHTML={{ 
              __html: highlightCode(displayedCode, language) + (showCursor && currentIndex < code.length ? '<span class="animate-pulse">|</span>' : '')
            }} 
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeTypingEffect;
