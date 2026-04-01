"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

interface CodeBlockProps {
  title: string;
  language: string;
  code: string;
  description?: string;
  collapsible?: boolean;
}

export default function CodeBlock({
  title,
  language,
  code,
  description,
  collapsible = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(collapsible);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--card-border)" }}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="opacity-60 hover:opacity-100"
            >
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          )}
          <span className="text-sm font-semibold">{title}</span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>

      {/* Code */}
      {!collapsed && (
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language === "json" ? "json" : "typescript"}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.8rem",
              lineHeight: "1.6",
              background: "#1e1e2e",
            }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}

      {/* Description */}
      {description && (
        <div
          className="px-4 py-3 text-sm"
          style={{
            color: "var(--muted)",
            borderTop: "1px solid var(--card-border)",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
