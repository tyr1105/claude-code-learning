"use client";

import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  Position,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { ArchNode, ArchEdge } from "@/data/chapters";

interface ArchitectureGraphProps {
  nodes: ArchNode[];
  edges: ArchEdge[];
  onNodeClick?: (nodeId: string) => void;
  height?: number;
}

function CustomNode({ data }: { data: { label: string; description: string; color: string } }) {
  return (
    <div
      className="px-4 py-3 rounded-xl shadow-lg text-center min-w-[120px] transition-transform hover:scale-105"
      style={{
        background: data.color + "15",
        border: `2px solid ${data.color}`,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: data.color, width: 8, height: 8 }} />
      <div className="text-sm font-bold" style={{ color: data.color }}>
        {data.label}
      </div>
      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
        {data.description}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: data.color, width: 8, height: 8 }} />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

export default function ArchitectureGraph({
  nodes: archNodes,
  edges: archEdges,
  onNodeClick,
  height = 500,
}: ArchitectureGraphProps) {
  const nodes: Node[] = archNodes.map((n) => ({
    id: n.id,
    type: "custom",
    position: { x: n.x, y: n.y },
    data: { label: n.label, description: n.description, color: n.color },
  }));

  const edges: Edge[] = archEdges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: true,
    style: { stroke: "var(--accent)", strokeWidth: 2 },
    labelStyle: { fill: "var(--muted)", fontSize: 11 },
    labelBgStyle: { fill: "var(--card-bg)", fillOpacity: 0.9 },
  }));

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  return (
    <div
      className="rounded-xl overflow-hidden relative"
      style={{
        height,
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        zIndex: 0,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background gap={20} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

// Home page full architecture graph
export function HomeArchitectureGraph() {
  const router = useRouter();

  const nodes: ArchNode[] = [
    { id: "entry", label: "CLI Entry", description: "cli.js / main.tsx", x: 300, y: 0, color: "#D97757" },
    { id: "tools", label: "工具系统", description: "42 个内置工具", x: 100, y: 150, color: "#C2785C" },
    { id: "commands", label: "命令系统", description: "86 个命令", x: 300, y: 150, color: "#B8860B" },
    { id: "permissions", label: "权限系统", description: "多层安全控制", x: 500, y: 150, color: "#8B7355" },
    { id: "messages", label: "消息系统", description: "对话与压缩", x: 0, y: 300, color: "#EDA100" },
    { id: "hooks", label: "Hook 系统", description: "生命周期钩子", x: 200, y: 300, color: "#A0522D" },
    { id: "mcp", label: "MCP 集成", description: "外部工具协议", x: 400, y: 300, color: "#D97757" },
    { id: "agent", label: "Agent 系统", description: "多代理协调", x: 600, y: 300, color: "#C2785C" },
    { id: "state", label: "状态管理", description: "AppState", x: 100, y: 450, color: "#B8860B" },
    { id: "bridge", label: "Bridge/IDE", description: "IDE 集成", x: 300, y: 450, color: "#8B7355" },
    { id: "skills", label: "技能系统", description: "Slash 命令扩展", x: 500, y: 450, color: "#EDA100" },
    { id: "prompts", label: "提示词系统", description: "60+ 提示词定义", x: 300, y: 600, color: "#D97757" },
  ];

  const edges: ArchEdge[] = [
    { source: "entry", target: "tools", label: "加载" },
    { source: "entry", target: "commands", label: "注册" },
    { source: "entry", target: "permissions", label: "初始化" },
    { source: "tools", target: "messages" },
    { source: "tools", target: "mcp", label: "MCP 工具" },
    { source: "commands", target: "hooks" },
    { source: "permissions", target: "agent" },
    { source: "messages", target: "state" },
    { source: "hooks", target: "bridge" },
    { source: "mcp", target: "skills" },
    { source: "agent", target: "state" },
    { source: "skills", target: "prompts", label: "调用" },
    { source: "messages", target: "prompts", label: "压缩" },
  ];

  const slugMap: Record<string, string> = {
    entry: "overview",
    tools: "tools",
    commands: "commands",
    permissions: "permissions",
    messages: "messages",
    hooks: "hooks",
    mcp: "mcp",
    agent: "agent",
    state: "state",
    bridge: "bridge",
    skills: "skills",
    prompts: "prompts",
  };

  return (
    <ArchitectureGraph
      nodes={nodes}
      edges={edges}
      onNodeClick={(id) => {
        const slug = slugMap[id];
        if (slug) router.push(`/chapters/${slug}`);
      }}
      height={600}
    />
  );
}
