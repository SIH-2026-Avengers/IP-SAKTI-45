import React from 'react';
import type { BackendRAGSource, BackendRelevantDomain } from '../../types/backendApi';
import { Card, Badge } from '../ui';
import { Layers } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';

interface RelevantDomainsSectionProps {
  domains?: BackendRelevantDomain[];
  documents?: BackendRAGSource[];
  selectedCategory?: string;
  className?: string;
}

export const RelevantDomainsSection: React.FC<RelevantDomainsSectionProps> = ({
  domains = [],
  documents = [],
  selectedCategory,
  className
}) => {
  const { t } = useLanguage();

  if (domains.length === 0 && documents.length === 0 && !selectedCategory) {
    return null;
  }

  const visibleDomains = domains.slice(0, 5);
  const visibleDocuments = documents.slice(0, 5);

  return (
    <Card className={cn('p-6 bg-background-surface border-border shadow-subtle space-y-5', className)}>
      <div className="space-y-1 pb-3 border-b border-border">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4 text-foreground" />
          <span>{t('relevant_domains_title', 'Relevant IP & Regulatory Domains')}</span>
        </h3>
        <p className="text-xs text-foreground-muted">
          {documents.length > 0
            ? `Documents retrieved for ${selectedCategory || documents[0].category} are shown with their statutory scope.`
            : t('relevant_domains_desc', 'Statutory domains and legal frameworks identified as relevant to this product profile.')}
        </p>
      </div>

      {selectedCategory && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-foreground-muted">Context folder:</span>
          <Badge variant="neutral" size="sm">{selectedCategory}</Badge>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {documents.length > 0
          ? visibleDocuments.map((document, index) => (
            <div
              key={document.chunk_id || `${document.source_file}-${index}`}
              className="p-3.5 rounded-lg border border-border bg-background-subtle space-y-1.5"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-foreground">{document.document}</span>
                <Badge variant="info" size="sm" className="font-mono text-[9px] px-1.5">
                  {document.category}
                </Badge>
              </div>
              <p className="text-[11px] text-foreground-subtle leading-relaxed">
                {document.section || 'Retrieved statutory source'}
                {document.page_start != null ? ` · p. ${document.page_start}` : ''}
              </p>
            </div>
          ))
          : visibleDomains.map((item) => (
            <div
              key={item.domain}
              className="p-3.5 rounded-lg border border-border bg-background-subtle hover:border-neutral-400 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-foreground">{item.domain}</span>
                <Badge
                  variant={item.label === 'IP' ? 'neutral' : item.label === 'Regulatory' ? 'info' : 'warning'}
                  size="sm"
                  className="font-mono text-[9px] px-1.5"
                >
                  {item.label}
                </Badge>
              </div>
              <p className="text-[11px] text-foreground-subtle leading-relaxed">{item.reason}</p>
            </div>
          ))}
        {(documents.length > 5 || (documents.length === 0 && domains.length > 5)) && (
          <div
            aria-label={`${Math.max(documents.length, domains.length) - 5} additional items not shown`}
            className="p-3.5 rounded-lg border border-border bg-background-subtle flex items-center justify-center text-sm text-foreground-muted"
          >
            ...
          </div>
        )}
      </div>
    </Card>
  );
};
