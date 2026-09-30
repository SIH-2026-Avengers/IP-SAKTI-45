import React from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-foreground-subtle">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-background-surface border border-border rounded-md px-3.5 py-2 text-sm text-foreground placeholder:text-foreground-light transition-colors focus:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 disabled:bg-neutral-50 disabled:opacity-60',
            error && 'border-status-error-border focus:border-red-600 focus:ring-red-600',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-[11px] text-foreground-muted">{helperText}</p>
        )}
        {error && <p className="text-xs text-status-error-text font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-foreground-subtle">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full bg-background-surface border border-border rounded-md px-3.5 py-2 text-sm text-foreground placeholder:text-foreground-light transition-colors focus:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 disabled:bg-neutral-50 disabled:opacity-60 resize-y min-h-[90px]',
            error && 'border-status-error-border focus:border-red-600 focus:ring-red-600',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-[11px] text-foreground-muted">{helperText}</p>
        )}
        {error && <p className="text-xs text-status-error-text font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
