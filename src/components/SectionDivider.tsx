import React from 'react';

interface SectionDividerProps {
  variant?: 'default' | 'gradient' | 'glow';
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ variant = 'default', className = '' }) => {
  const variants = {
    default: 'border-cyan-500/30',
    gradient: 'border-transparent bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent',
    glow: 'border-cyan-500/50 shadow-lg shadow-cyan-500/20'
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`h-px w-full ${variants[variant]}`}></div>
      {variant === 'glow' && (
        <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 blur-sm"></div>
      )}
    </div>
  );
};

export default SectionDivider;

