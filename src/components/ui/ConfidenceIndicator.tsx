import React from 'react';
import { cn } from '../../utils/cn';
import { formatPercentage } from '../../utils/formatters';

export interface ConfidenceIndicatorProps {
  score: number; // 0.0 to 1.0 or 0 to 100
  label?: string;
  showBar?: boolean;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  label = 'Model Confidence',
  showBar = true,
  className
}) => {
  const normalizedScore = score > 1 ? score / 100 : score;
  const percentage = Math.round(normalizedScore * 100);

  let toneColor = 'bg-neutral-900';
  let badgeText = 'High Evidence';
  let badgeVariant = 'bg-neutral-100 text-neutral-800 border-neutral-200';

  if (normalizedScore < 0.5) {
    toneColor = 'bg-neutral-400';
    badgeText = 'Low Evidence';
    badgeVariant = 'bg-status-warning-bg text-status-warning-text border-status-warning-border';
  } else if (normalizedScore < 0.75) {
    toneColor = 'bg-neutral-700';
    badgeText = 'Moderate Evidence';
    badgeVariant = 'bg-neutral-100 text-neutral-700 border-neutral-200';
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground-muted font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={cn('text-[11px] px-2 py-0.5 rounded-full border font-medium', badgeVariant)}>
            {badgeText}
          </span>
          <span className="font-mono font-semibold text-foreground text-xs">
            {formatPercentage(normalizedScore)}
          </span>
        </div>
      </div>
      {showBar && (
        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden border border-border-subtle">
          <div
            className={cn('h-full rounded-full transition-all duration-500', toneColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
