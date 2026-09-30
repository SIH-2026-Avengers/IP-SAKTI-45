import React, { useState, useRef, useEffect } from 'react';
import type { JurisdictionType, RAGMessage, Citation } from '../../types';
import { apiService } from '../../services/api';
import { Button } from '../ui';
import { MarkdownContent } from '../common/MarkdownContent';
import {
  MessageSquare,
  Send,
  Minimize2,
  Maximize2,
  X,
  Bot,
  User,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';

interface RagAssistantProps {
  productName: string;
  productClassification?: string;
  jurisdiction: JurisdictionType;
  className?: string;
}

export const RagAssistant: React.FC<RagAssistantProps> = ({
  productName,
  productClassification = 'Patent',
  jurisdiction,
  className
}) => {
  const { t } = useLanguage();
  const [viewState, setViewState] = useState<'minimized' | 'expanded' | 'maximized'>('minimized');
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCitationModal, setActiveCitationModal] = useState<Citation | null>(null);

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    `Can an Ayurvedic formulation in ${productClassification} be patented?`,
    'What prior art scrutiny applies under Section 3(p)?',
    'How does Biological Diversity Act Section 6 approval work?'
  ]);

  const [messages, setMessages] = useState<RAGMessage[]>([
    {
      id: 'msg-initial',
      role: 'assistant',
      content: `Namaste. I am your IP-SAKTI RAG Assistant, grounded in the active assessment for "${productName || 'your formulation'}" (${productClassification}, ${jurisdiction}).\n\nI retrieve evidence directly from 21 Indian statutory Acts, Rules, and official compendia (Patents Act 1970, DCA 1940, BDA 2002, FSSAI 2022). How can I assist with your IP or regulatory strategy?`,
      timestamp: new Date().toISOString(),
      confidenceLevel: 'high',
      jurisdictionContext: jurisdiction
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewState !== 'minimized') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, viewState, isLoading]);

  const handleSendQuery = async (queryText?: string) => {
    const text = (queryText || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: RAGMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Call Real Backend RAG API with hard metadata filtering & reranking
      const response = await apiService.queryRAG({
        question: text,
        jurisdiction: jurisdiction === 'INDIA' ? 'India' : 'International',
        category: productClassification || 'Patent',
        product_name: productName,
        conversation_history: messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content
        }))
      });

      const formattedCitations: Citation[] = (response.citations || []).map((c) => ({
        citationIndex: c.citation_index,
        sourceId: c.source_id,
        sourceTitle: c.source_title,
        authority: (c.authority as any) || 'Indian Patent Office (IPO)',
        section: c.section || 'Statutory Provision',
        excerpt: c.excerpt,
        jurisdiction: jurisdiction
      }));

      const assistantMessage: RAGMessage = {
        id: `msg-asst-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        citations: formattedCitations,
        suggestedFollowUps: response.suggested_questions,
        timestamp: new Date().toISOString(),
        confidenceLevel: 'high',
        jurisdictionContext: jurisdiction
      };

      if (response.suggested_questions && response.suggested_questions.length > 0) {
        setSuggestedQuestions(response.suggested_questions);
      }

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('RAG query error:', err);
      const errorMessage: RAGMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `I could not retrieve evidence from the statutory database: ${err?.message || 'Server connection error'}. Please verify that the backend API is running.`,
        timestamp: new Date().toISOString(),
        confidenceLevel: 'insufficient_evidence',
        jurisdictionContext: jurisdiction
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Minimized Floating Launcher Button
  if (viewState === 'minimized') {
    return (
      <div className={cn('flex items-center group animate-slow-float', className)}>
        {/* Tooltip on Hover */}
        <div
          role="tooltip"
          className="mr-3 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg shadow-elevated border border-neutral-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 -translate-x-1 group-hover:translate-x-0 hidden sm:block select-none"
        >
          {t('ask_rag_tooltip', 'Ask IP-SAKTI RAG')}
        </div>

        {/* Circular Chat Button */}
        <button
          type="button"
          onClick={() => setViewState('expanded')}
          aria-label={t('ask_rag_tooltip', 'Ask IP-SAKTI RAG')}
          title={t('ask_rag_tooltip', 'Ask IP-SAKTI RAG')}
          className="w-12 h-12 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full shadow-elevated border border-neutral-700 transition-transform duration-200 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </button>
      </div>
    );
  }

  // Common Inner Content of Assistant Modal/Drawer
  const renderAssistantContent = () => (
    <>
      {/* Assistant Header */}
      <div className="p-4 bg-background-surface border-b border-border rounded-t-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                {t('rag_title', 'IP-SAKTI RAG')}
              </h3>
            </div>
            <p className="text-[11px] text-foreground-muted">
              {t('rag_subtitle', 'Intelligent Statutory & Regulatory Intelligence')}
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1">
          {viewState === 'expanded' ? (
            <button
              type="button"
              onClick={() => setViewState('maximized')}
              title="Maximize workspace view"
              className="p-1.5 text-neutral-400 hover:text-foreground rounded transition-colors hidden sm:block cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setViewState('expanded')}
              title="Restore compact view"
              className="p-1.5 text-neutral-400 hover:text-foreground rounded transition-colors hidden sm:block cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setViewState('minimized')}
            title="Minimize assistant"
            className="p-1.5 text-neutral-400 hover:text-foreground rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Assessment Context Metadata Strip */}
      <div className="px-4 py-2 bg-background-subtle border-b border-border-subtle flex flex-wrap items-center justify-between gap-2 text-[11px] text-foreground-subtle">
        <div className="flex items-center gap-2 truncate">
          <span className="text-foreground-muted">Active:</span>
          <span className="font-semibold text-foreground truncate max-w-[140px] sm:max-w-[200px]">
            {productName || 'Herbal Formulation'}
          </span>
          <span className="text-neutral-300">&bull;</span>
          <span className="text-foreground-muted truncate hidden sm:inline">{productClassification}</span>
        </div>
        <span className="font-mono font-semibold text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded">
          {jurisdiction}
        </span>
      </div>

      {/* Citation Inspector Popover if selected */}
      {activeCitationModal && (
        <div className="p-3.5 m-3 bg-neutral-900 text-white rounded-lg border border-neutral-700 shadow-elevated space-y-2 text-xs animate-pop">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-300 uppercase">
              Citation [{activeCitationModal.citationIndex}] &bull; {activeCitationModal.authority}
            </span>
            <button
              type="button"
              onClick={() => setActiveCitationModal(null)}
              className="text-neutral-400 hover:text-white text-xs font-bold cursor-pointer"
            >
              &times;
            </button>
          </div>
          <h4 className="font-bold text-neutral-100">
            {activeCitationModal.sourceTitle} ({activeCitationModal.section})
          </h4>
          <p className="text-[11px] text-neutral-300 bg-neutral-800 p-2 rounded border border-neutral-700 font-serif leading-relaxed">
            &ldquo;{activeCitationModal.excerpt}&rdquo;
          </p>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role !== 'user' && (
              <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-xs mt-1">
                {msg.confidenceLevel === 'insufficient_evidence' ? (
                  <AlertCircle className="w-4 h-4 text-status-warning-text" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
            )}

            <div className={cn('space-y-2.5 max-w-[85%]', msg.role === 'user' ? 'text-right' : 'text-left')}>
              <div
                className={cn(
                  'p-3.5 rounded-xl leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-background-subtle text-foreground border border-border'
                )}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-line text-white">{msg.content}</p>
                ) : (
                  <MarkdownContent content={msg.content} variant="light" />
                )}

                {/* Grounded Citations Cards */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-border-subtle space-y-2">
                    <span className="text-[10px] font-mono text-foreground-muted block uppercase tracking-wider">
                      {t('sources_label', 'Statutory Sources & Evidence:')}
                    </span>
                    <div className="space-y-1.5">
                      {msg.citations.map((cit) => (
                        <div
                          key={cit.citationIndex}
                          onClick={() => setActiveCitationModal(cit)}
                          className="p-2 bg-background-surface rounded border border-border hover:border-neutral-800 transition-colors cursor-pointer flex items-start justify-between gap-2 text-left"
                        >
                          <div>
                            <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                              <span className="font-mono text-[10px] text-neutral-500">[{cit.citationIndex}]</span>
                              <span>{cit.sourceTitle}</span>
                              <span className="text-[10px] text-foreground-muted font-normal">({cit.section})</span>
                            </div>
                            <p className="text-[11px] text-foreground-subtle line-clamp-1 mt-0.5">
                              {cit.excerpt}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-600 uppercase flex-shrink-0">
                            {t('view_source', 'View')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Followups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedFollowUps.map((fu, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendQuery(fu)}
                      className="text-[11px] bg-background-surface hover:bg-neutral-100 text-foreground-subtle hover:text-foreground border border-border px-2.5 py-1 rounded-full transition-colors text-left cursor-pointer"
                    >
                      &rarr; {fu}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center flex-shrink-0 text-xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center justify-start">
            <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-xs">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="p-3 bg-background-subtle rounded-xl border border-border flex items-center gap-2 text-xs text-foreground-muted">
              <div className="w-3 h-3 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin" />
              <span>Searching 6,352 statutory chunks &amp; reranking evidence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills (when few messages) */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 py-2 bg-background-surface border-t border-border-subtle space-y-1.5">
          <span className="text-[10px] font-mono text-foreground-muted uppercase tracking-wider block">
            {t('suggested_questions_label', 'Suggested Questions:')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendQuery(q)}
                className="text-[11px] bg-background-subtle hover:bg-neutral-100 text-foreground px-2.5 py-1 rounded-md border border-border transition-colors text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery();
        }}
        className="p-3 bg-background-surface border-t border-border rounded-b-2xl flex gap-2"
      >
        <input
          type="text"
          placeholder={t('ask_placeholder', 'Ask Anything...')}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-background-subtle border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-foreground-light focus:outline-none focus:border-neutral-800 focus:bg-background-surface transition-colors"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim() || isLoading}
          className="px-3"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </>
  );

  // Maximized View with Clean Dark Backdrop Overlay
  if (viewState === 'maximized') {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div
          className={cn(
            'w-full max-w-4xl h-[85vh] max-h-[750px] bg-background-surface rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative',
            className
          )}
        >
          {renderAssistantContent()}
        </div>
      </div>
    );
  }

  // Expanded View (Floating Drawer Bottom-Right)
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 w-[calc(100vw-32px)] sm:w-[440px] h-[580px] max-h-[82vh] bg-background-surface rounded-2xl shadow-modal border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200',
        className
      )}
    >
      {renderAssistantContent()}
    </div>
  );
};
