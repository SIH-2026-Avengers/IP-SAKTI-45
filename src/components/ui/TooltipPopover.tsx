import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TooltipPopoverProps {
  content: string;
  className?: string;
  side?: 'top' | 'bottom';
}

export const TooltipPopover: React.FC<TooltipPopoverProps> = ({
  content,
  className,
  side = 'top'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        aria-label="Why is this question important?"
        aria-expanded={isOpen}
        className="text-neutral-400 hover:text-neutral-700 focus:text-neutral-900 focus:outline-none transition-colors p-0.5 rounded"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 w-64 sm:w-72 p-3 bg-neutral-900 text-neutral-100 text-[11px] leading-relaxed rounded-lg shadow-elevated border border-neutral-700 pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150',
            side === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0'
              : 'top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0'
          )}
        >
          <div className="font-semibold text-neutral-300 mb-1 text-[10px] uppercase tracking-wider">
            Why this matters
          </div>
          <p className="text-neutral-200 font-normal">{content}</p>
        </div>
      )}
    </div>
  );
};
