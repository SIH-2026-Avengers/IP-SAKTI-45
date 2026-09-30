import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary: 'bg-foreground text-foreground-inverted hover:bg-neutral-800 border border-transparent',
      secondary: 'bg-background-subtle text-foreground hover:bg-neutral-200 border border-border-subtle',
      outline: 'bg-background-surface text-foreground hover:bg-neutral-50 border border-border',
      ghost: 'bg-transparent text-foreground hover:bg-neutral-100 border border-transparent',
      danger: 'bg-status-error-bg text-status-error-text border-status-error-border hover:bg-red-100',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 rounded-sm gap-1.5',
      md: 'text-sm px-3.5 py-2 rounded-md gap-2',
      lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
