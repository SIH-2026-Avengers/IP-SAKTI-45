import React from 'react';
import { useJurisdiction } from '../../context/JurisdictionContext';
import { cn } from '../../utils/cn';
import { Globe, ShieldCheck } from 'lucide-react';

export const JurisdictionSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const { jurisdiction, setJurisdiction } = useJurisdiction();

  return (
    <div className={cn('inline-flex items-center bg-background-subtle p-1 rounded-lg border border-border', className)}>
      <button
        type="button"
        onClick={() => setJurisdiction('INDIA')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all select-none',
          jurisdiction === 'INDIA'
            ? 'bg-foreground text-foreground-inverted shadow-subtle'
            : 'text-foreground-muted hover:text-foreground'
        )}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>INDIA JURISDICTION</span>
      </button>

      <button
        type="button"
        onClick={() => setJurisdiction('INTERNATIONAL')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all select-none',
          jurisdiction === 'INTERNATIONAL'
            ? 'bg-foreground text-foreground-inverted shadow-subtle'
            : 'text-foreground-muted hover:text-foreground'
        )}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>INTERNATIONAL / EXPORT</span>
      </button>
    </div>
  );
};
