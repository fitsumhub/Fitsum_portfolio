import { useState, useEffect, useRef } from 'react';

interface TerminalWindowProps {
  commands?: string[];
  prompt?: string;
  className?: string;
  autoType?: boolean;
  speed?: number;
}

const TerminalWindow = ({ 
  commands = ['npm install', 'npm run dev', 'Building...', '✓ Ready!'],
  prompt = '$',
  className = '',
  autoType = true,
  speed = 100
}: TerminalWindowProps) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoType || currentCommandIndex >= commands.length) {
      setIsTyping(false);
      return;
    }

    const currentCommand = commands[currentCommandIndex];
    
    if (currentCharIndex < currentCommand.length) {
      const timer = setTimeout(() => {
        const newLine = currentCommand.substring(0, currentCharIndex + 1);
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentCommandIndex] = newLine;
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      // Move to next command after a delay
      setTimeout(() => {
        setCurrentCommandIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        setDisplayedLines(prev => [...prev, '']);
      }, 500);
    }
  }, [currentCommandIndex, currentCharIndex, commands, autoType, speed]);

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedLines]);

  return (
    <div className={`bg-gray-900 rounded-lg border border-gray-700 overflow-hidden ${className}`}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="ml-2 text-gray-400 text-xs font-mono">Terminal</span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="p-4 font-mono text-sm text-green-400 h-48 overflow-y-auto"
        style={{ fontFamily: 'monospace' }}
      >
        {displayedLines.map((line, index) => (
          <div key={index} className="mb-1">
            <span className="text-blue-400">{prompt}</span>{' '}
            <span className="text-gray-300">{line}</span>
            {index === displayedLines.length - 1 && isTyping && (
              <span className="animate-pulse text-green-400">|</span>
            )}
          </div>
        ))}
        {!isTyping && (
          <div className="text-gray-500 text-xs mt-2">
            Type <span className="text-green-400">help</span> for more commands
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalWindow;
