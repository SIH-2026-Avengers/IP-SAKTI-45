import React, { useState, useEffect } from 'react';
import { Card } from '../ui';
import { Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';

interface PrimaryClassificationCardProps {
  category?: string;
  score?: number;
  className?: string;
}

export const PrimaryClassificationCard: React.FC<PrimaryClassificationCardProps> = ({
  category = 'Patent',
  score = 0,
  className
}) => {
  const { t } = useLanguage();
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  useEffect(() => {
    // Smooth entry animation for the confidence score
    const duration = 900;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(easedProgress * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [score]);

  // SVG Circle parameters - Larger, prominent gauge
  const size = 136;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const displayCategory = category;

  return (
    <Card className={cn('p-6 sm:p-7 bg-background-surface border-border shadow-subtle flex flex-col justify-between space-y-6', className)}>
      {/* Upper Section: Primary Classification Details */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
          {t('primary_classification_title', 'Primary Classification')}
        </span>

        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          {displayCategory}
        </h3>

        <p className="text-xs sm:text-sm text-foreground-subtle leading-relaxed pt-1">
          {t('primary_category_desc', 'Most relevant classification based on the information provided in the intake questionnaire.')}
        </p>
      </div>

      {/* Middle Section: Enlarged Confidence Gauge & Score Information */}
      <div className="p-4 sm:p-5 bg-background-subtle rounded-xl border border-border">
        <div className="flex flex-row items-center gap-5 sm:gap-7">
          {/* Left: Prominent Circular Confidence Indicator */}
          <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              className="transform -rotate-90"
              aria-label={`Confidence score: ${score}%`}
            >
              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#E5E5E2"
                strokeWidth={strokeWidth}
              />
              {/* Active Progress Stroke */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#111111"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-75 ease-linear"
              />
            </svg>
            {/* Value inside circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="font-mono font-bold text-2xl text-foreground">
                {animatedScore}%
              </span>
              <span className="text-[9px] font-mono uppercase text-neutral-400 -mt-0.5">
                {t('model_score_label', 'Match')}
              </span>
            </div>
          </div>

          {/* Right: Confidence Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
              {t('confidence_label', 'Confidence')}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
                {score}%
              </span>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed font-sans">
              {t('confidence_context', 'High statutory alignment across classical compendia and formulary criteria.')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Legal & Regulatory Disclaimer */}
      <div className="flex items-start gap-2.5 bg-background-subtle p-3.5 rounded-lg border border-border text-[11px] text-foreground-muted leading-relaxed">
        <Info className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
        <span>
          {t('classification_disclaimer', 'Classification is an AI-assisted assessment based on the information provided and should not be treated as a legal or regulatory determination.')}
        </span>
      </div>
    </Card>
  );
};
