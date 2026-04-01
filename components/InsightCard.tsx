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
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${color}40`,
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-start gap-3">
        <Lightbulb
          size={18}
          className="mt-0.5 flex-shrink-0"
          style={{ color }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold">{insight.title}</h4>
          {/* Analogy highlight */}
          <div
            className="mt-2 px-3 py-2 rounded-lg text-xs leading-relaxed"
            style={{ background: color + "10", color }}
          >
            {insight.analogy}
          </div>
          {/* Explanation */}
          <p
            className="mt-2 text-xs leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {insight.explanation}
          </p>
        </div>
      </div>

      {/* Code toggle */}
      {insight.code && (
        <div style={{ borderTop: `1px solid ${color}20` }}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-2 flex items-center gap-2 text-xs hover:opacity-80 cursor-pointer"
            style={{ color: "var(--muted)" }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "收起代码" : "查看代码"}
          </button>
          {expanded && (
            <pre
              className="px-4 pb-3 text-xs leading-relaxed overflow-x-auto"
              style={{ color: "var(--muted)" }}
            >
              <code>{insight.code}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
