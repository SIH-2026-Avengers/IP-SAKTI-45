import React from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'outline';
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  noPadding = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-background-surface border border-border shadow-subtle',
    subtle: 'bg-background-subtle border border-border-subtle',
    outline: 'bg-transparent border border-border',
  };

  return (
    <div
      className={cn(
        'rounded-xl transition-all',
        variants[variant],
        !noPadding && 'p-5 md:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
