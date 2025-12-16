import { cn } from '../../lib/utils';
import { type ReactNode, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  className,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-black text-white border-black hover:bg-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1',
    secondary: 'bg-white text-black border-black hover:bg-gray-50',
    accent: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1',
    outline: 'bg-white text-black border-black hover:bg-gray-50',
    ghost: 'bg-transparent text-black border-black hover:bg-gray-50',
  };

  const sizeClasses = {
    default: 'py-3 px-4',
    sm: 'py-2 px-3',
    icon: 'w-10 h-10 p-2',
  };

  return (
    <button
      className={cn(
        'border-2 font-bold text-xs uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
