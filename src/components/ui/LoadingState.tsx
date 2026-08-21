import React from 'react';
import { Loader2 } from 'lucide-react';
import { SchoolLogo } from '@/components/ui/SchoolLogo';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Memuat data...',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 min-h-[200px] text-slate-500 ${className}`}
    >
      <div className="relative mb-3">
        <SchoolLogo size="md" animated />
        <Loader2 className="w-4 h-4 animate-spin text-brand-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
      </div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-4 bg-slate-200/70 rounded-xl h-24 w-full" />
      ))}
    </div>
  );
};
