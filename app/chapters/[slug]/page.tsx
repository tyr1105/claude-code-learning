"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { getChapterBySlug, chapters } from "@/data/chapters";
import FileTree from "@/components/FileTree";
import FlowDiagram from "@/components/FlowDiagram";
import InsightCard from "@/components/InsightCard";
import Link from "next/link";
import {
  Layout,
  Wrench,
  Terminal,
  Shield,
  MessageSquare,
  Anchor,
  Plug,
  Users,
  Database,
  Monitor,
  Sparkles,
  Star,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const ArchitectureGraph = dynamic(() => import("@/components/ArchitectureGraph"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-xl flex items-center justify-center"
      style={{ height: 500, background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <span style={{ color: "var(--muted)" }}>加载架构图...</span>
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
      <span style={{ color: "var(--muted)" }}>加载代码...</span>
    </div>
  ),
});

const iconMap: Record<string, React.ElementType> = {
  Layout, Wrench, Terminal, Shield, MessageSquare, Anchor,
  Plug, Users, Database, Monitor, Sparkles, Star,
};

export default function ChapterPage() {
  const params = useParams();
  const slug = params.slug as string;
  const chapter = getChapterBySlug(slug);

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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--muted)" }}>
        <Link href="/" className="hover:underline">
          首页
        </Link>
        <span>/</span>
        <span style={{ color: chapter.color }}>{chapter.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
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
        className="rounded-xl p-5 mb-6"
        style={{ background: chapter.color + "08", border: `1px solid ${chapter.color}30` }}
      >
        <p className="text-sm leading-relaxed">{chapter.overview}</p>
      </div>

      {/* Key Points */}
      <div className="mb-8">
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

      {/* Design Insights */}
      {chapter.insights && chapter.insights.length > 0 && (
        <div className="mb-8">
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
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">模块架构图</h2>
          <ArchitectureGraph nodes={chapter.archNodes} edges={chapter.archEdges} />
        </div>
      )}

      {/* Core Files */}
      {chapter.coreFiles.length > 0 && (
        <div className="mb-8">
          <FileTree files={chapter.coreFiles} />
        </div>
      )}

      {/* Flow Diagram */}
      {chapter.flowSteps.length > 0 && (
        <div className="mb-8">
          <FlowDiagram steps={chapter.flowSteps} connections={chapter.flowConnections} />
        </div>
      )}

      {/* Code Snippets */}
      {chapter.codeSnippets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">关键代码</h2>
          <div className="space-y-4">
            {chapter.codeSnippets.map((s, i) => (
              <CodeBlock
                key={i}
                title={s.title}
                language={s.language}
                code={s.code}
                description={s.description}
              />
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      {chapter.details.length > 0 && (
        <div className="mb-8">
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

      {/* Navigation */}
      <div
        className="flex items-center justify-between py-6 mt-8"
        style={{ borderTop: "1px solid var(--card-border)" }}
      >
        {prevChapter ? (
          <Link
            href={`/chapters/${prevChapter.slug}`}
            className="flex items-center gap-2 text-sm hover:underline"
            style={{ color: "var(--accent)" }}
          >
            <ArrowLeft size={16} />
            {prevChapter.title}
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link
            href={`/chapters/${nextChapter.slug}`}
            className="flex items-center gap-2 text-sm hover:underline"
            style={{ color: "var(--accent)" }}
          >
            {nextChapter.title}
            <ArrowRight size={16} />
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 text-sm hover:underline"
            style={{ color: "var(--accent)" }}
          >
            返回首页
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
