import { cn } from '../../lib/utils';
import { type ReactNode, type CSSProperties } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'secondary';
  className?: string;
  style?: CSSProperties;
}

export function Badge({ children, variant = 'default', className, style }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-50 text-black border-black',
    success: 'bg-emerald-50 text-black border-black',
    error: 'bg-red-50 text-black border-black',
    warning: 'bg-amber-50 text-black border-black',
    secondary: 'bg-gray-50 text-black border-black',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border-2 px-2 py-1 text-xs font-bold uppercase tracking-wide',
        variantClasses[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
