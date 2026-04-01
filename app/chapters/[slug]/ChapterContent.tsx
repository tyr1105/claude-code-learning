"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { getChapterBySlug, chapters } from "@/data/chapters";
import FileTree from "@/components/FileTree";
import FlowDiagram from "@/components/FlowDiagram";
import InsightCard from "@/components/InsightCard";
import TableOfContents from "@/components/TableOfContents";
import Link from "next/link";
import {
  Layout, Wrench, Terminal, Shield, MessageSquare, Anchor,
  Plug, Users, Database, Monitor, Sparkles, Star,
  ArrowLeft, ArrowRight, CheckCircle2,
} from "lucide-react";
import { useMemo } from "react";

const ArchitectureGraph = dynamic(() => import("@/components/ArchitectureGraph"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-xl flex items-center justify-center"
      style={{ height: 500, background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
        <span style={{ color: "var(--muted)" }} className="text-sm">加载架构图...</span>
      </div>
    </div>
  ),
});

const CodeBlock = dynamic(() => import("@/components/CodeBlock"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-xl h-40 flex items-center justify-center"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <span style={{ color: "var(--muted)" }} className="text-sm">加载代码...</span>
    </div>
  ),
});

// Prompt chapter: category anchors for right-side TOC
const PROMPT_TOC_CATS = [
  { id: "prompt-cat-0",  label: "系统提示",      titlePrefix: "【总目录" },
  { id: "prompt-cat-1",  label: "系统提示",      titlePrefix: "主系统提示" },
  { id: "prompt-cat-2",  label: "文件操作工具",  titlePrefix: "Bash 工具" },
  { id: "prompt-cat-3",  label: "文件操作工具",  titlePrefix: "文件编辑" },
  { id: "prompt-cat-4",  label: "文件操作工具",  titlePrefix: "FileReadTool" },
  { id: "prompt-cat-5",  label: "上下文压缩",    titlePrefix: "上下文压缩" },
  { id: "prompt-cat-6",  label: "记忆提取",      titlePrefix: "记忆提取" },
  { id: "prompt-cat-7",  label: "AskUserQuestion", titlePrefix: "AskUserQuestion" },
  { id: "prompt-cat-8",  label: "EnterPlanMode", titlePrefix: "EnterPlanMode" },
  { id: "prompt-cat-9",  label: "ExitPlanMode",  titlePrefix: "ExitPlanMode" },
  { id: "prompt-cat-10", label: "Glob / Grep",   titlePrefix: "GlobTool" },
  { id: "prompt-cat-11", label: "WebSearch",     titlePrefix: "WebSearch" },
  { id: "prompt-cat-12", label: "AgentTool",     titlePrefix: "Agent 工具" },
  { id: "prompt-cat-13", label: "Task 系列",     titlePrefix: "Task 系列" },
  { id: "prompt-cat-14", label: "SkillTool",     titlePrefix: "SkillTool" },
  { id: "prompt-cat-15", label: "TodoWrite",     titlePrefix: "TodoWriteTool" },
  { id: "prompt-cat-16", label: "Worktree",      titlePrefix: "EnterWorktree" },
  { id: "prompt-cat-17", label: "SendMessage/Team", titlePrefix: "SendMessage" },
  { id: "prompt-cat-18", label: "ToolSearch",    titlePrefix: "ToolSearch" },
  { id: "prompt-cat-19", label: "BriefTool",     titlePrefix: "BriefTool" },
  { id: "prompt-cat-20", label: "FileRead/Write", titlePrefix: "FileReadTool / FileWriteTool" },
  { id: "prompt-cat-21", label: "SleepTool",     titlePrefix: "SleepTool" },
  { id: "prompt-cat-22", label: "WebFetch",      titlePrefix: "WebFetchTool" },
  { id: "prompt-cat-23", label: "ConfigTool",    titlePrefix: "ConfigTool" },
  { id: "prompt-cat-24", label: "LSPTool",       titlePrefix: "LSPTool" },
  { id: "prompt-cat-25", label: "NotebookEdit",  titlePrefix: "NotebookEditTool" },
  { id: "prompt-cat-26", label: "PowerShell",    titlePrefix: "PowerShellTool" },
  { id: "prompt-cat-27", label: "MCP 资源",      titlePrefix: "MCP 资源工具" },
  { id: "prompt-cat-28", label: "RemoteTrigger", titlePrefix: "RemoteTriggerTool" },
  { id: "prompt-cat-29", label: "ScheduleCron",  titlePrefix: "ScheduleCronTool" },
  { id: "prompt-cat-30", label: "MagicDocs",     titlePrefix: "MagicDocs" },
  { id: "prompt-cat-31", label: "SessionMemory", titlePrefix: "SessionMemory" },
  { id: "prompt-cat-32", label: "autoDream",     titlePrefix: "autoDream" },
  { id: "prompt-cat-33", label: "Buddy",         titlePrefix: "Buddy" },
  { id: "prompt-cat-34", label: "Chrome 自动化", titlePrefix: "Chrome" },
  { id: "prompt-cat-35", label: "Swarm Teammate", titlePrefix: "Swarm Teammate" },
  { id: "prompt-cat-36", label: "/claude-in-chrome", titlePrefix: "/claude-in-chrome" },
  { id: "prompt-cat-37", label: "/claude-api",   titlePrefix: "/claude-api" },
  { id: "prompt-cat-38", label: "/debug",        titlePrefix: "/debug" },
  { id: "prompt-cat-39", label: "/update-config", titlePrefix: "/update-config" },
  { id: "prompt-cat-40", label: "/schedule",     titlePrefix: "/schedule" },
  { id: "prompt-cat-41", label: "/simplify",     titlePrefix: "/simplify" },
  { id: "prompt-cat-42", label: "/batch",        titlePrefix: "/batch" },
  { id: "prompt-cat-43", label: "/remember",     titlePrefix: "/remember" },
  { id: "prompt-cat-44", label: "/skillify",     titlePrefix: "/skillify" },
  { id: "prompt-cat-45", label: "/loop",         titlePrefix: "/loop" },
  { id: "prompt-cat-46", label: "/keybindings",  titlePrefix: "/keybindings" },
  { id: "prompt-cat-47", label: "/lorem-ipsum",  titlePrefix: "/lorem-ipsum" },
];

const iconMap: Record<string, React.ElementType> = {
  Layout, Wrench, Terminal, Shield, MessageSquare, Anchor,
  Plug, Users, Database, Monitor, Sparkles, Star,
};

export default function ChapterContent() {
  const params = useParams();
  const slug = params.slug as string;
  const chapter = getChapterBySlug(slug);

  const tocItems = useMemo(() => {
    if (!chapter) return [];
    const items: { id: string; label: string; indent?: boolean }[] = [];
    items.push({ id: "sec-overview", label: "概述" });
    items.push({ id: "sec-keypoints", label: "核心要点" });
    if (chapter.slug === "prompts") items.push({ id: "sec-prompt-index", label: "提示词索引" });
    if (chapter.insights && chapter.insights.length > 0) items.push({ id: "sec-insights", label: "设计亮点" });
    if (chapter.archNodes.length > 0) items.push({ id: "sec-arch", label: "架构图" });
    if (chapter.coreFiles.length > 0) items.push({ id: "sec-files", label: "核心文件" });
    if (chapter.flowSteps.length > 0) items.push({ id: "sec-flow", label: "数据流程" });
    if (chapter.codeSnippets.length > 0) {
      items.push({ id: "sec-code", label: "关键代码" });
      if (chapter.slug === "prompts") {
        const promptGroups = [
          { id: "prompt-cat-0",  label: "· 索引总览" },
          { id: "prompt-cat-1",  label: "· 系统提示" },
          { id: "prompt-cat-2",  label: "· BashTool" },
          { id: "prompt-cat-3",  label: "· 文件操作" },
          { id: "prompt-cat-5",  label: "· 压缩/记忆" },
          { id: "prompt-cat-7",  label: "· AskUserQuestion" },
          { id: "prompt-cat-8",  label: "· 计划模式" },
          { id: "prompt-cat-10", label: "· Glob / Grep" },
          { id: "prompt-cat-11", label: "· WebSearch" },
          { id: "prompt-cat-12", label: "· AgentTool" },
          { id: "prompt-cat-13", label: "· Task 系列" },
          { id: "prompt-cat-14", label: "· SkillTool" },
          { id: "prompt-cat-16", label: "· Worktree" },
          { id: "prompt-cat-17", label: "· SendMessage" },
          { id: "prompt-cat-18", label: "· ToolSearch" },
          { id: "prompt-cat-19", label: "· BriefTool" },
          { id: "prompt-cat-20", label: "· FileRead/Write" },
          { id: "prompt-cat-21", label: "· Sleep/WebFetch" },
          { id: "prompt-cat-23", label: "· Config/LSP" },
          { id: "prompt-cat-25", label: "· Notebook/PS" },
          { id: "prompt-cat-27", label: "· MCP/Remote/Cron" },
          { id: "prompt-cat-30", label: "· MagicDocs" },
          { id: "prompt-cat-31", label: "· SessionMemory" },
          { id: "prompt-cat-32", label: "· autoDream" },
          { id: "prompt-cat-33", label: "· Buddy/Chrome" },
          { id: "prompt-cat-35", label: "· Swarm Teammate" },
          { id: "prompt-cat-36", label: "· /claude-in-chrome" },
          { id: "prompt-cat-37", label: "· /claude-api" },
          { id: "prompt-cat-38", label: "· /debug" },
          { id: "prompt-cat-39", label: "· /update-config" },
          { id: "prompt-cat-40", label: "· /schedule" },
          { id: "prompt-cat-41", label: "· /simplify" },
          { id: "prompt-cat-42", label: "· /batch" },
          { id: "prompt-cat-43", label: "· /remember" },
          { id: "prompt-cat-44", label: "· /skillify" },
          { id: "prompt-cat-45", label: "· /loop" },
          { id: "prompt-cat-46", label: "· /keybindings" },
          { id: "prompt-cat-47", label: "· /lorem-ipsum" },
        ];
        promptGroups.forEach((g) => items.push({ id: g.id, label: g.label, indent: true }));
      }
    }
    if (chapter.details.length > 0) items.push({ id: "sec-details", label: "深入解析" });
    return items;
  }, [chapter]);

  if (!chapter) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">章节未找到</h1>
        <Link href="/" className="underline" style={{ color: "var(--accent)" }}>
          返回首页
        </Link>
      </div>
    );
  }

  const currentIndex = chapters.findIndex((c) => c.slug === slug);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const Icon = iconMap[chapter.icon] || Layout;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <TableOfContents items={tocItems} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6 animate-in" style={{ color: "var(--muted)" }}>
        <Link href="/" className="link-animated hover:text-[var(--accent)]">
          首页
        </Link>
        <span>/</span>
        <span style={{ color: chapter.color }}>{chapter.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8 animate-in" style={{ animationDelay: "0.05s" }}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: chapter.color + "15" }}
        >
          <Icon size={24} style={{ color: chapter.color }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{chapter.title}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {chapter.subtitle}
          </p>
        </div>
      </div>

      {/* Overview */}
      <div
        id="sec-overview"
        className="rounded-xl p-5 mb-6 animate-in"
        style={{ background: chapter.color + "08", border: `1px solid ${chapter.color}30`, animationDelay: "0.1s" }}
      >
        <p className="text-sm leading-relaxed">{chapter.overview}</p>
      </div>

      {/* Key Points */}
      <div id="sec-keypoints" className="mb-8 animate-in" style={{ animationDelay: "0.15s" }}>
        <h2 className="text-lg font-semibold mb-3">核心要点</h2>
        <div className="space-y-2">
          {chapter.keyPoints.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: chapter.color }} />
              <span className="text-sm">{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Index — only for the prompts chapter */}
      {chapter.slug === "prompts" && (
        <div id="sec-prompt-index" className="mb-8 animate-in" style={{ animationDelay: "0.18s" }}>
          <h2 className="text-lg font-semibold mb-3">提示词索引</h2>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--card-border)" }}>
            {[
              { cat: "系统提示", color: "#D97757", items: ["constants/prompts.ts — 主系统提示（14+ 分段动态拼接）"] },
              { cat: "文件操作工具", color: "#C2785C", items: ["FileReadTool", "FileEditTool", "FileWriteTool"] },
              { cat: "搜索工具", color: "#B8860B", items: ["GlobTool", "GrepTool"] },
              { cat: "执行工具", color: "#8B7355", items: ["BashTool", "PowerShellTool", "SleepTool", "LSPTool", "NotebookEditTool"] },
              { cat: "代理与计划工具", color: "#A0522D", items: ["AgentTool（Fork 模式）", "AskUserQuestionTool", "EnterPlanModeTool", "ExitPlanModeTool", "EnterWorktreeTool / ExitWorktreeTool"] },
              { cat: "任务管理工具", color: "#EDA100", items: ["TaskCreate / Get / List / Update / Stop", "TodoWriteTool（旧版）", "SkillTool"] },
              { cat: "网络工具", color: "#D97757", items: ["WebSearchTool", "WebFetchTool", "BriefTool / SendUserMessage"] },
              { cat: "Swarm 多代理工具", color: "#C2785C", items: ["SendMessageTool", "TeamCreateTool / TeamDeleteTool", "RemoteTriggerTool", "ScheduleCronTool"] },
              { cat: "MCP 集成工具", color: "#B8860B", items: ["ToolSearchTool（延迟加载）", "ListMcpResourcesTool / ReadMcpResourceTool", "ConfigTool"] },
              { cat: "服务层提示", color: "#8B7355", items: ["compact/prompt.ts", "extractMemories/prompts.ts", "MagicDocs/prompts.ts", "SessionMemory/prompts.ts", "autoDream/consolidationPrompt.ts"] },
              { cat: "特殊功能提示", color: "#A0522D", items: ["buddy/prompt.ts", "utils/claudeInChrome/prompt.ts", "utils/swarm/teammatePromptAddendum.ts"] },
              { cat: "技能提示", color: "#EDA100", items: ["/simplify", "/batch", "/remember", "/skillify", "/loop", "/stuck", "/debug", "/claude-api", "/claude-in-chrome", "/update-config", "/schedule", "/keybindings-help", "/lorem-ipsum"] },
            ].map((group, gi) => (
              <div key={gi} style={{ borderBottom: gi < 11 ? "1px solid var(--card-border)" : undefined }}>
                <div
                  className="px-4 py-2 flex items-center gap-2"
                  style={{ background: group.color + "10" }}
                >
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: group.color + "20", color: group.color }}
                  >
                    {group.cat}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {group.items.length} 个
                  </span>
                </div>
                <div className="px-4 py-2 flex flex-wrap gap-x-4 gap-y-1">
                  {group.items.map((item, ii) => (
                    <span key={ii} className="text-xs font-mono" style={{ color: "var(--foreground)" }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design Insights */}
      {chapter.insights && chapter.insights.length > 0 && (
        <div id="sec-insights" className="mb-8 animate-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-semibold mb-3">设计亮点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chapter.insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} color={chapter.color} />
            ))}
          </div>
        </div>
      )}

      {/* Architecture Graph */}
      {chapter.archNodes.length > 0 && (
        <div id="sec-arch" className="mb-8 animate-in" style={{ animationDelay: "0.25s" }}>
          <h2 className="text-lg font-semibold mb-3">模块架构图</h2>
          <ArchitectureGraph nodes={chapter.archNodes} edges={chapter.archEdges} />
        </div>
      )}

      {/* Core Files */}
      {chapter.coreFiles.length > 0 && (
        <div id="sec-files" className="mb-8 animate-in" style={{ animationDelay: "0.3s" }}>
          <FileTree files={chapter.coreFiles} />
        </div>
      )}

      {/* Flow Diagram */}
      {chapter.flowSteps.length > 0 && (
        <div id="sec-flow" className="mb-8 animate-in" style={{ animationDelay: "0.35s" }}>
          <FlowDiagram steps={chapter.flowSteps} connections={chapter.flowConnections} />
        </div>
      )}

      {/* Code Snippets */}
      {chapter.codeSnippets.length > 0 && (
        <div id="sec-code" className="mb-8 animate-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-lg font-semibold mb-3">关键代码</h2>
          <div className="space-y-4">
            {chapter.codeSnippets.map((s, i) => {
              const anchorId = chapter.slug === "prompts" ? `prompt-cat-${i}` : undefined;
              return (
                <div key={i} id={anchorId}>
                  <CodeBlock
                    title={s.title}
                    language={s.language}
                    code={s.code}
                    description={s.description}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Details */}
      {chapter.details.length > 0 && (
        <div id="sec-details" className="mb-8 animate-in" style={{ animationDelay: "0.45s" }}>
          <h2 className="text-lg font-semibold mb-3">深入解析</h2>
          <div className="space-y-3">
            {chapter.details.map((d, i) => (
              <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {d}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 py-6 mt-8 animate-in"
        style={{ borderTop: "1px solid var(--card-border)", animationDelay: "0.5s" }}
      >
        {prevChapter ? (
          <Link
            href={`/chapters/${prevChapter.slug}`}
            className="group rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
              <ArrowLeft size={12} className="inline mr-1" />
              上一章
            </div>
            <div className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors">
              {prevChapter.title}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {prevChapter.subtitle}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link
            href={`/chapters/${nextChapter.slug}`}
            className="group rounded-xl p-4 text-right transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
              下一章
              <ArrowRight size={12} className="inline ml-1" />
            </div>
            <div className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors">
              {nextChapter.title}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {nextChapter.subtitle}
            </div>
          </Link>
        ) : (
          <Link
            href="/"
            className="group rounded-xl p-4 text-right transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
              完成
              <ArrowRight size={12} className="inline ml-1" />
            </div>
            <div className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors">
              返回首页
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              回到架构总览
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
