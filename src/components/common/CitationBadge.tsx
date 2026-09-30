import React from 'react';
import type { Citation } from '../../types';
import { cn } from '../../utils/cn';

interface CitationBadgeProps {
  citation: Citation;
  onClick?: (citation: Citation) => void;
  className?: string;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({ citation, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(citation)}
      className={cn(
        'inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-foreground px-1.5 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors mx-1 align-baseline cursor-pointer',
        className
      )}
      title={`${citation.authority} — ${citation.section}: ${citation.sourceTitle}`}
    >
      <span>[{citation.citationIndex}]</span>
      <span className="max-w-[120px] truncate text-[10px] text-foreground-subtle hidden sm:inline">
        {citation.section}
      </span>
    </button>
  );
};
