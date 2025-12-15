import { cn } from '../../lib/utils';
import { type ReactNode, type CSSProperties } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary';
  className?: string;
  style?: CSSProperties;
}

export function Badge({ children, variant = 'default', className, style }: BadgeProps) {
  const variantClasses = {
    default: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    secondary: 'bg-secondary text-secondary-foreground border-border',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
