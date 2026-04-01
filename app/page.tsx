"use client";

import dynamic from "next/dynamic";
import ModuleCard from "@/components/ModuleCard";
import { chapters, stats } from "@/data/chapters";
import { Code2, FileCode, Terminal, Wrench, Cpu, GitBranch } from "lucide-react";

const HomeArchitectureGraph = dynamic(
  () => import("@/components/ArchitectureGraph").then((m) => m.HomeArchitectureGraph),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-xl flex items-center justify-center"
        style={{ height: 600, background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
      >
        <span style={{ color: "var(--muted)" }}>加载架构图...</span>
      </div>
    ),
  }
);

const statItems = [
  { label: "源文件", value: stats.totalFiles.toLocaleString(), icon: FileCode, color: "#3B82F6" },
  { label: "代码行数", value: (stats.totalLines / 1000).toFixed(0) + "K", icon: Code2, color: "#EF4444" },
  { label: "内置工具", value: stats.tools.toString(), icon: Wrench, color: "#10B981" },
  { label: "命令", value: stats.commands.toString(), icon: Terminal, color: "#8B5CF6" },
  { label: "React Hooks", value: stats.hooks.toString(), icon: Cpu, color: "#F59E0B" },
  { label: "UI 组件", value: stats.components.toString(), icon: GitBranch, color: "#EC4899" },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Claude Code 源码深度解析</h1>
        <p style={{ color: "var(--muted)" }}>
          交互式探索 Anthropic Claude Code CLI 的架构与实现 — 515K 行 TypeScript 代码的完整解读
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {statItems.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center"
              style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
            >
              <Icon size={20} className="mx-auto mb-2" style={{ color: s.color }} />
              <div className="text-xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Graph */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">全局架构图</h2>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          点击节点可跳转到对应模块的详细解析页面。拖拽可平移，滚轮可缩放。
        </p>
        <HomeArchitectureGraph />
      </div>

      {/* Chapter Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">模块详解</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {chapters.map((ch, i) => (
            <ModuleCard key={ch.slug} chapter={ch} index={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="text-center py-6 text-xs"
        style={{ color: "var(--muted)" }}
      >
        Claude Code 源码解析 — 基于 v2.1.88 版本分析
      </div>
    </div>
  );
}
