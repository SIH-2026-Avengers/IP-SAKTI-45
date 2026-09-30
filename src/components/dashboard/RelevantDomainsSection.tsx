import React from 'react';
import type { BackendRelevantDomain } from '../../types/backendApi';
import { Card, Badge } from '../ui';
import { Layers } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';

interface RelevantDomainsSectionProps {
  domains?: BackendRelevantDomain[];
  className?: string;
}

export const RelevantDomainsSection: React.FC<RelevantDomainsSectionProps> = ({
  domains = [],
  className
}) => {
  const { t } = useLanguage();

  if (!domains || domains.length === 0) {
    return null;
  }

  return (
    <Card className={cn('p-6 bg-background-surface border-border shadow-subtle space-y-5', className)}>
      <div className="space-y-1 pb-3 border-b border-border">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-foreground" />
          <span>{t('relevant_domains_title', 'Relevant IP & Regulatory Domains')}</span>
        </h3>
        <p className="text-xs text-foreground-muted">
          {t('relevant_domains_desc', 'Statutory domains and legal frameworks identified as relevant to this product profile.')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {domains.map((item) => (
          <div
            key={item.domain}
            className="p-3.5 rounded-lg border border-border bg-background-subtle hover:border-neutral-400 transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-foreground">
                {item.domain}
              </span>
              <Badge
                variant={item.label === 'IP' ? 'neutral' : item.label === 'Regulatory' ? 'info' : 'warning'}
                size="sm"
                className="font-mono text-[9px] px-1.5"
              >
                {item.label}
              </Badge>
            </div>
            <p className="text-[11px] text-foreground-subtle leading-relaxed">
              {item.reason}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
