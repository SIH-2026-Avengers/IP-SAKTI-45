import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../../data/translations';
import type { LanguageOption } from '../../data/translations';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, setLanguage, currentLanguageInfo, t } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = (lang: LanguageOption) => {
    setLanguage(lang.code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative inline-block text-left', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-background-surface hover:bg-neutral-100 text-foreground border border-border rounded-lg shadow-subtle transition-all duration-150 text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-800"
      >
        <Globe className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
        <span className="font-mono font-semibold uppercase">{currentLanguageInfo.code}</span>
        <span className="text-foreground-muted hidden sm:inline">&bull; {currentLanguageInfo.nativeName}</span>
        <ChevronDown className={cn('w-3 h-3 text-neutral-500 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 bg-background-surface border border-border rounded-xl shadow-modal py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-72 overflow-y-auto">
          <div className="px-3 py-1 border-b border-border-subtle mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
              {t('select_language', 'Select Language')}
            </span>
          </div>

          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-neutral-100 font-semibold text-foreground'
                    : 'text-foreground-subtle hover:bg-neutral-50 hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase text-neutral-500 w-5">
                    {lang.code}
                  </span>
                  <span>{lang.nativeName}</span>
                  <span className="text-[11px] text-neutral-400">({lang.label})</span>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
