import React from 'react';
import type { JurisdictionType } from '../../types';
import { cn } from '../../utils/cn';

interface JurisdictionSegmentedControlProps {
  value: JurisdictionType;
  onChange: (val: JurisdictionType) => void;
  className?: string;
}

export const JurisdictionSegmentedControl: React.FC<JurisdictionSegmentedControlProps> = ({
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn('w-full space-y-1.5', className)}>
      <label className="block text-xs font-medium text-foreground-subtle">
        Jurisdiction
      </label>
      <div
        role="radiogroup"
        aria-label="Jurisdiction Selection"
        className="grid grid-cols-2 p-1 bg-background-subtle rounded-lg border border-border"
      >
        <button
          type="button"
          role="radio"
          aria-checked={value === 'INDIA'}
          onClick={() => onChange('INDIA')}
          className={cn(
            'flex items-center justify-center py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-200 select-none cursor-pointer',
            value === 'INDIA'
              ? 'bg-background-surface text-foreground shadow-subtle border border-border scale-100 active-pop'
              : 'text-foreground-muted hover:text-foreground hover:bg-neutral-100/50 border border-transparent active:scale-98'
          )}
        >
          India
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={value === 'INTERNATIONAL'}
          onClick={() => onChange('INTERNATIONAL')}
          className={cn(
            'flex items-center justify-center py-2.5 px-4 text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-200 select-none cursor-pointer',
            value === 'INTERNATIONAL'
              ? 'bg-background-surface text-foreground shadow-subtle border border-border scale-100 active-pop'
              : 'text-foreground-muted hover:text-foreground hover:bg-neutral-100/50 border border-transparent active:scale-98'
          )}
        >
          International
        </button>
      </div>
    </div>
  );
};
