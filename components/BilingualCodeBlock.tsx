"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { showToast } from "./Toast";

interface BilingualCodeBlockProps {
  title: string;
  language: string;
  code: string;
  codeZh: string;
  description?: string;
  collapsible?: boolean;
}

function CodePanel({
  code,
  language,
  label,
}: {
  code: string;
  language: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 min-w-0">
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: "1px solid var(--card-border)" }}
      >
        <span
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{
            background: label === "EN" ? "var(--accent)" : "var(--accent-secondary, #EDA100)",
            color: "#fff",
          }}
        >
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="opacity-50 hover:opacity-100 transition-all duration-200"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language === "json" ? "json" : "typescript"}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "0.75rem",
            fontSize: "0.75rem",
            lineHeight: "1.6",
            background: "#1e1e2e",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function BilingualCodeBlock({
  title,
  language,
  code,
  codeZh,
  description,
  collapsible = false,
}: BilingualCodeBlockProps) {
  const [collapsed, setCollapsed] = useState(collapsible);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: collapsed ? "none" : "1px solid var(--card-border)",
        }}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          )}
          <span className="text-sm font-semibold">{title}</span>
        </div>
      </div>

      {/* Bilingual code panels */}
      <div
        className="grid-expand"
        style={{ gridTemplateRows: collapsed ? "0fr" : "1fr" }}
      >
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ borderTop: "none" }}>
            <CodePanel code={code} language={language} label="EN" />
            <CodePanel code={codeZh} language={language} label="中文" />
          </div>
        </div>
      </div>

      {/* Description */}
      {description && !collapsed && (
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
