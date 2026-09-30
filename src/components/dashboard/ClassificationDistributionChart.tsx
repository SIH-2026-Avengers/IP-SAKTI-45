import React, { useState, useEffect } from 'react';
import type { BackendTopPrediction } from '../../types/backendApi';
import { Card } from '../ui';
import { BarChart3, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Patent': 'Technical formulations, synergistic extraction methods, and inventive processes evaluated under Patents Act 1970.',
  'Ayurveda-Aahar': 'Dietary food preparations complying with FSSAI Ayurveda Aahar Regulations 2022 without direct disease claims.',
  'Drug Regulation': 'Classical and proprietary AYUSH medicinal formulations regulated under Chapter IV-A of Drugs & Cosmetics Act 1940.',
  'Biological Diversity': 'Statutory Access & Benefit Sharing (ABS) mandates and NBA Section 6 clearances under Biological Diversity Act 2002.',
  'Trademark': 'Brand names, distinctive marks, and trade dress protection under Trade Marks Act 1999.',
  'Geographical Indication': 'Region-specific botanical terroir, indigenous cultivars, and collective origins under GI Act 1999.',
  'Design': 'Novel aesthetic packaging bottles, container shapes, and applicator configurations under Designs Act 2000.',
  'Trade Secret': 'Proprietary extraction ratios, confidential standard operating procedures (SOPs), and internal know-how.',
  'Copyright': 'Original literary descriptions, packaging graphics, and educational wellness brochures under Copyright Act 1957.',
  'Plant Variety Protection': 'Distinct, uniform, and stable medicinal plant varieties under PPV&FR Act 2001.',
  'Food Regulation': 'General nutraceutical, health supplement, and functional food standards under FSSAI regulations.',
  'Regulatory': 'General statutory manufacturing, labeling, and licensing compliance standards for AYUSH units.'
};

interface ClassificationDistributionChartProps {
  candidates?: BackendTopPrediction[];
  onSelectCategory?: (category: string) => void;
  className?: string;
}

export const ClassificationDistributionChart: React.FC<ClassificationDistributionChartProps> = ({
  candidates = [],
  onSelectCategory,
  className
}) => {
  const { t } = useLanguage();
  const [animated, setAnimated] = useState<boolean>(false);
  const [hoveredCategory, setHoveredCategory] = useState<BackendTopPrediction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BackendTopPrediction | null>(
    candidates[0] || null
  );

  useEffect(() => {
    if (candidates.length > 0 && !selectedCategory) {
      setSelectedCategory(candidates[0]);
    }
  }, [candidates, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const activeItem = hoveredCategory || selectedCategory || candidates[0];

  const getCategoryInfo = (item?: BackendTopPrediction | null) => {
    if (!item) {
      return {
        name: 'Classification Candidate',
        score: 0,
        desc: 'Comparative classification distribution across statutory frameworks.'
      };
    }
    const score = Math.round(item.probability * 100);
    const desc = CATEGORY_DESCRIPTIONS[item.category] || 'Statutory domain evaluation under Indian law.';
    return {
      name: item.category,
      score,
      desc
    };
  };

  const activeInfo = getCategoryInfo(activeItem);

  // Grid tick marks
  const yTicks = [100, 80, 60, 40, 20, 0];

  if (!candidates || candidates.length === 0) {
    return (
      <Card className={cn('p-6 sm:p-7 bg-background-surface border-border shadow-subtle flex flex-col justify-center items-center', className)}>
        <p className="text-xs text-foreground-muted">No classification distribution available.</p>
      </Card>
    );
  }

  return (
    <Card className={cn('p-6 sm:p-7 bg-background-surface border-border shadow-subtle flex flex-col justify-between space-y-6', className)}>
      {/* Chart Section Header */}
      <div className="space-y-1 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-foreground" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
            {t('top5_title', 'Top-5 Classification Distribution')}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-foreground-muted">
          {t('top5_desc', 'Comparative classification scores across recognized statutory categories.')}
        </p>
      </div>

      {/* Vertical Bar Chart Container */}
      <div className="pt-6 pb-2">
        <div className="relative">
          {/* Y-Axis Grid Lines and Labels */}
          <div className="h-52 sm:h-56 relative border-b border-border flex flex-col justify-between">
            {yTicks.map((tick) => (
              <div key={tick} className="w-full flex items-center">
                <span className="w-7 font-mono text-[10px] text-neutral-400 text-right pr-2 select-none">
                  {tick}
                </span>
                <div
                  className={cn(
                    'flex-1 border-t',
                    tick === 0 ? 'border-border' : 'border-border-subtle border-dashed'
                  )}
                />
              </div>
            ))}

            {/* Vertical Bars Area */}
            <div className="absolute inset-y-0 left-8 right-0 flex items-end justify-around px-2 sm:px-6">
              {candidates.map((item, idx) => {
                const isTop = idx === 0;
                const isSelected = selectedCategory?.category === item.category;
                const isHovered = hoveredCategory?.category === item.category;
                const itemScore = Math.round(item.probability * 100);

                // Monochrome shading for bars
                const barColor = isTop
                  ? 'bg-neutral-900'
                  : idx === 1
                  ? 'bg-neutral-600'
                  : idx === 2
                  ? 'bg-neutral-400'
                  : idx === 3
                  ? 'bg-neutral-300'
                  : 'bg-neutral-200';

                return (
                  <div
                    key={item.category}
                    className="relative flex flex-col items-center h-full justify-end group cursor-pointer focus:outline-none"
                    style={{ width: '16%' }}
                    onClick={() => {
                      setSelectedCategory(item);
                      onSelectCategory?.(item.category);
                    }}
                    onMouseEnter={() => setHoveredCategory(item)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.category}: classification score ${itemScore}%`}
                  >
                    {/* Floating Tooltip with Full Category Name on Hover */}
                    {isHovered && (
                      <div className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-md shadow-modal whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <span>{item.category}</span>
                        <span className="ml-1.5 font-mono text-neutral-300">({itemScore}%)</span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                      </div>
                    )}

                    {/* Score Label Above Bar */}
                    <span
                      className={cn(
                        'font-mono text-xs font-bold transition-all duration-300 mb-1 select-none',
                        isTop ? 'text-foreground' : 'text-neutral-500',
                        (isSelected || isHovered) && 'scale-110 text-foreground'
                      )}
                    >
                      {itemScore}%
                    </span>

                    {/* Animated Bar with highlight on selection */}
                    <div className="w-full max-w-[48px] h-full flex items-end">
                      <div
                        className={cn(
                          'w-full rounded-t-sm transition-all duration-700 ease-out relative',
                          barColor,
                          (isSelected || isHovered) && 'ring-2 ring-neutral-900 ring-offset-2'
                        )}
                        style={{
                          height: animated ? `${Math.max(itemScore, 4)}%` : '0%'
                        }}
                      >
                        {isTop && (
                          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-900" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected / Hovered Category Statutory Detail Callout */}
      {activeInfo && (
        <div className="p-4 bg-background-subtle rounded-lg border border-border space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-foreground">
              {activeInfo.name} ({activeInfo.score}%)
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {t('statutory_scope_label', 'Statutory Scope')}
            </span>
          </div>
          <p className="text-xs text-foreground-subtle leading-relaxed">
            {activeInfo.desc}
          </p>
        </div>
      )}

      {/* Interactive Helper Footer */}
      <div className="pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-foreground-muted">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-neutral-400" />
          <span>{t('top5_hover_hint', 'Hover over any bar to inspect category & statutory criteria')}</span>
        </span>
      </div>
    </Card>
  );
};
