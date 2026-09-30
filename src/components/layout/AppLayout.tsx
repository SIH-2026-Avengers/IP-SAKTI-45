import React from 'react';
import { Outlet } from 'react-router-dom';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { RagAssistant } from '../rag/RagAssistant';
import { useAssessment } from '../../context/AssessmentContext';
import { useJurisdiction } from '../../context/JurisdictionContext';

export const AppLayout: React.FC = () => {
  const { input, isDashboardActive, activeRagCategory } = useAssessment();
  const { jurisdiction } = useJurisdiction();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* Statutory Disclaimer & Top Header Bar */}
      <div className="relative">
        <DisclaimerBanner />
        {/* Top-Right Language Switcher */}
        <div className="absolute top-1.5 right-3 sm:right-6 z-40">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>

      {/* Floating Action Buttons Column (Chatbot ON TOP when on Dashboard, GitHub ON BOTTOM) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3.5 select-none pointer-events-auto">
        {/* 1. Chatbot Launcher (Visible only on Dashboard screen) */}
        {isDashboardActive && (
          <RagAssistant
            productName={input.productName}
            productClassification={activeRagCategory}
            jurisdiction={jurisdiction}
          />
        )}

        {/* 2. GitHub Repo Button (Bottom) */}
        <div className="flex items-center group animate-slow-float">
          {/* Tooltip on Hover */}
          <div
            role="tooltip"
            className="mr-3 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg shadow-elevated border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 -translate-x-1 group-hover:translate-x-0 hidden sm:block select-none"
          >
            GitHub Repository
          </div>

          {/* GitHub Button */}
          <a
            href="https://github.com/ranjeet22"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            title="GitHub Repository"
            className="w-12 h-12 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full shadow-elevated border border-neutral-700 transition-transform duration-200 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-6 h-6 fill-current text-white"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
