import React from 'react';
import type { ReactNode } from 'react';
import { useJurisdiction } from '../../context/JurisdictionContext';
import { Badge } from '../ui';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  className
}) => {
  const { jurisdiction } = useJurisdiction();

  return (
    <div className={cn('pb-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4', className)}>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {badge && (
            <Badge variant="outline" size="sm">
              {badge}
            </Badge>
          )}
          <Badge
            variant={jurisdiction === 'INDIA' ? 'neutral' : 'info'}
            size="sm"
            className="font-mono text-[10px]"
          >
            {jurisdiction === 'INDIA' ? 'DOMESTIC (INDIA)' : 'INTERNATIONAL / EXPORT'}
          </Badge>
        </div>
        {subtitle && <p className="text-xs md:text-sm text-foreground-muted">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
