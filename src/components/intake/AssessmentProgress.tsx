import React from 'react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';

interface AssessmentProgressProps {
  currentStage: 1 | 2;
  canNavigateToStage2: boolean;
  onSelectStage: (stage: 1 | 2) => void;
  className?: string;
}

export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentStage,
  canNavigateToStage2,
  onSelectStage,
  className
}) => {
  const { t } = useLanguage();

  return (
    <nav aria-label="Assessment Progress" className={cn('flex items-center justify-center space-x-1 sm:space-x-2 select-none py-1', className)}>
      {/* Product information */}
      <button
        type="button"
        onClick={() => onSelectStage(1)}
        className={cn(
          'text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center cursor-pointer',
          currentStage === 1
            ? 'bg-neutral-900 text-white font-semibold shadow-subtle active-pop'
            : 'text-foreground-subtle hover:text-foreground hover:bg-neutral-100 active:scale-95'
        )}
      >
        {t('tab_product_info', 'Product Information')}
      </button>

      <span className="text-neutral-300 text-xs px-1">/</span>

      {/* Product classification */}
      <button
        type="button"
        onClick={() => {
          if (canNavigateToStage2) {
            onSelectStage(2);
          }
        }}
        disabled={!canNavigateToStage2}
        className={cn(
          'text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center',
          currentStage === 2
            ? 'bg-neutral-900 text-white font-semibold shadow-subtle active-pop'
            : canNavigateToStage2
            ? 'text-foreground-subtle hover:text-foreground hover:bg-neutral-100 cursor-pointer active:scale-95'
            : 'text-neutral-400 cursor-not-allowed opacity-50'
        )}
        title={!canNavigateToStage2 ? 'Fill in product information to unlock classification' : undefined}
      >
        {t('tab_classification', 'Product Classification')}
      </button>
    </nav>
  );
};
