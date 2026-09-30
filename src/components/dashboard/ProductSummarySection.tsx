import React, { useState } from 'react';
import type { JurisdictionType } from '../../types';
import { Card } from '../ui';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';

interface ProductSummarySectionProps {
  productName: string;
  productDescription: string;
  jurisdiction: JurisdictionType;
  onRestart?: () => void;
  className?: string;
}

export const ProductSummarySection: React.FC<ProductSummarySectionProps> = ({
  productName,
  productDescription,
  className
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isDescriptionLong = productDescription && productDescription.length > 180;

  return (
    <Card className={cn('p-6 sm:p-7 bg-background-surface border-border shadow-subtle space-y-5', className)}>
      <div className="pb-4 border-b border-border">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            {t('product_info_title', 'Product Information')}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {productName || 'Ashwagandha Botanical Formulation'}
          </h2>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-foreground-subtle block">
          {t('product_desc_title', 'Product Description')}
        </span>
        <div className="text-xs sm:text-sm text-foreground-subtle leading-relaxed bg-background-subtle p-3.5 rounded-lg border border-border">
          <p className={cn(!isExpanded && isDescriptionLong && 'line-clamp-3 font-sans')}>
            {productDescription || 'A standardized Ayurvedic herbal preparation formulated for vitality, adaptogenic support, and wellness.'}
          </p>
          {isDescriptionLong && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-2 text-xs font-semibold text-foreground hover:underline flex items-center gap-1 focus:outline-none cursor-pointer select-none"
            >
              <span>{isExpanded ? t('show_less', 'Show less') : t('show_more', 'Show more')}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
