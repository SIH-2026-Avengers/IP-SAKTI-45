import React, { useState, useEffect } from 'react';
import { useJurisdiction } from '../context/JurisdictionContext';
import { useAssessment } from '../context/AssessmentContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, Button, Input, Badge, Select } from '../components/ui';
import { CitationBadge } from '../components/common/CitationBadge';
import { MarkdownContent } from '../components/common/MarkdownContent';
import { apiService } from '../services/api';
import { sendAssistantQuery } from '../services/assistant';
import type { RAGMessage, Citation } from '../types';
import { Send, User, Bot, AlertCircle } from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const { jurisdiction } = useJurisdiction();
  const {
    input,
    predictedCategory,
    activeRagCategory,
    selectRagCategory,
    submitPendingClassifierFeedback
  } = useAssessment();
  const [categories, setCategories] = useState<string[]>([]);
  const [messages, setMessages] = useState<RAGMessage[]>([
    {
      id: 'msg-initial',
      role: 'assistant',
      content: `Namaste. I am your IP-SAKTI RAG Assistant, grounded in your active assessment for "${input.productName || 'your formulation'}" (${predictedCategory || 'Patent'}, ${jurisdiction}).\n\nI retrieve evidence directly from 21 Indian statutory Acts, Rules, and official compendia (Patents Act 1970, DCA 1940, BDA 2002, FSSAI 2022). How can I assist with your IP or regulatory strategy?`,
      timestamp: new Date().toISOString(),
      confidenceLevel: 'high',
      jurisdictionContext: jurisdiction
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiService.getCategories()
      .then(({ categories: availableCategories }) => {
        if (!cancelled) setCategories(availableCategories);
      })
      .catch((error) => console.error('Category list API error:', error));

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: RAGMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    let classifierFeedbackError: string | null = null;

    try {
      try {
        await submitPendingClassifierFeedback(activeRagCategory);
      } catch (error) {
        classifierFeedbackError = error instanceof Error ? error.message : String(error);
        console.error('Classifier feedback update failed:', error);
      }

      const response = await sendAssistantQuery(
        text,
        jurisdiction,
        activeRagCategory || predictedCategory || 'Patent',
        input.productName
      );
      const feedbackWarning: RAGMessage | null = classifierFeedbackError
        ? {
            id: `msg-feedback-error-${Date.now()}`,
            role: 'assistant',
            content: `The search completed, but the classifier could not be updated: ${classifierFeedbackError}`,
            timestamp: new Date().toISOString(),
            confidenceLevel: 'insufficient_evidence',
            jurisdictionContext: jurisdiction
          }
        : null;
      setMessages((prev) => [
        ...prev,
        response,
        ...(feedbackWarning ? [feedbackWarning] : [])
      ]);
    } catch (err: any) {
      const errorMsg: RAGMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: [
          `Error connecting to RAG backend: ${err?.message || 'Server unreachable'}`,
          classifierFeedbackError
            ? `The classifier could not be updated: ${classifierFeedbackError}`
            : ''
        ].filter(Boolean).join('\n\n'),
        timestamp: new Date().toISOString(),
        confidenceLevel: 'insufficient_evidence',
        jurisdictionContext: jurisdiction
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Source-Grounded RAG Assistant"
        subtitle="Ask regulatory and IP questions grounded in classical AYUSH treatises, Indian Patent Office guidelines, and global export laws."
        badge="Stage 5: RAG Intelligence"
      />

      <Card className="p-4 bg-background-surface border-border space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
          <span>Classifier prediction: <strong className="text-foreground">{predictedCategory}</strong></span>
          <span aria-hidden="true">&bull;</span>
          <span>Selected search category: <strong className="text-foreground">{activeRagCategory}</strong></span>
        </div>
        <Select
          id="assistant-search-category"
          label="Search documents in"
          value={activeRagCategory}
          options={categories.map((category) => ({ value: category, label: category }))}
          onChange={(event) => selectRagCategory(event.target.value)}
          disabled={isLoading || categories.length === 0}
          helperText="Using a changed category for a question updates future classifier predictions; this assessment stays unchanged."
        />
      </Card>

      {/* Citation Inspector Modal/Drawer Preview */}
      {activeCitation && (
        <div className="p-4 bg-background-surface border-2 border-neutral-900 rounded-xl shadow-elevated transition-all space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="neutral" size="sm">
                Citation [{activeCitation.citationIndex}]
              </Badge>
              <span className="text-xs font-bold text-foreground">
                {activeCitation.authority} &bull; {activeCitation.section}
              </span>
            </div>
            <button
              onClick={() => setActiveCitation(null)}
              className="text-xs text-neutral-400 hover:text-black font-bold cursor-pointer"
            >
              Close &times;
            </button>
          </div>
          <h4 className="text-xs font-semibold text-foreground">{activeCitation.sourceTitle}</h4>
          <p className="text-xs text-foreground-subtle bg-background-subtle p-2.5 rounded border border-border font-serif">
            &ldquo;{activeCitation.excerpt}&rdquo;
          </p>
        </div>
      )}

      {/* Message Stream */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role !== 'user' && (
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                {msg.confidenceLevel === 'insufficient_evidence' ? (
                  <AlertCircle className="w-4 h-4 text-status-warning-text" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
            )}

            <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <Card
                className={`p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-background-surface border-border'
                }`}
              >
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-line font-sans text-white">{msg.content}</div>
                ) : (
                  <MarkdownContent content={msg.content} variant="light" />
                )}

                {/* Citations List if present */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap items-center gap-1">
                    <span className="text-[11px] font-mono text-foreground-muted mr-1">Cited Evidence:</span>
                    {msg.citations.map((c) => (
                      <CitationBadge
                        key={c.citationIndex}
                        citation={c}
                        onClick={(cit) => setActiveCitation(cit)}
                      />
                    ))}
                  </div>
                )}
              </Card>

              {/* Suggested Followups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedFollowUps.map((fu, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(fu)}
                      className="text-[11px] bg-background-surface hover:bg-neutral-100 text-foreground-subtle hover:text-foreground border border-border px-2.5 py-1 rounded-full transition-colors text-left cursor-pointer"
                    >
                      &rarr; {fu}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-background-surface border border-border rounded-xl p-3 flex items-center gap-2 text-xs text-foreground-muted">
              <div className="w-3.5 h-3.5 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin" />
              <span>Retrieving statutory precedents and synthesizing grounded guidance...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="sticky bottom-4 pt-2"
      >
        <div className="flex gap-2 bg-background-surface p-2 rounded-xl border border-neutral-400 shadow-elevated">
          <Input
            placeholder="Ask anything about ASU drug licensing, Section 3(p) objections, NBA approval, or export rules..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="border-0 shadow-none focus:ring-0 px-2"
          />
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            <Send className="w-4 h-4 mr-1" />
            <span>Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
