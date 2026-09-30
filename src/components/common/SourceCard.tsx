import React from 'react';
import type { EvidenceSource } from '../../types';
import { Card, Badge } from '../ui';
import { cn } from '../../utils/cn';
import { ExternalLink, BookOpen } from 'lucide-react';

interface SourceCardProps {
  source: EvidenceSource;
  onSelect?: (source: EvidenceSource) => void;
  className?: string;
  isCompact?: boolean;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  onSelect,
  className,
  isCompact = false
}) => {
  return (
    <Card
      className={cn(
        'group cursor-pointer hover:border-neutral-400 transition-all text-left flex flex-col justify-between',
        className
      )}
      onClick={() => onSelect?.(source)}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="neutral" size="sm">
              {source.authority}
            </Badge>
            <Badge variant="outline" size="sm">
              {source.category}
            </Badge>
            <Badge
              variant={source.jurisdiction === 'INDIA' ? 'neutral' : 'info'}
              size="sm"
            >
              {source.jurisdiction}
            </Badge>
          </div>
          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-foreground-muted hover:text-foreground p-1"
              title="Open external statutory reference"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <h4 className="text-sm font-semibold text-foreground group-hover:text-neutral-900 mb-1">
          {source.title}
        </h4>

        <div className="text-xs font-mono text-foreground-muted mb-2">
          {source.sectionOrArticle} &bull; {source.yearOrDate}
        </div>

        <p className={cn(
          'text-xs text-foreground-subtle leading-relaxed bg-background-subtle p-2.5 rounded-md border border-border-subtle font-serif',
          isCompact && 'line-clamp-3'
        )}>
          &ldquo;{source.excerpt}&rdquo;
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-foreground-muted">
        <div className="flex flex-wrap gap-1">
          {source.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <BookOpen className="w-3 h-3 text-neutral-400" />
          <span>Score: {Math.round(source.relevanceScore * 100)}%</span>
        </div>
      </div>
    </Card>
  );
};
