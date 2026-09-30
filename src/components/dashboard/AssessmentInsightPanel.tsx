import React from 'react';
import { Card } from '../ui';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { MarkdownContent } from '../common/MarkdownContent';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';

interface AssessmentInsightPanelProps {
  summary?: string;
  whyThisMatters?: string;
  keyConsiderations?: string[];
  className?: string;
}

export const AssessmentInsightPanel: React.FC<AssessmentInsightPanelProps> = ({
  summary,
  whyThisMatters,
  keyConsiderations,
  className
}) => {
  const { t } = useLanguage();

  const displaySummary = summary || t('insight_summary');
  const displayWhy = whyThisMatters || t('why_this_matters_body');

  return (
    <Card className={cn('p-6 sm:p-7 bg-background-surface border-border shadow-subtle flex flex-col justify-between space-y-6', className)}>
      <div className="space-y-5">
        {/* Header with Title */}
        <div className="pb-3 border-b border-border">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>{t('insight_title', 'LLM Based Insight')}</span>
          </h3>
        </div>

        {/* Main Interpretation */}
        <div className="space-y-2">
          <MarkdownContent content={displaySummary} variant="light" className="text-sm sm:text-[15px] text-foreground leading-relaxed" />
        </div>

        {/* Why this matters subsection with subtle divider and clean typography */}
        <div className="pt-4 border-t border-border space-y-1.5">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
            {t('why_this_matters_title', 'Why this matters:')}
          </h4>
          <MarkdownContent content={displayWhy} variant="light" className="text-xs sm:text-sm text-foreground-muted leading-relaxed" />
        </div>

        {/* Key Considerations if present */}
        {keyConsiderations && keyConsiderations.length > 0 && (
          <div className="pt-4 border-t border-border space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-foreground">
              Strategic Action Items:
            </h4>
            <ul className="space-y-1.5">
              {keyConsiderations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground leading-snug">
                  <CheckCircle2 className="w-3.5 h-3.5 text-status-success flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
