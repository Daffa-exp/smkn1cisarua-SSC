import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] active:duration-75';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-px text-white focus-visible:ring-brand-500 shadow-sm hover:shadow-md',
    secondary: 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-px text-white focus-visible:ring-slate-700 shadow-sm hover:shadow-md',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 focus-visible:ring-brand-500',
    danger: 'bg-rose-600 hover:bg-rose-700 hover:-translate-y-px text-white focus-visible:ring-rose-500 shadow-sm hover:shadow-md',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};
