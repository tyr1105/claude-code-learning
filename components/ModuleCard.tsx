import Link from "next/link";
import type { Chapter } from "@/data/chapters";
import {
  Layout, Wrench, Terminal, Shield, MessageSquare, Anchor,
  Plug, Users, Database, Monitor, Sparkles, Star, ArrowRight,
  Lightbulb, FileText,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Layout, Wrench, Terminal, Shield, MessageSquare, Anchor,
  Plug, Users, Database, Monitor, Sparkles, Star,
};

interface ModuleCardProps {
  chapter: Chapter;
  index: number;
}

export default function ModuleCard({ chapter, index }: ModuleCardProps) {
  const Icon = iconMap[chapter.icon] || Layout;

  return (
    <Link
      href={`/chapters/${chapter.slug}`}
      className="group block rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderLeft: `3px solid ${chapter.color}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ background: chapter.color + "15" }}
        >
          <Icon size={20} style={{ color: chapter.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
              #{index + 1}
            </span>
            <h3 className="font-semibold text-sm">{chapter.title}</h3>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            {chapter.subtitle}
          </p>
          {/* Tags */}
          <div className="flex items-center gap-3 mt-3">
            {chapter.coreFiles.length > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                <FileText size={10} />
                {chapter.coreFiles.length} 文件
              </span>
            )}
            {chapter.insights && chapter.insights.length > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: chapter.color }}>
                <Lightbulb size={10} />
                {chapter.insights.length} 亮点
              </span>
            )}
          </div>
        </div>
        <ArrowRight
          size={16}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1 mt-2"
          style={{ color: chapter.color }}
        />
      </div>
    </Link>
  );
}
