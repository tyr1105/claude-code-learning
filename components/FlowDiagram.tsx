"use client";

import type { FlowStep, FlowConnection } from "@/data/chapters";

interface FlowDiagramProps {
  steps: FlowStep[];
  connections: FlowConnection[];
}

export default function FlowDiagram({ steps }: FlowDiagramProps) {
  return (
    <div
      className="rounded-xl p-6"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <div className="text-sm font-semibold mb-5">数据流程</div>
      <div className="relative">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-start gap-4 group" style={{ marginBottom: i < steps.length - 1 ? 0 : 0 }}>
            {/* Timeline */}
            <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
              {/* Number circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 group-hover:scale-110"
                style={{
                  background: "var(--accent)" + "15",
                  color: "var(--accent)",
                  border: `2px solid var(--accent)`,
                }}
              >
                {i + 1}
              </div>
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div
                  className="w-0.5 flex-1"
                  style={{
                    background: `linear-gradient(to bottom, var(--accent), var(--accent)30)`,
                    minHeight: 32,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div
              className="flex-1 rounded-lg px-4 py-3 transition-all duration-200 group-hover:shadow-sm"
              style={{
                background: "var(--background)",
                border: "1px solid var(--card-border)",
                marginBottom: i < steps.length - 1 ? 8 : 0,
              }}
            >
              <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                {step.label}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
