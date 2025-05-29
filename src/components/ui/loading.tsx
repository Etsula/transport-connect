
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
};

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export const LoadingCard = ({ title = "Loading...", description, className }: LoadingCardProps) => (
  <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
    <LoadingSpinner size="lg" />
    <div className="text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
    </div>
  </div>
);

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export const LoadingOverlay = ({ isLoading, children, loadingText = "Loading..." }: LoadingOverlayProps) => (
  <div className="relative">
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
        <div className="flex flex-col items-center space-y-2">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-600">{loadingText}</p>
        </div>
      </div>
    )}
  </div>
);
