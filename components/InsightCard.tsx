"use client";

import { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import type { Insight } from "@/data/chapters";

interface InsightCardProps {
  insight: Insight;
  color: string;
}

export default function InsightCard({ insight, color }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${color}40`,
        transform: "translateY(0)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-start gap-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: color + "15" }}
        >
          <Lightbulb size={14} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold">{insight.title}</h4>
          {/* Analogy highlight */}
          <div
            className="mt-2 px-3 py-2 rounded-lg text-xs leading-relaxed italic"
            style={{ background: color + "08", borderLeft: `3px solid ${color}`, color }}
          >
            {insight.analogy}
          </div>
          {/* Explanation */}
          <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            {insight.explanation}
          </p>
        </div>
      </div>

      {/* Code toggle with smooth expand */}
      {insight.code && (
        <div style={{ borderTop: `1px solid ${color}15` }}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-2 flex items-center gap-2 text-xs cursor-pointer transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "收起代码" : "查看代码"}
          </button>
          <div
            className="grid-expand"
            style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
          >
            <div>
              <pre
                className="px-4 pb-3 text-xs leading-relaxed overflow-x-auto font-mono"
                style={{ color: "var(--muted)", background: "var(--code-bg)", margin: 0, padding: "12px 16px" }}
              >
                <code>{insight.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
