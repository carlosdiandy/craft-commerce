import React from 'react';
import { Link } from 'react-router-dom';

interface ElosaBrandProps {
  variant?: 'header' | 'footer' | 'standalone';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const ElosaBrand: React.FC<ElosaBrandProps> = ({ 
  variant = 'header', 
  size = 'md',
  showTagline = true 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-10 w-auto', 
    lg: 'h-16 w-auto'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const taglineSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm'
  };

  if (variant === 'standalone') {
    return (
      <div className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
        {/* ... same content ... */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-primary rounded-full scale-110 opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className={`relative ${sizeClasses[size]} aspect-square bg-primary rounded-full flex items-center justify-center shadow-elosa`}>
            <svg 
              viewBox="0 0 24 24" 
              className="w-3/5 h-3/5 text-secondary"
              fill="currentColor"
            >
              <path d="M12 2C12 2 12 12 12 22M12 12C12 12 6 8 6 12C6 16 12 12 12 12M12 12C12 12 18 8 18 12C18 16 12 12 12 12" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
              <path d="M8 6C8 6 10 8 12 6M16 6C16 6 14 8 12 6M8 18C8 18 10 16 12 18M16 18C16 18 14 16 12 18" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    fill="none" 
                    strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-elosa bg-clip-text text-transparent font-display`}>
            Elosa
          </h1>
          {showTagline && (
            <p className={`${taglineSizeClasses[size]} text-muted-foreground -mt-1 font-medium`}>
              Natural Marketplace
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link 
      to="/"
      className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
    >
      {/* Elosa Logo */}
      <div className="relative flex-shrink-0">
        {/* Golden yellow circular background */}
        <div className="absolute inset-0 bg-primary rounded-full scale-110 opacity-20 group-hover:opacity-30 transition-opacity"></div>
        
        {/* Logo container */}
        <div className={`relative ${sizeClasses[size]} aspect-square bg-primary rounded-full flex items-center justify-center shadow-elosa`}>
          {/* Leaf pattern - inspired by the uploaded logo */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-3/5 h-3/5 text-secondary"
            fill="currentColor"
          >
            {/* Central leaf stem */}
            <path d="M12 2C12 2 12 12 12 22M12 12C12 12 6 8 6 12C6 16 12 12 12 12M12 12C12 12 18 8 18 12C18 16 12 12 12 12" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
            {/* Side leaves */}
            <path d="M8 6C8 6 10 8 12 6M16 6C16 6 14 8 12 6M8 18C8 18 10 16 12 18M16 18C16 18 14 16 12 18" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  fill="none" 
                  strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Brand text */}
      <div className="flex flex-col">
        <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-elosa bg-clip-text text-transparent font-display`}>
          Elosa
        </h1>
        {showTagline && (
          <p className={`${taglineSizeClasses[size]} text-muted-foreground -mt-1 font-medium`}>
            Natural Marketplace
          </p>
        )}
      </div>
    </Link>
  );
};