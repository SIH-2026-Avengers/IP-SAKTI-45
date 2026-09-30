import React from 'react';
import { cn } from '../../utils/cn';

interface StateProps {
  title: string;
  description?: string;
  className?: string;
}

export const LoadingState: React.FC<StateProps> = ({
  title = 'Processing...',
  description = 'Retrieving legal statutes and analyzing formulation...',
  className
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
      <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-4" />
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-xs text-foreground-muted max-w-sm">{description}</p>}
    </div>
  );
};

export const EmptyState: React.FC<StateProps & { action?: React.ReactNode }> = ({
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-background-surface', className)}>
      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 mb-3 font-mono text-sm">
        ∅
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-xs text-foreground-muted max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export const ErrorState: React.FC<StateProps & { onRetry?: () => void }> = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading this section. Please check connection and try again.',
  onRetry,
  className
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center border border-status-error-border rounded-xl bg-status-error-bg text-status-error-text', className)}>
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      {description && <p className="text-xs max-w-sm mb-4 opacity-90">{description}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-medium underline hover:opacity-80 transition-opacity"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
