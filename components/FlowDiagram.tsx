"use client";

import type { FlowStep, FlowConnection } from "@/data/chapters";
import { ArrowRight } from "lucide-react";

interface FlowDiagramProps {
  steps: FlowStep[];
  connections: FlowConnection[];
}

export default function FlowDiagram({ steps, connections }: FlowDiagramProps) {
  return (
    <div
      className="rounded-xl p-6"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <div className="text-sm font-semibold mb-4">数据流程</div>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className="px-4 py-3 rounded-xl text-center min-w-[100px]"
              style={{
                background: "var(--accent)" + "10",
                border: "1px solid var(--accent)" + "40",
              }}
            >
              <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                {step.label}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {step.description}
              </div>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight size={16} style={{ color: "var(--muted)" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
