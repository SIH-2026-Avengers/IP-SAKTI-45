import React from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-foreground-subtle">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none bg-background-surface border border-border rounded-md px-3.5 py-2 text-sm text-foreground transition-colors focus:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 disabled:bg-neutral-50 disabled:opacity-60 pr-8',
              error && 'border-status-error-border focus:border-red-600 focus:ring-red-600',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {helperText && !error && (
          <p className="text-[11px] text-foreground-muted">{helperText}</p>
        )}
        {error && <p className="text-xs text-status-error-text font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
