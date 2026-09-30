import React, { useState, useEffect } from 'react';
import { useJurisdiction } from '../context/JurisdictionContext';
import { PageHeader } from '../components/layout/PageHeader';
import { SourceCard } from '../components/common/SourceCard';
import { Input, Badge } from '../components/ui';
import { fetchEvidenceSources } from '../services/evidence';
import type { EvidenceSource } from '../types';
import { Search, Database } from 'lucide-react';

export const EvidencePage: React.FC = () => {
  const { jurisdiction } = useJurisdiction();
  const [sources, setSources] = useState<EvidenceSource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadSources = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEvidenceSources(searchQuery, jurisdiction);
      setSources(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, [jurisdiction, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence Explorer & Statutory Repositories"
        subtitle="Searchable repository of legislative acts, gazette notifications, classical texts, TKDL references, and international regulatory directives."
        badge="Stage 4: Traceability"
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Search statutes, sections, keywords (e.g. Section 3(p), DSHEA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-foreground-muted">
          <span>Filtering by:</span>
          <Badge variant="neutral" size="sm">
            {jurisdiction}
          </Badge>
          <span>({sources.length} sources found)</span>
        </div>
      </div>

      {/* Evidence Source Grid */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sources.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <Database className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <p className="text-xs text-foreground-muted">No statutory sources matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
            />
          ))}
        </div>
      )}
    </div>
  );
};
