import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../utils/cn';

interface MarkdownContentProps {
  content: string;
  className?: string;
  variant?: 'dark' | 'light';
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  className,
  variant = 'light'
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={cn('markdown-content leading-relaxed text-xs sm:text-sm break-words', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={cn('text-base font-bold mt-3 mb-1.5 first:mt-0', isDark ? 'text-white' : 'text-foreground')}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={cn('text-sm font-bold mt-2.5 mb-1.5 first:mt-0', isDark ? 'text-white' : 'text-foreground')}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={cn('text-xs font-bold uppercase tracking-wider mt-2 mb-1 first:mt-0', isDark ? 'text-neutral-200' : 'text-foreground')}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className={cn('mb-2 last:mb-0', isDark ? 'text-neutral-100' : 'text-foreground')}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className={cn('font-bold', isDark ? 'text-white font-semibold' : 'text-foreground font-semibold')}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className={cn('italic', isDark ? 'text-neutral-300' : 'text-foreground-muted')}>
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 space-y-1 mb-2 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 space-y-1 mb-2 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className={cn('pl-0.5', isDark ? 'text-neutral-200' : 'text-foreground')}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className={cn(
              'border-l-2 pl-3 my-2 italic text-xs',
              isDark ? 'border-neutral-500 text-neutral-300 bg-neutral-800/40' : 'border-neutral-400 text-foreground-muted bg-neutral-50'
            )}>
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className?.includes('language-');
            return isInline ? (
              <code className={cn(
                'px-1.5 py-0.5 rounded font-mono text-[11px]',
                isDark ? 'bg-neutral-800 text-neutral-200 border border-neutral-700' : 'bg-neutral-200 text-neutral-800 border border-neutral-300'
              )}>
                {children}
              </code>
            ) : (
              <pre className={cn(
                'p-2.5 rounded-md font-mono text-xs overflow-x-auto my-2',
                isDark ? 'bg-neutral-950 text-neutral-200 border border-neutral-800' : 'bg-neutral-900 text-neutral-100'
              )}>
                <code>{children}</code>
              </pre>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className={cn('min-w-full text-xs border-collapse', isDark ? 'border-neutral-700' : 'border-border')}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className={cn('p-1.5 text-left font-bold border-b text-[11px] uppercase tracking-wider', isDark ? 'border-neutral-700 text-neutral-200' : 'border-border text-foreground-muted')}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={cn('p-1.5 border-b text-xs', isDark ? 'border-neutral-800 text-neutral-300' : 'border-border text-foreground')}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
