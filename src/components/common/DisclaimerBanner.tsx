import React from 'react';
import { cn } from '../../utils/cn';
import { Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DisclaimerBanner: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'bg-background-subtle border-y border-border px-4 py-2 pr-28 sm:pr-36 text-[11px] text-foreground-subtle flex items-center justify-center gap-2 select-none',
        className
      )}
    >
      <Info className="w-3.5 h-3.5 text-foreground-muted flex-shrink-0" />
      <span>
        <strong>{t('disclaimer_title')}</strong> {t('disclaimer_body')}
      </span>
    </div>
  );
};
