import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, Button, ConfidenceIndicator } from '../components/ui';
import { formatPercentage } from '../utils/formatters';
import { ArrowRight, Scale, FileText } from 'lucide-react';
import { CATEGORY_DESCRIPTIONS } from '../components/dashboard/ClassificationDistributionChart';

export const ClassificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { classificationData, predictedCategory, confidence, topPredictions } = useAssessment();

  if (!classificationData) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-lg font-bold text-foreground">No Assessment Run Yet</h2>
        <p className="text-xs text-foreground-muted">Please submit product information in Stage 1.</p>
        <Button onClick={() => navigate('/')}>Go to Intake</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Classification & Regulatory Routing"
        subtitle="Ranked classification candidate probabilities and statutory risk breakdown for the submitted product profile."
        badge="Stage 2: Classification"
        actions={
          <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
            <span>View Full IP Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        }
      />

      {/* Top Primary Classification Banner */}
      <Card className="border-neutral-800 bg-background-surface">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[11px] font-mono text-foreground-muted uppercase tracking-wider block mb-1">
              Primary Statutory Classification
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {predictedCategory}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <ConfidenceIndicator
              score={confidence}
              label="Classifier Certainty"
              className="w-48"
            />
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <p className="text-xs md:text-sm text-foreground-subtle leading-relaxed">
            {CATEGORY_DESCRIPTIONS[predictedCategory] || 'Statutory evaluation based on the trained classification model.'}
          </p>

          <div className="bg-background-subtle p-3 rounded-lg border border-border flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-foreground-subtle flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-foreground">Recommended Statutory Pathway: </strong>
              <span className="text-foreground-subtle">{predictedCategory} framework under Indian Law</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid: Probability Distribution */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Class Candidate Probability Distribution (Top-5)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topPredictions.map((cand, idx) => {
            const pct = Math.round(cand.probability * 100);
            return (
              <Card key={idx} variant={idx === 0 ? 'default' : 'subtle'} className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-500">#{idx + 1}</span>
                    <h4 className="text-sm font-bold text-foreground">{cand.category}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-foreground">
                      {formatPercentage(cand.probability)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-xs text-foreground-subtle">
                  {CATEGORY_DESCRIPTIONS[cand.category] || 'Statutory domain under Indian legal frameworks.'}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
