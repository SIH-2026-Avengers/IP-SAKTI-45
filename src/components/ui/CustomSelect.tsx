import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CustomSelectProps {
  label?: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (val: string) => void;
  infoTooltip?: React.ReactNode;
  error?: string;
  className?: string;
  id?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  options,
  placeholder = 'Select an option',
  onChange,
  infoTooltip,
  error,
  className,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  // Click outside listener
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

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(options.length - 1);
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < options.length) {
        onChange(options[highlightedIndex]);
        setIsOpen(false);
      } else {
        setIsOpen((prev) => !prev);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-foreground-subtle"
          >
            {label}
          </label>
          {infoTooltip}
        </div>
      )}

      <button
        id={selectId}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'w-full flex items-center justify-between text-left bg-background-surface border border-border rounded-md px-3.5 py-2 text-sm text-foreground transition-colors hover:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-800 focus:border-neutral-800 select-none',
          !value && 'text-foreground-light',
          error && 'border-status-error-border focus:ring-red-600 focus:border-red-600'
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-neutral-400 transition-transform duration-200 flex-shrink-0 ml-2',
            isOpen && 'rotate-180 text-foreground'
          )}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 w-full mt-1 max-h-56 overflow-auto bg-background-surface border border-border rounded-md shadow-elevated py-1 text-xs sm:text-sm focus:outline-none"
        >
          {options.map((option, idx) => {
            const isSelected = value === option;
            const isHighlighted = highlightedIndex === idx;

            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2 cursor-pointer transition-colors select-none',
                  isSelected && 'font-medium bg-neutral-100 text-foreground',
                  isHighlighted && !isSelected && 'bg-neutral-50 text-foreground',
                  !isSelected && !isHighlighted && 'text-foreground-subtle'
                )}
              >
                <span className="truncate">{option}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-foreground flex-shrink-0 ml-2" />}
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="text-xs text-status-error-text font-medium">{error}</p>}
    </div>
  );
};
