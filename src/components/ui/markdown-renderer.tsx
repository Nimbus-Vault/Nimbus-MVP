import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useEffect } from 'react';
import mermaid from 'mermaid';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  useEffect(() => {
    // Process mermaid diagrams after component mounts/updates
    const renderMermaidDiagrams = async () => {
      const mermaidElements = document.querySelectorAll('.mermaid');
      if (mermaidElements.length > 0) {
        mermaid.init(undefined, mermaidElements);
      }
    };

    const timer = setTimeout(renderMermaidDiagrams, 100);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (language === 'mermaid') {
              return (
                <div className="mermaid">
                  {String(children).replace(/\n$/, '')}
                </div>
              );
            }
            
            return !inline ? (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code 
                className="bg-muted px-2 py-1 rounded text-sm font-mono" 
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-border">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-border px-4 py-2">
                {children}
              </td>
            );
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold mb-4">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-semibold mb-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-semibold mb-2">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-1">{children}</ol>;
          },
          a({ href, children }) {
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
