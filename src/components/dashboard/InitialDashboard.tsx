import React from 'react';
import type { JurisdictionType, ClassificationAnswers } from '../../types';
import { Card, Badge, Button } from '../ui';
import { ShieldCheck, Scale, FileSpreadsheet, Database, MessageSquareText, RotateCcw, CheckCircle, Globe } from 'lucide-react';

interface InitialDashboardProps {
  productName: string;
  productDescription: string;
  jurisdiction: JurisdictionType;
  classificationAnswers?: ClassificationAnswers;
  onRestart: () => void;
}

export const InitialDashboard: React.FC<InitialDashboardProps> = ({
  productName,
  productDescription,
  jurisdiction,
  onRestart
}) => {
  // Reusable KPI card data
  const relevantDomains = [
    'Patent',
    'Trademark',
    'Drug Regulation',
    'Biological Diversity',
    'Traditional Knowledge',
    'Food Regulation'
  ];

  const exploreSections = [
    {
      id: 'ip-landscape',
      title: 'IP Landscape',
      description: 'Explore potential intellectual property areas including patents, trademarks, GI, and traditional knowledge.',
      icon: Scale,
    },
    {
      id: 'regulatory-context',
      title: 'Regulatory Context',
      description: 'Review potentially relevant regulatory frameworks under AYUSH, FSSAI, or international export directives.',
      icon: FileSpreadsheet,
    },
    {
      id: 'evidence',
      title: 'Evidence',
      description: 'Explore the statutory acts, gazettes, and classical treatises that support your assessment.',
      icon: Database,
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Ask questions and receive evidence-grounded answers about your product.',
      icon: MessageSquareText,
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pop">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs font-mono uppercase tracking-widest text-neutral-500">
              IP-SAKTI Sahayak
            </span>
            <Badge
              variant={jurisdiction === 'INDIA' ? 'neutral' : 'info'}
              size="sm"
              className="font-mono text-[10px]"
            >
              {jurisdiction === 'INDIA' ? 'INDIA JURISDICTION' : 'INTERNATIONAL / EXPORT'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Assessment Overview
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted">
            A structured overview of your product's IP and regulatory context.
          </p>
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Assessment</span>
          </Button>
        </div>
      </div>

      {/* Product Summary Card */}
      <Card className="p-6 bg-background-surface border-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase text-foreground-muted">Product</span>
            <h2 className="text-lg font-bold text-foreground">
              {productName || 'Ayurvedic Botanical Formulation'}
            </h2>
          </div>
          <Badge variant="success" size="md" className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Assessment Complete</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
          <div className="md:col-span-2 space-y-1">
            <span className="text-foreground-muted font-medium block">Product Description:</span>
            <p className="text-foreground-subtle leading-relaxed bg-background-subtle p-3 rounded-lg border border-border">
              {productDescription || 'Herbal formulation designed for therapeutic and adaptogenic wellness.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-background-subtle p-3 rounded-lg border border-border space-y-1">
              <span className="text-foreground-muted font-medium block">Jurisdiction:</span>
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                {jurisdiction === 'INDIA' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-800" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-neutral-800" />
                )}
                <span>{jurisdiction === 'INDIA' ? 'India' : 'International'}</span>
              </div>
            </div>

            <div className="bg-background-subtle p-3 rounded-lg border border-border space-y-1">
              <span className="text-foreground-muted font-medium block">Assessment Status:</span>
              <span className="text-status-success-text font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-status-success-text" />
                Complete
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Classification */}
        <Card className="p-5 bg-background-surface border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-mono text-foreground-muted uppercase tracking-wider block">
            Product Classification
          </span>
          <div className="text-sm font-bold text-foreground">
            Classical Ayurvedic Medicine
          </div>
          <div className="text-[11px] text-foreground-muted font-mono pt-1">
            82% Confidence (Mock)
          </div>
        </Card>

        {/* Card 2: IP & Regulatory Domains */}
        <Card className="p-5 bg-background-surface border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-mono text-foreground-muted uppercase tracking-wider block">
            IP &amp; Regulatory Domains
          </span>
          <div className="text-sm font-bold text-foreground">
            6 Relevant Areas
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {relevantDomains.slice(0, 3).map((domain) => (
              <span key={domain} className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">
                {domain}
              </span>
            ))}
            <span className="text-[10px] text-neutral-500 self-center">+{relevantDomains.length - 3} more</span>
          </div>
        </Card>

        {/* Card 3: Jurisdiction Context */}
        <Card className="p-5 bg-background-surface border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-mono text-foreground-muted uppercase tracking-wider block">
            Jurisdiction
          </span>
          <div className="text-sm font-bold text-foreground">
            {jurisdiction === 'INDIA' ? 'India' : 'International'}
          </div>
          <div className="text-[11px] text-foreground-muted pt-1">
            Active assessment context
          </div>
        </Card>

        {/* Card 4: Evidence Context */}
        <Card className="p-5 bg-background-surface border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-mono text-foreground-muted uppercase tracking-wider block">
            Evidence Context
          </span>
          <div className="text-sm font-bold text-foreground">
            Prepared
          </div>
          <div className="text-[11px] text-foreground-muted pt-1">
            Ready for source-grounded analysis
          </div>
        </Card>
      </div>

      {/* Explore Section (Future Modules Preview) */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Explore your assessment
          </h2>
          <p className="text-xs text-foreground-muted">
            The full assessment modules will be available as the workspace expands in upcoming releases.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {exploreSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.id}
                className="p-5 bg-background-surface border-border shadow-subtle hover:border-neutral-400 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-foreground">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {section.title}
                  </h3>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                    Workspace Ready
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
