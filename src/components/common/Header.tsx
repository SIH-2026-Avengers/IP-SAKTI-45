import React from 'react';
import { useLocation } from 'react-router-dom';
import { JurisdictionSwitch } from './JurisdictionSwitch';
import { useAssessment } from '../../context/AssessmentContext';

export const Header: React.FC = () => {
  const { input } = useAssessment();
  const location = useLocation();
  const isIntakeFlow = location.pathname === '/';

  return (
    <header className="bg-background-surface border-b border-border sticky top-0 z-30">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-widest border border-neutral-800 shadow-subtle">
            IP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-foreground">
                IP-SAKTI Sahayak
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-200">
                AYUSH IP Intel
              </span>
            </div>
            <p className="text-[11px] text-foreground-muted hidden sm:block">
              Intellectual Property &amp; Regulatory Guidance Platform
            </p>
          </div>
        </div>

        {/* Global Jurisdiction & Active Context */}
        <div className="flex items-center gap-3">
          {input.productName && !isIntakeFlow && (
            <div className="hidden lg:flex items-center text-xs text-foreground-subtle max-w-xs truncate border-r border-border pr-3">
              <span className="text-foreground-muted mr-1.5">Active:</span>
              <span className="font-medium truncate">{input.productName}</span>
            </div>
          )}
          <JurisdictionSwitch />
        </div>
      </div>
    </header>
  );
};
